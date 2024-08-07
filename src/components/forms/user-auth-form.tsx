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
import { signIn } from "next-auth/react";
// import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import GoogleSignInButton from "../google-auth-button";
import GithubSignInButton from "../github-auth-button";
import LinkedInSignInButton from "../linkedin-auth-button";
import Link from "next/link";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { CREATE_USER_API, GET_CONTACTS_API } from "../../constants/envConfig";
import {toast} from '../ui/use-toast'

const formSchema = z.object({
  first_name: z.string().nonempty({ message: "First name is required" }),
  last_name: z.string().nonempty({ message: "Last name is required" }),
  username: z.string().nonempty({ message: "Username is required" }),
  email: z.string().email({ message: "Enter a valid email address" }),
  user_mobile: z.string().nonempty({ message: "Mobile number is required" }),
  business_name: z.string().nonempty({ message: "Business name is required" }),
  business_number: z
    .string()
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

const CREATE_USER_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXBpX3VzZXIifQ.Ks_9ISeorCCS73q1WKEjZHu9kRx107eOx5VcImPh9U8"

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter();
  // const cookieStore = cookies()
  // const searchParams = useSearchParams();
  //const callbackUrl = searchParams.get("callbackUrl");
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

  const onSubmit = async (data: UserFormValue) => {
    //added create_user_catalog API for user_catalog ID
    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      user_name:data.username,
      user_email:data.email,
      user_mobile: data.user_mobile,
      business_name:data.business_name,
      business_number: data.business_number,
      // store_name: data.store_name,
      password: data.password,
      retype_password: data.retype_password,
    }

    const myHeaders1 = new Headers();
    myHeaders1.append("Authorization", `Bearer ${CREATE_USER_KEY}`);
    myHeaders1.append("Content-Type", "application/json");
    const requestOptions1: any = {
      method: "POST",
      headers: myHeaders1,
      body: JSON.stringify(payload)
    }
    console.log("payload---", payload)

    try {
      const response1 = await fetch(GET_CONTACTS_API, requestOptions1)
      const data = await response1.text()
      console.log("data----",data)
      console.log("response1----",response1.status)
      if(response1.status == 201) {
      toast({description:"User Created Successfully",variant:"default"})
      let text:any = document.getElementById("success-text");
      text.textContent = "User Created Successfully"
      }
      return data
    }
    catch (error) {
      console.log("error---", error)
    }
    // // const { password, retypePassword, ...formData } = data
    // const myHeaders = new Headers();
    // myHeaders.append("Authorization", `Bearer ${CREATE_USER_KEY}`);
    // myHeaders.append("Content-Type", "application/json");
    // const raw = JSON.stringify(data);
    // const requestOptions: any = {
    //   method: "POST",
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: "follow"
    // };
    // setLoading(true)
    // const response = await fetch(CREATE_USER_API, requestOptions)
    // const result = await response.text()
    // setLoading(false)

    // console.log("result", response.status)

    // if (response.status == 201) {
    //   // router.push("/")
    //   let text: any = document.getElementById("success")
    //   text.textContent = "User Created Successfully"

    // }
    // else {
    //   console.log("Error creating user", result)
    // }
    // // Handle form submission, such as sending data to your API or authentication logic
    // // signIn('credentials', {
    // //   email: data.email,
    // //   callbackUrl: callbackUrl ?? '/dashboard'
    // // });
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
                    type="number"
                    placeholder="Mobile"
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
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name *</FormLabel>
                <FormControl>
                  <Input
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
                    type="text"
                    placeholder="Business Number"
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
            name="store_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Name *</FormLabel>
                <FormControl>
                  <Input
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
}
