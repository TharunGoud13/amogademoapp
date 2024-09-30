
import { Metadata } from "next";
// import { columns } from "@/components/data-table-components/columns";
import { columns } from "@/components/order-table/columns";
import { DataTable } from "@/components/order-layout/order-page-layout";

import { toast } from "@/components/ui/use-toast";
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
        redirect: "follow",
        // cache:"no-store"
    }
    const response = await fetch("https://growretail.my/wp-json/wc/v3/orders",requestOptions)
    const result = await response.json()
    return result
}

export default async function Page() {
  const data = await getOrdersDetails();
  return(
  <div className="h-full flex-1 flex-col space-y-2 p-8 md:flex">
      <DataTable data={data}  columns={columns} />
     </div>
  )
}
