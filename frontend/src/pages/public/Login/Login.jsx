import React from 'react'
import {Button, Col, Form, Input, message, Row} from "antd";
import LoginImage from "../../../assets/LoginImage.png"
import {Link, useNavigate} from "react-router";
import "./Login.scss"
import {setLoginSuccess} from "../../../redux/actions/authAction.js";
import authService from "../../../services/authService.js"
import {useDispatch} from "react-redux";
import BreadscrumbMenu from "../../../components/BreadscrumbMenu/BreadscrumbMenu.jsx";

const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigateBasedOnRole = (role) => {
    switch (role) {
      case 'ADMIN':
        navigate('/admin/dashboard');
        break;
      case 'SELLER':
        navigate('/admin/dashboard');
        break;
      case 'CUSTOMER':
        navigate('/');
        break;
      default:
        navigate('/');
    }
  };

  const onFinish = async (values) => {
    try {
      const userData = await authService.login(values.email, values.password);

      dispatch(setLoginSuccess(userData.data));

      messageApi.open({
        type: 'success',
        content: 'Login Successfully!',
        duration: 0.5,
        onClose: () => {
          navigateBasedOnRole(userData.role);
        }
      });
    }
    catch (error) {
      messageApi.open({
        type: 'error',
        content: error.message || 'Email or Password is incorrect.',
      });
    }
  }

  const breadcrumbItems = [
    {
      title: 'Login'
    }
  ];

  return (
    <>
      {contextHolder}

      <BreadscrumbMenu items={breadcrumbItems}/>

      <div className={"login"}>
        <Row gutter={24} align="middle">
          <Col span={12}>
            <div className="login__image">
              <img src={LoginImage} alt="Login Image"/>
            </div>
          </Col>
          <Col span={12}>
            <Form layout="vertical" name={"login_form"} className="login_form" onFinish={onFinish}>
              <h2 className={"login__form-title"}>Welcome Back</h2>
              <p className={"login__form-subtitle"}>LOGIN TO CONTINUE</p>

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

              <Form.Item style={{marginBottom: '24px', marginTop: '-12px'}}>
                <Link to="/forgot-password">
                  Forgot Password?
                </Link>
              </Form.Item>

              <Form.Item style={{marginBottom: '16px'}}>
                <Button type="primary" htmlType="submit" size="large" style={{padding:'22px 42px', color: "white", backgroundColor: "#008ECC"}}>
                  LOGIN
                </Button>
              </Form.Item>

              <div>
                <span style={{color: "#999"}}>NEW USER? </span>
                <Link to="/register">SIGN UP</Link>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Login;