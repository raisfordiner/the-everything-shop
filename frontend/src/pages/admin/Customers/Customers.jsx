import {useEffect, useState} from "react";
import userService from "../../../services/userService.js";
import {Button, Card, Col, Input, message, Popconfirm, Row, Space, Spin, Table} from "antd";
import {EditOutlined, DeleteOutlined, ExportOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import dayjs from 'dayjs';
import {useNavigate} from "react-router";

const Customers = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getAllUsers();
            if (response) {
                const data = response.data.users;
                setUsers(data);
            }
        }
        catch (error) {
            console.error("Failed to fetch users:", error);
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
            fetchUsers();
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        {
            title: "Customers Name",
            dataIndex: "username",
            key: "username",
            render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
            sorter: (a, b) => a.username.localeCompare(b.username)
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email"
        },
        {
            title: 'Join Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('DD/MM/YYYY'),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        },
        {
            title: 'Action',
            key: 'action',
            width: 1,
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />}
                            size="small"
                            onClick={() => navigate(`edit-customer/${record.id}`)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete user"
                        description="Are you sure to delete this customer?"
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
            <Row justify="space-between" align="middle" style={{marginBottom: 24}}>
                <Col>
                    <h2>Customers</h2>
                </Col>
                <Col>
                    <Space>
                        <Button icon={<ExportOutlined/>}>Export</Button>
                        <Button type="primary" icon={<PlusOutlined/>} style={{backgroundColor: '#008ECC'}} onClick={() => navigate('add-customer')}>
                            Add Customer
                        </Button>
                    </Space>
                </Col>
            </Row>

            <Card style={{borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>

                <div style={{marginBottom: 16, display: 'flex', justifyContent: 'space-between'}}>
                    <Input
                        placeholder="Search by name or email..."
                        prefix={<SearchOutlined/>}
                        style={{width: 400}}
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

export default Customers;