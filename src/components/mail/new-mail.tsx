"use client";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { useSession } from "next-auth/react";
import { toast } from "../ui/use-toast";
import { GET_CONTACTS_API, GET_EMAILS } from "@/constants/envConfig";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface NewMailProps {
  getAllImapDetailsResponse: any;
}

const NewMail: FC<NewMailProps> = ({ getAllImapDetailsResponse }) => {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { data: session } = useSession();
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionField, setActiveSuggestionField] = useState(null);
  const [users,setUsers] = useState([])

  const fetchUsers = async(query:string) => {
    const headers = new Headers()
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`);
    const requestOptions:any =  {
      method:"GET",
      headers: headers,
      redirect: "follow",
    }
    try{
      const response = await fetch(`${GET_CONTACTS_API}?user_email=ilike.*${query}*`,requestOptions)
      const result = await response.json();
      setUsers(result)
      return result
    }
    catch(error){
      toast({description:"Error fetching users",variant:"destructive"})
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchValue) {
        fetchUsers(searchValue); 
      } else {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchValue]);
  

  let user: any = session?.user;
  const currentDate = new Date().toUTCString();
  let username = getAllImapDetailsResponse[0]?.data_response?.split(" ")[0];
  let password = getAllImapDetailsResponse[0]?.data_response?.split(" ")[1];

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (activeSuggestionField) {
        const value = activeSuggestionField === 'to' ? to : activeSuggestionField === 'cc' ? cc : bcc;
        const filterUsers = users.filter((user:any) => user.user_email?.toLowerCase().includes(value.toLowerCase()));  
        const filteredSuggestions:any = filterUsers
        console.log("Filtered users: " + filteredSuggestions)
        setSuggestions(filteredSuggestions);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [to, cc, bcc, activeSuggestionField,users]);

  const handleInputChange = (e:any, setter:any, field:any) => {
    setter(e.target.value);
    setSearchValue(e.target.value);
    setActiveSuggestionField(field);
  };

  console.log("ccccccccc",{cc,bcc})

  const handleSuggestionClick = (suggestion:any) => {
    if (activeSuggestionField === 'to') setTo(suggestion);
    else if (activeSuggestionField === 'cc') setCc(suggestion);
    else if (activeSuggestionField === 'bcc') setBcc(suggestion);
    setSuggestions([]);
    setActiveSuggestionField(null);
  };

  const handleSendMail = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    try {
      const requestOptions = {
        method: "POST",
        body: JSON.stringify({
          user,
          to,
          subject,
          message,
          username,
          password,
        }),
        headers: { "Content-Type": "application/json" },
      };
      const response = await fetch("/api/send-email", requestOptions);
      if (!response.ok) {
        toast({ description: "Error sending email", variant: "destructive" });
      }
      const emailHeaders = new Headers();
      emailHeaders.append("Content-Type", "application/json");
      emailHeaders.append(
        "Authorization",
        `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
      );
      const emailRequestOptions = {
        method: "POST",
        body: JSON.stringify({
          status: "sent",
          subject: message,
          sender_email: user?.email,
          sender_name: user?.name,
          sender_mobile: user?.mobile,
          business_name: user?.business_name,
          business_number: user?.business_number,
          created_datetime: currentDate,
          cc_emails:cc,
          bcc_emails: bcc,
        }),
        headers: emailHeaders,
      };
      const sendEmail = await fetch(GET_EMAILS, emailRequestOptions);
      if (!sendEmail.ok) {
        toast({ description: "Something went wrong", variant: "destructive" });
      }
      toast({ description: "Email sent successfully", variant: "default" });
      setTo("");
      setLoading(false);
      setSubject("");
      setMessage("");
    } catch (error) {
      toast({ description: "Failed to send email", variant: "destructive" });
      setLoading(false);
      console.error("Error sending email: ", error);
    }
  };



  return (
    <form onSubmit={handleSendMail}>
      <Card className="p-2.5 my-2.5 flex flex-col gap-5 m-2.5">
        <div className="flex flex-col border">
          <div className="flex justify-center items-center">
            <span className="text-gray-500 pl-2.5 pr-[20px]">To</span>
            <Input
              className="!border-0 focus:!ring-offset-0 focus:!ring-0 focus:!ring-opacity-0  focus:!border-0"
              value={to}
              type="email"
              onChange={(e) => handleInputChange(e, setTo, 'to')}
            />
          </div>
          <div className="flex justify-center items-center">
            <span className="text-gray-500 pl-2.5 pr-[18px]">Cc</span>
            <Input
              className="!border-0 focus:!ring-offset-0 focus:!ring-0 focus:!ring-opacity-0  focus:!border-0"
              value={cc}
              autoFocus
              type="email"
              onChange={(e) => handleInputChange(e, setCc, 'cc')}
            />
          </div>
          <div className="flex justify-center items-center">
            <span className="text-gray-500 pl-2.5 pr-[12px]">Bcc</span>
            <Input
              className="!border-0 focus:!ring-offset-0 focus:!ring-0 focus:!ring-opacity-0  focus:!border-0"
              value={bcc}
              autoFocus
              type="email"
              onChange={(e) => handleInputChange(e, setBcc, 'bcc')}
            />
          </div>
          {suggestions.length > 0 && (
            <Card className="relative  left-5 w-[50%] z-10">
              {suggestions.map((suggestion:any, index) => (
                <div
                  key={index}
                  className="p-2 flex items-center gap-2.5 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion?.user_email)}
                >
                  <Avatar>
                    <AvatarFallback>
                      {suggestion?.user_email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {suggestion.user_email}
                </div>
              ))}
            </Card>
          )}
        </div>
        <Input
          type="text"
          placeholder="Subject"
          value={subject}
          className="focus:!ring-0 focus:!ring-offset-0"
          onChange={(e) => setSubject(e.target.value)}
        />
        <Textarea
          placeholder="Type your message here"
          value={message}
          className="resize-none focus:!ring-0 focus:!ring-offset-0"
          rows={14}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit">{loading ? "Sending..." : "Send"}</Button>
      </Card>
    </form>
  );
};

export default NewMail;