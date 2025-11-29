import {Avatar, Button, Card, Col, DatePicker, Divider, Form, Input, message, Row, Select, Switch, Upload} from "antd";
import {useNavigate} from "react-router";
import {useState} from "react";
import userService from "../../../services/userService.js";
import {UserOutlined, UploadOutlined, PlusOutlined} from "@ant-design/icons";
import EditCustomer from "./EditCustomer.jsx";

const AddCustomer = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values) => {
        setSubmitting(true);
        try {
            const newUser = {
                username: values.username,
                email: values.email,
                password: values.password,
                password_confirmation: values.confirmPassword,
                role: values.role,
            };

            await userService.createUser(newUser);
            messageApi.open({
                type: 'success',
                content: 'Customers created successfully!',
                duration: 0.5,
                onClose: () => {
                    navigate('/admin/customers');
                }
            });
        } catch (error) {
            console.error(error);
            messageApi.open({
                type: 'error',
                content: error.message || 'Failed to create customer!',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (

        <>
            {contextHolder}

            <h2 style={{marginBottom: "24px"}}>Add New Customers</h2>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    role: 'CUSTOMER',
                    status: true,
                    gender: 'other'
                }}
            >
                <Row gutter={24}>
                    <Col span={8}>
                        <Card style={{textAlign: 'center', borderRadius: 12, marginBottom: 24}}>
                            <div style={{marginBottom: 20}}>
                                <Avatar size={100} icon={<UserOutlined/>}/>
                                <div style={{marginTop: 16}}>
                                    <Upload showUploadList={false}>
                                        <Button icon={<UploadOutlined/>}>Upload Avatar</Button>
                                    </Upload>
                                </div>
                            </div>

                            <Divider/>

                            <div style={{textAlign: 'left'}}>
                                <Form.Item name="status" label="Account Status" valuePropName="checked">
                                    <Switch
                                        checkedChildren="Active"
                                        unCheckedChildren="Blocked"
                                    />
                                </Form.Item>

                                <Form.Item name="role" label="User Role" rules={[{required: true}]}>
                                    <Select>
                                        <Select.Option value="CUSTOMER">Customers</Select.Option>
                                        <Select.Option value="SELLER">Seller</Select.Option>
                                        <Select.Option value="ADMIN">Admin</Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>
                        </Card>
                    </Col>

                    <Col span={16}>
                        <Card title="Customers Information" style={{borderRadius: 12}}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="firstName" label="First Name">
                                        <Input placeholder="Enter first name"/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="lastName" label="Last Name">
                                        <Input placeholder="Enter last name"/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="username"
                                        label="Username"
                                        rules={[{required: true, message: 'Username is required'}]}
                                    >
                                        <Input placeholder="Unique username"/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="email"
                                        label="Email Address"
                                        rules={[
                                            {required: true, message: 'Email is required'},
                                            {type: 'email', message: 'Invalid email format'}
                                        ]}
                                    >
                                        <Input placeholder="example@mail.com"/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="password"
                                        label="Password"
                                        rules={[
                                            {required: true, message: 'Password is required'},
                                            {min: 6, message: 'Password must be at least 6 characters'}
                                        ]}
                                    >
                                        <Input.Password placeholder="Set password"/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        dependencies={['password']}
                                        rules={[
                                            {required: true, message: 'Please confirm password'},
                                            ({getFieldValue}) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Passwords do not match!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password placeholder="Confirm password"/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider orientation="left" style={{borderColor: '#f0f0f0'}}>Additional Info</Divider>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="phone" label="Phone Number">
                                        <Input placeholder="+84..."/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="dob" label="Date of Birth">
                                        <DatePicker style={{width: '100%'}} format="DD/MM/YYYY"/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="gender" label="Gender">
                                        <Select>
                                            <Select.Option value="male">Male</Select.Option>
                                            <Select.Option value="female">Female</Select.Option>
                                            <Select.Option value="other">Other</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider/>

                            <Form.Item style={{marginBottom: 0, textAlign: 'right'}}>
                                <Button style={{marginRight: 12}} onClick={() => navigate('/admin/customers')}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit" icon={<PlusOutlined/>} loading={submitting}
                                        style={{backgroundColor: '#008ECC'}}>
                                    Create Customers
                                </Button>
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default AddCustomer;