import prisma from '@/lib/prisma';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ['http://localhost:3000', process.env.NEXT_PUBLIC_APP_URL!],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: ['email', 'profile'],
      prompt: 'select_account',
    },
  },
});

// Export the Session type inferred from your auth config
// this is useful for typing session objects throughout your app
// e.g., in API route handlers or server-side functions request
export type Session = typeof auth.$Infer.Session;
