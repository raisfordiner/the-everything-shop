import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Empty,
    Spin,
    List,
    Tag,
    Button,
    Typography,
    Space,
    Image,
    Collapse,
    Divider,
    message,
    Popconfirm,
} from 'antd';
import {
    ShoppingOutlined,
    EyeOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    CarOutlined,
    StarFilled,
} from '@ant-design/icons';
import orderService from '../../../services/orderService';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const Orders = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.authReducer || { user: {}, isAuthenticated: false });
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) {
            message.error('Please login to view your orders');
            navigate('/login');
            return;
        }

        if (!user?.customer?.id) {
            message.error('Customer information not available');
            setLoading(false);
            return;
        }

        fetchOrders();
    }, [user, isAuthenticated, navigate]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            console.log('Fetching orders...');
            const response = await orderService.getAllOrders();
            console.log('Orders response:', response);

            // Handle response structure
            const ordersData = response?.data?.orders || response?.orders || [];
            setOrders(ordersData);
            console.log('Orders loaded:', ordersData);
        } catch (error) {
            message.error('Failed to load orders');
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            console.log('Cancelling order:', orderId);
            await orderService.updateOrderStatus(orderId, 'CANCELLED');
            message.success('Order cancelled successfully');
            fetchOrders();
        } catch (error) {
            message.error('Failed to cancel order');
            console.error('Error cancelling order:', error);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING':
                return <ClockCircleOutlined />;
            case 'SHIPPED':
                return <CarOutlined />;
            case 'DELIVERED':
                return <CheckCircleOutlined />;
            case 'CANCELLED':
                return <CloseCircleOutlined />;
            default:
                return <ClockCircleOutlined />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'orange';
            case 'SHIPPED':
                return 'blue';
            case 'DELIVERED':
                return 'green';
            case 'CANCELLED':
                return 'red';
            default:
                return 'default';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'SUCCESS':
                return 'green';
            case 'PENDING':
                return 'orange';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getItemPrice = (item) => {
        // If item has price field, use it (for older orders)
        if (item.price !== undefined) {
            return item.price;
        }
        // Otherwise calculate from product and variant
        const basePrice = item.productVariant?.product?.price || 0;
        const priceAdjustment = item.productVariant?.priceAdjustment || 0;
        return basePrice + priceAdjustment;
    };

    const calculateOrderTotal = (order) => {
        if (!order?.orderItems) return 0;
        return order.orderItems.reduce((total, item) => {
            const itemPrice = getItemPrice(item);
            return total + (itemPrice * item.quantity);
        }, 0);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div style={{ padding: '50px' }}>
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No orders yet"
                >
                    <Button type="primary" onClick={() => navigate('/products')}>
                        Start Shopping
                    </Button>
                </Empty>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

            <List
                dataSource={orders}
                renderItem={(order) => {
                    const total = calculateOrderTotal(order);

                    return (
                        <Card
                            key={order.id}
                            style={{ marginBottom: '16px' }}
                            title={
                                <Space>
                                    <Text type="secondary" style={{ fontWeight: 'normal', fontSize: '14px' }}>Order ID:</Text>
                                    <Text strong>{order.id.substring(0, 8)}...</Text>
                                </Space>
                            }
                            extra={
                                <Space size="middle">
                                    {order.status === 'DELIVERED' && order.payment?.status === 'SUCCESS' && (
                                        <Button
                                            type="primary"
                                            icon={<StarFilled />}
                                            onClick={() => navigate(`/orders/${order.id}/review`)}
                                        >
                                            {order.orderItems.every(item => !!item.review) ? 'Edit Review' : 'Leave a Review'}
                                        </Button>
                                    )}
                                    <Button
                                        type="link"
                                        icon={<EyeOutlined />}
                                        onClick={() => navigate(`/orders/${order.id}`)}
                                        style={{ padding: 0 }}
                                    >
                                        View Details
                                    </Button>
                                </Space>
                            }
                        >
                            <div style={{ marginBottom: '16px' }}>
                                <Space size="large" style={{ width: '100%' }}>
                                    <div>
                                        <Text type="secondary">Date:</Text>
                                        <br />
                                        <Text>{formatDate(order.createdAt)}</Text>
                                    </div>
                                    <Divider type="vertical" />
                                    <div>
                                        <Text type="secondary">Status:</Text>
                                        <br />
                                        <Tag
                                            icon={getStatusIcon(order.status)}
                                            color={getStatusColor(order.status)}
                                        >
                                            {order.status}
                                        </Tag>
                                    </div>
                                    <Divider type="vertical" />
                                    <div>
                                        <Text type="secondary">Payment:</Text>
                                        <br />
                                        {order.payment ? (
                                            <Tag color={getPaymentStatusColor(order.payment.status)}>
                                                {order.payment.method} - {order.payment.status}
                                            </Tag>
                                        ) : (
                                            <Tag color="default">No Payment Info</Tag>
                                        )}
                                    </div>
                                    {(order.status === 'PENDING' || order.status === 'SHIPPED') && (
                                        <>
                                            <Divider type="vertical" />
                                            <div style={{ flex: 1, textAlign: 'right' }}>
                                                <Popconfirm
                                                    title="Cancel Order"
                                                    description="Are you sure you want to cancel this order?"
                                                    onConfirm={() => handleCancelOrder(order.id)}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <Button type="default" danger>
                                                        Cancel Order
                                                    </Button>
                                                </Popconfirm>
                                            </div>
                                        </>
                                    )}
                                </Space>
                            </div>

                            <Collapse ghost>
                                <Panel header={`${order.orderItems?.length || 0} items`} key="1">
                                    <List
                                        dataSource={order.orderItems || []}
                                        renderItem={(item) => (
                                            <List.Item key={item.id}>
                                                <List.Item.Meta
                                                    avatar={
                                                        <Image
                                                            src={
                                                                item.productVariant?.images?.[0] ||
                                                                item.productVariant?.product?.images?.[0] ||
                                                                'https://via.placeholder.com/60'
                                                            }
                                                            alt={item.productVariant?.product?.name || 'Product'}
                                                            width={60}
                                                            height={60}
                                                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                                                        />
                                                    }
                                                    title={item.productVariant?.product?.name || 'Product'}
                                                    description={
                                                        <>
                                                            <Text type="secondary">
                                                                {item.productVariant?.variantAttributes &&
                                                                    Object.entries(item.productVariant.variantAttributes)
                                                                        .map(([key, value]) => `${key}: ${value}`)
                                                                        .join(', ')
                                                                }
                                                            </Text>
                                                            <br />
                                                            <Text>
                                                                ${getItemPrice(item).toFixed(2)} × {item.quantity}
                                                            </Text>
                                                        </>
                                                    }
                                                />
                                                <Text strong style={{ fontSize: '16px' }}>
                                                    ${(getItemPrice(item) * item.quantity).toFixed(2)}
                                                </Text>
                                            </List.Item>
                                        )}
                                    />
                                </Panel>
                            </Collapse>

                            <Divider />

                            <div style={{ textAlign: 'right' }}>
                                <Space>
                                    <Text strong>Total Amount:</Text>
                                    <Text strong style={{ fontSize: '20px', color: '#ff4d4f' }}>
                                        ${total.toFixed(2)}
                                    </Text>
                                </Space>
                            </div>
                        </Card>
                    );
                }}
            />
        </div >
    );
};

export default Orders;
