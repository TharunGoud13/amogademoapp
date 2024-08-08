"use client"
import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";
import { GET_GROUPS } from "@/constants/envConfig";
import { connect } from "react-redux";
import { getChatGroup } from "@/lib/store/actions";
import { FC, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

const Groups: FC<any> = ({ getChatGroupResponse, getChatGroup, getChatGroupLoading }) => {
    useEffect(() => {
        getChatGroup()
    }, [getChatGroup])

    let groups: any = getChatGroupResponse

    console.log("getChatGroupLoading", getChatGroupLoading)

    if (getChatGroupLoading) {
        return(
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 h-fit w-full">
                {Array.from({length:10}).map((_,index) => (
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
            {groups?.length > 0 && groups?.map((group: any, index: any) => <Link href={`/chat/groups/${group.chat_group_id}`} key={index} className="border p-2.5 transition ease-in-out delay-150 rounded-lg hover:scale-105">
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

const mapStateToProps = (state: any) => ({
    getChatGroupResponse: state.getChatGroupResponse,
    getChatGroupLoading: state.getChatGroupLoading
})

const mapDispatchToProps = { getChatGroup }

export default connect(mapStateToProps, mapDispatchToProps)(Groups);