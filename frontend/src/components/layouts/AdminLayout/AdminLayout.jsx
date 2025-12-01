import React from 'react'
import {Outlet} from "react-router-dom";
import {Layout} from "antd";
import AdminHeader from '../../AdminHeader/AdminHeader'
import AdminSidebar from '../../AdminSidebar/AdminSidebar'
const { Header, Footer, Sider, Content } = Layout;


const AdminLayout = () => {
  return (
    <Layout>
      <AdminHeader/>
      <Layout>
        <AdminSidebar/>
        <Content className="content">
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout