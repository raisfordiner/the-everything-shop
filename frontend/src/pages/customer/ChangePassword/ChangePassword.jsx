import React from 'react'
import {Button, Col, Form, Input, Row} from "antd";

const ChangePassword = () => {
    return (
        <>
            <Form layout="vertical" name={"account_form"} className="account__form">
                <h2 style={{fontSize: "32px", color: '#008ECC'}}>Change Password</h2>

                <Form.Item
                    label="Current Password"
                    name="current_password"
                    rules={[{ required: true, message: 'Please input your current password!' }]}
                >
                    <Input.Password size="large"/>
                </Form.Item>

                <Form.Item
                    label="New Password"
                    name="new_password"
                    rules={[{ required: true, message: 'Please input your new password!' }]}
                >
                    <Input.Password size="large"/>
                </Form.Item>

                <Form.Item
                    label="Confirm Password"
                    name="confirm_password"
                    rules={[{ required: true, message: 'Please input your confirm password!' }]}
                >
                    <Input.Password size="large" />
                </Form.Item>

                <Form.Item style={{marginTop: '32px'}}>
                    <Button type="primary" htmlType="submit" size="large"
                            style={{padding: '22px 42px', color: "white", backgroundColor: "#008ECC"}}>
                        SAVE
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default ChangePassword;