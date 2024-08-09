import { Metadata } from "next";
import { columns } from './columns'
import { ProductTable } from "./bom-table";
import { BOM_RAW, GET_ORDER_ITEMS } from "@/constants/envConfig";

export const metadata: Metadata = {
  title: "Products",
  description: "Products Data using TanStack React Table",
};

const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXBpX3VzZXIifQ.Ks_9ISeorCCS73q1WKEjZHu9kRx107eOx5VcImPh9U8");


const requestOptions: any = {
  method: "GET",
  headers: myHeaders,
};

async function getProducts() {
  const response = await fetch(BOM_RAW, requestOptions);
  const data = await response.json();
  return data

}


export default async function Bom() {
  const products = await getProducts();

  return (
    <>
      <div className=" h-full mt-[-30px] flex-1 flex-col space-y-8  ">
        <ProductTable data={products} columns={columns} />
      </div>
    </>
  );
}
