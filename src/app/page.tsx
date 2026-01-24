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
    <main className="flex items-center justify-center h-screen bg-slate-50">
      <div className="flex gap-4">
        <div className="flex flex-col items-center justify-center gap-8">
          <h1 className="text-5xl font-bold text-slate-800">Welcome to Quizzy!</h1>
          <p className="text-xl text-center max-w-2xl text-slate-600">
            Test your knowledge with our fun and interactive quizzes. Sign up or sign in to create
            your own quizzes.
          </p>
          {user ? (
            <>
              <SignedInUser />
              <Link href="/quizzes">
                <button className="px-6 py-3 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-700 transition">
                  Browse Available Quizzes
                </button>
              </Link>
            </>
          ) : (
            <div className="text-slate-500">Please sign in to continue</div>
          )}
        </div>
      </div>
    </main>
  );
}
