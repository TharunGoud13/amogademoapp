"use client"
import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";
import { GET_GROUPS } from "@/constants/envConfig";
import { connect } from "react-redux";
import { getChatGroup, loginLog } from "@/lib/store/actions";
import { FC, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { FiEdit } from "react-icons/fi";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import EditGroupUsers from "./editGroupUsers";
import { trace, context } from "@opentelemetry/api";
import { useSession } from "next-auth/react";
import IpAddress from "@/lib/IpAddress";
import getCurrentBrowser from '@/lib/getCurrentBrowser'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const Groups: FC<any> = ({ getChatGroupResponse, getChatGroup, getChatGroupLoading, loginLog,getChatGroupError }) => {

    useEffect(() => {
        getChatGroup()
    }, [getChatGroup])

    const { data: session }: any = useSession()
    let browser = getCurrentBrowser()

    let groups: any = getChatGroupResponse

    const trackPageLoad = async () => {
        const tracer = trace.getTracer('groups-tracer');
        const currentTime = new Date().toUTCString();

        const span = tracer.startSpan('page-load', {
            attributes: {
                description: 'Groups Page Viewed',
                user_id: session?.user?.id,
                user_name: session?.user?.name,
                user_email: session?.user?.email,
                event_type: "Chat Groups",
                user_ip_address: await IpAddress(),
                created_datetime: currentTime,
                browser: browser,
                session_id: session?.user?.id

            }
        });

        context.with(trace.setSpan(context.active(), span), async () => {
            loginLog({
                description: 'Groups Page Viewed',
                session:session?.user,
                event_type: "Chat Groups",
                user_ip_address: await IpAddress(),
                http_method: 'GET',
                http_url:`${GET_GROUPS}`,
                response_status_code: 200,
                response_status: 'SUCCESS',

            });
            span.addEvent("groups-page-loaded")
            span.setAttribute("http.status_code", "200");
            span.setAttribute("http.method", "GET");
            span.setAttribute("http.url", `${GET_GROUPS}`);
            span.setAttribute("http.status_message", "Success");
            span.end();                                     
            if(getChatGroupError){
                loginLog({
                    description: 'Groups Page Error',
                    session:session?.user,
                    event_type: "Chat Groups",
                    user_ip_address: await IpAddress(),
                    http_method: 'GET',
                    http_url:`${GET_GROUPS}`,
                    response_status_code: 500,
                    response_status: 'Something went wrong",',
                    error_message: "Error displaying chat groups",
                    response_error:"Something went wrong when fetching chat groups",
                });
                span.addEvent("groups-page-error")
                span.setAttribute("http.status_code", "500");
                span.setAttribute("http.method", "GET");
                span.setAttribute("http.url", `${GET_GROUPS}`);
                span.setAttribute("http.status_message", "Something went wrong");
                span.end(); 
            }
        });
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

    if (getChatGroupLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 h-fit w-full">
                {Array.from({ length: 10 }).map((_, index) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 h-fit w-full">
            {groups?.length > 0 && groups?.map((group: any, index: any) =>

                <div key={index} className="border p-2.5 flex  transition ease-in-out delay-150 rounded-lg ">
                    <div className="flex justify-between w-full">
                        <Link href={`/chat/groups/${group.chat_group_id}`} className="flex flex-col  justify-between">
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

                        </Link>
                        <div className="flex flex-col justify-center items-center">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <p className="text-lg cursor-pointer"><FontAwesomeIcon icon={faPenToSquare}/></p>
                                </PopoverTrigger>
                                <PopoverContent className=' w-[25vw] h-[50vh] overflow-x-hidden overflow-y-auto'>
                                    <EditGroupUsers id={group?.chat_group_id} />
                                </PopoverContent>
                            </Popover>

                        </div>
                    </div>
                </div>)}
        </div>
    )
}

const mapStateToProps = (state: any) => ({
    getChatGroupResponse: state.getChatGroupResponse,
    getChatGroupLoading: state.getChatGroupLoading,
    getChatGroupError:state.getChatGroupError
})

const mapDispatchToProps = { getChatGroup, loginLog }

export default connect(mapStateToProps, mapDispatchToProps)(Groups);