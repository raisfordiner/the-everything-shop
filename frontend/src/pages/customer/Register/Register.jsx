import React from 'react'
import LoginImage from "../../../assets/LoginImage.png"
import {Button, Col, Form, Input, message, Row} from "antd";
import {Link, useNavigate} from "react-router";
import "./Register.scss"
import authService from "../../../services/authService.js";

const Register = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await authService.register({
        username: values.username,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });

      messageApi.open({
        type: 'success',
        content: 'Register Successfully!',
        duration: 0.5,
        onClose: () => {
          navigate('/login');
        }
      });
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: error.message || 'Register failed. Email or Password already exists!',
      });
    }
  }

  return (
      <>
        {contextHolder}
        <div className={"register"}>
          <Row gutter={24} align="middle">
            <Col span={12}>
              <div className="register__image">
                <img src={LoginImage} alt="Register Image"/>
              </div>
            </Col>
            <Col span={12}>
              <Form layout="vertical" name={"register_form"} className="register_form" onFinish={onFinish}>
                <h2 className={"register__form-title"}>Register</h2>
                <p className={"register__form-subtitle"}>JOIN TO US</p>

                <Form.Item
                    label="Your Name"
                    name="username"
                    rules={[{required: true, message: 'Please input your name!', whitespace: true}]}
                >
                  <Input placeholder="John Doe" size="large"/>
                </Form.Item>

                <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[{required: true, message: 'Please input your email!'}, {
                      type: 'email',
                      message: 'Invalid email!'
                    }]}
                >
                  <Input placeholder="Example@gmail.com" size="large"/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                  <Input.Password placeholder="..." size="large"/>
                </Form.Item>

                <Form.Item
                    label="Confirm Password"
                    name="password_confirmation"
                    rules={[{required: true, message: 'Please input your confirm password!'}]}
                >
                  <Input.Password placeholder="..." size="large"/>
                </Form.Item>

                <Form.Item style={{marginBottom: '16px'}}>
                  <Button type="primary" htmlType="submit" size="large"
                          style={{padding: '22px 42px', color: "white", backgroundColor: "#008ECC"}}>
                    REGISTER
                  </Button>
                </Form.Item>

                <div>
                  <span style={{color: "#999"}}>ALREADY USER? </span>
                  <Link to="/login">LOGIN</Link>
                </div>
              </Form>
            </Col>
          </Row>
        </div>
      </>
  )
}

export default Register;