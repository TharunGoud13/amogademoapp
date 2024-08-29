'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, useSession } from 'next-auth/react';
// import { useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import GoogleSignInButton from '../google-auth-button';
import GithubSignInButton from '../github-auth-button';
import LinkedInSignInButton from '../linkedin-auth-button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from '../ui/use-toast'
import { context, trace } from '@opentelemetry/api';
import { loginLog } from '@/lib/store/actions';
import { connect } from 'react-redux';
import IpAddress from '@/lib/IpAddress';
import { GET_CONTACTS_API } from '@/constants/envConfig';


const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }).min(2, { message: 'Enter valid email ' }),
  password: z.string().nonempty({ message: 'Password is required' }),
});

type UserFormValue = z.infer<typeof formSchema>;

const LoginForm: FC<any> = ({ loginLog }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const defaultValues = {
    email: '',
    password: '',
  };

  const trackPageLoad = async () => {
    const tracer = trace.getTracer('login-page-viewed');
    const span = tracer.startSpan('login-page-load');

    context.with(trace.setSpan(context.active(), span), async () => {
      loginLog({
        description: 'Login Page Viewed',
        event_type: "Login Page",
        event_details: "Login Page Viewed",
        session: session?.user,
        user_ip_address: await IpAddress(),
      });
    });
    setTimeout(() => {
      span.end();
    }, 100);

    return () => {
      if (span.isRecording()) {
        span.end();
      }
    }
  };

  useEffect(() => {
    trackPageLoad()
  }, [])


  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    const tracer = trace.getTracer('login-tracer');

    await tracer.startActiveSpan('login-attempt', async (span) => {
      try {
        const result: any = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (!result?.error) {
          await loginLog({
             event_type: 'Login',status: 'Success', social_login_used: "false",
            user_ip_address: await IpAddress(),description:"Login successful",
            http_method: "POST",http_url:`${GET_CONTACTS_API}`,
            response_status_code:201,
            response_status:"SUCCESS"
          });
          span.addEvent("login-attempt-success")
          span.setAttribute("http.status_code",201)
          span.setAttribute("http.url", `${GET_CONTACTS_API}`)
          router.push('/chat');
          // toast({ description: "Login successful", variant: "default" });
        } else {
          await loginLog({
             event_type: 'Login', status: 'failure', social_login_used: "false",
            event_details: "Invalid credentials",
            user_ip_address: await IpAddress(),description:"Login failed",
            http_method:"POST",http_url:`${GET_CONTACTS_API}`,
            response_status_code:401,response_error:"Invalid credentials",error_message:"Invalid credentials",
            response_status:"FAILURE"
          });
          span.addEvent("login-attempt-failure")
          span.setAttribute("http.status_code",401)
          span.setAttribute("http.url", `${GET_CONTACTS_API}`)

          let text: any = document.getElementById("error-text")
          text.textContent = "Invalid credentials, please try again.";
          toast({ description: "Invalid credentials, please try again.", variant: "destructive" });
          router.push('/login');
        }
      } catch (error) {
        await loginLog({
           event_type: 'Login', status: 'failure', social_login_used: "false",
          user_ip_address: await IpAddress(),description:"Login failed",
        });
        span.addEvent("login-attempt-failure")

        router.push('/login');
        toast({ description: "An unexpected error occurred", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    disabled={loading}
                    className='focus:!ring-offset-0 focus:!ring-0'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password *</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password"
                    disabled={loading}
                    className='focus:!ring-offset-0 focus:!ring-0'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p id="error-text" className='font-md text-red-500'></p>

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Login
          </Button>
        </form>
      </Form>
      <div className='flex justify-center items-center'>
        <Link href="/storejoin" className='underline'>
          <p>Don&apos;t have an account? Sign Up</p></Link>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GithubSignInButton />
      <GoogleSignInButton />
      <LinkedInSignInButton />
    </>
  );
}

const mapStateToProps = (state: any) => ({
  loginLogResponse: state.loginLogResponse
})

const mapDispatchToProps = {
  loginLog
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);