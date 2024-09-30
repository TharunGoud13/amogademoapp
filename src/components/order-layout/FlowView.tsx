import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Edit, MessageCircle, CheckSquare } from "lucide-react";
import { DataTableRowActions } from "../data-table-components/data-table-row-actions";

const FlowView = ({ data }:any) => {
  const [selectedTab, setSelectedTab] = useState("pending");

  const filteredData = data.filter((item:any) => item.status === selectedTab);

  return (
    <div className="hidden md:block">
      <Tabs defaultValue="pending" onValueChange={setSelectedTab}>
        <TabsList className="w-full grid gap-10 grid-cols-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredData.map((order:any) => (
          <Card key={order.id} className="relative">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold">{order.number}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.date_created).toLocaleDateString("en-GB", {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <Badge
                  variant={
                    order.status === 'completed'
                      ? 'default'
                      : order.status === 'cancelled'
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {order.status}
                </Badge>
              </div>
              <div className="mb-4">
                <p className="font-semibold">
                  {order.billing.first_name} {order.billing.last_name}
                </p>
                <p className="text-sm">{order.billing.email}</p>
                <p className="text-sm">{order.billing.phone}</p>
              </div>
              <div className="text-xl font-bold mb-4">
                {order.currency_symbol} {parseFloat(order.total).toFixed(2)}
              </div>
              <div className="flex justify-between items-center space-x-2">
                <div>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <CheckSquare className="h-5 w-5" />
                  </Button>
                </div>
                <div>
                  <DataTableRowActions row={order} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FlowView;