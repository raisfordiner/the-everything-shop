import React, { useState, useEffect } from 'react';
import returnService from "../../../services/returnService.js";
import {
    Table, Card, Typography, Tag, Space, Button, Modal,
    message, Select, Input, Descriptions, Row, Col, Popconfirm
} from "antd";
import {
    EditOutlined, DeleteOutlined,
    SearchOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Returns = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const [status, setStatus] = useState(null);
    const [reason, setReason] = useState("");

    const [searchText, setSearchText] = useState("");
    const [messageApi, contextHolder] = message.useMessage();

    const fetchReturns = async () => {
        setLoading(true);
        try {
            const params = searchText ? { q: searchText } : {};
            const response = await returnService.getAllReturns(params);

            if (response && response.data) {
                const data = response.data?.returns || response.data || [];
                setData(data);
            }
        }
        catch (error) {
            message.error("Failed to fetch return requests");
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchReturns();
    }, [searchText]);

    const handleEdit = (record) => {
        setSelectedRequest(record);
        setStatus(record.status);
        setReason(record.reason);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await returnService.deleteReturn(id);
            messageApi.open({
                type: 'success',
                content: 'Request deleted successfully!',
            });
            fetchReturns();
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: error.message || 'Failed to delete request!',
            });
        }
    };

    const handleUpdate = async () => {
        if (!selectedRequest) return;

        setActionLoading(true);
        try {
            await returnService.updateReturn(selectedRequest.id, {
                status: status,
                reason: reason
            });
            messageApi.open({
                type: 'success',
                content: 'Return request updated!',
            });
            setIsModalOpen(false);
            fetchReturns();
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: error.message || 'Return update failed!',
            });
        } finally {
            setActionLoading(false);
        }
    };

    const renderStatusTag = (statusVal) => {
        let color = "default";
        switch (statusVal) {
            case "REQUESTED": color = "orange"; break;
            case "APPROVED": color = "blue"; break;
            case "COMPLETED": color = "green"; break;
            case "REJECTED": color = "red"; break;
            default: color = "default";
        }
        return <Tag color={color}>{statusVal}</Tag>;
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 80,
            render: (text) => <Text ellipsis strong style={{ width: 50 }}>{text}</Text>,
        },
        {
            title: "Order ID",
            dataIndex: "orderId",
            key: "orderId",
            render: (text) => <Text copyable>{text}</Text>,
        },
        {
            title: "Reason",
            dataIndex: "reason",
            key: "reason",
            ellipsis: true,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 160,
            render: (val) => renderStatusTag(val),
        },
        {
            title: "Action",
            key: "action",
            // width: 280,
            render: (_, record) => (
                <Space size="small" wrap>
                    {/* Quick Approve/Reject for REQUESTED status */}
                    {record.status === 'REQUESTED' && (
                        <>
                            <Popconfirm
                                title="Approve this return?"
                                description="This will mark the request as approved."
                                onConfirm={async () => {
                                    try {
                                        await returnService.updateReturn(record.id, { status: 'APPROVED' });
                                        messageApi.success('Return approved');
                                        fetchReturns();
                                    } catch (error) {
                                        messageApi.error('Failed to approve');
                                    }
                                }}
                            >
                                <Button type="primary" size="small">Approve</Button>
                            </Popconfirm>
                            <Popconfirm
                                title="Reject this return?"
                                description="This will reject the request."
                                onConfirm={async () => {
                                    try {
                                        await returnService.updateReturn(record.id, { status: 'REJECTED' });
                                        messageApi.success('Return rejected');
                                        fetchReturns();
                                    } catch (error) {
                                        messageApi.error('Failed to reject');
                                    }
                                }}
                            >
                                <Button danger size="small">Reject</Button>
                            </Popconfirm>
                        </>
                    )}
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete this request?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger icon={<DeleteOutlined />} size="small">Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={2} style={{ margin: 0, color: "#008ECC" }}>
                        Return Requests
                    </Title>
                </Col>
            </Row>

            <Card style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <div style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Search by reason..."
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        onPressEnter={(e) => setSearchText(e.target.value)}
                        onChange={(e) => !e.target.value && setSearchText("")}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        total: data.length,
                        showTotal: (total) => `Total ${total} returns`,
                    }}
                />
            </Card>

            <Modal
                title="Update Return Request"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={actionLoading}
                        onClick={handleUpdate}
                        style={{ backgroundColor: "#008ECC" }}
                    >
                        Update
                    </Button>,
                ]}
            >
                {selectedRequest && (
                    <div style={{ marginTop: 20 }}>
                        <Descriptions bordered column={1} size="small" style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="Return ID">{selectedRequest.id}</Descriptions.Item>
                            <Descriptions.Item label="Order ID">{selectedRequest.orderId}</Descriptions.Item>
                        </Descriptions>

                        <Text strong>Status</Text>
                        <Select
                            style={{ width: "100%", marginTop: 8, marginBottom: 16 }}
                            value={status}
                            onChange={setStatus}
                        >
                            <Select.Option value="REQUESTED">REQUESTED</Select.Option>
                            <Select.Option value="APPROVED">APPROVED</Select.Option>
                            <Select.Option value="REJECTED">REJECTED</Select.Option>
                            <Select.Option value="COMPLETED">COMPLETED</Select.Option>
                        </Select>

                        <Text strong>Reason</Text>
                        <TextArea
                            rows={4}
                            style={{ marginTop: 8 }}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter return reason..."
                        />
                    </div>
                )}
            </Modal>
        </>
    )
}

export default Returns;