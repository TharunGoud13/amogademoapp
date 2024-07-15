'use client';

// import { useSearchParams } from 'next/navigation';
import { Button } from './ui/button';
import { Icons } from './icons';
import { login } from '@/app/actions';

export default function GoogleSignInButton() {
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get('callbackUrl');

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() =>
        login("google")
        // signIn('github', { callbackUrl: callbackUrl ?? '/dashboard' })
        // console.log("google sign in not implemented yet")
      }
    >
      <Icons.google className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
}