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
import { signIn,useSession } from 'next-auth/react';
// import { useSearchParams } from 'next/navigation';
import {  useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import GoogleSignInButton from '../google-auth-button';
import GithubSignInButton from '../github-auth-button'; 
import LinkedInSignInButton from '../linkedin-auth-button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {toast} from '../ui/use-toast'

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }).min(2,{ message: 'Enter valid email ' }),
  password: z.string().nonempty({ message: 'Password is required' }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {data:session,status} = useSession(); 
  const defaultValues = {
    email: '',
    password: '',
  };

  console.log("session",session)

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });


  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    try {
      const result:any = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      // if (result?.url) {
      //   throw new Error(result.error);
      // }
      if (!result?.error) { 
        router.push('/chat');
      }
      else {
        let text:any = document.getElementById("error-text")
        text.textContent = "Invalid credentials, please try again.";
        toast({description:"Invalid credentials, please try again.",variant:"destructive"});
        router.push('/login');
      }
    } catch (error) {
      router.push('/login'); 
    } finally {
      setLoading(false);
    }
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
        <p>Dont have an account? Sign Up</p></Link>
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
      <GithubSignInButton/>
      <GoogleSignInButton/>
      <LinkedInSignInButton/>
    </>
  );
}
