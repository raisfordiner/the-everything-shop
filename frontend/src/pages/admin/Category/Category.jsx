import React, {useEffect, useState} from 'react'
import {Button, Card, Col, Flex, Input, message, Popconfirm, Row, Space, Spin, Table, Typography} from "antd"
import {PlusOutlined, ExportOutlined, EyeOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons"
import {useNavigate} from 'react-router'
import categoryService from '../../../services/categoryService.js'
import AdminTable from '../../../components/AdminTable/AdminTable.jsx'

const Category = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState([])
    const [searchText, setSearchText] = useState('')

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const response = await categoryService.getAllCategoriesSimple()
            response && setCategories(response.data)
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


    const colums = [
        {
            title: 'Category',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Sales',
            dataIndex: 'sales',
            key: 'sales',
        }, 
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Added',
            dataIndex: 'added',
            key: 'added',
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
                        onClick={() => navigate(`edit-category/${record.id}`)}/>
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


    return (
        <>
            <Flex justify="space-between" style={{marginBottom: 24}}>
                <Typography.Title level={3} style={{margin: 0}}>
                    Categories
                </Typography.Title>
                <Space>
                    <Button icon={<ExportOutlined/>}>Export</Button>
                    <Button type="primary" icon={<PlusOutlined/>} onClick={() => navigate('add-category')}>
                        Add Category
                    </Button>
                </Space>
            </Flex>
            <AdminTable 
                columnsTemplate={colums}
                dataSource={categories}
            />
        </>
    )
}

export default Category

const data = {
  "ok": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "id": "cmikasrq9000ln23wmwcb3590",
      "name": "Electronics",
      "description": "Electronic devices and gadgets",
      "createdAt": "2025-11-29T12:59:14.146Z",
      "updatedAt": "2025-11-29T12:59:14.146Z"
    },
    {
      "id": "cmikasrvu000mn23wuplb9a8g",
      "name": "Fashion",
      "description": "Clothing and apparel",
      "createdAt": "2025-11-29T12:59:14.346Z",
      "updatedAt": "2025-11-29T12:59:14.346Z"
    },
    {
      "id": "cmikasrw3000nn23wfrukpsoc",
      "name": "Home & Garden",
      "description": "Home and garden products",
      "createdAt": "2025-11-29T12:59:14.356Z",
      "updatedAt": "2025-11-29T12:59:14.356Z"
    }
  ]
}