'use client';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import { useState } from 'react';

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  async function handleGoogleSignIn() {
    const { error } = await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/quizzes',
    });
    console.log(error);

    if (error) setError(error.message || 'Google sign-in failed');
  }
  return (
    <main className="max-w-md h-screen flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-white">
      {error && <p className="text-red-500">{error}</p>}

      <div className="h-1/4 flex flex-col items-center justify-center">
        <Button
          variant="default"
          size="lg"
          className="w-full flex gap-4 hover:cursor-pointer"
          onClick={handleGoogleSignIn}
        >
          <Image src="/google.svg" alt="picture of google" width={16} height={16} />
          <div>Continue with Google</div>
        </Button>
      </div>
    </main>
  );
}
