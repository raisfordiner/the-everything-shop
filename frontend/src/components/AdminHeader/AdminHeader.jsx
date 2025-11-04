import { MessageOutlined, BellOutlined, DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Avatar, Badge, Dropdown, Space } from "antd";
import "./AdminHeader.css";

const AdminHeader = () => {
    const items = [
        { key: "1", label: <Link to="/admin/profile">Hồ sơ cá nhân</Link> },
        { key: "2", label: <Link to="/admin/settings">Cài đặt</Link> },
        { type: "divider" },
        { key: "3", label: <Link to="/logout">Đăng xuất</Link> },
    ];

    return (
        <header className="admin-header">
            <div className="header-left">
                <img src="/logo.png" alt="Shop Logo" className="shop-logo" />
                <h2 className="shop-name">MyShop Admin</h2>
            </div>

            <div className="header-right">
                <Badge count={1} size="small" offset={[-2, 4]}>
                    <MessageOutlined className="header-icon" />
                </Badge>

                <Badge count={3} size="small" offset={[-2, 4]}>
                    <BellOutlined className="header-icon" />
                </Badge>

                <Dropdown menu={{ items }} placement="bottomRight" arrow>
                    <Space className="admin-info">
                        <Avatar src="/avatar.jpg" alt="Admin Avatar" />
                        <span className="admin-name">Administrator</span>
                        <DownOutlined className="down-icon" />
                    </Space>
                </Dropdown>
            </div>
        </header>
    );
};

export default AdminHeader;
