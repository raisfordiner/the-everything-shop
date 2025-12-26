import React, {useEffect, useState} from "react";
import userService from "../../../services/userService.js";
import {Avatar, Button, Card, Col, Input, message, Popconfirm, Row, Space, Spin, Table, Tag, Typography} from "antd";
import {EditOutlined, DeleteOutlined, ExportOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router";
import {getAvatarColor} from "../../../utils/avatar.js";
const { Title, Text } = Typography;

const Staffs = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [messageApi, contextHolder] = message.useMessage();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getAllUsers();
            if (response && response?.data) {
                const data = response.data?.users || [];
                const users = data.filter(user => user.role === "ADMIN" || user.role === "SELLER");

                setUsers(users);
            }
        }
        catch (error) {
            message.error("Failed to load staff list.");
            console.error("Fetch error:", error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    const handleDelete = async (id) => {
        try {
            await userService.deleteUser(id);
            messageApi.open({
                type: 'success',
                content: 'Staff deleted successfully!',
            });
            fetchUsers();
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: error.message || 'Failed to delete staff!',
            });
        }
    };

    const columns = [
        {
            key: "avatar",
            width: 80,
            align: 'center',
            render: (_, record) => {
                const name = record.username || "U";
                const firstLetter = name.charAt(0).toUpperCase();

                return (
                    <Avatar
                        style={{
                            backgroundColor: getAvatarColor(name),
                            verticalAlign: 'middle',
                            color: '#fff',
                            fontWeight: 600
                        }}
                        size="large"
                    >
                        {firstLetter}
                    </Avatar>
                );
            }
        },
        {
            title: "User Name",
            dataIndex: "username",
            key: "username",
            render: (text) => <Text strong style={{ fontSize: 16 }}>{text}</Text>,
            sorter: (a, b) => a.username.localeCompare(b.username)
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (text) => <Text strong type="secondary" style={{ fontSize: 16 , color: '#595959' }}>{text}</Text>,
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            sorter: (a, b) => a.role.localeCompare(b.role),
            render: (role) => {
                let color = role === 'ADMIN' ? 'volcano' : 'geekblue';
                return (
                    <Tag color={color} key={role}>
                        {role.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: 'Action',
            key: 'action',
            width: 1,
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />}
                            size="small"
                            onClick={() => navigate(`edit-staff/${record.id}`)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete user"
                        description="Are you sure to delete this user?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        }
    ]

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            {contextHolder}

            <Row justify="space-between" align="middle" style={{marginBottom: 24}}>
                <Col>
                    <div>
                        <Title level={2} style={{margin: 0, color: '#008ECC'}}>Staffs</Title>
                    </div>
                </Col>
                <Col>
                    <Space>
                        <Button type="primary" icon={<PlusOutlined/>} style={{backgroundColor: '#008ECC'}} onClick={() => navigate('add-staff')}>
                            Add Staffs
                        </Button>
                    </Space>
                </Col>
            </Row>

            <Card style={{borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>

                <div style={{marginBottom: 16, display: 'flex', justifyContent: 'space-between'}}>
                    <Input
                        placeholder="Search by name or email..."
                        prefix={<SearchOutlined/>}
                        style={{width: 360}}
                        allowClear
                        onChange={e => setSearchText(e.target.value)}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        total: filteredUsers.length,
                        showTotal: (total) => `Total ${total} items`,
                    }}
                />
            </Card>
        </>
    )
}

export default Staffs;