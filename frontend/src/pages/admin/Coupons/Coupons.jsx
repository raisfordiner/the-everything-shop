import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import couponService from "../../../services/couponService.js";
import {Button, Card, Col, Input, message, Popconfirm, Row, Space, Table, Tag} from "antd";
import {DeleteOutlined, EditOutlined, ExportOutlined, GiftOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

const Coupons = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [messageApi, contextHolder] = message.useMessage();

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const response = await couponService.getAllCoupons();
            const data = response.data.coupons;
            setCoupons(data);
        }
        catch (error) {
            console.error("Failed to fetch coupons:", error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCoupons();
    }, [])

    const handleDelete = async (id) => {
        try {
            await couponService.deleteCoupon(id);
            messageApi.open({
                type: 'success',
                content: 'Coupon deleted successfully!',
            });
            fetchCoupons();
        }
        catch (error) {
            messageApi.open({
                type: 'error',
                content: error.message || 'Failed to delete coupon!',
            });
        }
    }

    const columns = [
        {
            title: 'Coupon Code',
            dataIndex: 'code',
            key: 'code',
            render: (text) => (
                <Space>
                    <GiftOutlined style={{ color: '#008ECC' }} />
                    <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '14px' }}>{text}</span>
                </Space>
            ),
            sorter: (a, b) => a.code.localeCompare(b.code)
        },
        {
            title: 'Discount',
            dataIndex: 'discountPercentage',
            key: 'discountPercentage',
            render: (value) => (
                <Tag color="orange">-{value}%</Tag>
            ),
        },
        {
            title: 'Usage Limit',
            dataIndex: 'maxUsage',
            key: 'maxUsage',
            render: (limit) => limit ? `${limit} times` : 'Unlimited',
        },
        {
            title: 'Expiration Date',
            dataIndex: 'expiresAt',
            key: 'expiresAt',
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : 'Never',
            sorter: (a, b) => new Date(a.expiresAt) - new Date(b.expiresAt),
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => {
                const isExpired = record.expiresAt && dayjs().isAfter(dayjs(record.expiresAt));
                const isActive = record.isActive !== false;

                if (isExpired) {
                    return <Tag color="red">Expired</Tag>;
                }
                return isActive ? <Tag color="success">Active</Tag> : <Tag color="default">Disabled</Tag>;
            }
        },
        {
            title: 'Action',
            key: 'action',
            width: 1,
            render: (_, record) => (
                <Space size="middle" style={{ whiteSpace: 'nowrap' }}>
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => navigate(`edit-coupon/${record.id}`)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete coupon"
                        description="Are you sure to delete this coupon?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const filteredCoupons = coupons.filter(coupon =>
        coupon.code?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <h2>Coupons</h2>
                </Col>
                <Col>
                    <Space>
                        <Button icon={<ExportOutlined />}>Export</Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            style={{ backgroundColor: '#008ECC' }}
                            onClick={() => navigate('add-coupon')}
                        >
                            Add Coupon
                        </Button>
                    </Space>
                </Col>
            </Row>

            <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Search by coupon code..."
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        onChange={e => setSearchText(e.target.value)}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredCoupons}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        total: filteredCoupons.length,
                        showTotal: (total) => `Total ${total} coupons`,
                    }}
                />
            </Card>
        </>
    )
}

export default Coupons;