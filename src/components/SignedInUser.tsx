'use client';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from './ui/button';

export default function SignedInUser() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="flex flex-col justify-center items-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border shadow-lg p-6 max-w-sm mx-auto my-8">
        <p className="text-center text-gray-700">You are not signed in.</p>
        <Button asChild className="mt-4">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border shadow-lg p-6 max-w-sm mx-auto my-8">
      <p className="text-center text-gray-600">
        You are signed in as {user.emailAddresses[0]?.emailAddress}.
      </p>
    </div>
  );
}
