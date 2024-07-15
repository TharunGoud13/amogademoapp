'use client';

// import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from './ui/button';
import { Icons } from './icons';

export default function LinkedInSignInButton() {
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get('callbackUrl');

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() =>
        // signIn('github', { callbackUrl: callbackUrl ?? '/dashboard' })
        console.log("linkedin sign in not implemented yet")
      }
    >
      <Icons.linkedin className="mr-2 h-4 w-4" />
      Continue with LinkedIn
    </Button>
  );
}