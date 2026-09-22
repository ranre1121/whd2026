import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { emailOTP } from 'better-auth/plugins';
import { env } from 'cloudflare:workers';
import { getDb } from '@/db';
import { user, session, account, verification } from '@/db/auth-schema';

interface AuthEnv {
  DB: D1Database;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GAS_URL?: string;
  GAS_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}

/**
 * Request-time auth instance. Reads the D1 binding and secrets from the Workers
 * env, so it may only be imported from server code (server functions, API
 * routes) — never from a component.
 */
export function getAuth() {
  const authEnv = env as unknown as AuthEnv;
  const { DB: d1Binding, BETTER_AUTH_SECRET: secret, BETTER_AUTH_URL: url } = authEnv;

  if (!secret)
    throw new Error('BETTER_AUTH_SECRET is not set — copy .dev.vars.example to .dev.vars');
  if (!url) throw new Error('BETTER_AUTH_URL is not set — copy .dev.vars.example to .dev.vars');
  if (!d1Binding) throw new Error('D1 binding (DB) is not configured — check wrangler.jsonc');

  const db = getDb(d1Binding);
  const { GAS_URL: gasUrl, GAS_SECRET: gasSecret } = authEnv;
  const { GOOGLE_CLIENT_ID: googleId, GOOGLE_CLIENT_SECRET: googleSecret } = authEnv;

  const socialProviders =
    googleId && googleSecret
      ? { google: { clientId: googleId, clientSecret: googleSecret } }
      : undefined;

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: { user, session, account, verification },
    }),
    secret,
    appName: "Women's Hack Day",
    baseURL: url,
    ...(socialProviders && { socialProviders }),
    plugins: [
      emailOTP({
        otpLength: 6,
        expiresIn: 300,
        async sendVerificationOTP({ email, otp, type }) {
          // Without a mail webhook configured, print the code so local
          // development works with no external service.
          if (!gasUrl || !gasSecret) {
            console.log(`[OTP] type=${type} email=${email} otp=${otp}`);
            return;
          }
          try {
            const res = await fetch(gasUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ secret: gasSecret, action: 'send-otp', email, otp, type }),
            });
            if (!res.ok) console.error(`[OTP] mail webhook returned HTTP ${res.status}`);
          } catch (err) {
            console.error('[OTP] failed to call mail webhook:', err);
          }
        },
      }),
    ],
  });
}

/** Read the current session from request headers. Returns null when signed out. */
export async function getSession(request: Request) {
  try {
    return await getAuth().api.getSession({ headers: request.headers });
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
}

/** Same as getSession, but throws when there is no session. */
export async function ensureSession(request: Request) {
  const session = await getSession(request);
  if (!session) throw new Error('Unauthorized');
  return session;
}
