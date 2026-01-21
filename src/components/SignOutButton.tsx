// this should be client component
'use client';
import { authClient } from '@/lib/auth-client'; //import the auth client
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
// client components can't be async

export function SignOutButton() {
  const router = useRouter();
  // took this from better auth docs
  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in'); // redirect to login page
        },
      },
    });
  }

  return (
    <Button variant="bluish" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
