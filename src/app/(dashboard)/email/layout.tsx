"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


const staticTabs = [
  { tab: "Inbox", route: "/email" },
  { tab: "Sent", route: "/email/sent" },
  { tab: "Draft", route: "/email/draft" },
  { tab: "Trash", route: "/email/trash" },
  { tab: "New", route: "/email/new" },
];

const MailLayout = ({
  children,
}: any) => {
  const pathname = usePathname()
  const segments = pathname.split("/");
  let tabs = [...staticTabs];

  if(segments.length === 3 && segments[1] === "email" && segments[2] !== "sent" && segments[2] !== "trash" && segments[2] !== "draft" && segments[2] !== "new") {
    
    tabs.push({tab: "View", route: pathname})
  }
  return (
    <div className="h-full flex w-full flex-col md:flex-row">
      <div className="w-full">
      <div className="flex w-full md:gap-2 p-3">
          {tabs.map((tab, index) => (
            <div key={index} className={`${pathname === tab.route && " font-semibold bg-gray-100 dark:text-black"} h-[45px]  p-2.5 rounded`}>
              <Link href={tab.route}>{tab.tab}</Link>
            </div>
          ))}
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default MailLayout;