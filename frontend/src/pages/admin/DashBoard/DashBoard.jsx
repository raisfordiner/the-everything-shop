import { Button, Card, Col, Divider, Flex, Row, Select, Space, Table, Typography } from 'antd'
import { 
    SettingOutlined,
    ArrowUpOutlined
} from '@ant-design/icons'
import SimpleReportCard from '../../../components/SimpleReportCard/SimpleReportCard'
import { Column, Line } from '@ant-design/plots';
import { useState } from 'react'
import React from 'react'

const DashBoard = () => {
    const [legendItems, setLegendItems] = useState([]);
    return (
        <>
            <div>
                <Flex justify='space-between' style={{marginBottom: 16}}>
                    <Typography.Title level={3} style={{margin: 0}}>Dashboard</Typography.Title>
                    <Button type='primary' ghost icon={<SettingOutlined />}>Add New</Button>
                </Flex>
                <Flex vertical justify='center' gap={16}>
                    <Row gutter={16}>
                        {mockSimpleReportCards.map((card, index) => (
                            <Col key={`simple-report-${index}`} span={24/mockSimpleReportCards.length}>
                                <SimpleReportCard 
                                    {...card}
                                />
                            </Col>
                        ))}
                    </Row>
                    <Row gutter={16}>
                        <Col span={18}>
                            <Card>
                                <Flex justify='space-between' align='center'>
                                    <Typography.Title level={5}>Order Over Time</Typography.Title>
                                    <Select defaultValue={mockOptions[0]?.value} options={mockOptions}/>
                                </Flex>
                                <Flex justify='space-between' align='start' style={{ marginBottom: 12 }}>
                                    <Space direction="vertical" size={4}>
                                        <Typography.Text strong>Total orders by day</Typography.Text>
                                        {/* {uniqueDays.map((d) => (
                                            <Typography.Text key={`total-${d.dayKey}`}>
                                                {d.dayLabel}: <Typography.Text strong>{totalsByDay[d.dayKey]}</Typography.Text> orders
                                            </Typography.Text>
                                        ))} */}
                                    </Space>
                                </Flex>
                                <Line {...lineChartConfig} />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Typography.Title level={5}>Last 7 days sales</Typography.Title>
                                <Flex justify='center' vertical>
                                    <Typography.Text strong style={{fontSize: 24}}>1,259</Typography.Text>
                                    <Typography.Text type='success'>Items sold</Typography.Text>
                                </Flex>
                                <Flex justify='center' vertical>
                                    <Typography.Text strong style={{fontSize: 24}}>$12,546</Typography.Text>
                                    <Typography.Text type='success'>Revenue</Typography.Text>
                                </Flex>
                                <Divider/>
                                <Column {...columnChartConfig}/> 
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card>
                                <Typography.Title level={5} style={{marginTop: 0, marginBottom: 20}}>Recent Transactions</Typography.Title>
                                <Table columns={recentTransactionsTableColumns}/>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card>
                                <Typography.Title level={5} style={{marginTop: 0, marginBottom: 20}}>Top Products By Units Sold</Typography.Title>
                                <Table columns={topProductsByUnitsSoldTableColumns}/>
                            </Card>
                        </Col>
                    </Row>
                </Flex>
            </div>
        </>
    )
}

export default DashBoard


const recentTransactionsTableColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    }
]

const topProductsByUnitsSoldTableColumns = [
    {
        title: 'Product Name',
        dataIndex: 'productName',
        key: 'productName',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Units Sold',
        dataIndex: 'unitsSold',
        key: 'unitsSold',
    }
]

const mockSimpleReportCards = [
    {
        title: "Total Sales",
        subtitle: "Last 7 days",
        value: "$350K",
        rate: 10.4,
        rateType: "Sales",
        previousValue: "7.6k"
    },
    {
        title: "Total Sales",
        subtitle: "Last 7 days",
        value: "$350K",
        rate: 10.4,
        rateType: "Sales",
        previousValue: "7.6k"
    },
    {
        title: "Total Sales",
        subtitle: "Last 7 days",
        value: "$350K",
        rate: 10.4,
        rateType: "Sales",
        previousValue: "7.6k"
    },
]

const mockOptions = [
    {value: 'option 1', label: 'Option 1'},
    {value: 'option 2', label: 'Option 2'},
    {value: 'option 3', label: 'Option 3'},
]

// Fake chart config

const lineChartConfig = {
    data: {
        type: 'fetch',
        value: 'https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json',
    },
    xField: (d) => new Date(d.year),
    yField: 'value',
    sizeField: 'value',
    legend: { size: false },
    colorField: 'category',
};

const columnChartConfig = {
    data: {
        type: 'fetch',
        value: 'https://gw.alipayobjects.com/os/antfincdn/iPY8JFnxdb/dodge-padding.json',
    },
    xField: '月份',
    yField: '月均降雨量',
    colorField: 'name',
    group: true,
    style: {
        inset: 5,
    },
}