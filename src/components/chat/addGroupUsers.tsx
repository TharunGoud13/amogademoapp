"use client"
import { getChatGroupUsers, getUsers, loginLog } from '@/lib/store/actions'
import React, { FC, useEffect } from 'react'
import { connect } from 'react-redux'
import ClientContacts from './clientContacts'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '../ui/avatar'
import Image from 'next/image'
import { GET_CHAT_GROUP_USERS } from '@/constants/envConfig'
import { Skeleton } from '../ui/skeleton'
import { context, trace } from '@opentelemetry/api'
import IpAddress from '@/lib/IpAddress'
import { useSession } from 'next-auth/react'

const AddGroupUsers: FC<any> = ({ getUsers, getUsersResponse, groupsData, getChatGroupUsers, getUsersLoading, loginLog }) => {
    const {data: session} = useSession()

    useEffect(() => {
        getUsers(),
        getChatGroupUsers()
    }, [getUsers, getChatGroupUsers])

    const handleAddUsersToGroup = async (contact: any) => {
        const payload = {
            "status": contact?.status,
            "group_id": groupsData[0]?.chat_group_id,
            "user_id": contact?.user_catalog_id,
            "user_name": contact?.user_name,
            "user_email": contact?.user_email,
            "user_mobile": contact?.user_mobile,
            "city": contact?.business_city,
            "business_number": contact?.business_number,
            "business_name": contact?.business_name,
            "for_business_number": contact?.for_business_number,
            "for_business_name": contact?.for_business_name,
            "is_admin": null,
            "is_blocked": null,
            "app_name": contact?.app_name,
            "updated_at_datetime": null,
            "created_at_datetime": null,
            "created_user": null,
            "created_user_id": null,
        }
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify(payload);

        const requestOptions: any = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        const tracer = trace.getTracer('add-user-to-group-tracer');
        const span = tracer.startSpan('add-user-to-group-span');
        const response = await fetch(GET_CHAT_GROUP_USERS, requestOptions)
        const result = await response.text();
        if (response.status == 201) {
            await getChatGroupUsers()
            context.with(trace.setSpan(context.active(), span), async () => {

                // Call loginLog action with the relevant data
                loginLog({
                    description: 'User Added to Group Successfully',
                    session: session?.user,
                    event_type: "Add User to Group",
                    user_ip_address: await IpAddress(),
                    http_method: 'POST',
                    http_url: `${GET_CHAT_GROUP_USERS}`,
                    response_status_code: 201,
                    response_status: 'SUCCESS',

                });
                span.addEvent("add-user-to-group-tracer")
                span.setAttribute("http.status_code", "201");
                span.setAttribute("http.method", "POST");
                span.setAttribute("http.url", `${GET_CHAT_GROUP_USERS}`);
                span.setAttribute("http.status_message", "Success");
                span.end();
            });
        }
        else{
            context.with(trace.setSpan(context.active(), span), async () => {
                // Call loginLog action with the relevant data
                loginLog({
                    description: 'Add User to Group Error',
                    session: session?.user,
                    event_type: "Add User to Group",
                    user_ip_address: await IpAddress(),
                    http_method: 'POST',
                    http_url: `${GET_CHAT_GROUP_USERS}`,
                    response_status_code: 500,
                    response_status: 'Failed',
    
                });
                span.addEvent("add-user-to-group-failed")
                span.setAttribute("http.status_code", 500);
                span.setAttribute("http.method", "POST");
                span.setAttribute("http.url", `${GET_CHAT_GROUP_USERS}`);
                span.setAttribute("http.status_message", "Failure");
                span.end();  
            });
        }
        return result
    }

    if (getUsersLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 h-fit w-full">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="border p-2.5 transition ease-in-out delay-150 rounded-lg">
                        <div className="flex gap-4 items-center">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                        <div className="space-y-2 text-muted-foreground pt-2.5">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                ))}

            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 h-fit w-full">
            {getUsersResponse?.length > 0 && getUsersResponse.map((contact: any, index: any) => (
                <div key={index} className="border p-2.5 transition ease-in-out flex justify-between delay-150 rounded-lg">
                    <div className='flex flex-col'>
                        <div className="flex gap-4 items-center">
                            {contact?.avatar_url ?
                                <Avatar className="w-12 h-12">
                                    <Image src={contact?.avatar_url} alt="user" width={80} height={80} />
                                </Avatar>
                                : <Avatar>
                                    <AvatarFallback>{contact?.user_name?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>}
                            <div className="space-y-1 w-[90%]">
                                <h1 className="font-bold line-clamp-1">{contact?.user_name}</h1>
                                <h1 className='truncate'>{contact?.user_email}</h1>
                            </div>
                        </div>
                        <div className="space-y-2 text-muted-foreground pt-2.5">
                            <h1>{contact?.user_mobile}</h1>
                            <h1>{contact?.business_city}</h1>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                        <span className='text-3xl cursor-pointer font-[200] hover:scale-105 hover:font-[500]'
                            onClick={() => handleAddUsersToGroup(contact)}>+</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

const mapStateToProps = (state: any) => ({
    getUsersResponse: state.getUsersResponse,
    getUsersLoading: state.getUsersLoading
})

const mapDispatchToProps = {
    getUsers,
    getChatGroupUsers,
    loginLog
}

export default connect(mapStateToProps, mapDispatchToProps)(AddGroupUsers)