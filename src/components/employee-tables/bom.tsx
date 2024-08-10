"use client"
import { Metadata } from "next";
import { columns } from './columns'
import { ProductTable } from "./bom-table";
import { BOM_RAW_URL, GET_ORDER_ITEMS } from "@/constants/envConfig";
import { FC, useEffect, useState } from "react";
import { bomRaw } from "@/lib/store/actions";
import { connect } from "react-redux";
import { Spin } from "antd";


const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXBpX3VzZXIifQ.Ks_9ISeorCCS73q1WKEjZHu9kRx107eOx5VcImPh9U8");


const requestOptions: any = {
  method: "GET",
  headers: myHeaders,
};

async function getProducts() {
  const response = await fetch(BOM_RAW_URL, requestOptions);
  const data = await response.json();
  return data

}


const  Bom:FC<any> = ({bomRawResponse,bomRaw,bomRawLoading})  => {
  const [products, setProducts] = useState([]);

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
  bomRawLoading:state.bomRawLoading
});

const mapDispatchToProps = {
  bomRaw
}

export default connect(mapStateToProps,mapDispatchToProps)(Bom);
