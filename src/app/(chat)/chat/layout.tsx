"use client"
import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

const staticTabs = [
  { tab: "Contacts", route: "/chat" },
  { tab: "Groups", route: "/chat/groups" },
];

export default function ChatLayout({ children }: { children: ReactNode }) {
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
    <main className="flex flex-col h-[calc(100dvh)] p-4 md:px-8 py-20 gap-4">
      <div className="flex justify-between w-full items-center">
        <div className="flex gap-5">
          {tabs.map((tab, index) => (
            <div key={index} className={`${pathname === tab.route && " font-semibold bg-gray-100 dark:text-black"} h-[45px]  p-2.5 rounded`}>
              <Link href={tab.route}>{tab.tab}</Link>
            </div>
          ))}
        </div>
      </div>
      {children}
    </main>
  );
}