import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import promotionService from "../../../services/promotionService.js";
import {
    Badge,
    Button,
    Card,
    Input,
    message,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
    Tooltip,
    Typography
} from "antd";
import {
    PlusOutlined, SearchOutlined, EditOutlined,
    DeleteOutlined, CalendarOutlined,
    ClockCircleOutlined, ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
const { Title, Text } = Typography;

const Promotions = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [promotions, setPromotions] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [messageApi, contextHolder] = message.useMessage();

    const fetchPromotions = async () => {
        setLoading(true);
        try {
            const response = await promotionService.getAllPromotions({ status: "ACTIVE"});

            if (response && response.data) {
                const data = response.data?.promotions || response.data || [];
                setPromotions(data);
            }
        }
        catch (error) {
            console.error("Failed to fetch promotions:", error);
            message.error("Could not load promotions data");
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPromotions();
    }, [])

    const getPromotionStatus = (status) => {
        if (status === "ACTIVE") {
            return { status: 'ACTIVE', color: 'green', text: 'Happening Now' };
        } else if (status === "EXPIRED") {
            return { status: 'EXPIRED', color: 'default', text: 'Expired' };
        } else {
            return { status: 'UPCOMING', color: 'gold', text: 'Upcoming' };
        }
    }

    const handleDelete = async (id) => {
        try {
            await promotionService.deletePromotion(id);
            messageApi.open({
                type: 'success',
                content: 'Promotion deleted successfully!',
            });
            fetchPromotions();
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: error.message || 'Failed to delete promotion!',
            });
        }
    }

    const columns = [
        {
            title: 'Promotion Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text strong style={{ fontSize: 16 }}>{text}</Text>
                    {record.description && (
                        <Text type="secondary" style={{ maxWidth: 250 }} ellipsis>
                            {record.description}
                        </Text>
                    )}
                </div>
            )
        },
        {
            title: 'Duration',
            key: 'duration',
            render: (_, record) => {
                const start = dayjs(record.startDate);
                const end = dayjs(record.endDate);
                return (
                    <Space direction="vertical" size={0}>
                        <div>
                            <CalendarOutlined style={{ marginRight: 8, color: '#008ECC' }} />
                            <Text strong>{start.format('DD/MM/YYYY')}</Text>
                            {' - '}
                            <Text strong>{end.format('DD/MM/YYYY')}</Text>
                        </div>
                        <Text type="secondary" style={{ fontSize: 12, marginLeft: 24 }}>
                            <ClockCircleOutlined /> {end.diff(start, 'day') + 1} days
                        </Text>
                    </Space>
                )
            }
        },
        {
            title: 'Scope',
            key: 'scope',
            render: (_, record) => {
                if (record.appliedCategories && record.appliedCategories.length > 0) {
                    const categoryNames = record.appliedCategories.map(cate => cate.name).join(', ');
                    return (
                        <Tooltip title={categoryNames}>
                            <Tag color="blue">
                                {record.appliedCategories.length} Categories Applied
                            </Tag>
                        </Tooltip>
                    );
                }

                if (record.appliedProducts && record.appliedProducts.length > 0) {
                    const productNames = record.appliedProducts.map(p => p.name).join(', ');
                    return (
                        <Tooltip title={productNames}>
                            <Tag color="cyan">
                                {record.appliedProducts.length} Products Applied
                            </Tag>
                        </Tooltip>
                    );
                }

                return <Tag color="geekblue">All Store</Tag>;
            }
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => {
                const { color, text, status } = getPromotionStatus(record.status);

                if (status === 'ACTIVE') {
                    return <Badge status="processing" text={<span style={{color: '#52c41a', fontWeight: 600}}>{text}</span>} />;
                }
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        size={"small"}
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/promotions/edit-promotion/${record.id}`)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete promotion"
                        description="Are you sure to delete this promotion?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const filteredData = promotions.filter(item => {
        const matchName = item.name?.toLowerCase().includes(searchText.toLowerCase());
        const { status } = getPromotionStatus(item.status);
        const matchStatus = filterStatus === 'ALL' || status === filterStatus;
        return matchName && matchStatus;
    });

    return (
        <>
            {contextHolder}

            <div>
                <div style={{marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                        <Title level={2} style={{margin: 0, color: '#008ECC'}}>Promotions</Title>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined/>}
                        style={{backgroundColor: '#008ECC'}}
                        onClick={() => navigate('/admin/promotions/add-promotion')}
                    >
                        Add Promotion
                    </Button>
                </div>

                <Card style={{borderRadius: 12}}>
                    <div style={{marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center'}}>
                        <Input
                            placeholder="Search campaign..."
                            prefix={<SearchOutlined/>}
                            style={{width: 300}}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                        />
                        <Select defaultValue="ALL" style={{width: 180}} onChange={setFilterStatus}>
                            <Select.Option value="ALL">All Status</Select.Option>
                            <Select.Option value="ACTIVE">Happening Now</Select.Option>
                            <Select.Option value="UPCOMING">Upcoming</Select.Option>
                            <Select.Option value="EXPIRED">Expired</Select.Option>
                        </Select>

                        <Button icon={<ReloadOutlined/>} onClick={fetchPromotions}>Refresh</Button>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="id"
                        loading={loading}
                        pagination={{pageSize: 10}}
                    />
                </Card>
            </div>
        </>
    )
}

export default Promotions;