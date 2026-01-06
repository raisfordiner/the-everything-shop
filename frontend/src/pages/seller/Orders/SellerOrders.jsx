import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Card,
    Col,
    Input,
    message,
    Row,
    Space,
    Table,
    Tag,
    Select,
    Modal,
    Descriptions,
    Image,
    Typography,
    Divider,
} from 'antd';
import {
    SearchOutlined,
    EyeOutlined,
    ReloadOutlined,
    FilterOutlined,
    ShoppingOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import orderService from '../../../services/orderService';
import TablePagination from '../../../components/common/TablePagination/TablePagination';

const { Option } = Select;
const { Text } = Typography;

const SellerOrders = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, searchText, statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            console.log('Fetching orders...');
            const response = await orderService.getAllOrders();
            console.log('Orders response:', response);

            const ordersData = response?.data?.orders || response?.orders || [];
            setOrders(ordersData);
            setPagination(prev => ({ ...prev, total: ordersData.length }));
        } catch (error) {
            console.error('Error fetching orders:', error);
            message.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = [...orders];

        // Filter by status
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Filter by search text
        if (searchText) {
            const searchLower = searchText.toLowerCase();
            filtered = filtered.filter(order => 
                order.id.toLowerCase().includes(searchLower) ||
                order.address?.recipientName?.toLowerCase().includes(searchLower) ||
                order.address?.phone?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredOrders(filtered);
        setPagination(prev => ({ ...prev, total: filtered.length, current: 1 }));
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            console.log('Updating order status:', { orderId, newStatus });
            await orderService.updateOrderStatus(orderId, newStatus);
            message.success('Order status updated successfully');
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            message.error('Failed to update order status');
        }
    };

    const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
        try {
            console.log('Updating payment status:', { orderId, newPaymentStatus });
            // You'll need to implement this in your orderService
            await orderService.updatePaymentStatus(orderId, newPaymentStatus);
            message.success('Payment status updated successfully');
            fetchOrders();
        } catch (error) {
            console.error('Error updating payment status:', error);
            message.error('Failed to update payment status');
        }
    };

    const handleBulkStatusChange = async (newStatus) => {
        if (selectedRowKeys.length === 0) {
            message.warning('Please select at least one order');
            return;
        }

        try {
            console.log('Bulk updating order status:', { orderIds: selectedRowKeys, newStatus });
            
            // Update all selected orders
            await Promise.all(
                selectedRowKeys.map(orderId => 
                    orderService.updateOrderStatus(orderId, newStatus)
                )
            );

            message.success(`${selectedRowKeys.length} order(s) updated successfully`);
            setSelectedRowKeys([]);
            fetchOrders();
        } catch (error) {
            console.error('Error bulk updating orders:', error);
            message.error('Failed to update some orders');
        }
    };

    const handleViewDetails = async (orderId) => {
        try {
            console.log('Fetching order details:', orderId);
            const response = await orderService.getOrderById(orderId);
            console.log('Order detail response:', response);

            const orderData = response?.data?.order || response?.order || null;
            if (orderData) {
                setSelectedOrder(orderData);
                setDetailModalVisible(true);
            } else {
                message.error('Failed to load order details');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            message.error('Failed to load order details');
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

    const getItemPrice = (item) => {
        if (item.price !== undefined) {
            return item.price;
        }
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

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            width: 150,
            render: (text) => (
                <Text copyable={{ text }}>{text.substring(0, 8)}...</Text>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
            render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Customer',
            key: 'customer',
            width: 200,
            render: (_, record) => {
                const address = record.address?.address || 
                    (record.address?.street ? `${record.address.street}, ${record.address.ward}, ${record.address.district}` : 'N/A');
                const truncatedAddress = address.length > 30 ? address.substring(0, 30) + '...' : address;
                
                return (
                    <div>
                        <Text strong>{record.address?.phoneNumber || record.address?.phone || 'N/A'}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }} title={address}>
                            {truncatedAddress}
                        </Text>
                    </div>
                );
            },
        },
        {
            title: 'Items',
            dataIndex: 'orderItems',
            key: 'items',
            width: 80,
            align: 'center',
            render: (items) => <Tag>{items?.length || 0}</Tag>,
        },
        {
            title: 'Total',
            key: 'total',
            width: 120,
            align: 'right',
            sorter: (a, b) => calculateOrderTotal(a) - calculateOrderTotal(b),
            render: (_, record) => (
                <Text strong style={{ color: '#ff4d4f' }}>
                    ${calculateOrderTotal(record).toFixed(2)}
                </Text>
            ),
        },
        {
            title: 'Payment',
            key: 'payment',
            width: 150,
            render: (_, record) => (
                record.payment ? (
                    <div>
                        <Select
                            value={record.payment.status}
                            onChange={(value) => handlePaymentStatusChange(record.id, value)}
                            style={{ width: '100%' }}
                            size="small"
                        >
                            <Option value="PENDING">
                                <Tag color="orange">Pending</Tag>
                            </Option>
                            <Option value="SUCCESS">
                                <Tag color="green">Success</Tag>
                            </Option>
                            <Option value="FAILED">
                                <Tag color="red">Failed</Tag>
                            </Option>
                        </Select>
                        <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>
                            {record.payment.method}
                        </Text>
                    </div>
                ) : (
                    <Tag color="default">No Payment</Tag>
                )
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            filters: [
                { text: 'Pending', value: 'PENDING' },
                { text: 'Shipped', value: 'SHIPPED' },
                { text: 'Delivered', value: 'DELIVERED' },
                { text: 'Cancelled', value: 'CANCELLED' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status, record) => (
                <Select
                    value={status}
                    onChange={(value) => handleStatusChange(record.id, value)}
                    style={{ width: '100%' }}
                    size="small"
                >
                    <Option value="PENDING">
                        <Tag color="orange">Pending</Tag>
                    </Option>
                    <Option value="SHIPPED">
                        <Tag color="blue">Shipped</Tag>
                    </Option>
                    <Option value="DELIVERED">
                        <Tag color="green">Delivered</Tag>
                    </Option>
                    <Option value="CANCELLED">
                        <Tag color="red">Cancelled</Tag>
                    </Option>
                </Select>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(record.id)}
                >
                    View
                </Button>
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    };

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: '12px' }}>
                <Col>
                    <Space size="middle">
                        <h2>Orders</h2>
                        <Tag color="blue">{filteredOrders.length} orders</Tag>
                    </Space>
                </Col>
                <Col>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchOrders}
                        loading={loading}
                    >
                        Refresh
                    </Button>
                </Col>
            </Row>

            <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Space style={{ marginBottom: '16px', width: '100%' }} direction="vertical">
                    <Space wrap>
                        <Input
                            placeholder="Search by Order ID, Customer, Phone..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 300 }}
                            allowClear
                        />
                        <Select
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: 150 }}
                            prefix={<FilterOutlined />}
                        >
                            <Option value="ALL">All Status</Option>
                            <Option value="PENDING">Pending</Option>
                            <Option value="SHIPPED">Shipped</Option>
                            <Option value="DELIVERED">Delivered</Option>
                            <Option value="CANCELLED">Cancelled</Option>
                        </Select>
                    </Space>

                    {selectedRowKeys.length > 0 && (
                        <Space>
                            <Text>Selected {selectedRowKeys.length} order(s)</Text>
                            <Button
                                size="small"
                                type="primary"
                                onClick={() => handleBulkStatusChange('SHIPPED')}
                            >
                                Mark as Shipped
                            </Button>
                            <Button
                                size="small"
                                onClick={() => handleBulkStatusChange('DELIVERED')}
                            >
                                Mark as Delivered
                            </Button>
                            <Button
                                size="small"
                                danger
                                onClick={() => handleBulkStatusChange('CANCELLED')}
                            >
                                Cancel Orders
                            </Button>
                            <Button
                                size="small"
                                onClick={() => setSelectedRowKeys([])}
                            >
                                Clear Selection
                            </Button>
                        </Space>
                    )}
                </Space>

                <Table
                    columns={columns}
                    dataSource={filteredOrders.slice(
                        (pagination.current - 1) * pagination.pageSize,
                        pagination.current * pagination.pageSize
                    )}
                    rowKey="id"
                    loading={loading}
                    rowSelection={rowSelection}
                    pagination={false}
                    scroll={{ x: 1200, y: 'calc(100vh - 380px)' }}
                />

                <TablePagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={filteredOrders.length}
                    onChange={(page, pageSize) => {
                        setPagination({ ...pagination, current: page, pageSize });
                    }}
                />
            </Card>

            {/* Order Detail Modal */}
            <Modal
                title="Order Details"
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailModalVisible(false)}>
                        Close
                    </Button>
                ]}
                width={900}
            >
                {selectedOrder && (
                    <div>
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Order ID" span={2}>
                                <Text copyable>{selectedOrder.id}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Order Date">
                                {dayjs(selectedOrder.createdAt).format('DD/MM/YYYY HH:mm')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={getStatusColor(selectedOrder.status)}>
                                    {selectedOrder.status}
                                </Tag>
                            </Descriptions.Item>
                            {selectedOrder.payment && (
                                <>
                                    <Descriptions.Item label="Payment Method">
                                        {selectedOrder.payment.method}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Payment Status">
                                        <Tag color={getPaymentStatusColor(selectedOrder.payment.status)}>
                                            {selectedOrder.payment.status}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Payment Amount" span={2}>
                                        <Text strong style={{ fontSize: '16px', color: '#ff4d4f' }}>
                                            ${selectedOrder.payment.amount?.toFixed(2)}
                                        </Text>
                                    </Descriptions.Item>
                                </>
                            )}
                        </Descriptions>

                        {selectedOrder.address && (
                            <>
                                <Divider orientation="left">Delivery Address</Divider>
                                <Descriptions bordered column={1} size="small">
                                    <Descriptions.Item label="Recipient">
                                        {selectedOrder.address.recipientName}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Phone">
                                        {selectedOrder.address.phoneNumber || selectedOrder.address.phone}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Address">
                                        {selectedOrder.address.address || 
                                            `${selectedOrder.address.street}, ${selectedOrder.address.ward}, ${selectedOrder.address.district}, ${selectedOrder.address.province}`}
                                    </Descriptions.Item>
                                </Descriptions>
                            </>
                        )}

                        <Divider orientation="left">Order Items</Divider>
                        <Table
                            dataSource={selectedOrder.orderItems || []}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            columns={[
                                {
                                    title: 'Product',
                                    key: 'product',
                                    render: (_, item) => (
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <Image
                                                src={
                                                    item.productVariant?.images?.[0] ||
                                                    item.productVariant?.product?.images?.[0] ||
                                                    'https://via.placeholder.com/50'
                                                }
                                                alt={item.productVariant?.product?.name}
                                                width={50}
                                                height={50}
                                                style={{ objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                            <div>
                                                <Text strong>{item.productVariant?.product?.name}</Text>
                                                <br />
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    {item.productVariant?.variantAttributes &&
                                                        Object.entries(item.productVariant.variantAttributes)
                                                            .map(([key, value]) => `${key}: ${value}`)
                                                            .join(', ')}
                                                </Text>
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    title: 'Price',
                                    key: 'price',
                                    align: 'right',
                                    render: (_, item) => `$${getItemPrice(item).toFixed(2)}`,
                                },
                                {
                                    title: 'Quantity',
                                    dataIndex: 'quantity',
                                    key: 'quantity',
                                    align: 'center',
                                },
                                {
                                    title: 'Subtotal',
                                    key: 'subtotal',
                                    align: 'right',
                                    render: (_, item) => (
                                        <Text strong>
                                            ${(getItemPrice(item) * item.quantity).toFixed(2)}
                                        </Text>
                                    ),
                                },
                            ]}
                        />

                        <div style={{ marginTop: '16px', textAlign: 'right' }}>
                            <Space direction="vertical" align="end">
                                <div>
                                    <Text>Subtotal: </Text>
                                    <Text strong>${calculateOrderTotal(selectedOrder).toFixed(2)}</Text>
                                </div>
                                <div>
                                    <Text strong style={{ fontSize: '18px' }}>Total: </Text>
                                    <Text strong style={{ fontSize: '20px', color: '#ff4d4f' }}>
                                        ${selectedOrder.payment?.amount?.toFixed(2) || calculateOrderTotal(selectedOrder).toFixed(2)}
                                    </Text>
                                </div>
                            </Space>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default SellerOrders;
