import React, { useState } from 'react';
import {Card, Row, Col, Table, Statistic, Space, Select, DatePicker, Button, Tag, Empty, Typography} from 'antd';
import {
    ShopOutlined,
    ShoppingOutlined,
    DollarOutlined,
    SafetyCertificateOutlined,
    ExportOutlined,
    FilterOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title} = Typography;


const ReportCard = ({ title, value, icon, type, activeTab, onClick }) => {
    const isActive = activeTab === type;
    return (
        <Card
            hoverable
            onClick={() => onClick(type)}
            style={{
                cursor: 'pointer',
                borderColor: isActive ? '#008ECC' : '#f0f0f0',
                backgroundColor: isActive ? '#e6f7ff' : '#fff',
                transition: 'all 0.3s',
                height: '100%'
            }}
        >
            <Statistic
                title={
                    <span style={{
                        fontWeight: isActive ? 'bold' : 'normal',
                        color: isActive ? '#008ECC' : undefined,
                        fontSize: '14px'
                    }}>
                        {title}
                    </span>
                }
                value={value}
                valueStyle={{
                    color: isActive ? '#008ECC' : '#3f8600',
                    fontSize: '18px',
                }}
                prefix={icon}
            />
        </Card>
    );
};

const Reports = () => {
    const [activeTab, setActiveTab] = useState('INVENTORY');
    const [subFilter, setSubFilter] = useState('ALL');

    const inventoryData = [];
    const orderData = [];
    const revenueData = [];
    const controlData = [];

    const handleTabChange = (type) => {
        setActiveTab(type);
        setSubFilter('ALL');
    };

    const getColumns = () => {
        switch (activeTab) {
            case 'INVENTORY':
                return [
                    { title: 'Product Name', dataIndex: 'product', key: 'product', render: text => <b>{text}</b> },
                    { title: 'Variant', dataIndex: 'variant', key: 'variant', responsive: ['md'] },
                    { title: 'Category', dataIndex: 'category', key: 'category', responsive: ['lg'] },
                    { title: 'Stock Qty', dataIndex: 'stock', key: 'stock', sorter: true },
                    { title: 'Status', dataIndex: 'status', key: 'status' },
                ];
            case 'ORDER':
                return [
                    { title: 'Order ID', dataIndex: 'id', key: 'id' },
                    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
                    { title: 'Date', dataIndex: 'date', key: 'date' },
                    { title: 'Total', dataIndex: 'total', key: 'total' },
                    { title: 'Status', dataIndex: 'status', key: 'status' },
                ];
            case 'REVENUE':
                return [
                    { title: 'Time Period', dataIndex: 'period', key: 'period' },
                    { title: 'Total Revenue', dataIndex: 'revenue', key: 'revenue' },
                    { title: 'Discounts', dataIndex: 'discount', key: 'discount' },
                    { title: 'Profit', dataIndex: 'profit', key: 'profit' },
                ];
            case 'CONTROL':
                return [
                    { title: 'Timestamp', dataIndex: 'time', key: 'time' },
                    { title: 'Activity', dataIndex: 'action', key: 'action' },
                    { title: 'User', dataIndex: 'user', key: 'user' },
                    { title: 'Note', dataIndex: 'note', key: 'note' },
                ];
            default: return [];
        }
    };

    const getDataSource = () => {
        switch (activeTab) {
            case 'INVENTORY': return inventoryData;
            case 'ORDER': return orderData;
            case 'REVENUE': return revenueData;
            case 'CONTROL': return controlData;
            default: return [];
        }
    };

    const getFilterOptions = () => {
        switch (activeTab) {
            case 'INVENTORY':
                return [
                    { value: 'ALL', label: 'All Inventory' },
                    { value: 'LOW', label: 'Low Stock' },
                    { value: 'OUT', label: 'Out of Stock' },
                ];
            case 'ORDER':
                return [
                    { value: 'ALL', label: 'All Orders' },
                    { value: 'LATE', label: 'Late Processing' },
                ];
            case 'REVENUE':
                return [
                    { value: 'DAY', label: 'Daily' },
                    { value: 'MONTH', label: 'Monthly' },
                ];
            default: return [{ value: 'ALL', label: 'All Records' }];
        }
    };

    return (
        <div className="reports-page">
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <Title level={2} style={{margin: 0, color: '#008ECC'}}>Reports Center</Title>
                <Button icon={<ExportOutlined />} disabled>Export Report</Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <ReportCard
                        title="Inventory"
                        value="Checking"
                        type="INVENTORY"
                        activeTab={activeTab}
                        onClick={handleTabChange}
                        icon={<ShopOutlined style={{ color: activeTab === 'INVENTORY' ? '#008ECC' : '#cf1322' }} />}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <ReportCard
                        title="Orders"
                        value="Processing"
                        type="ORDER"
                        activeTab={activeTab}
                        onClick={handleTabChange}
                        icon={<ShoppingOutlined style={{ color: activeTab === 'ORDER' ? '#008ECC' : '#cf1322' }} />}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <ReportCard
                        title="Revenue"
                        value="Financial"
                        type="REVENUE"
                        activeTab={activeTab}
                        onClick={handleTabChange}
                        icon={<DollarOutlined style={{ color: activeTab === 'REVENUE' ? '#008ECC' : '#cf1322' }} />}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <ReportCard
                        title="Control"
                        value="Logs"
                        type="CONTROL"
                        activeTab={activeTab}
                        onClick={handleTabChange}
                        icon={<SafetyCertificateOutlined style={{ color: activeTab === 'CONTROL' ? '#008ECC' : '#cf1322' }} />}
                    />
                </Col>
            </Row>

            <Card style={{ borderRadius: 12, minHeight: 400 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                    <Space>
                        <FilterOutlined style={{ color: '#888' }} />

                        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Filter View:</span>

                        <Select
                            value={subFilter}
                            onChange={setSubFilter}
                            style={{ width: 200 }}
                        >
                            {getFilterOptions().map(opt => (
                                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                            ))}
                        </Select>
                    </Space>

                    {activeTab !== 'INVENTORY' && <RangePicker style={{ width: 250 }} />}
                </Row>

                <Table
                    rowKey="id"
                    columns={getColumns()}
                    dataSource={getDataSource()}
                    pagination={false}
                    bordered={false}

                    title={() => <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{activeTab} Details</span>}
                    locale={{ emptyText: <Empty description={`No Data for ${activeTab}`} /> }}
                    scroll={{ x: 600 }}
                />
            </Card>
        </div>
    );
};

export default Reports;