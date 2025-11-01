import React from 'react'
import "./Profile.scss"
import {Avatar, Col, Menu, Row} from "antd";
import {UserOutlined, RightOutlined, ShoppingOutlined, HomeOutlined, LockOutlined} from "@ant-design/icons";
import {Outlet} from "react-router-dom";
import {Link} from "react-router";

const Profile = () => {
    const menuItems = [
        {
            key: "account-info",
            label: (
                <Link to="">
                    <div className={"profile__menu-item"}>
                        <div className="profile__menu-item-left">
                            <UserOutlined/>
                            <span>Account info</span>
                        </div>

                        <RightOutlined className="profile__menu-item-right"/>
                    </div>
                </Link>
            ),
        },
        {
            key: "my-order",
            label: (
                <div className={"profile__menu-item"}>
                    <div className="profile__menu-item-left">
                        <ShoppingOutlined/>
                        <span>My order</span>
                    </div>
                    <RightOutlined className="profile__menu-item-right"/>
                </div>
            ),
        },
        {
            key: "my-address",
            label: (
                <div className={"profile__menu-item"}>
                    <div className="profile__menu-item-left">
                        <HomeOutlined/>
                        <span>My address</span>
                    </div>
                    <RightOutlined className="profile__menu-item-right"/>
                </div>
            ),
        },
        {
            key: "change-password",
            label: (
                <div className={"profile__menu-item"}>
                    <div className="profile__menu-item-left">
                        <LockOutlined />
                        <span>Change password</span>
                    </div>
                    <RightOutlined className="profile__menu-item-right"/>
                </div>
            ),
        },
    ];


    return (
        <>
            <div className="profile">
                <Row gutter={48}>
                    <Col span={6}>
                        <div className="profile__info">
                            <Avatar
                                className="profile__info-image"
                                size={180}
                                icon={<UserOutlined />}
                                src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                            />

                            <h2 className="profile__info-name">Mark Cole</h2>
                            <p className="profile__info-email">swoo@gmail.com</p>

                            <Menu
                                items={menuItems}
                                mode="vertical"
                                defaultSelectedKeys={['account-info']}
                                style={{
                                    border: 'none',
                                }}
                                className="profile__menu"
                            />
                        </div>
                    </Col>
                    <Col span={18}>
                        <Outlet/>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Profile;