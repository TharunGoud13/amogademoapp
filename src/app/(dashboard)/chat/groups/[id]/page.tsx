import  ChatLayout  from "@/components/chat/chat-layout";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { GET_SINGLE_GROUP } from "@/constants/envConfig";

async function getGroupData(id: string) {
  const url = `${GET_SINGLE_GROUP}${id}`;


  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${process.env.GET_ONE_CONTACT_KEY}`);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  const response = await fetch(url, requestOptions);
  const data = await response.json();
  return data;
}

const ChatPage = async ({ params }: { params: { id: string } }) => {
    
  const session = await auth();
  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  const groupsData = await getGroupData(params.id);


  return (
    <div className="z-10 border rounded-lg w-full h-[90%] text-sm lg:flex">
      <ChatLayout 
        defaultLayout={defaultLayout}
        session={session}
        navCollapsedSize={8}
        groupsData={groupsData} contactData={undefined}      />
    </div>
  );
}

export default ChatPage;