import { groupUsers } from '@/lib/store/actions'
import React, { FC, useEffect } from 'react'
import { connect } from 'react-redux'
import { Skeleton } from '../ui/skeleton'
import { Avatar, AvatarFallback } from '../ui/avatar'
import Image from 'next/image'
import { MdDeleteOutline } from "react-icons/md";
import { DELETE_USERS_FROM_GROUP } from '@/constants/envConfig'
import { toast } from '../ui/use-toast'

const EditGroupUsers:FC<any> = ({id,groupUsers,groupUsersResponse,groupUsersLoading}) => {

    useEffect(() => {
        groupUsers(id)
    },[groupUsers,id])

    if(groupUsersLoading){
        return(
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 h-fit w-full">
                {Array.from({length:3}).map((_,index) => (
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

    const handleDelete = async(contact:any) => {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXBpX3VzZXIifQ.Ks_9ISeorCCS73q1WKEjZHu9kRx107eOx5VcImPh9U8");

        const requestOptions:any = {
            method: "DELETE",
            headers: myHeaders,
            body: "",
            redirect: "follow"
          };
        const response = await fetch(`${DELETE_USERS_FROM_GROUP}?group_id=eq.${contact?.group_id}&user_id=eq.${contact?.user_id}`,requestOptions)
        
          if(response.status == 204){
            toast({description:"User deleted successfully",variant:"default"})
          }
          else{
            toast({description:"Something went wrong",variant:"destructive"})
  
          }
        
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 h-fit w-full">
            {groupUsersResponse?.length > 0 ? groupUsersResponse.map((contact: any, index: any) => (
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
                        <span className='text-2xl text-gray-500 hover:text-gray-800 cursor-pointer font-[200] hover:scale-105 hover:font-[500]'
                        onClick={() => handleDelete(contact)}
                            ><MdDeleteOutline /></span>
                    </div>
                </div>
            )): <div>
                <h1>No Users.</h1></div>}


        </div>
    )
}

const mapStateToProps = (state:any) => ({
    groupUsersResponse:state.groupUsersResponse,
    groupUsersLoading:state.groupUsersLoading

})

const mapDispatchToProps = {
    groupUsers
}

export default connect(mapStateToProps,mapDispatchToProps)(EditGroupUsers);