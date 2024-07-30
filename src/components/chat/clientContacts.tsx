/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";
import { useEffect } from "react";
import Cookies from 'js-cookie';

const ClientContacts = ({ contacts, currentUser }: { contacts: any[], currentUser: any }) => {
    const userData = {
        user_catalog_id: currentUser?.user_catalog_id,
        user_name: currentUser?.user_name,
        user_email: currentUser?.user_email,
        user_mobile: currentUser?.user_mobile,
        
    }
    useEffect(() => {
        if (currentUser) {
            Cookies.set('currentUser', JSON.stringify(userData), { expires: 7 }); 
        }
    }, [currentUser,userData]);


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 h-fit w-full">
            {contacts.map((contact: any, index: any) => (
                <Link href={`/chat/${contact.user_catalog_id}`} key={index} className="border p-2.5 transition ease-in-out delay-150 rounded-lg hover:scale-105">
                    <div className="flex gap-4 items-center">
                        {contact?.avatar_url ?
                            <Avatar className="w-12 h-12">
                                <Image src={contact?.avatar_url} alt="user" width={80} height={80} />
                            </Avatar>
                            : <Avatar>
                                <AvatarFallback>{contact?.user_name?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>}
                        <div className="space-y-1">
                            <h1 className="font-bold">{contact?.user_name}</h1>
                            <h1>{contact?.user_email}</h1>
                        </div>
                    </div>
                    <div className="space-y-2 text-muted-foreground pt-2.5">
                        <h1>{contact?.user_mobile}</h1>
                        <h1>{contact?.business_city}</h1>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default ClientContacts;