import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FC } from "react";


const StoreMenu:FC = async() => {
    const session = await auth()
    if(!session?.user) redirect('/login')
    return(
        <div>
        <h1>Page</h1>
        </div>
    )
}

export default StoreMenu;