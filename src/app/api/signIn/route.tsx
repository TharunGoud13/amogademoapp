import { CREATE_USER_API } from "@/components/envConfig"
import { NextResponse } from "next/server"


// api/signIn/route.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { password, retypePassword, ...formData } = req.body;

      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXBpX3VzZXIifQ.Ks_9ISeorCCS73q1WKEjZHu9kRx107eOx5VcImPh9U8");
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify(formData);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch("https://us4okg8.219.93.129.146.sslip.io/contacts", requestOptions);
      const result = await response.text();
      
      if (response.ok) {
        res.status(response.status).json({ message: "User Created Successfully" });
      } else {
        res.status(response.status).json({ message: "Something went wrong, please try again.", details: result });
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred while creating the user.", error: error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
