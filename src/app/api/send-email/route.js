import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export  async function POST(req){
    const {user,receipient, subject, message,username,password} = await req.json()

    let transporter = nodemailer.createTransport({
        host: 'mail.morr.biz',
        port: 465,
        auth: {
          user: username,
          pass: password
        }
      });

      try{
        let info = await transporter.sendMail({
            from:username,
            to: receipient,
            subject: subject,
            text: message,
            
        })
        return NextResponse.json({message: 'Email sent successfully', data: info  });
      }
      catch(error){
        return NextResponse.status(500).json({error: error.message})
      }

}