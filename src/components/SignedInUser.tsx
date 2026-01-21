'use client';
import { authClient } from '@/lib/auth-client';
import { Button } from './ui/button';

export default function SignedInUser() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="flex flex-col justify-center items-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border shadow-lg p-6 max-w-sm mx-auto my-8">
        <p className="text-center text-gray-700">You are not signed in.</p>
        <Button asChild className="mt-4">
          <a href="/sign-in">Sign In</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border shadow-lg p-6 max-w-sm mx-auto my-8">
      <h1 className="text-xl font-semibold text-center mb-4">Welcome, {session.user.name}!</h1>
      <p className="text-center text-gray-600">You are signed in as {session.user.email}.</p>
    </div>
  );
}
