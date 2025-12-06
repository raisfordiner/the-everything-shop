import {
    DashboardOutlined,
    ShoppingCartOutlined,
    AppstoreOutlined,
    TagsOutlined,
    UserOutlined,
    BarChartOutlined,
    GiftOutlined,
    InboxOutlined,
    SettingOutlined,
    UserSwitchOutlined,
    GlobalOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

const { Sider } = Layout;

const AdminSidebar = () => {
    const location = useLocation();

    const menuItems = [
        {
            key: "/admin/dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/admin/dashboard">Dashboard</Link>,
        },
        {
            key: "/admin/orders",
            icon: <ShoppingCartOutlined />,
            label: <Link to="/admin/orders">Orders</Link>,
        },
        {
            key: "/admin/products",
            icon: <AppstoreOutlined />,
            label: <Link to="/admin/products">Products</Link>,
        },
        {
            key: "/admin/categories",
            icon: <TagsOutlined />,
            label: <Link to="/admin/categories">Categories</Link>,
        },
        {
            key: "/admin/customers",
            icon: <UserOutlined />,
            label: <Link to="/admin/customers">Customers</Link>,
        },
        {
            key: "/admin/reports",
            icon: <BarChartOutlined />,
            label: <Link to="/admin/reports">Reports</Link>,
        },
        {
            key: "/admin/coupons",
            icon: <GiftOutlined />,
            label: <Link to="/admin/coupons">Coupons</Link>,
        },
        {
            key: "/admin/inbox",
            icon: <InboxOutlined />,
            label: <Link to="/admin/inbox">Inbox</Link>,
        },
        {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Settings",
            children: [
                {
                    key: "/admin/settings/personal",
                    icon: <UserSwitchOutlined />,
                    label: <Link to="/admin/settings/personal">Personal Setting</Link>,
                },
                {
                    key: "/admin/settings/global",
                    icon: <GlobalOutlined />,
                    label: <Link to="/admin/settings/global">Global Setting</Link>,
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

export default AdminSidebar;
