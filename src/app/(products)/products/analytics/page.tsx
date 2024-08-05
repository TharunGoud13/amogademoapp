"use client"
import { fetchDataRequest } from '@/lib/store/actions'
import React, { FC, useEffect } from 'react'
import { connect } from 'react-redux'

interface Props{
  fetchDataRequest:any
  data:any
}

const Analytics:FC<Props> = ({fetchDataRequest,data}) => {

  useEffect(() => {
    fetchDataRequest()
  },[fetchDataRequest])

  console.log("data----",data)
  return (
    <div>
        
        <h1>Analytics Page</h1>
        {data.map((item:any,index:any) => <div key={index}>
          <p>{item.name}</p>
        </div>)}
        
    
    </div>
  )
}

const mapStateToProps = (state:any) => ({
  data: state.data
})

const mapDispatchToProps = {fetchDataRequest}

export default connect(mapStateToProps,mapDispatchToProps)(Analytics)