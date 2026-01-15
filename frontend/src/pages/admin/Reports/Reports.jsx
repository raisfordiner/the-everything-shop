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
    { value: '1H', label: 'Last 60 Minutes', hours: 1, grain: 'minute' },
    { value: '6H', label: 'Last 6 Hours', hours: 6, grain: 'hour' },
    { value: '12H', label: 'Last 12 Hours', hours: 12, grain: 'hour' },
    { value: '24H', label: 'Last 24 Hours', hours: 24, grain: 'hour' },
    { value: '7D', label: 'Last 7 Days', hours: 24 * 7, grain: 'day' },
    { value: '30D', label: 'Last 30 Days', hours: 24 * 30, grain: 'day' },
    { value: '12M', label: 'Last 12 Months', hours: 24 * 365, grain: 'month' },
    { value: 'ALL', label: 'All Time', hours: null, grain: 'month' },
    { value: 'CUSTOM', label: 'Custom Range', hours: null, grain: 'day' },
];

const Reports = () => {
    const [activeTab, setActiveTab] = useState('INVENTORY');
    const [subFilter, setSubFilter] = useState('ALL');
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [timePeriod, setTimePeriod] = useState('24H');
    const [inventoryData, setInventoryData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [controlData, setControlData] = useState([]);

    const fillTimeData = (data, rangeOption, mode = 'count') => {
        if (!rangeOption) return [];

        const grain = rangeOption.grain || 'day';
        const now = dayjs();
        let start = now;

        if (rangeOption.value === 'ALL') {
            // For All Time, find the earliest date in data or default to 1 year ago
            if (data.length > 0) {
                const earliest = data.reduce((min, p) => p.createdAt < min ? p.createdAt : min, data[0].createdAt);
                start = dayjs(earliest).startOf('month');
            } else {
                start = now.subtract(1, 'year').startOf('month');
            }
        } else if (rangeOption.value === 'CUSTOM') {
            if (dateRange && dateRange[0]) {
                start = dayjs(dateRange[0]).startOf('day');
            } else {
                start = now.subtract(7, 'day').startOf('day');
            }
        } else {
            // Standard ranges
            start = now.subtract(rangeOption.hours, 'hour');
            // adjust start based on grain for cleaner charts
            if (grain === 'day') start = start.startOf('day');
            if (grain === 'month') start = start.startOf('month');

            // Shift forward by one unit to avoid the "same time last day" (extra bar) issue
            // and ensure we end on the current time/day.
            start = start.add(1, grain === 'minute' ? 'minute' : grain);
        }

        const filledData = [];
        let current = start;

        // Determine format based on grain
        let format = 'MMM D';
        if (grain === 'hour') format = 'HH:mm';
        if (grain === 'minute') format = 'HH:mm';
        if (grain === 'month') format = 'MMM YYYY';

        // Limit iteration to avoid infinite loops
        let safety = 0;
        const end = now;

        while (current.isBefore(end) || current.isSame(end, grain)) {
            if (safety++ > 1000) break;

            const label = current.format(format);

            if (mode === 'sum') {
                let sum = 0;
                data.forEach(item => {
                    const itemDate = dayjs(item.createdAt);
                    if (itemDate.isSame(current, grain)) {
                        sum += (item.amount || 0);
                    }
                });
                filledData.push({
                    date: label,
                    value: sum,
                    timestamp: current.valueOf()
                });
            } else {
                // Count items in this bucket (grouped logic)
                let typeMap = {};
                data.forEach(item => {
                    const itemDate = dayjs(item.createdAt);
                    if (itemDate.isSame(current, grain)) {
                        const type = item.type === 'USER_SIGNUP' ? 'Sign Up' : 'Login';
                        typeMap[type] = (typeMap[type] || 0) + 1;
                    }
                });

                const types = ['Sign Up', 'Login'];
                types.forEach(type => {
                    filledData.push({
                        date: label,
                        type: type,
                        count: typeMap[type] || 0,
                        timestamp: current.valueOf()
                    })
                });
            }

            // Advance time
            current = current.add(1, grain === 'minute' ? 'minute' : grain);
        }

        return filledData;
    };

    const buildParams = (additionalParams = {}) => {
        const params = { ...additionalParams };

        // Handle time period filter
        if (timePeriod !== 'CUSTOM' && timePeriod !== 'ALL') {
            const selectedPeriod = TIME_PERIOD_OPTIONS.find(opt => opt.value === timePeriod);
            if (selectedPeriod && selectedPeriod.hours) {
                const now = new Date();
                const startTime = new Date(now.getTime() - selectedPeriod.hours * 60 * 60 * 1000);
                params.startDate = startTime.toISOString();
                params.endDate = now.toISOString();
            }
        } else if (timePeriod === 'CUSTOM' && dateRange && dateRange[0] && dateRange[1]) {
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
                    const invFilter = subFilter !== 'ALL'
                        ? { type: subFilter === 'OUT' ? 'OUT_OF_STOCK' : 'PRODUCT_CREATED' }
                        : {};
                    const invRes = await reportService.getInventoryLogs(buildParams(invFilter));
                    setInventoryData(invRes?.logs || []);
                    break;
                case 'REVENUE':
                    const revRes = await reportService.getRevenueLogs(buildParams());
                    setRevenueData(revRes?.logs || []);
                    break;
                case 'CONTROL':
                    const auditFilter = subFilter !== 'ALL' ? { type: subFilter } : {};
                    const audRes = await reportService.getAuditLogs(buildParams(auditFilter));
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
    }, [activeTab, subFilter, dateRange, timePeriod]);

    const handleTabChange = (type) => {
        setActiveTab(type);
        setSubFilter('ALL');
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

    const revenueTimelineData = useMemo(() => {
        const option = TIME_PERIOD_OPTIONS.find(opt => opt.value === timePeriod);
        const rangeOpt = timePeriod === 'CUSTOM' ? { value: 'CUSTOM', grain: 'day' } : option;

        // Use 'sum' mode to aggregate revenue amounts
        return fillTimeData(revenueData, rangeOpt, 'sum');
    }, [revenueData, timePeriod, dateRange]);

    const columnRevenueConfig = {
        data: revenueTimelineData,
        xField: 'date',
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
            date: { alias: 'Time' },
            value: { alias: 'Revenue' }
        },
        color: ({ value }) => {
            if (value > 0) return '#008ECC';
            if (value < 0) return '#ff4d4f';
            return '#f0f0f0';
        },
        tooltip: {
            formatter: (datum) => {
                return { name: 'Net Revenue', value: `$${datum.value.toFixed(2)}` };
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
                    { value: 'USER_SIGNUP', label: 'Sign Up Only' },
                    { value: 'USER_LOGIN', label: 'Login Only' },
                ];
            default:
                return [{ value: 'ALL', label: 'All Records' }];
        }
    };

    // --- CHART LOGIC ---



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
        const option = TIME_PERIOD_OPTIONS.find(opt => opt.value === timePeriod);
        // Pass the actual option or a custom one for CUSTOM range
        const rangeOpt = timePeriod === 'CUSTOM' ? { value: 'CUSTOM', grain: 'day' } : option;

        return fillTimeData(controlData, rangeOpt);
    }, [controlData, timePeriod, dateRange]);

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
                {/* Global Filters - Moved to top */}
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

                        <Space>
                            <Divider type="vertical" style={{ height: 24 }} />
                            <ClockCircleOutlined style={{ color: '#888' }} />
                            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Time Period:</span>
                            <Select
                                value={timePeriod}
                                onChange={handleTimePeriodChange}
                                style={{ width: 180 }}
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
                                                avatar={<div style={{ background: '#f6ffed', padding: 8, borderRadius: 6 }}><ArrowUpOutlined style={{ color: '#52c41a' }} /></div>}
                                                title="Money In (Orders)"
                                                description="Revenue from completed orders"
                                            />
                                            <div style={{ fontWeight: 'bold', color: '#52c41a', fontSize: 16 }}>
                                                +${revenueMetrics.grossIncome.toFixed(2)}
                                            </div>
                                        </List.Item>
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<div style={{ background: '#fff7e6', padding: 8, borderRadius: 6 }}><RollbackOutlined style={{ color: '#faad14' }} /></div>}
                                                title="Money Out (Returns)"
                                                description="Refunds for returned items"
                                            />
                                            <div style={{ fontWeight: 'bold', color: '#faad14', fontSize: 16 }}>
                                                -${revenueMetrics.deductionReturn.toFixed(2)}
                                            </div>
                                        </List.Item>
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<div style={{ background: '#fff1f0', padding: 8, borderRadius: 6 }}><CloseCircleOutlined style={{ color: '#f5222d' }} /></div>}
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

                <Spin spinning={loading}>
                    {/* Audit Logs Charts - Only show when CONTROL tab is active */}
                    {activeTab === 'CONTROL' && controlData.length > 0 && (
                        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                            {/* Adjusted Column Sizes */}
                            <Col xs={24} lg={6}>
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
                            <Col xs={24} lg={18}>
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