/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";
import { useEffect } from "react";
import Cookies from 'js-cookie';
import { connect } from "react-redux";
import { loginLog } from "@/lib/store/actions";
import { trace, context } from "@opentelemetry/api";
import IpAddress from "@/lib/IpAddress";
import { useSession } from "next-auth/react";
import { GET_CONTACTS_API } from "@/constants/envConfig";

const ClientContacts = ({ contacts, currentUser, loginLog,getUsersError }: { contacts: any[], currentUser: any, loginLog: any, getUsersError: any }) => {
    const { data: session } = useSession();
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
    }, [currentUser, userData]);

    const trackPageLoad = async () => {
        const tracer = trace.getTracer('client-contacts-tracer');

        const span = tracer.startSpan('page-load', {
            attributes: {
                description: 'Contacts Page Viewed',
                user_id: currentUser?.user_catalog_id,
                user_name: currentUser?.user_name,
                user_email: currentUser?.user_email,
                event_type: "Chat Contacts",
                user_ip_address: await IpAddress(),
            }
        });
        context.with(trace.setSpan(context.active(), span), async () => {
            loginLog({
                description: 'Contacts Page Viewed',
                session: session?.user,
                event_type: "Chat Contacts",
                user_ip_address: await IpAddress(),
                http_method: 'GET',
                http_url: `${GET_CONTACTS_API}`,
                response_status_code: 200,
                response_status: 'SUCCESS',

            });
            span.addEvent("contacts-page-loaded")
            span.setAttribute("http.status_code", "200");
            span.setAttribute("http.method", "GET");
            span.setAttribute("http.url", `${GET_CONTACTS_API}`);
            span.setAttribute("http.status_message", "Success");
            span.end();  
        });
        if(getUsersError){
            loginLog({
                description: 'Contacts Page Error',
                session:session?.user,
                event_type: "Chat Contacts",
                user_ip_address: await IpAddress(),
                http_method: 'GET',
                http_url:`${GET_CONTACTS_API}`,
                response_status_code: 500,
                response_status: 'Something went wrong",',
                error_message: "Unable to view contacts",
                response_error:"Something went wrong. Unable to view contacts",


            });
            span.addEvent("groups-page-error")
            span.setAttribute("http.status_code", "500");
            span.setAttribute("http.method", "GET");
            span.setAttribute("http.url", `${GET_CONTACTS_API}`);
            span.setAttribute("http.status_message", "Something went wrong");
            span.end(); 
        }
        setTimeout(() => {
            span.end();
        }, 100);

        return () => {
            if (span.isRecording()) {
                span.end();
            }
        }
    };

    useEffect(() => {
        trackPageLoad()
    }, [])


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

const mapStateToProps = (state: any) => ({
    loginLogResponse: state.loginLogResponse,
    getUsersError: state.getUsersError
})

const mapDispatchToProps = {
    loginLog
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientContacts);