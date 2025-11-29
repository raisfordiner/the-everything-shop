import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import userService from "../../../services/userService.js";
import {Avatar, Button, Card, Col, DatePicker, Divider, Form, Input, message, Row, Select, Spin, Switch, Tag, Upload} from "antd";
import dayjs from 'dayjs';
import {UserOutlined, UploadOutlined, SaveOutlined} from "@ant-design/icons";

const EditCustomer = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const response = await userService.getUserById(id);
                const data = response.data.user;
                setUserInfo(data);

                form.setFieldsValue({
                    username: data.username,
                    email: data.email,
                    role: data.role,
                    status: data.status || true,
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    phone: data.phone || '',
                    gender: data.gender || 'other',
                    dob: data.dob ? dayjs(data.dob) : null,
                });
            }
            catch (error) {
                console.error("Failed to load user details: " + error);
            }
            finally {
                setLoading(false);
            }
        }

        fetchUserDetails();
    }, [form])

    const onFinish = async (values) => {
        setSubmitting(true);
        try {
            const updateData = {
                role: values.role,
                username: values.username,
            };

            await userService.updateUser(id, updateData);

            messageApi.open({
                type: 'success',
                content: 'User updated successfully!',
                duration: 0.5,
                onClose: () => {
                    navigate('/admin/customers');
                }
            });
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: error.message || 'Failed to update user!',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {contextHolder}

            <h2 style={{marginBottom: "24px"}}>Edit Customer</h2>

            <Spin spinning={loading} size="large">
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        role: 'CUSTOMER',
                        status: true,
                        gender: 'other'
                    }}
                    onFinish={onFinish}
                >
                    <Row gutter={24}>
                        <Col span={8}>
                            <Card style={{textAlign: 'center', borderRadius: 12, marginBottom: 24}}>
                                <div style={{marginBottom: 20}}>
                                    <Avatar size={100} icon={<UserOutlined/>} src={userInfo?.avatar}/>
                                    <div style={{marginTop: 16}}>
                                        <Upload showUploadList={false}>
                                            <Button icon={<UploadOutlined/>}>Change Avatar</Button>
                                        </Upload>
                                    </div>
                                </div>

                                <Divider/>

                                <div style={{textAlign: 'left'}}>
                                    <Form.Item name="status" label="Account Status" valuePropName="checked">
                                        <Switch
                                            checkedChildren="Active"
                                            unCheckedChildren="Blocked"
                                            defaultChecked
                                        />
                                    </Form.Item>

                                    <Form.Item name="role" label="User Role" rules={[{required: true}]}>
                                        <Select>
                                            <Select.Option value="CUSTOMER">Customer</Select.Option>
                                            <Select.Option value="SELLER">Seller</Select.Option>
                                            <Select.Option value="ADMIN">Admin</Select.Option>
                                        </Select>
                                    </Form.Item>

                                    <div style={{marginTop: 24}}>
                                        <span style={{display: 'block'}}>Joined Date</span>
                                        <span>{userInfo?.createdAt ? dayjs(userInfo.createdAt).format('DD/MM/YYYY HH:mm') : 'N/A'}</span>
                                    </div>
                                    <div style={{marginTop: 12}}>
                                        <span style={{display: 'block'}}>User ID</span>
                                        <Tag>{userInfo?.id}</Tag>
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        <Col span={16}>
                            <Card title="Personal Information" style={{borderRadius: 12}}>
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
                                        <Form.Item name="username" label="Username" rules={[{required: true}]}>
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="email" label="Email Address">
                                            <Input disabled style={{color: '#555'}}/>
                                        </Form.Item>
                                    </Col>
                                </Row>

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
                                    <Button type="primary" htmlType="submit" icon={<SaveOutlined/>} loading={submitting}
                                            style={{backgroundColor: '#008ECC'}}>
                                        Save Changes
                                    </Button>
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </>
    )
}

export default EditCustomer;