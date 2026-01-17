'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { authClient } from '../../lib/auth-client';

// what we need while sign in: email and password
const signInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type signInSchemaType = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(signInSchema),
  });
  async function onSubmit(data: signInSchemaType) {
    setError(null);
    const res = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (res.error) {
      setError(res.error.message || 'Something went wrong.');
    } else {
      router.push('/quizzes');
    }
  }
  return (
    <main className="max-w-md h-screen flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-white">
      <h1 className="text-2xl font-bold">Sign In</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
        />
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-300 text-black font-medium rounded-md px-4 py-2 hover:bg-blue-500 hover:cursor-pointer"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
