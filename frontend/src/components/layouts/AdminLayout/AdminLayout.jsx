import React from 'react'
import {Outlet} from "react-router-dom";
import {Layout} from "antd";
const { Header, Footer, Sider, Content } = Layout;


const AdminLayout = () => {
  return (
    <>
        <Layout>
            <header>
                Header
            </header>

            <Layout>
                <Sider theme={"light"}>
                    Slider
                </Sider>

                <Content className="content">
                    Content
                    <Outlet/>
                </Content>
            </Layout>
        </Layout>
      <Outlet />
    </>
  )
}

export default AdminLayout