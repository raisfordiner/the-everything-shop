import React from 'react'
import {Button, Col, Form, Input, Radio, Row} from "antd";

const AccountInfo = () => {
    return (
        <>
            <Form layout="vertical" name={"account_form"} className="account__form">
                <h2 style={{fontSize: "32px", color: '#008ECC'}}>Account Info</h2>

                <Form.Item name="gender" label="">
                    <Radio.Group>
                        <Radio value="female">Female</Radio>
                        <Radio value="male">Male</Radio>
                    </Radio.Group>
                </Form.Item>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="First Name"
                            name="firstName"
                            rules={[{ required: true, message: 'Please input your first name!' }]}
                        >
                            <Input size="large" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Last Name"
                            name="lastName"
                            rules={[{ required: true, message: 'Please input your last name!' }]}
                        >
                            <Input size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input size="large"/>
                </Form.Item>

                <Form.Item
                    label="Phone Number (Optional)"
                    name="phone"
                >
                    <Input size="large" />
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

export default AccountInfo;