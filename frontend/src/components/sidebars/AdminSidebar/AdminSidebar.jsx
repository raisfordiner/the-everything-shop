import {
    ShoppingCartOutlined,
    TagsOutlined,
    UserOutlined,
    BarChartOutlined,
    GiftOutlined,
    ProductOutlined
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

const { Sider } = Layout;

const AdminSidebar = () => {
    const location = useLocation();

    const menuItems = [
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
        // {
        //     key: "/admin/categories",
        //     icon: <TagsOutlined />,
        //     label: <Link to="/admin/categories">Categories</Link>,
        // },
        {
            key: "/admin/staffs",
            icon: <UserOutlined />,
            label: <Link to="/admin/staffs">Staffs</Link>,
        },
        {
            key: "/admin/customers",
            icon: <UserOutlined />,
            label: <Link to="/admin/customers">Customers</Link>,
        },
        {
            key: "/admin/promotions",
            icon: <ProductOutlined />,
            label: <Link to="/admin/promotions">Promotions</Link>,
        },
        {
            key: "/admin/coupons",
            icon: <GiftOutlined />,
            label: <Link to="/admin/coupons">Coupons</Link>,
        },
        {
            key: "/admin/reports",
            icon: <BarChartOutlined />,
            label: <Link to="/admin/reports">Reports</Link>,
        },
    ];

    return (
        <Sider
            width={230}
            collapsible
            breakpoint="lg"
            collapsedWidth="70"
            theme="light"
            style={{
                background: "#fff",
                borderRight: "1px solid #f0f0f0",
                position: "sticky",
                left: "0",
                top: "64px",
                height: "calc(100vh - 64px)",
                zIndex: "99",
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

export default AdminSidebar;
