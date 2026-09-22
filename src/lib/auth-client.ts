import { createAuthClient } from 'better-auth/react';
import { emailOTPClient } from 'better-auth/client/plugins';

/** Browser-side auth client: sign in/out and session access. */
export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
  plugins: [emailOTPClient()],
});

export const { signIn, signOut, useSession } = authClient;
