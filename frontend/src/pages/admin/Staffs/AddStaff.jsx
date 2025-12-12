import {Avatar, Button, Card, Col, DatePicker, Divider, Form, Input, message, Row, Select, Switch, Upload} from "antd";
import {useNavigate} from "react-router";
import {useState} from "react";
import userService from "../../../services/userService.js";
import {UserOutlined, UploadOutlined, PlusOutlined} from "@ant-design/icons";

const AddStaff = () => {
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
                content: 'Staff created successfully!',
                duration: 0.5,
                onClose: () => {
                    navigate('/admin/staffs');
                }
            });
        } catch (error) {
            console.error(error);
            messageApi.open({
                type: 'error',
                content: error.message || 'Failed to create staff!',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (

        <>
            {contextHolder}

            <h2 style={{marginBottom: "24px"}}>Add New Staff</h2>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    role: 'SELLER',
                    status: true,
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
                                        <Select.Option value="SELLER">Seller</Select.Option>
                                        <Select.Option value="ADMIN">Admin</Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>
                        </Card>
                    </Col>

                    <Col span={16}>
                        <Card title="Personal Information" style={{borderRadius: 12}}>
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

                            <Divider/>

                            <Form.Item style={{marginBottom: 0, textAlign: 'right'}}>
                                <Button style={{marginRight: 12}} onClick={() => navigate('/admin/staffs')}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit" icon={<PlusOutlined/>} loading={submitting}
                                        style={{backgroundColor: '#008ECC'}}>
                                    Create Staff
                                </Button>
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default AddStaff;