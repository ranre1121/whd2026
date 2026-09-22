import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { emailOTP } from 'better-auth/plugins';

/**
 * CLI-only auth configuration, kept Node-safe so `@better-auth/cli` can read it
 * to generate src/db/auth-schema.ts. This is NEVER used at runtime — the
 * request-time instance lives in auth.server.ts.
 *
 * Nothing here may import `cloudflare:workers`.
 */
export const auth = betterAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  database: drizzleAdapter(null as any, {
    provider: 'sqlite',
    schema: {},
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  appName: "Women's Hack Day",
  ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET && {
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      },
    }),
  plugins: [
    emailOTP({
      async sendVerificationOTP() {
        // no-op: this config exists only for schema generation
      },
    }),
  ],
});
