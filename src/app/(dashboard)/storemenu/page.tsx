import Product from "@/components/products/product";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent, TabsList } from "@radix-ui/react-tabs";
import { FC } from "react";
import Table from "../menu/table/page";
import New from "../menu/new/page";
import Bom from "@/components/employee-tables/bom";


const Page:FC = () => {
    return(
        <div className="mt-[1%] h-full">
            <Tabs defaultValue="products">
                <TabsList className="grid ml-[2%] bg-gray-100 p-2.5 rounded grid-cols-3 w-[400px]">
                    <TabsTrigger value="products">Cards</TabsTrigger>
                    <TabsTrigger value="analytics">Table</TabsTrigger>
                    <TabsTrigger value="ask">New</TabsTrigger>
                </TabsList>
                <TabsContent value="products" className="m-[30px]">
                    <Bom/>
                </TabsContent>
                <TabsContent value="analytics" className="m-[30px]">
                    <Table/>
                </TabsContent>
                <TabsContent value="ask" className="m-[30px]">
                    <New/>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Page;