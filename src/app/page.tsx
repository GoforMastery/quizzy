'use client';

import SignedInUser from '@/components/SignedInUser';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <p className="text-center mt-10">Checking session...</p>;
  }

  return (
    <main className="flex items-center justify-center h-screen bg-white">
      <div className="flex gap-4">
        <div className="flex flex-col items-center justify-center gap-8">
          <h1 className="text-5xl font-bold">Welcome to Quizzy!</h1>
          <p className="text-xl text-center max-w-2xl">
            Test your knowledge with our fun and interactive quizzes. Sign up or sign in to create
            your own quizzes.
          </p>
          {user ? (
            <>
              <SignedInUser />
              <Link href="/quizzes">
                <button className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
                  Browse Available Quizzes
                </button>
              </Link>
            </>
          ) : (
            <div>Please sign to continue</div>
          )}
        </div>
      </div>
    </main>
  );
}
