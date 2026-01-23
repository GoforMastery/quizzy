import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="max-w-md h-screen flex items-center justify-center flex-col mx-auto p-6">
      <SignIn />
    </main>
  );
}
