import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Edit,
  Send,
  Bot,
  User,
  RefreshCw,
  MessageCircle,
  CheckSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { DataTableRowActions } from "../data-table-components/data-table-row-actions";

const status = ["pending", "processing", "completed", "cancelled"];

const AssistantView = ({ data }: any) => {
  const [messages, setMessages] = useState<
    Array<{ sender: string; text?: string; type?: string; data?: any[] }>
  >([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    setMessages([{ sender: "bot", type: "buttons", data: status }]);
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "user", text: input }]);
      setInput("");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "I'm processing your request. Please wait." },
        ]);
      }, 1000);
    }
  };

  const handleButton = (period: string) => {
    const filteredData = data.filter((item: any) => item.status === period);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: `Show me data for ${period}` },
      { sender: "bot", type: "carousel", data: filteredData },
    ]);
  };

  const handleRestart = () => {
    setMessages([{ sender: "bot", type: "buttons", data: status }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[90vh]">
      <div className="flex-1 overflow-y-auto md:p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            } items-end space-x-2`}
          >
            {message.sender === "bot" && (
              <Avatar>
                <AvatarFallback>
                  <Bot size={24} />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[70%] ${
                message.sender === "user"
                  ? "bg-blue-500 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
                  : "bg-secondary rounded-tl-2xl rounded-tr-2xl rounded-br-2xl"
              } p-3 shadow`}
            >
              {message.type === "carousel" && message.data ? (
                <div className="w-full max-w-md">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {message.data.map((order: any) => (
                        <CarouselItem key={order.id}>
                          <Card key={order.id} className="w-full">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="text-lg font-bold">
                                    {order.number}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {new Date(
                                      order.date_created
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    order.status === "completed"
                                      ? "default"
                                      : order.status === "cancelled"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </div>
                              <div className="mb-4">
                                <p className="font-semibold">
                                  {order.billing.first_name}{" "}
                                  {order.billing.last_name}
                                </p>
                                <p className="text-sm">{order.billing.email}</p>
                                <p className="text-sm">{order.billing.phone}</p>
                              </div>
                              <div className="text-xl font-bold mb-4">
                                {order.currency_symbol}{" "}
                                {parseFloat(order.total).toFixed(2)}
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
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              ) : message.type === "buttons" ? (
                <div>
                  <p className="mb-2">{message.text}</p>
                  <div className="flex flex-wrap gap-2">
                    {message.data?.map((button: string, idx: number) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => handleButton(button)}
                      >
                        {button}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <p>{message.text}</p>
              )}
            </div>
            {message.sender === "user" && (
              <Avatar>
                <AvatarFallback>
                  <User size={24} />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>

      <div className="pt-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className=""
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
          <Button onClick={handleRestart} variant="outline">
            <RefreshCw className="h-4 w-4 md:mr-2" />
            <span className="hidden md:block">Restart</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssistantView;
