import React from 'react'
import {Outlet} from "react-router-dom";
import {Layout} from "antd";
import AdminHeader from '../../headers/AdminHeader/AdminHeader'
import SellerSidebar from '../../sidebars/SellerSidebar/SellerSidebar';
import SellerHeader from '../../headers/SellerHeader/SellerHeader';
const {Footer, Sider, Content } = Layout;


const AdminLayout = () => {
  return (
    <>
        <Layout>
            <SellerHeader/>
            <Layout>
                <SellerSidebar/>
                <Content className="content" style={{ padding: '30px', marginLeft: '230px' }}>
                    <Outlet/>
                </Content>
            </Layout>
        </Layout>
    </>
  )
}

export default AdminLayout