'use client';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/navigation';

export default function LogOut() {
  async function handleSignOut() {
    await authClient.signOut();
    redirect('/sign-in');
  }
  return (
    <div className="mt-3 flex flex-col justify-center items-center">
      <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  );
}
