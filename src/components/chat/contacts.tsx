import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";
import { GET_CONTACTS_API } from "@/constants/envConfig";

async function getContacts() {
    const url = GET_CONTACTS_API

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


const Contacts = async () => {
    const contacts = await getContacts();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 h-fit w-full">
            {contacts.map((contact: any, index: any) => <Link href={`/chat/${contact.contact_id}`}  key={index} className="border p-2.5 transition ease-in-out delay-150 rounded-lg hover:scale-105">
                <div className="flex gap-4 items-center">
                    {contact?.avatar_url ?
                        <Avatar className="w-12 h-12">
                            <Image src={contact?.avatar_url} alt="user" width={80} height={80} />
                        </Avatar>
                        : <Avatar>
                            <AvatarFallback>{contact.username.charAt(0).toUpperCase()}</AvatarFallback></Avatar>}
                    <div className="space-y-1">
                        <h1 className="font-bold">{contact.username}</h1>
                        <h1>{contact.email}</h1>
                    </div>
                </div>
                <div className="space-y-2 text-muted-foreground pt-2.5">
                    <h1>{contact.user_mobile}</h1>
                    <h1>{contact?.billing?.city}</h1>
                </div>
            </Link>)}
        </div>
    )
}

export default Contacts;