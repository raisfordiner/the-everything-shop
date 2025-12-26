import { MessageOutlined, BellOutlined, DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Avatar, Badge, Dropdown, Space } from "antd";
import "./AdminHeader.css";
import {getAvatarColor} from "../../../utils/avatar.js";
import React from "react";

const AdminHeader = () => {
    const items = [
        { key: "1", label: <Link to="/logout">Logout</Link> },
    ];

    return (
        <header className="admin-header">
            <Link to="/admin/orders" className="logo">
                ADMIN PORTAL
            </Link>

            <div className="header-right">
                <Dropdown menu={{ items }} placement="bottomRight" arrow>
                    <Space className="admin-info">
                        <Avatar
                            style={{
                                backgroundColor: getAvatarColor("Admin"),
                                verticalAlign: 'middle',
                                color: '#fff',
                                fontWeight: 600
                            }}
                        >
                            A
                        </Avatar>
                        <span className="admin-name">Administrator</span>
                        <DownOutlined className="down-icon" />
                    </Space>
                </Dropdown>
            </div>
        </header>
    );
};

export default AdminHeader;
