import {useNavigate} from "react-router";
import React, {useEffect, useState} from "react";
import couponService from "../../../services/couponService.js";
import {Button, Card, Col, Input, message, Popconfirm, Row, Space, Table, Tag, Typography} from "antd";
import {DeleteOutlined, EditOutlined, ExportOutlined, GiftOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import promotionService from "../../../services/promotionService.js";
const { Title, Text } = Typography;


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

            const newCoupons = await Promise.all(data.map(async (coupon) => {
                if (!coupon.promotionId) return { ...coupon, promotionStatus: 'N/A' };

                try {
                    const promoRes = await promotionService.getPromotionById(coupon.promotionId);
                    return {
                        ...coupon,
                        promotionStatus: promoRes?.data?.status || 'N/A'
                    };
                } catch (err) {
                    console.error(`Failed to fetch promotion for coupon ${coupon.id}`, err);
                    return { ...coupon, promotionStatus: 'ERROR' };
                }
            }));

            setCoupons(newCoupons);
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
                    <GiftOutlined style={{ color: '#008ECC', fontSize: 16 }} />
                    <Text strong style={{ fontSize: 16 }}>{text}</Text>,
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
            render: (limit) => <Text strong type="secondary" style={{ fontSize: 16 , color: '#595959' }}>{limit ? `${limit} times` : "Unlimited"}</Text>,
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => {
                const status = record.promotionStatus;

                if (status === "ACTIVE") {
                    return <Tag color="success">Active</Tag>;
                }
                else {
                    return <Tag color="default">Disabled</Tag>;
                }
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
                    <Title level={2} style={{margin: 0, color: '#008ECC'}}>Coupons</Title>
                </Col>
                <Col>
                    <Space>
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