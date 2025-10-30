import Header from '../../Header/Header'
import React from 'react'
import {Outlet} from "react-router-dom"
import {Layout} from "antd";
const { Header, Footer, Content } = Layout;


const CustomerLayout = () => {
  return (
    <>
      <Layout>
          <header>
              Header
          </header>
          <Content style={{ padding: '80px 120px' }}>
              <Outlet />
          </Content>
          <Footer>
              The everything shop ©2025
          </Footer>
      </Layout>
    </>
  )
}

export default CustomerLayout