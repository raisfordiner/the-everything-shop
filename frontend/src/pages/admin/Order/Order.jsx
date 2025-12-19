import React, {useEffect, useState} from 'react'
import {Button, Card, Col, Flex, Input, message, Popconfirm, Row, Space, Spin, Table, Typography} from "antd"
import {PlusOutlined, ExportOutlined, EyeOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons"
import {data, useNavigate} from 'react-router'
import categoryService from '../../../services/categoryService.js'
import AdminTable from '../../../components/AdminTable/AdminTable.jsx'
import orderService from '../../../services/orderService.js'
import userService from '../../../services/userService.js'

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
    getCheckboxProps: (record) => ({}),
}

const Order = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState([])
    const [searchText, setSearchText] = useState('')

    const colums = [
        {
            title: 'Order',
            dataIndex: 'id',
            key: 'order',
        },
        {
            title: 'Date',
            dataIndex: 'orderDate',
            key: 'date',
        },
        {
            title: 'Customer',
            key: 'customer',
            dataIndex: 'customerId',
            render: async (value) => {
                try {
                    const customer = await userService.getUserById(value)
                    return <Typography.Text>{customer.data.username}</Typography.Text>
                } catch (error) {
                    console.error("Failed to fetch user:", error)
                } finally {
                    return <Typography.Text>{customer.data.username || 'Unknown User'}</Typography.Text>
                }
            }
        },
        {
            title: 'Payment status',
            dataIndex: 'payment',
            key: 'payment',
            render: (payment) => (
                <Typography.Text>
                    {payment?.status ? 'Paid' : 'Unpaid'}
                </Typography.Text>
            )
        },
        {
            title: 'Order status',
            dataIndex: 'status',
            key: 'status',
        },
        // {
        //     title: 'Total',
        //     dataIndex: 'total',
        //     key: 'total',
        // },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button 
                        color="default" 
                        variant='text' 
                        icon={<EditOutlined />}
                        onClick={() => navigate(`edit-order/${record.id}`)}/>
                    <Popconfirm
                        title="Delete user"
                        description="Are you sure to delete this customer?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger></Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const response = await orderService.getAllOrders()
            const data = response?.data?.orders
            setOrders(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Failed to fetch orders:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await orderService.deleteOrder(id)
            fetchOrders()
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])


    return (
        <>
            <Flex justify="space-between" style={{marginBottom: 24}}>
                <Typography.Title level={3} style={{margin: 0}}>
                    Orders
                </Typography.Title>
                <Space>
                    <Button icon={<ExportOutlined/>}>Export</Button>
                    <Button type="primary" icon={<PlusOutlined/>} onClick={() => navigate('add-order')}>
                        Add Order
                    </Button>
                </Space>
            </Flex>
            <AdminTable 
                columnsTemplate={colums}
                dataSource={orders}
            />
        </>
    )
}

export default Order
