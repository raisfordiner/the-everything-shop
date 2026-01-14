import React, { useState, useEffect } from 'react';
import {
    Table, Card, Typography, Tag, Space, Button, Modal,
    message, Select, Input, Descriptions, Row, Col, Popconfirm
} from "antd";
import {
    EditOutlined, DeleteOutlined,
    SearchOutlined
} from "@ant-design/icons";
import cancellationService from "../../../services/cancellationService.js";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Cancellations = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const [status, setStatus] = useState(null);
    const [reason, setReason] = useState("");

    const [searchText, setSearchText] = useState("");
    const [messageApi, contextHolder] = message.useMessage();

    const fetchCancellations = async () => {
        setLoading(true);
        try {
            const params = searchText ? { q: searchText } : {};
            const response = await cancellationService.getAllCancellations(params);

            if (response && response.data) {
                const data = response.data?.cancellations || response.data || [];
                setData(data);
            }
        }
        catch (error) {
            message.error("Failed to fetch cancellation requests");
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCancellations();
    }, [searchText]);

    const handleEdit = (record) => {
        setSelectedRequest(record);
        setStatus(record.status);
        setReason(record.reason);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await cancellationService.deleteCancellation(id);
            messageApi.open({
                type: 'success',
                content: 'Request deleted successfully!',
            });
            fetchCancellations();
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
            await cancellationService.updateCancellation(selectedRequest.id, {
                status: status,
                reason: reason
            });
            messageApi.open({
                type: 'success',
                content: 'Cancellation request updated!',
            });
            setIsModalOpen(false);
            fetchCancellations();
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: error.message || 'Cancellation update failed!',
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
            case "REJECTED": color = "red"; break;
            case "COMPLETED": color = "green"; break;
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
                                title="Approve this cancellation?"
                                description="This will mark the request as approved."
                                onConfirm={async () => {
                                    try {
                                        await cancellationService.updateCancellation(record.id, { status: 'APPROVED' });
                                        messageApi.success('Cancellation approved');
                                        fetchCancellations();
                                    } catch (error) {
                                        messageApi.error('Failed to approve');
                                    }
                                }}
                            >
                                <Button type="primary" size="small">Approve</Button>
                            </Popconfirm>
                            <Popconfirm
                                title="Reject this cancellation?"
                                description="This will reject the request."
                                onConfirm={async () => {
                                    try {
                                        await cancellationService.updateCancellation(record.id, { status: 'REJECTED' });
                                        messageApi.success('Cancellation rejected');
                                        fetchCancellations();
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
                        Cancellation Requests
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
                        showTotal: (total) => `Total ${total} cancellations`,
                    }}
                />
            </Card>

            <Modal
                title="Update Cancellation Request"
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
                            <Descriptions.Item label="Cancellation ID">{selectedRequest.id}</Descriptions.Item>
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
                            placeholder="Enter cancellation reason..."
                        />
                    </div>
                )}
            </Modal>
        </>
    )
}

export default Cancellations;