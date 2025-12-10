import React, { useEffect, useState } from 'react';
import { Typography, Select, List, Card, Tag, Button, Spin, Empty, Row, Col } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import orderService from '../../../services/orderService';
import './MyOrder.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const MyOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await orderService.getAllOrders(statusFilter);
            if (res && res.data && res.data.orders) {
                setOrders(res.data.orders);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'orange';
            case 'SHIPPED': return 'blue';
            case 'DELIVERED': return 'green';
            case 'CANCELLED': return 'red';
            default: return 'default';
        }
    };

    const formatPrice = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const calculateTotal = (order) => {
        if (order.payment && order.payment.amount) {
            return order.payment.amount;
        }
        return order.orderItems.reduce((total, item) => {
            const price = item.productVariant?.product?.price || 0;
            const adjustment = item.productVariant?.priceAdjustment || 0;
            return total + (price + adjustment) * item.quantity;
        }, 0);
    };

    return (
        <div className="my-order">
            <h2 style={{ fontSize: "32px", color: '#008ECC', marginBottom: '24px' }}>My Order</h2>

            <div className="my-order__filter">
                <Text strong style={{ marginRight: 10 }}>Filter by status:</Text>
                <Select
                    defaultValue=""
                    style={{ width: 200 }}
                    onChange={handleStatusChange}
                    allowClear
                >
                    <Option value="">All</Option>
                    <Option value="PENDING">Pending</Option>
                    <Option value="SHIPPED">Shipped</Option>
                    <Option value="DELIVERED">Delivered</Option>
                    <Option value="CANCELLED">Cancelled</Option>
                </Select>
            </div>

            <div className="my-order__list-container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Spin size="large" />
                    </div>
                ) : orders.length > 0 ? (
                    <List
                        grid={{ gutter: 16, column: 1 }}
                        dataSource={orders}
                        renderItem={order => (
                            <List.Item>
                                <Card className="my-order__card">
                                    <Row gutter={16} align="middle">
                                        <Col span={4}>
                                            <div className="my-order__card-date">
                                                <Text type="secondary">Order Date</Text>
                                                <br />
                                                <Text strong>{new Date(order.orderDate).toLocaleDateString()}</Text>
                                            </div>
                                        </Col>
                                        <Col span={10}>
                                            <div className="my-order__card-address">
                                                <Text type="secondary">Address</Text>
                                                <br />
                                                <Text>{order.address ? order.address.address : 'N/A'}</Text>
                                            </div>
                                        </Col>
                                        <Col span={4}>
                                            <div className="my-order__card-status">
                                                <Text type="secondary">Status</Text>
                                                <br />
                                                <Tag color={getStatusColor(order.status)}>{order.status}</Tag>
                                            </div>
                                        </Col>
                                        <Col span={4}>
                                            <div className="my-order__card-price">
                                                <Text type="secondary">Total Price</Text>
                                                <br />
                                                <Text strong style={{ color: '#ff4d4f' }}>
                                                    {formatPrice(calculateTotal(order))}
                                                </Text>
                                            </div>
                                        </Col>
                                        <Col span={2} style={{ textAlign: 'right' }}>
                                            <Button type="primary" size="small" style={{ backgroundColor: '#008ECC' }}>
                                                Detail
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card>
                            </List.Item>
                        )}
                    />
                ) : (
                    <Empty description="No orders found" />
                )}
            </div>
        </div>
    );
};

export default MyOrder;
