import React, { useState } from 'react'
import {Outlet} from "react-router-dom";
import {Layout} from "antd";
import SellerSidebar from '../../sidebars/SellerSidebar/SellerSidebar';
import SellerHeader from '../../headers/SellerHeader/SellerHeader';
const { Content } = Layout;


const SellerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = (isCollapsed) => {
    setCollapsed(isCollapsed);
  };

  return (
    <>
        <Layout style={{ minHeight: '100vh' }}>
            <SellerHeader/>
            <Layout>
                <SellerSidebar onCollapse={handleCollapse}/>
                <Content 
                    className="content" 
                    style={{ 
                        marginLeft: collapsed ? '70px' : '230px',
                        minHeight: 'calc(100vh - 64px)',
                        transition: 'margin-left 0.2s',
                        padding: '0 24px'
                    }}
                >
                    <Outlet/>
                </Content>
            </Layout>
        </Layout>
    </>
  )
}

export default SellerLayout