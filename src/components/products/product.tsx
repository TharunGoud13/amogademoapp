import { Metadata } from "next";
import { columns } from "./product-column";
import { ProductTable } from "./product-table";
import { GET_ORDER_ITEMS } from "../envConfig";

export const metadata: Metadata = {
  title: "Products",
  description: "Products Data using TanStack React Table",
};

const headers = new Headers()
headers.append("Auth",process.env.GET_ORDER_API_KEY as string)

const requestOptions = {
  method: "GET",
  headers: headers
}

async function getProducts(){
  const response = await fetch(GET_ORDER_ITEMS,requestOptions);
  const data = await response.json();
  return data

}

export default async function Products() {
  const products = await getProducts();

  return (
    <>
      <div className=" h-full flex-1 flex-col space-y-8  ">
        <ProductTable data={products} columns={columns} />
      </div>
    </>
  );
}
