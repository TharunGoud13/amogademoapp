
import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { DataTable } from "@/components/data-table-components/data-table";
// import { columns } from "@/components/data-table-components/columns";
import { columns } from "@/components/order-table/columns";
export const metadata: Metadata = {
  title: "Order Tracking",
  description: "Order tracker build using Tanstack Table."
};

async function getOrdersDetails(){
    const myHeaders = new Headers()
    myHeaders.append("Authorization",`Basic ${process.env.ORDERS_TABLE_API_KEY}`)

    const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    }
    const response = await fetch("https://growretail.my/wp-json/wc/v3/orders",requestOptions)
    const result = await response.json()
    return result
}


export default async function Page() {
  const data = await getOrdersDetails();
  console.log("data======",data)
  console.log("columns=====",columns)

  return (
    <div className="h-full flex-1 flex-col space-y-2 p-8 md:flex">
      <DataTable data={data} columns={columns} />
    </div>
  );
}
