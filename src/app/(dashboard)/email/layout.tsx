"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";


const staticTabs = [
  { tab: "Inbox", route: "/email" },
  { tab: "Sent", route: "/email/sent" },
  { tab: "Draft", route: "/email/draft" },
  { tab: "Important", route: "/email/important" },
  { tab: "New", route: "/email/new" },
];

const MailLayout = ({
  children,
}: any) => {
  const pathname = usePathname()
  const segments = pathname.split("/");
  let tabs = [...staticTabs];

  if(segments.length === 3 && segments[1] === "email" && segments[2] !== "sent" && segments[2] !== "important" && segments[2] !== "draft" && segments[2] !== "new") {
    
    tabs.push({tab: "View", route: pathname})
  }
  return (
    <div className="h-full flex w-full flex-col md:flex-row">
      <div className="w-full">
      <div className="flex w-full md:gap-2 p-3">
      <Tabs value={pathname}>
            <TabsList className="w-full bg-secondary text-primary">
              {tabs.map((tab, index) => (
                <TabsTrigger
                  key={index}
                  value={tab.route}
                  className={`${
                    pathname === tab.route
                      ? "font-semibold text-primary bg-secondary dark:text-black"
                      : "text-primary"
                  }  rounded`}
                >
                  <Link href={tab.route}>{tab.tab}</Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default MailLayout;
