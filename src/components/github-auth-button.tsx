'use client';

// import { useSearchParams } from 'next/navigation';
import { Button } from './ui/button';
import { Icons } from './icons';
import { login } from '@/app/actions';

export default function GithubSignInButton() {
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get('callbackUrl');

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() =>
        // signIn('github', { callbackUrl: callbackUrl ?? '/dashboard' })
        login("github")
      }
    >
      <Icons.gitHub className="mr-2 h-4 w-4" />
      Continue with Github
    </Button>
  );
}