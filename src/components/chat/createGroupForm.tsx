import React, { FC, useEffect } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { useSession } from 'next-auth/react';
import {toast} from '../ui/use-toast'
import { connect } from 'react-redux';
import { getChatGroup, loginLog } from '@/lib/store/actions';
import { GET_GROUPS } from '@/constants/envConfig';
import { context, trace } from '@opentelemetry/api';
import IpAddress from '@/lib/IpAddress';


const CreateGroupForm:FC<any> = ({onClose,getChatGroup,getChatGroupResponse,loginLog}) => {
    const session = useSession();
    const sessionUser: any = session?.data?.user;

    const formSchema = z.object({
        group_name: z.string().min(2, { message: 'Group name must be at least 2 characters' }),
        description: z.string().min(5, { message: 'Description must be at least 5 characters' }),
    })
    type UserFormValue = z.infer<typeof formSchema>;
    const defaultValues = {
        group_name: "",
        description: ""
    }
    const form = useForm<UserFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const createGroup = async (data: UserFormValue) => {
        const payload = {
            group_name: data?.group_name,
            description: data?.description,
            email: sessionUser?.email,
            mobile: sessionUser?.mobile,
            business_number: sessionUser?.business_number,
            business_name: sessionUser?.business_name,
            
        }
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify(payload);

        const requestOptions:any = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        const tracer = trace.getTracer('create-group-form-tracer');
        const span = tracer.startSpan('create-group-span');

        const response = await fetch(`${GET_GROUPS}`, requestOptions)
        const result = await response.text();
        if(response.status == 201){
            await getChatGroup()
            toast({description:"Group Created Successfully",variant:"default"})
            onClose()
            context.with(trace.setSpan(context.active(), span), async () => {
           
                // Call loginLog action with the relevant data
                loginLog({
                    description: 'New Group Created Successfully',
                    session: session?.data?.user,
                    event_type: "Group Creation",
                    user_ip_address: await IpAddress(),
                    http_method: 'POST',
                    http_url: `${GET_GROUPS}`,
                    response_status_code: 201,
                    response_status: 'SUCCESS',
    
                });
                span.addEvent("groups-creation-page-loaded")
                span.setAttribute("http.status_code", "201");
                span.setAttribute("http.method", "POST");
                span.setAttribute("http.url", `${GET_GROUPS}`);
                span.setAttribute("http.status_message", "Success");
                span.end();  
            });

        }
        else{
            toast({description:"Something went wrong",variant:"destructive"})
            onClose()
            context.with(trace.setSpan(context.active(), span), async () => {
                // Call loginLog action with the relevant data
                loginLog({
                    description: ' Group Creation Error',
                    session: session?.data?.user,
                    event_type: "Group Creation",
                    user_ip_address: await IpAddress(),
                    http_method: 'POST',
                    http_url: `${GET_GROUPS}`,
                    response_status_code: 500,
                    response_status: 'Failed',
    
                });
                span.addEvent("groups-creation-page-failed")
                span.setAttribute("http.status_code", 500);
                span.setAttribute("http.method", "POST");
                span.setAttribute("http.url", `${GET_GROUPS}`);
                span.setAttribute("http.status_message", "Failure");
                span.end();  
            });
        }
        return result
            
    }

    return (
        <div>
            <Form {...form}>
                <form className='w-full space-y-4' onSubmit={form.handleSubmit(createGroup)}>
                    <FormField control={form.control} name="group_name" render={({ field }) =>
                        <FormItem>
                            <FormLabel>Group Name *</FormLabel>
                            <FormControl>
                                <Input type='text' placeholder='Group Name' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>}
                    />
                    <FormField control={form.control} name="description" render={({ field }) => <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                            <Input type='text' placeholder='Description' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>} />
                    <Button type='submit'>Create Group</Button>
                </form>
            </Form>
        </div>
    )
}

const mapStateToProps = (state:any) => ({
    getChatGroupResponse:state.getChatGroupResponses
})

const mapDispatchToProps = {
    getChatGroup,
    loginLog
}

export default connect(mapStateToProps,mapDispatchToProps)(CreateGroupForm)