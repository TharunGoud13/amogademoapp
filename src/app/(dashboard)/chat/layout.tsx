"use client"
import Link from "next/link";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import CreateGroupForm from "@/components/chat/createGroupForm";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const staticTabs = [
  { tab: "Contacts", route: "/chat" },
  { tab: "Groups", route: "/chat/groups" },
];

export default function ChatLayout({ children }: { children: ReactNode }) {
  const [displayForm,setDisplayForm] = useState(false)
    const pathname = usePathname();
  const segments = pathname.split("/");
  
  let tabs = [...staticTabs];
  
  // Add Personal tab only if we're in a specific chat and not in the groups section
  if (segments.length === 3 && segments[1] === "chat" && segments[2] !== "groups") {
    tabs.push({ tab: "One to One Chat", route: pathname });
  }
  else if (segments.length === 4 && segments[1] === "chat" && segments[2] === "groups")  {
    tabs.push({ tab: "Group Chat", route: pathname });

  }

  return (
    <main className="flex flex-col  p-4 md:px-8 pb-20 gap-4">
      <div className="flex justify-between w-full items-center">
        <div className="flex gap-5">
          {tabs.map((tab, index) => (
            <div key={index} className={`${pathname === tab.route && " font-semibold bg-secondary text-primary dark:text-black"} h-[45px] text-primary  p-2.5 rounded`}>
              <Link href={tab.route}>{tab.tab}</Link>
            </div>
          ))}
        </div>
        <Popover>
          <PopoverTrigger asChild>
          <Button onClick={() => setDisplayForm(!displayForm)}>Add Group</Button>
          </PopoverTrigger>
          <PopoverContent className="relative left-[-32px] mt-2 w-[25vw]">
          {<CreateGroupForm onClose={() => setDisplayForm(false)}/>}
          </PopoverContent>
        </Popover>
      </div>
      {children}
    </main>
  );
}