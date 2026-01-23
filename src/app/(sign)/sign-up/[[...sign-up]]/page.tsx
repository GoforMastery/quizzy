import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className="h-screen w-md mx-auto p-6 flex flex-col justify-center items-center">
      <SignUp />
    </main>
  );
}
