import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Table, Statistic, Space, Select, DatePicker, Button, Tag, Empty, Typography, message, Spin, Segmented, Divider, List } from 'antd';
import {
    ShopOutlined,
    DollarOutlined,
    SafetyCertificateOutlined,
    ExportOutlined,
    FilterOutlined,
    ClockCircleOutlined,
    BarChartOutlined,
    PieChartOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    WalletOutlined,
    ShoppingCartOutlined,
    RollbackOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { Pie, Column } from '@ant-design/plots';
import reportService from '../../../services/reportService';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

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

const MetricCard = ({ title, value, color, icon }) => (
    <Card style={{ height: '100%', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <Text type="secondary" style={{ fontSize: 14 }}>{title}</Text>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 8 }}>
                    {value}
                </div>
            </div>
            <div style={{
                backgroundColor: `${color}20`,
                padding: 12,
                borderRadius: '50%',
                color: color,
                fontSize: 24,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                {icon}
            </div>
        </div>
    </Card>
);

// Time period options (in hours)
const TIME_PERIOD_OPTIONS = [
    { value: 'CUSTOM', label: 'Custom Range', hours: null },
    { value: '1H', label: 'Last 1 Hour', hours: 1 },
    { value: '6H', label: 'Last 6 Hours', hours: 6 },
    { value: '12H', label: 'Last 12 Hours', hours: 12 },
    { value: '24H', label: 'Last 24 Hours', hours: 24 },
    { value: '48H', label: 'Last 48 Hours', hours: 48 },
    { value: '7D', label: 'Last 7 Days', hours: 24 * 7 },
    { value: '30D', label: 'Last 30 Days', hours: 24 * 30 },
    { value: '90D', label: 'Last 90 Days', hours: 24 * 90 },
];

// Activity type options for CONTROL tab
const ACTIVITY_TYPE_OPTIONS = [
    { value: 'ALL', label: 'All Activities' },
    { value: 'USER_SIGNUP', label: 'Sign Up Only' },
    { value: 'USER_LOGIN', label: 'Login Only' },
];

const Reports = () => {
    const [activeTab, setActiveTab] = useState('INVENTORY');
    const [subFilter, setSubFilter] = useState('ALL');
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [timeGranularity, setTimeGranularity] = useState('day');
    const [timePeriod, setTimePeriod] = useState('24H');
    const [activityType, setActivityType] = useState('ALL');

    const [inventoryData, setInventoryData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [controlData, setControlData] = useState([]);

    const buildParams = (additionalParams = {}) => {
        const params = { ...additionalParams };
        
        // Handle time period filter
        if (timePeriod !== 'CUSTOM') {
            const selectedPeriod = TIME_PERIOD_OPTIONS.find(opt => opt.value === timePeriod);
            if (selectedPeriod && selectedPeriod.hours) {
                const now = new Date();
                const startTime = new Date(now.getTime() - selectedPeriod.hours * 60 * 60 * 1000);
                params.startDate = startTime.toISOString();
                params.endDate = now.toISOString();
            }
        } else if (dateRange && dateRange[0] && dateRange[1]) {
            // Custom date range
            params.startDate = dateRange[0].startOf('day').toISOString();
            params.endDate = dateRange[1].endOf('day').toISOString();
        }
        return params;
    };

    const fetchData = async (tab) => {
        setLoading(true);
        try {
            switch (tab) {
                case 'INVENTORY':
                    const typeFilter = subFilter !== 'ALL'
                        ? { type: subFilter === 'OUT' ? 'OUT_OF_STOCK' : 'PRODUCT_CREATED' }
                        : {};
                    const invRes = await reportService.getInventoryLogs(buildParams(typeFilter));
                    setInventoryData(invRes?.logs || []);
                    break;
                case 'REVENUE':
                    const revRes = await reportService.getRevenueLogs(buildParams());
                    setRevenueData(revRes?.logs || []);
                    break;
                case 'CONTROL':
                    const activityFilter = activityType !== 'ALL' ? { type: activityType } : {};
                    const audRes = await reportService.getAuditLogs(buildParams(activityFilter));
                    setControlData(audRes?.logs || []);
                    break;
                default:
                    break;
            }
        } catch (error) {
            message.error('Failed to fetch report data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(activeTab);
    }, [activeTab, subFilter, dateRange, timePeriod, activityType]);

    const handleTabChange = (type) => {
        setActiveTab(type);
        setSubFilter('ALL');
        setActivityType('ALL');
    };

    const handleTimePeriodChange = (value) => {
        setTimePeriod(value);
        if (value !== 'CUSTOM') {
            setDateRange(null);
        }
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        if (dates && dates[0] && dates[1]) {
            setTimePeriod('CUSTOM');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const revenueMetrics = useMemo(() => {
        const completed = revenueData.filter(i => i.type === 'ORDER_COMPLETED');
        const returns = revenueData.filter(i => i.type === 'RETURN_COMPLETED');
        const cancels = revenueData.filter(i => i.type === 'CANCELLATION_COMPLETED');

        const income = completed.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        const expenseReturn = Math.abs(returns.reduce((acc, curr) => acc + (curr.amount || 0), 0));
        const expenseCancel = Math.abs(cancels.reduce((acc, curr) => acc + (curr.amount || 0), 0));
        const netRevenue = revenueData.reduce((acc, curr) => acc + (curr.amount || 0), 0);

        return {
            netRevenue,
            grossIncome: income,
            totalDeduction: expenseReturn + expenseCancel,
            deductionReturn: expenseReturn,
            deductionCancel: expenseCancel,
            countOrder: completed.length,
            countReturn: returns.length,
            countCancel: cancels.length
        };
    }, [revenueData]);

    const columnData = useMemo(() => {
        if (!dateRange || !dateRange[0]) return [];

        const anchorDate = dateRange[0];
        const dataMap = {};

        revenueData.forEach(item => {
            const date = dayjs(item.createdAt);
            let key;
            if (timeGranularity === 'hour') key = date.hour();
            else if (timeGranularity === 'day') key = date.date();
            else if (timeGranularity === 'month') key = date.month();
            else if (timeGranularity === 'year') key = date.year();

            if (dataMap[key] === undefined) dataMap[key] = 0;
            dataMap[key] += (item.amount || 0);
        });

        const filledData = [];

        if (timeGranularity === 'hour') {
            for (let i = 0; i < 24; i++) {
                filledData.push({
                    time: `${i}:00`,
                    value: dataMap[i] || 0,
                    sortIndex: i
                });
            }
        } else if (timeGranularity === 'day') {
            const daysInMonth = anchorDate.daysInMonth();
            for (let i = 1; i <= daysInMonth; i++) {
                filledData.push({
                    time: `${i}/${anchorDate.format('MM')}`,
                    value: dataMap[i] || 0,
                    sortIndex: i
                });
            }
        } else if (timeGranularity === 'month') {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            for (let i = 0; i < 12; i++) {
                filledData.push({
                    time: months[i],
                    value: dataMap[i] || 0,
                    sortIndex: i
                });
            }
        } else if (timeGranularity === 'year') {
            const currentYear = dayjs().year();
            for (let i = currentYear - 4; i <= currentYear; i++) {
                filledData.push({
                    time: i.toString(),
                    value: dataMap[i] || 0,
                    sortIndex: i
                });
            }
        }

        return filledData;
    }, [revenueData, timeGranularity, dateRange]);

    const columnRevenueConfig = {
        data: columnData,
        xField: 'time',
        yField: 'value',
        label: {
            position: 'middle',
            style: { fill: '#FFFFFF', opacity: 0.6 },
            formatter: (datum) => datum.value !== 0 ? datum.value.toFixed(0) : '',
        },
        xAxis: {
            label: { autoHide: true, autoRotate: false },
        },
        meta: {
            time: { alias: 'Thời gian' },
            value: { alias: 'Doanh thu' }
        },
        color: ({ value }) => {
            if (value > 0) return '#008ECC';
            if (value < 0) return '#ff4d4f';
            return '#f0f0f0';
        },
        tooltip: {
            formatter: (datum) => {
                return { name: 'Revenue', value: `$${datum.value.toFixed(2)}` };
            },
        }
    };

    const pieData = useMemo(() => {
        return [
            { type: 'Orders', value: revenueMetrics.countOrder },
            { type: 'Returns', value: revenueMetrics.countReturn },
            { type: 'Cancellations', value: revenueMetrics.countCancel },
        ].filter(i => i.value > 0);
    }, [revenueMetrics]);

    const pieRevenueConfig = {
        appendPadding: 10,
        data: pieData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        innerRadius: 0.6,
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{value}',
            style: { textAlign: 'center', fontSize: 14, fill: '#fff' },
        },
        interactions: [{ type: 'element-active' }],
        color: ({ type }) => {
            if (type === 'Orders') return '#52c41a';
            if (type === 'Returns') return '#faad14';
            return '#f5222d';
        },
        statistic: {
            title: false,
            content: {
                style: { whiteSpace: 'pre-wrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '18px' },
                content: 'Total\nTxns',
            },
        },
    };

    const exportToCSV = () => {
        const data = getDataSource();
        if (!data || data.length === 0) {
            message.warning('No data to export');
            return;
        }

        let headers = [];
        let rows = [];

        switch (activeTab) {
            case 'INVENTORY':
                headers = ['Type', 'Product ID', 'Variant ID', 'Details', 'Date'];
                rows = data.map(item => [
                    item.type === 'PRODUCT_CREATED' ? 'New Product' : 'Out of Stock',
                    item.productId || '',
                    item.variantId || '',
                    item.details?.productName || item.details?.name || '',
                    formatDate(item.createdAt)
                ]);
                break;
            case 'REVENUE':
                headers = ['Type', 'Order ID', 'Amount', 'Date'];
                rows = data.map(item => [
                    item.type === 'ORDER_COMPLETED' ? 'Order Completed' :
                        item.type === 'RETURN_COMPLETED' ? 'Return' : 'Cancellation',
                    item.orderId || '',
                    item.amount?.toFixed(2) || '0.00',
                    formatDate(item.createdAt)
                ]);
                break;
            case 'CONTROL':
                headers = ['Activity', 'Email', 'User ID', 'Details', 'Timestamp'];
                rows = data.map(item => [
                    item.type === 'USER_SIGNUP' ? 'Sign Up' : 'Login',
                    item.email || '',
                    item.userId || '',
                    item.details?.username || item.details?.role || '',
                    formatDate(item.createdAt)
                ]);
                break;
            default:
                return;
        }

        const csvContent = [headers.join(','), ...rows.map(row =>
            row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        )].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${activeTab.toLowerCase()}_report_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        message.success('Report exported successfully');
    };

    const getColumns = () => {
        switch (activeTab) {
            case 'INVENTORY':
                return [
                    {
                        title: 'Type',
                        dataIndex: 'type',
                        key: 'type',
                        sorter: (a, b) => a.type.localeCompare(b.type),
                        render: (type) => (
                            <Tag color={type === 'PRODUCT_CREATED' ? 'green' : 'red'}>
                                {type === 'PRODUCT_CREATED' ? 'New Product' : 'Out of Stock'}
                            </Tag>
                        )
                    },
                    {
                        title: 'Product ID',
                        dataIndex: 'productId',
                        key: 'productId',
                        ellipsis: true,
                        sorter: (a, b) => (a.productId || '').localeCompare(b.productId || ''),
                    },
                    {
                        title: 'Details',
                        dataIndex: 'details',
                        key: 'details',
                        render: (details) => details?.productName || details?.name || '-'
                    },
                    {
                        title: 'Date',
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                        defaultSortOrder: 'descend',
                        render: formatDate
                    },
                ];
            case 'REVENUE':
                return [
                    {
                        title: 'Type',
                        dataIndex: 'type',
                        key: 'type',
                        sorter: (a, b) => a.type.localeCompare(b.type),
                        render: (type) => {
                            let color = 'green';
                            let label = 'Order Completed';
                            if (type === 'RETURN_COMPLETED') {
                                color = 'orange';
                                label = 'Return';
                            } else if (type === 'CANCELLATION_COMPLETED') {
                                color = 'red';
                                label = 'Cancellation';
                            }
                            return <Tag color={color}>{label}</Tag>;
                        }
                    },
                    {
                        title: 'Order ID',
                        dataIndex: 'orderId',
                        key: 'orderId',
                        ellipsis: true,
                        sorter: (a, b) => (a.orderId || '').localeCompare(b.orderId || ''),
                    },
                    {
                        title: 'Amount',
                        dataIndex: 'amount',
                        key: 'amount',
                        sorter: (a, b) => a.amount - b.amount,
                        render: (amount) => (
                            <span style={{ color: amount >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                                {amount >= 0 ? '+' : ''}{amount?.toFixed(2) || '0.00'}
                            </span>
                        )
                    },
                    {
                        title: 'Date',
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                        defaultSortOrder: 'descend',
                        render: formatDate
                    },
                ];
            case 'CONTROL':
                return [
                    {
                        title: 'Activity',
                        dataIndex: 'type',
                        key: 'type',
                        sorter: (a, b) => a.type.localeCompare(b.type),
                        render: (type) => (
                            <Tag color={type === 'USER_SIGNUP' ? 'blue' : 'purple'}>
                                {type === 'USER_SIGNUP' ? 'Sign Up' : 'Login'}
                            </Tag>
                        )
                    },
                    {
                        title: 'Email',
                        dataIndex: 'email',
                        key: 'email',
                        sorter: (a, b) => (a.email || '').localeCompare(b.email || ''),
                    },
                    {
                        title: 'User ID',
                        dataIndex: 'userId',
                        key: 'userId',
                        ellipsis: true,
                    },
                    {
                        title: 'Details',
                        dataIndex: 'details',
                        key: 'details',
                        render: (details) => details?.username || details?.role || '-'
                    },
                    {
                        title: 'Timestamp',
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                        defaultSortOrder: 'descend',
                        render: formatDate
                    },
                ];
            default:
                return [];
        }
    };

    const getDataSource = () => {
        switch (activeTab) {
            case 'INVENTORY': return inventoryData;
            case 'REVENUE': return revenueData;
            case 'CONTROL': return controlData;
            default: return [];
        }
    };

    // Chart data for Audit Logs (CONTROL tab)
    const auditPieData = useMemo(() => {
        if (!controlData || controlData.length === 0) return [];
        const signUpCount = controlData.filter(item => item.type === 'USER_SIGNUP').length;
        const loginCount = controlData.filter(item => item.type === 'USER_LOGIN').length;
        return [
            { type: 'Sign Up', value: signUpCount },
            { type: 'Login', value: loginCount },
        ].filter(item => item.value > 0);
    }, [controlData]);

    const auditTimelineData = useMemo(() => {
        if (!controlData || controlData.length === 0) return [];
        
        // Group data by date and type
        const grouped = {};
        controlData.forEach(item => {
            const date = new Date(item.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            const type = item.type === 'USER_SIGNUP' ? 'Sign Up' : 'Login';
            const key = `${date}-${type}`;
            if (!grouped[key]) {
                grouped[key] = { date, type, count: 0 };
            }
            grouped[key].count++;
        });
        
        return Object.values(grouped).sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });
    }, [controlData]);

    const pieConfig = {
        data: auditPieData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        innerRadius: 0.6,
        label: {
            text: 'value',
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            color: {
                title: false,
                position: 'bottom',
            },
        },
        tooltip: {
            title: 'type',
        },
    };

    const columnConfig = {
        data: auditTimelineData,
        xField: 'date',
        yField: 'count',
        colorField: 'type',
        group: true,
        style: {
            radiusTopLeft: 4,
            radiusTopRight: 4,
        },
        legend: {
            color: {
                title: false,
                position: 'top',
            },
        },
    };

    const getFilterOptions = () => {
        switch (activeTab) {
            case 'INVENTORY':
                return [
                    { value: 'ALL', label: 'All Inventory' },
                    { value: 'NEW', label: 'New Products' },
                    { value: 'OUT', label: 'Out of Stock' },
                ];
            case 'REVENUE':
                return [
                    { value: 'ALL', label: 'All Transactions' },
                ];
            case 'CONTROL':
                return [
                    { value: 'ALL', label: 'All Activities' },
                ];
            default:
                return [{ value: 'ALL', label: 'All Records' }];
        }
    };

    return (
        <div className="reports-page">
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <Title level={2} style={{ margin: 0, color: '#008ECC' }}>Reports Center</Title>
                <Button icon={<ExportOutlined />} onClick={exportToCSV}>Export Report</Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={8}>
                    <ReportCard
                        title="Inventory"
                        value="Checking"
                        type="INVENTORY"
                        activeTab={activeTab}
                        onClick={handleTabChange}
                        icon={<ShopOutlined style={{ color: activeTab === 'INVENTORY' ? '#008ECC' : '#cf1322' }} />}
                    />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <ReportCard
                        title="Revenue"
                        value="Financial"
                        type="REVENUE"
                        activeTab={activeTab}
                        onClick={handleTabChange}
                        icon={<DollarOutlined style={{ color: activeTab === 'REVENUE' ? '#008ECC' : '#cf1322' }} />}
                    />
                </Col>
                <Col xs={24} sm={12} lg={8}>
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
                {activeTab === 'REVENUE' && (
                    <div style={{ marginBottom: 30 }}>
                        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                            <Col xs={24} sm={12} lg={6}>
                                <MetricCard
                                    title="Total Transactions" value={revenueData.length}
                                    color="#008ECC" icon={<FileTextOutlined />}
                                />
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <MetricCard
                                    title="Completed Orders" value={revenueMetrics.countOrder}
                                    color="#52c41a" icon={<CheckCircleOutlined />}
                                />
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <MetricCard
                                    title="Returned Orders" value={revenueMetrics.countReturn}
                                    color="#faad14" icon={<RollbackOutlined />}
                                />
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <MetricCard
                                    title="Cancelled Orders" value={revenueMetrics.countCancel}
                                    color="#f5222d" icon={<CloseCircleOutlined />}
                                />
                            </Col>
                        </Row>

                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={12}>
                                <Card title={<span><PieChartOutlined /> Order Status Distribution</span>} style={{ borderRadius: 12, height: '100%' }}>
                                    {pieData.length > 0 ? (
                                        <div style={{ height: 280 }}>
                                            <Pie {...pieRevenueConfig} />
                                        </div>
                                    ) : <Empty description="No transaction data" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card title={<span><DollarOutlined /> Financial Breakdown</span>} style={{ borderRadius: 12, height: '100%' }}>
                                    <List itemLayout="horizontal" split={true}>
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<div style={{background: '#f6ffed', padding: 8, borderRadius: 6}}><ArrowUpOutlined style={{color: '#52c41a'}}/></div>}
                                                title="Money In (Orders)"
                                                description="Revenue from completed orders"
                                            />
                                            <div style={{ fontWeight: 'bold', color: '#52c41a', fontSize: 16 }}>
                                                +${revenueMetrics.grossIncome.toFixed(2)}
                                            </div>
                                        </List.Item>
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<div style={{background: '#fff7e6', padding: 8, borderRadius: 6}}><RollbackOutlined style={{color: '#faad14'}}/></div>}
                                                title="Money Out (Returns)"
                                                description="Refunds for returned items"
                                            />
                                            <div style={{ fontWeight: 'bold', color: '#faad14', fontSize: 16 }}>
                                                -${revenueMetrics.deductionReturn.toFixed(2)}
                                            </div>
                                        </List.Item>
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<div style={{background: '#fff1f0', padding: 8, borderRadius: 6}}><CloseCircleOutlined style={{color: '#f5222d'}}/></div>}
                                                title="Money Out (Cancellations)"
                                                description="Refunds for cancelled orders"
                                            />
                                            <div style={{ fontWeight: 'bold', color: '#f5222d', fontSize: 16 }}>
                                                -${revenueMetrics.deductionCancel.toFixed(2)}
                                            </div>
                                        </List.Item>
                                        <div style={{ marginTop: 20, paddingTop: 15, borderTop: '2px dashed #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: 16, fontWeight: 600 }}>Net Profit</span>
                                            <span style={{ fontSize: 20, fontWeight: 'bold', color: '#008ECC' }}>
                                                ${revenueMetrics.netRevenue.toFixed(2)}
                                            </span>
                                        </div>
                                    </List>
                                </Card>
                            </Col>
                        </Row>

                        <Divider />

                        <Row gutter={[24, 24]}>
                            <Col xs={24}>
                                <Card
                                    style={{ borderRadius: 12 }}
                                    title={
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span><BarChartOutlined /> Revenue Trends</span>
                                            <Segmented
                                                options={[
                                                    { label: 'Hour (24h)', value: 'hour' },
                                                    { label: 'Day (Month)', value: 'day' },
                                                    { label: 'Month (Year)', value: 'month' },
                                                    { label: 'Year (5 Years)', value: 'year' },
                                                ]}
                                                value={timeGranularity}
                                                onChange={setTimeGranularity}
                                            />
                                        </div>
                                    }
                                >
                                    <div style={{ height: 320 }}>
                                        <Column {...columnRevenueConfig} />
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        <Divider dashed />
                    </div>
                )}

                <Row justify="space-between" align="middle" style={{ marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                    <Space wrap size="middle">
                        <Space>
                            <FilterOutlined style={{ color: '#888' }} />
                            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Filter:</span>
                            <Select
                                value={subFilter}
                                onChange={setSubFilter}
                                style={{ width: 160 }}
                            >
                                {getFilterOptions().map(opt => (
                                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                                ))}
                            </Select>
                        </Space>

                        {activeTab === 'CONTROL' && (
                            <Space>
                                <Divider type="vertical" style={{ height: 24 }} />
                                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Activity:</span>
                                <Select
                                    value={activityType}
                                    onChange={setActivityType}
                                    style={{ width: 140 }}
                                >
                                    {ACTIVITY_TYPE_OPTIONS.map(opt => (
                                        <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                                    ))}
                                </Select>
                            </Space>
                        )}

                        <Space>
                            <Divider type="vertical" style={{ height: 24 }} />
                            <ClockCircleOutlined style={{ color: '#888' }} />
                            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Time Period:</span>
                            <Select
                                value={timePeriod}
                                onChange={handleTimePeriodChange}
                                style={{ width: 150 }}
                            >
                                {TIME_PERIOD_OPTIONS.map(opt => (
                                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                                ))}
                            </Select>
                        </Space>

                        {timePeriod === 'CUSTOM' && (
                            <RangePicker
                                value={dateRange}
                                onChange={handleDateRangeChange}
                                allowClear
                                style={{ width: 260 }}
                                placeholder={['Start Date', 'End Date']}
                            />
                        )}
                    </Space>
                </Row>

                <Spin spinning={loading}>
                    {/* Audit Logs Charts - Only show when CONTROL tab is active */}
                    {activeTab === 'CONTROL' && controlData.length > 0 && (
                        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                            <Col xs={24} lg={10}>
                                <Card 
                                    title="Activity Distribution" 
                                    size="small"
                                    style={{ height: '100%' }}
                                >
                                    <div style={{ height: 280 }}>
                                        {auditPieData.length > 0 ? (
                                            <Pie {...pieConfig} />
                                        ) : (
                                            <Empty description="No activity data" />
                                        )}
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={24} lg={14}>
                                <Card 
                                    title="Activity Timeline" 
                                    size="small"
                                    style={{ height: '100%' }}
                                >
                                    <div style={{ height: 280 }}>
                                        {auditTimelineData.length > 0 ? (
                                            <Column {...columnConfig} />
                                        ) : (
                                            <Empty description="No timeline data" />
                                        )}
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    <Table
                        rowKey="id"
                        columns={getColumns()}
                        dataSource={getDataSource()}
                        pagination={{ pageSize: 10 }}
                        bordered={false}
                        title={() => <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{activeTab} Details</span>}
                        locale={{ emptyText: <Empty description={`No Data for ${activeTab}`} /> }}
                        scroll={{ x: 600 }}
                        showSorterTooltip={{ title: 'Click to sort' }}
                    />
                </Spin>
            </Card>
        </div>
    );
};

export default Reports;