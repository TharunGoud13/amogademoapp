import NewMail from "@/components/mail/new-mail";
import { FC } from "react";


const Page:FC = () => {
    return(
        <div>
            <NewMail  response={null} repliedEmails={null}/>
        </div>
    )
}

export default Page;