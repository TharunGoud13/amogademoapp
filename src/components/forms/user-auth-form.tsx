"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
// import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import GoogleSignInButton from "../google-auth-button";
import GithubSignInButton from "../github-auth-button";
import LinkedInSignInButton from "../linkedin-auth-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CREATE_USER_API, GET_CONTACTS_API } from "../../constants/envConfig";
import { toast } from "../ui/use-toast";
import { context, trace } from "@opentelemetry/api";
import IpAddress from "@/lib/IpAddress";
import { loginLog } from "@/lib/store/actions";
import { connect } from "react-redux";

const formSchema = z
  .object({
    first_name: z.string().nonempty({ message: "First name is required" }),
    last_name: z.string().nonempty({ message: "Last name is required" }),
    username: z.string().nonempty({ message: "Username is required" }),
    email: z.string().email({ message: "Enter a valid email address" }),
    user_mobile: z
      .string()
      .min(10)
      .max(10)
      .nonempty({ message: "Mobile number is required" }),
    business_name: z
      .string()
      .nonempty({ message: "Business name is required" }),
    business_number: z
      .string()
      .min(10)
      .max(10)
      .nonempty({ message: "Business Number is required" }),
    store_name: z.string().nonempty({ message: "Store name is required" }),
    password: z.string().min(4, {
      message: "Password must be at len 8 .",
    }),
    retype_password: z
      .string()
      .min(1, {
        message: "Passwords don't match",
      })
      .nonempty({ message: "Required" }),
  })
  .refine((data) => data.password === data.retype_password, {
    message: "Passwords don't match",
    path: ["retype_password"],
  });

type UserFormValue = z.infer<typeof formSchema>;

const UserAuthForm: FC<any> = ({ loginLog }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  // const { toast } = useToast();
  const defaultValues = {
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    user_mobile: "",
    business_name: "",
    business_number: "",
    store_name: "",
    password: "",
    retypePassword: "",
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const trackPageLoad = async () => {
    const tracer = trace.getTracer("Join-page-viewed");
    const span = tracer.startSpan("Join-page-load");

    context.with(trace.setSpan(context.active(), span), async () => {
      loginLog({
        description: "Join Page Viewed",
        event_type: "Join Page",
        event_details: "Join Page Viewed",
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
    };
  };

  useEffect(() => {
    trackPageLoad();
  }, []);

  const onSubmit = async (data: UserFormValue) => {
    //added create_user_catalog API for user_catalog ID
    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      user_name: data.username,
      user_email: data.email,
      user_mobile: data.user_mobile,
      business_name: data.business_name,
      business_number: data.business_number,
      // store_name: data.store_name,
      password: data.password,
      retype_password: data.retype_password,
    };

    const myHeaders1 = new Headers();
    myHeaders1.append(
      "Authorization",
      `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
    );
    myHeaders1.append("Content-Type", "application/json");
    const requestOptions1: any = {
      method: "POST",
      headers: myHeaders1,
      body: JSON.stringify(payload),
    };

    try {
      const response1 = await fetch(GET_CONTACTS_API, requestOptions1);
      const data = await response1.text();
      if (response1.status == 201) {
        toast({ description: "User Created Successfully", variant: "default" });
        let text: any = document.getElementById("success-text");
        text.textContent = "User Created Successfully";
      }
      return data;
    } catch (error: any) {
      throw new Error("Error", error);
    }
  };

  return (
    <>
      <Form {...form}>
        <h1 id="success"></h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input
                    className="focus:!ring-offset-0 focus:!ring-0"
                    type="text"
                    placeholder="First name"
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
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="focus:!ring-offset-0 focus:!ring-0"
                    placeholder="Last name"
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Name *</FormLabel>
                <FormControl>
                  <Input
                    className="focus:!ring-offset-0 focus:!ring-0"
                    type="text"
                    placeholder="User name"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    className="focus:!ring-offset-0 focus:!ring-0"
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
            name="user_mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile *</FormLabel>
                <FormControl>
                  <Input
                    className="focus:!ring-offset-0 focus:!ring-0"
                    type="number"
                    placeholder="Mobile"
                    disabled={loading}
                    inputMode="numeric"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name *</FormLabel>
                <FormControl>
                  <Input
                    className="focus:!ring-offset-0 focus:!ring-0"
                    type="text"
                    placeholder="Business name"
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
            name="business_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Number *</FormLabel>
                <FormControl>
                  <Input
                    className="focus:!ring-offset-0 focus:!ring-0"
                    type="text"
                    placeholder="Business Number"
                    disabled={loading}
                    inputMode="numeric"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="store_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Name *</FormLabel>
                <FormControl>
                  <Input
                    className="focus:!ring-offset-0 focus:!ring-0"
                    type="text"
                    placeholder="Store name"
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
                    className="focus:!ring-offset-0 focus:!ring-0"
                    placeholder="Password"
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
            name="retype_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Retype Password *</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="focus:!ring-offset-0 focus:!ring-0"
                    placeholder="Retype password"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-green-500 text-md" id="success-text"></p>
          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Join
          </Button>
        </form>
      </Form>
      <div className="flex justify-center items-center">
        <Link href="/login" className="underline">
          <span>Do you have an account? Login</span>
        </Link>
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
};

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {
  loginLog,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserAuthForm);
