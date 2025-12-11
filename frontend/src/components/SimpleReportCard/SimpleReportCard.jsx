import React from 'react'
import { Button, Card, Col, Flex, Row, Space, Typography } from 'antd'
import {
    ArrowUpOutlined,
    ArrowDownOutlined
} from '@ant-design/icons'

const SimpleReportCard = ({title, subtitle, value, rate, rateType, previousValue}) => {
    return (
        <Card>
            <Typography.Title className='title' level={4} ellipsis style={{marginTop: 0}}>{title}</Typography.Title>
            <Typography.Title level={5} ellipsis style={{marginTop: 0}} type='secondary'>{subtitle}</Typography.Title>
            <Flex vertical>
                <Space align='center'>
                    <Typography.Title className='value' level={2} ellipsis style={{margin: 0}}>{value}</Typography.Title>
                    <Typography.Text className='rate-title' ellipsis>{rateType}</Typography.Text>
                    <Typography.Text className='rate' type={rate < 0 ? 'danger' : 'success'} ellipsis>
                        {rate < 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                        {Math.abs(rate)}%
                    </Typography.Text>
                </Space>
                <Space align='center'>
                    <Typography.Text className='sub-rate-title' ellipsis>Previous 7 days</Typography.Text>
                    <Typography.Text className='sub-rate' style={{color: '#6467F2'}} ellipsis>
                        ({previousValue})
                    </Typography.Text>
                </Space>
            </Flex>
        </Card>
    )
}

export default SimpleReportCard
