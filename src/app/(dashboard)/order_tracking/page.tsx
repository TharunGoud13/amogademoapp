
import { Metadata } from "next";
import { DataTable } from "@/components/data-table-components/data-table";
// import { columns } from "@/components/data-table-components/columns";
import { columns } from "@/components/order-table/columns";
import { useEffect, useState } from "react";
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
        redirect: "follow"
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



// export default  function Page() {
//   const [data,setData] = useState([])
//   const [loading,setLoading] = useState(false)

//   useEffect(() => {
//     getOrdersDetails()
//   },[])

//   async function getOrdersDetails(){
//     setLoading(true)
//     const myHeaders = new Headers()
//     myHeaders.append("Authorization",`Basic Y2tfMjFiYjRmYjhlNWYyMzk5ODJjZDliZDkyMDA4N2ZjMGZkOTFjZTM0Njpjc19mN2VkMmY3YzIwMmY0YTRjNmQ4YTQzNTg5OTQ4ZmRlNDk3Zjg1ODFi`)

//     const requestOptions: RequestInit = {
//         method: "GET",
//         headers: myHeaders,
//         redirect: "follow"
//     }
//     try{
//     const response = await fetch("https://growretail.my/wp-json/wc/v3/orders",requestOptions)
//     const result = await response.json()
//     setLoading(false)
//     setData(result)
//     }catch(err){
//       toast({description:"Something went wrong",variant:"destructive"})
//       setLoading(false)
//     }
// }

// console.log("data-----",data)

//   return (
//     <div className="h-full flex-1 flex-col space-y-2 p-8 md:flex">
//       <DataTable data={data} loading={loading} columns={columns} />
//     </div>
//   );
// }


