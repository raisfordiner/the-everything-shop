import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Flex, Input, Modal, message, Popconfirm, Row, Space, Spin, Table, Typography } from "antd"
import { PlusOutlined, ExportOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { useNavigate } from 'react-router'
import categoryService from '../../../services/categoryService.js'
import AdminTable from '../../../components/AdminTable/AdminTable.jsx'

const Category = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState([])
    const [searchText, setSearchText] = useState('')

    const [isForceModalOpen, setIsForceModalOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

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

    const handleDelete = async (id, force = false) => {
        console.log(`[handleDelete] id: ${id}, force: ${force}`);
        try {
            const result = await categoryService.deleteCategory(id, force)
            console.log("[handleDelete] Success:", result);
            message.success('Category deleted successfully')
            fetchCategories()
            setIsForceModalOpen(false)
        } catch (error) {
            console.error("[handleDelete] Error:", error)

            const statusCode = error.status;
            const messageFromError = error.message || "";
            const lowerMessage = messageFromError.toLowerCase();

            // If it's a 400 or message includes product warning, show the force modal
            const isExistingProductsError =
                (statusCode == 400) ||
                lowerMessage.includes("existing products") ||
                lowerMessage.includes("cannot delete category");

            if (isExistingProductsError && !force) {
                console.log("[handleDelete] Showing force delete modal");
                setPendingDeleteId(id);
                setIsForceModalOpen(true);
            } else {
                message.error(messageFromError || "Failed to delete category!")
            }
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])


    const columns = [
        {
            title: 'Category',
            // dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <Space direction='vertical' size='small'>
                    <Typography.Text strong>{record.name}</Typography.Text>
                    <Typography.Text type="secondary">{record.description}</Typography.Text>
                </Space>
            )
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
                        onClick={() => navigate(`edit-category/${record.id}`)} />
                    <Popconfirm
                        title="Delete Category"
                        description="Are you sure you want to delete this category?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ]


    return (
        <>
            <Flex justify="space-between" style={{ marginBottom: 24 }}>
                <Typography.Title level={3} style={{ margin: 0 }}>
                    Categories
                </Typography.Title>
                <Space>
                    <Button icon={<ExportOutlined />}>Export</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('add-category')}>
                        Add Category
                    </Button>
                </Space>
            </Flex>
            <AdminTable
                columnsTemplate={columns}
                dataSource={categories}
            />

            {/* Force Delete Confirmation Modal */}
            <Modal
                title="Category has existing products"
                open={isForceModalOpen}
                onOk={() => handleDelete(pendingDeleteId, true)}
                onCancel={() => setIsForceModalOpen(false)}
                okText="Yes, delete everything"
                cancelText="No, cancel"
                okButtonProps={{ danger: true }}
                maskClosable={false}
            >
                <p>This category contains products. Are you sure you want to delete this category and <b>ALL</b> its products?</p>
                <p style={{ color: '#ff4d4f' }}>This action cannot be undone.</p>
            </Modal>
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