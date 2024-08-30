

export type UserData = any;


export interface Message {
    chat_message: any;
    id: any;
    name: string;
    avatar: string;
    message: string | number;
    room:string
}

export interface User {
    id: number;
    avatar: string;
    messages: { id: number; avatar: string; name: string; message: string; }[];
    name: string;
    mobile: string | number;
    business_name: string;
    business_number:string | number;
}
