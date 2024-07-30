import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";
import { GET_CONTACTS_API } from "@/constants/envConfig";
import { auth } from "@/auth";
import ClientContacts from "./clientContacts";

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
    const session = await auth()
    console.log("email----",session?.user?.email)

    const currentUser = contacts.find((user: any) => user?.user_email === session?.user?.email)
    console.log("user--", currentUser)

        return <ClientContacts contacts={contacts} currentUser={currentUser}/>
}

export default Contacts;