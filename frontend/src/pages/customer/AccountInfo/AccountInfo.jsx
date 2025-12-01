import React, {useState} from 'react'
import {Button, Col, DatePicker, Form, Input, Modal, Radio, Row} from "antd";

const AccountInfo = () => {
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

    const showVerifyModal = () => {
        setIsVerifyModalOpen(true);
    };

    const handleVerifyCancel = () => {
        setIsVerifyModalOpen(false);
    };

    const onVerifyFinish = (values) => {
        console.log("Verification Code:", values.code);
        setIsVerifyModalOpen(false);
    };

    return (
        <>
            <Form layout="vertical" name={"account_form"} className="account__form">
                <h2 style={{fontSize: "32px", color: '#008ECC'}}>Account Info</h2>

                <Form.Item name="gender" label="">
                    Gender:
                    <Radio.Group style={{marginLeft: '16px'}}>
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
                    <Input size="large"
                           suffix= {(
                               <a
                                   style={{color: '#008ECC', fontWeight: 500, cursor: 'pointer', fontSize: '13px'}}
                                   onClick={showVerifyModal}
                               >
                                   Verify Now
                               </a>
                           )}/>
                </Form.Item>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            label="Phone Number (Optional)"
                            name="phone"
                        >
                            <Input size="large" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Date of Birth"
                            name="dob"
                        >
                            <DatePicker
                                size="large"
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                                placeholder="Select date"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item style={{marginTop: '12px'}}>
                <Button type="primary" htmlType="submit" size="large"
                            style={{padding: '22px 42px', color: "white", backgroundColor: "#008ECC"}}>
                        SAVE
                    </Button>
                </Form.Item>
            </Form>

            <Modal
                title={<div style={{ color: '#008ECC', fontSize: '20px', textAlign: 'center' }}>Email Verification</div>}
                open={isVerifyModalOpen}
                onCancel={handleVerifyCancel}
                footer={null}
                centered
                width={400}
            >
                <div style={{ textAlign: 'center', marginBottom: '24px', color: '#666' }}>
                    Please enter the 6-digit code sent to your email to verify your account.
                </div>

                <Form onFinish={onVerifyFinish} layout="vertical">
                    <Form.Item
                        name="code"
                        rules={[
                            { required: true, message: 'Please input confirmation code!' },
                            { len: 6, message: 'Code must be exactly 6 digits!' }
                        ]}
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <Input.OTP length={6} size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            style={{ backgroundColor: "#008ECC", marginTop: '10px' }}
                        >
                            CONFIRM CODE
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <Button type="link" style={{ color: '#999' }}>Resend Code</Button>
                    </div>
                </Form>
            </Modal>
        </>
    )
}

export default AccountInfo;