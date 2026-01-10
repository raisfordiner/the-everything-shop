import { MessageOutlined, BellOutlined, DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Avatar, Badge, Dropdown, Space, message } from "antd";
import "./AdminHeader.css";
import {getAvatarColor} from "../../../utils/avatar.js";
import React from "react";
import authService from "../../../services/authService.js";
import { useDispatch, useSelector } from "react-redux";
import {setLogout} from "../../../redux/actions/authAction.js";
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useNavigate } from "react-router";

const AdminHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const { isAuthenticated, user } = useSelector((state) => state.authReducer);

    const handleLogout = async () => {
        try {
            await authService.logout();
            dispatch(setLogout());
            messageApi.open({
                type: 'success',
                content: 'Log out successfully!',
            });
            navigate('/login');
        }
        catch (error) {
            console.error(error);
            messageApi.open({
                type: 'error',
                content: 'Log out failed',
            });
        }
    }

    const userMenu = {
        items: [
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Logout',
                onClick: handleLogout,
            }
        ]
    };

    return (
        <header className="admin-header">
            {contextHolder}

            <Link to="/admin" className="logo">
                ADMIN PORTAL
            </Link>

            <div className="header-right">
                {isAuthenticated ? (
                    <Dropdown menu={userMenu} placement="bottomRight" arrow>
                        <Space className="admin-info">
                            <Avatar
                                style={{
                                    backgroundColor: getAvatarColor(user?.username || 'Admin'),
                                    verticalAlign: 'middle',
                                    color: '#fff',
                                    fontWeight: 600
                                }}
                            >
                                A
                            </Avatar>
                            <span className="admin-name">{user?.username || 'Administrator'}</span>
                            <DownOutlined className="down-icon" />
                        </Space>
                    </Dropdown>
                ) : (
                    <Link to="/login" className="header-action-item">
                        <UserOutlined className="icon" />
                        <span>Sign In</span>
                    </Link>
                )}
            </div>
        </header>
    );
};

export default AdminHeader;
