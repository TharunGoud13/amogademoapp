import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";
import { GET_GROUPS } from "@/constants/envConfig";

async function getGroups() {
    const url = GET_GROUPS

    const myHeaders = new Headers();
    myHeaders.append("Authorization",`Bearer ${process.env.GET_CONTACTS_KEY}`);

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };
    const response = await fetch(url, requestOptions)
    const data = await response.json();
    return data
}


const Groups = async () => {
    const groups = await getGroups();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 h-fit w-full">
            {groups.map((group: any, index: any) => <Link href={`/chat/groups/${group.chat_group_id}`}  key={index} className="border p-2.5 transition ease-in-out delay-150 rounded-lg hover:scale-105">
                <div className="flex gap-4 items-center">
                    {group?.icon ?
                        <Avatar className="w-12 h-12">
                            <Image src={group?.icon} alt="user" width={80} height={80} />
                        </Avatar>
                        : <Avatar>
                            <AvatarFallback>{group?.group_name?.charAt(0).toUpperCase()}</AvatarFallback></Avatar>}
                    <div className="space-y-1">
                        <h1 className="font-bold">{group?.group_name}</h1>
                        <h1>Owner: {group?.owner_fullname}</h1>
                    </div>
                </div>
                <div className="space-y-2 text-muted-foreground pt-2.5">
                    <h1>{group?.mobile}</h1>
                    <h1>{group?.email}</h1>
                    <h1>{group?.city}</h1>
                </div>
            </Link>)}
        </div>
    )
}

export default Groups;