import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export  async function POST(req){
    const {user,receipient, subject, message} = await req.json()

    let transporter = nodemailer.createTransport({
        host: 'mail.morr.biz',
        port: 465,
        auth: {
          user: 'tarun@morr.biz',
          pass: 'tarun@8888'
        }
      });

      try{
        let info = await transporter.sendMail({
            from:`${user}`,
            to: receipient,
            subject: subject,
            text: message
        })
        return NextResponse.json({message: 'Email sent successfully', data: info  });
      }
      catch(error){
        return NextResponse.status(500).json({error: error.message})
      }

}