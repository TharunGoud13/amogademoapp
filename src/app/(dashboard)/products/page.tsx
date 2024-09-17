import Product from "@/components/products/product";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent, TabsList } from "@radix-ui/react-tabs";
import { FC } from "react";
import Analytics from "./analytics/page";
import Ask from "./ask/page";


const Page:FC = () => {
    return(
        <div className="mt-[1%] h-full">
            <Tabs defaultValue="products">
                <TabsList className="grid ml-[2%] bg-secondary text-primary p-2.5 rounded grid-cols-3 w-[400px]">
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="ask">Ask</TabsTrigger>
                </TabsList>
                <TabsContent value="products" className="m-[30px]">
                    <Product/>
                </TabsContent>
                <TabsContent value="analytics" className="m-[30px]">
                    <Analytics/>
                </TabsContent>
                <TabsContent value="ask" className="m-[30px]">
                    <Ask/>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Page;