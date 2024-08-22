'use client';

// import { useSearchParams } from 'next/navigation';
import { Button } from './ui/button';
import { Icons } from './icons';
import { login } from '@/app/actions';
import { loginLog } from '@/lib/store/actions';
import { connect } from 'react-redux';
import { FC } from 'react';
import IpAddress from '@/lib/IpAddress';

const GoogleSignInButton:FC<any> = ({loginLog}) => {
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get('callbackUrl');

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={async() => {
        login("google"),
        loginLog({
          description: "Login with Google",
          event_type: "Login",
          social_login_used: "Google",
          user_ip_address: await IpAddress()
        })
      }
        // signIn('github', { callbackUrl: callbackUrl ?? '/dashboard' })
      }
    >
      <Icons.google className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
}

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = {
  loginLog
}

export default connect(mapStateToProps,mapDispatchToProps)(GoogleSignInButton);