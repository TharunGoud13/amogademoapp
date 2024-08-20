"use client"
import { Metadata } from "next";
import { columns } from './columns'
import { ProductTable } from "./bom-table";
import { BOM_RAW_URL, GET_ORDER_ITEMS } from "@/constants/envConfig";
import { FC, useEffect, useState } from "react";
import { bomRaw, loginLog } from "@/lib/store/actions";
import { connect } from "react-redux";
import { Spin } from "antd";
import { useSession } from "next-auth/react";
import { context, trace } from "@opentelemetry/api";
import IpAddress from "@/lib/IpAddress";


const myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer process.env.NEXT_PUBLIC_API_KEY`);


const requestOptions: any = {
  method: "GET",
  headers: myHeaders,
};

async function getProducts() {
  const response = await fetch(BOM_RAW_URL, requestOptions);
  const data = await response.json();
  return data

}


const  Bom:FC<any> = ({bomRawResponse,bomRaw,bomRawLoading,loginLog,bomRawError})  => {
  const [products, setProducts] = useState([]);
  const { data: session }: any = useSession()


  const trackPageLoad = async () => {
    const tracer = trace.getTracer('mail--tracer');

    const span = tracer.startSpan('products-page-load', {
      attributes: {
        description: 'Products Page Viewed',
        user_id: session?.user?.id,
        user_name: session?.user?.name,
        user_email: session?.user?.email,
        event_type: "Mail Page",
        user_ip_address: await IpAddress(),

      }
    });

    context.with(trace.setSpan(context.active(), span), async () => {
      // Call loginLog action with the relevant data
      loginLog({
        description: 'Menu Page Viewed',
        event_type: "Menu Page",
        session: session?.user,
        user_ip_address: await IpAddress(),
        http_method: 'GET',
                http_url: `${BOM_RAW_URL}`,
                response_status_code: 200,
                response_status: 'SUCCESS',
      });
      span.addEvent("bom-raw-data-page-loaded");
      span.setAttribute("http.status_code", "200");
      span.setAttribute("http.url", `${BOM_RAW_URL} `);
      span.setAttribute("http.status", "Success");
      span.end();

      if(bomRawError){
        loginLog({
          description: 'Menu Page Error',
          event_type: "Menu Page",
          session: session?.user,
          user_ip_address: await IpAddress(),
          http_method: 'GET',
                  http_url: `${BOM_RAW_URL}`,
                  response_status_code: 500,
                  response_status: 'Something Went Wrong',
        });
        span.addEvent("bom-raw-data-page-failed");
      span.setAttribute("http.status_code", "500");
      span.setAttribute("http.url", `${BOM_RAW_URL} `);
      span.setAttribute("http.status", "Something Went Wrong");
      span.end();
      }
    });
    setTimeout(() => {
      span.end();
    }, 100);

    return () => {
      if (span.isRecording()) {
        span.end();
      }
    }
  };


  useEffect(() => {
    trackPageLoad()
  }, [])

  useEffect(() => {
    bomRaw()
  },[bomRaw])
  
  return (
    <>
      <div className=" h-full flex-1 flex-col space-y-8  ">
        <span className="flex justify-center">{bomRawLoading && <div> <Spin/> <span className="ml-[10px] ">Loading Data...</span></div>}</span>
        <ProductTable data={bomRawResponse} columns={columns} />
      </div>
    </>
  );
}

const mapStateToProps = (state:any) => ({
  bomRawResponse: state.bomRawResponse,
  bomRawLoading:state.bomRawLoading,
  bomRawError:state.bomRawError
});

const mapDispatchToProps = {
  bomRaw,
  loginLog
}

export default connect(mapStateToProps,mapDispatchToProps)(Bom);
