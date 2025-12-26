import {
    DashboardOutlined,
    ShoppingCartOutlined,
    AppstoreOutlined,
    BarChartOutlined,
    GiftOutlined,
    InboxOutlined,
    SettingOutlined,
    UserSwitchOutlined,
    GlobalOutlined,
    TagsOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "./SellerSidebar.css";

const { Sider } = Layout;

const SellerSidebar = ({ onCollapse }) => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const handleCollapse = (collapsed) => {
        setCollapsed(collapsed);
        if (onCollapse) {
            onCollapse(collapsed);
        }
    };

    const menuItems = [
        {
            key: "/seller/dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/seller/dashboard">Dashboard</Link>,
        },
        {
            key: "/seller/categories",
            icon: <TagsOutlined />,
            label: <Link to="/seller/categories">Categories</Link>,
        },
        {
            key: "/seller/orders",
            icon: <ShoppingCartOutlined />,
            label: <Link to="/seller/orders">Orders</Link>,
        },
        {
            key: "/seller/products",
            icon: <AppstoreOutlined />,
            label: <Link to="/seller/products">Products</Link>,
        },
        {
            key: "/seller/reports",
            icon: <BarChartOutlined />,
            label: <Link to="/seller/reports">Reports</Link>,
        },
        {
            key: "/seller/coupons",
            icon: <GiftOutlined />,
            label: <Link to="/seller/coupons">Coupons</Link>,
        },
        {
            key: "/seller/inbox",
            icon: <InboxOutlined />,
            label: <Link to="/seller/inbox">Inbox</Link>,
        },
        {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Settings",
            children: [
                {
                    key: "/admin/settings/personal",
                    icon: <UserSwitchOutlined />,
                    label: <Link to="/seller/settings/personal">Personal Setting</Link>,
                },
                {
                    key: "/seller/settings/global",
                    icon: <GlobalOutlined />,
                    label: <Link to="/seller/settings/global">Global Setting</Link>,
                },
            ],
        },
    ];

    return (
        <Sider
            width={230}
            className="admin-sidebar light"
            collapsible
            collapsed={collapsed}
            onCollapse={handleCollapse}
            breakpoint="lg"
            collapsedWidth="70"
            theme="light"
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 64,
                bottom: 0,
                paddingTop: '64px',
            }}
        >
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                defaultOpenKeys={["settings"]}
                defaultChecked={menuItems[0]}
                items={menuItems}
            />
        </Sider>
    );
};

export default SellerSidebar;
