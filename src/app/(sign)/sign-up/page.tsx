'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { authClient } from '../../../lib/auth-client';

// this is done by first time user
// so we need name, email and password

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type signUpSchemaType = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<signUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });
  // what it does is that it validates the form data based on the schema defined using zod library
  // (data : { name: string; email: string; password: string })
  async function onSubmit(data: signUpSchemaType) {
    setError(null);
    const res = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    if (res.error) {
      if (res.error.message?.toLowerCase().includes('exist')) {
        setError('User with this email already exists.');
      } else {
        setError(res.error.message || 'An error occurred');
      }
    } else {
      const otpResponse = await authClient.emailOtp.sendVerificationOtp({
        email: data.email,
        type: 'email-verification',
      });
      if (otpResponse.error) {
        setError(otpResponse.error.message || 'An error occurred');
      } else {
        router.push(`/verify?email=${data.email}&type=email-verification`);
      }
    }
  }
  return (
    <main className="h-screen w-md mx-auto p-6 space-y-4 text-white bg-black flex flex-col justify-center items-center">
      <div className="rounded-lg p-6 shadow-lg flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        {error && <p className="text-destructive text-sm text-center">{error}</p>}
        {error?.toLowerCase().includes('exist') && (
          <p className="text-sm text-center">
            <Link href="/sign-in" className="underline hover:opacity-80">
              Sign in instead
            </Link>
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('name')}
            placeholder="Full Name"
            required
            className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
          />
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
            minLength={8}
            className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
          />
          <button
            type="submit"
            className="w-full bg-white text-black font-medium rounded-md px-4 py-2 hover:bg-gray-200 cursor-pointer"
          >
            Create Account
          </button>
        </form>
      </div>
    </main>
  );
}
