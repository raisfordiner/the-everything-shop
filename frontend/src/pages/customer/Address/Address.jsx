import React from 'react';
import {Button, Col, Form, Input, Row} from "antd";

const Address = () => {
    return (
        <>
            <Form layout="vertical" name={"address_form"} className="address__form">
                <h2 style={{fontSize: "32px", color: '#008ECC'}}>My Address</h2>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="City"
                            name="city"
                            rules={[{ required: true, message: 'Please input your city!' }]}
                        >
                            <Input size="large" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="District"
                            name="district"
                            rules={[{ required: true, message: 'Please input your district!' }]}
                        >
                            <Input size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Street Address"
                    name="streetAddress"
                    rules={[{ required: true, message: 'Please input your address!' }]}
                >
                    <Input size="large"/>
                </Form.Item>

                <Form.Item
                    label="Note (Optional)"
                    name="note"
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

export default Address;