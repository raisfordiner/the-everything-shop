import React, {useEffect, useState} from 'react'
import {Button, Card, Col, Flex, Input, message, Popconfirm, Row, Space, Spin, Table, Typography} from "antd"
import {PlusOutlined, ExportOutlined, EyeOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons"
import {useNavigate} from 'react-router'
import categoryService from '../../../services/categoryService.js'
import AdminTable from '../../../components/AdminTable/AdminTable.jsx'

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
            dataIndex: 'createdAt',
            key: 'date',
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'Payment status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
        },
        {
            title: 'Order status',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
        },
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

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const response = await orderService.getAllOrders()
            response && setOrders(response.data)
        } catch (error) {
            console.error("Failed to fetch categories:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await categoryService.deleteCategory(id)
            fetchCategories()
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])


    return (
        <>
            <Flex justify="space-between" style={{marginBottom: 24}}>
                <Typography.Title level={3} style={{margin: 0}}>
                    Categories
                </Typography.Title>
                <Space>
                    <Button icon={<ExportOutlined/>}>Export</Button>
                    <Button type="primary" icon={<PlusOutlined/>} onClick={() => navigate('add-order')}>
                        Add Category
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
