import {useNavigate, useParams} from "react-router";
import React, {useEffect, useState} from "react";
import userService from "../../../services/userService.js";
import {
    Avatar,
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    message,
    Row,
    Select,
    Spin,
    Tag, Tooltip,
    Typography,
} from "antd";
import { SaveOutlined, EditOutlined, UndoOutlined } from "@ant-design/icons";
import {getAvatarColor} from "../../../utils/avatar.js";
const { Title} = Typography;

const EditStaff = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [isEmailEditable, setIsEmailEditable] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const response = await userService.getUserById(id);

                let data = {};
                if (response && response?.data) {
                    data = response.data.user;
                    setUserInfo(data);
                }

                form.setFieldsValue({
                    username: data.username,
                    email: data.email,
                    role: data.role,
                    status: data.status || true,
                });
            }
            catch (error) {
                console.error("Failed to load user details: " + error);
            }
            finally {
                setLoading(false);
            }
        }

        if (id) fetchUserDetails();
    }, [form])

    const toggleEmailEdit = () => {
        if (isEmailEditable) {
            form.setFieldValue('email', userInfo.email);
            setIsEmailEditable(false);
        } else {
            setIsEmailEditable(true);
        }
    };

    const onFinish = async (values) => {
        setSubmitting(true);
        try {
            const updateData = {
                role: values.role,
                username: values.username,
                email: values.email,
            };

            await userService.updateUser(id, updateData);

            messageApi.open({
                type: 'success',
                content: 'User updated successfully!',
                duration: 0.5,
                onClose: () => {
                    navigate('/admin/staffs');
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

            <div style={{marginBottom: "24px"}}>
                <Title level={2} style={{margin: 0, color: '#008ECC'}}>Edit Staff</Title>
            </div>

            <Spin spinning={loading} size="large">
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        role: 'SELLER',
                        status: true,
                    }}
                    onFinish={onFinish}
                >
                    <Row gutter={24}>
                        <Col span={8}>
                            <Card style={{textAlign: 'center', borderRadius: 12, marginBottom: 24}}>
                                <div style={{marginBottom: 20}}>
                                    <Avatar
                                        style={{
                                            backgroundColor: getAvatarColor(name),
                                            verticalAlign: 'middle',
                                            color: '#fff',
                                            fontWeight: 600,
                                            fontSize: 42,
                                            width: 120,
                                            height: 120,
                                        }}
                                        size="large"
                                    >
                                        {userInfo?.username.charAt(0).toUpperCase() || "A"}
                                    </Avatar>
                                </div>

                                <Divider/>

                                <div style={{textAlign: 'left'}}>
                                    <Form.Item name="role" label="User Role" rules={[{required: true}]}>
                                        <Select>
                                            <Select.Option value="SELLER">Seller</Select.Option>
                                            <Select.Option value="ADMIN">Admin</Select.Option>
                                        </Select>
                                    </Form.Item>

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
                                        <Form.Item name="username" label="Username" rules={[{required: true}]}>
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="email" label="Email Address">
                                            <Input
                                                disabled={!isEmailEditable}
                                                style={{
                                                    color: isEmailEditable ? '#000' : '#777',
                                                    cursor: isEmailEditable ? 'text' : 'default'
                                                }}
                                                suffix={
                                                    <Tooltip title={isEmailEditable ? "Cancel edit" : "Edit email"}>
                                                        {isEmailEditable ? (
                                                            <UndoOutlined
                                                                onClick={toggleEmailEdit}
                                                                style={{ color: '#ff4d4f', cursor: 'pointer' }}
                                                            />
                                                        ) : (
                                                            <EditOutlined
                                                                onClick={toggleEmailEdit}
                                                                style={{ color: '#008ECC', cursor: 'pointer' }}
                                                            />
                                                        )}
                                                    </Tooltip>
                                                }
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Divider/>

                                <Form.Item style={{marginBottom: 0, textAlign: 'right'}}>
                                    <Button style={{marginRight: 12}} onClick={() => navigate('/admin/staffs')}>
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

export default EditStaff;