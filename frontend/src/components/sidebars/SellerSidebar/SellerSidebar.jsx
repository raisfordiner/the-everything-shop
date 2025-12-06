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
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import "./SellerSidebar.css";

const { Sider } = Layout;

const SellerSidebar = () => {
    const location = useLocation();

    const menuItems = [
        {
            key: "/seller/dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/seller/dashboard">Dashboard</Link>,
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
            breakpoint="lg"
            collapsedWidth="70"
            theme="light"
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
