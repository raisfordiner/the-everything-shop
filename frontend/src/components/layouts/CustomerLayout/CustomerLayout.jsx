import Header from '../../Header/Header'
import Footer from '../../Footer/Footer'
import React from 'react'
import {Outlet} from "react-router-dom"
import {Layout} from "antd";
const { Header: LayoutHeader, Footer: LayoutFooter, Content: LayoutContent } = Layout;


const CustomerLayout = () => {
  return (
    <>
      <Layout>
          <header>
              <Header/>
          </header>
          <LayoutContent style={{ padding: '80px 120px' }}>
              <Outlet />
          </LayoutContent>
          <footer>
              <Footer/>
          </footer>
      </Layout>
    </>
  )
}

export default CustomerLayout