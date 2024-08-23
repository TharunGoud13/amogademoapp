"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import { useSession } from "next-auth/react"
import { toast } from "../ui/use-toast"

export default function NewMail() {
    const [receipient, setReceipient] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const {data:session} = useSession()
    const [loading,setLoading] = useState(false)

    let user = session?.user?.email
    console.log("user----",user)

    const handleSendMail = async(e:any) => {
        setLoading(true)
        e.preventDefault()
        const requestOptions = {
            method:"POST",
            body:JSON.stringify({user,receipient, subject, message}),
            headers: {"Content-Type": "application/json"}
        }
        const response = await fetch('/api/send-email',requestOptions)
        if(response.ok) {
            setLoading(false)
            toast({description:"Email sent successfully",variant:"default"  })
            setReceipient("")
            setSubject("")
            setMessage("")
        }
        else {
            setLoading(false)
            toast({description:"Email sent successfully",variant:"destructive"  })
            setReceipient("")
            setReceipient("")
            setSubject("")
            setMessage("")
        }
    }
    return (
        <form onSubmit={handleSendMail}>
            <Card className="p-2.5 my-2.5 flex flex-col gap-5 m-2.5">
                <Input className="mt-3" value={receipient} type="email" onChange={((e) => setReceipient(e.target.value))} placeholder="Recipient's email" />
                <Input type="text" placeholder="Subject" value={subject}
                    onChange={((e) => setSubject(e.target.value))} />
                <Textarea placeholder="Type your message here" value={message} className="resize-none" rows={14}
                    onChange={((e) => setMessage(e.target.value))} />
                <Button type="submit">{loading ? "Sending..." : "Send"}</Button>
            </Card>
        </form>
    )
}
