import React, { useState } from 'react';
import { Button, Form, Input, message, Row, Col } from 'antd';
import { useSearchParams, useNavigate, Link } from 'react-router';
import authService from '../../../services/authService';
import LoginImage from "../../../assets/LoginImage.png";
import "./ResetPassword.scss";
import BreadscrumbMenu from "../../../components/BreadscrumbMenu/BreadscrumbMenu.jsx";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values) => {
        if (!token) {
            messageApi.error("Invalid or missing token.");
            return;
        }
        setLoading(true);
        try {
            await authService.resetPassword(token, values.new_password, values.confirm_password);
            messageApi.success("Password reset successfully! Redirecting to login...", 1.5, () => {
                navigate('/login');
            });
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="reset-password-container">
                <div className="error-message">
                    <h2>Invalid Link</h2>
                    <p>The password reset link is invalid or missing.</p>
                    <Link to="/login">Go to Login</Link>
                </div>
            </div>
        )
    }

    return (
        <>
            {contextHolder}
            <BreadscrumbMenu items={[{ title: 'Reset Password' }]} />
            <div className="reset-password-page">
                <Row gutter={24} align="middle">
                    <Col span={12}>
                        <div className="login__image">
                            <img src={LoginImage} alt="Login Image" />
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="reset-password-form-container">
                            <h2 className="title">Reset Password</h2>
                            <p className="subtitle">Enter your new password below</p>

                            <Form
                                layout="vertical"
                                onFinish={onFinish}
                                className="reset-password-form"
                            >
                                <Form.Item
                                    label="New Password"
                                    name="new_password"
                                    rules={[
                                        { required: true, message: 'Please enter your new password!' },
                                        { min: 8, message: 'Password must be at least 8 characters.' }
                                    ]}
                                >
                                    <Input.Password placeholder="New Password" size="large" />
                                </Form.Item>

                                <Form.Item
                                    label="Confirm Password"
                                    name="confirm_password"
                                    dependencies={['new_password']}
                                    rules={[
                                        { required: true, message: 'Please confirm your password!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('new_password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder="Confirm Password" size="large" />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loading} block size="large" className="submit-btn" style={{ backgroundColor: "#008ECC", borderColor: "#008ECC" }}>
                                        RESET PASSWORD
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default ResetPassword;
