import { cookies } from "next/headers";
import { ChatLayout } from "@/components/chat/chat-layout";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Chat application built using the components.'
}

export default async function Home() {
  const session = await auth()
  if(!session?.user)redirect('/login')
  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center justify-center p-4 md:px-24 py-28 gap-4">
      <div className="flex justify-between  w-full items-center">
        <h1  className="text-4xl font-bold text-gradient">Chat</h1>
      </div>

      <div className="z-10 border rounded-lg  w-full h-full text-sm lg:flex">
        <ChatLayout defaultLayout={defaultLayout} navCollapsedSize={8} />
      </div>

      
    </main>
  );
}