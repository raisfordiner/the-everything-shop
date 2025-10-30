import Header from '../../Header/Header'
import React from 'react'
import {Outlet} from "react-router-dom"

const CustomerLayout = () => {
  return (
    <>
      <Header/>
      <Outlet />
    </>
  )
}

export default CustomerLayout