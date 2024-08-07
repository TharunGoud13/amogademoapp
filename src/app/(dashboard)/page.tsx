import { Mail } from "@/components/mail/mail";
import { cookies } from "next/headers";
import { FC } from "react";
import { accounts, mails } from "@/components/mail/data";
import { auth } from "@/auth";
import { redirect } from "next/navigation";


const Home: FC = () => {
  
  const layout = cookies().get("react-resizable-panels:layout")
  const collapsed = cookies().get("react-resizable-panels:collapsed")
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined
  return (
    <div>
      <Mail
        accounts={accounts}
        mails={mails}
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={4}
      />
    </div>
  )
}

export default Home;