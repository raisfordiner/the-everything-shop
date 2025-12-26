import {useNavigate} from "react-router";
import {Card, Col, DatePicker, Form, Input, message, Row, Select, Typography, Radio, Button, Divider} from "antd";
import {useEffect, useState} from "react";
import productService from "../../../services/productService.js";
import categoryService from "../../../services/categoryService.js";
import promotionService from "../../../services/promotionService.js";
import {PlusOutlined} from "@ant-design/icons";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const AddPromotion = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [scopeType, setScopeType] = useState('ALL');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const prodResponse = await productService.getAllProducts();
                const catResponse = await categoryService.getAllCategoriesSimple()

                if (catResponse && catResponse.data) {
                    const data = catResponse.data?.products || catResponse.data || [];
                    setCategories(data);
                }

                if (prodResponse && prodResponse.data) {
                    const data = prodResponse.data?.products || prodResponse.data || [];
                    setProducts(data);
                }
            }
            catch (error) {
                console.error(error);
                messageApi.error('Failed to load products/categories');
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [])

    const onFinish = async (values) => {
        setSubmitting(true);
        try {
            const payload = {
                name: values.name,
                description: values.description,
                startDate: values.dateRange[0].toISOString(),
                endDate: values.dateRange[1].toISOString(),
                status: values.status,

                appliedProducts: values.scopeType === 'PRODUCT' ? values.appliedIds : [],
                appliedCategories: values.scopeType === 'CATEGORY' ? values.appliedIds : [],
            };

            await promotionService.addPromotion(payload);

            messageApi.open({
                type: 'success',
                content: 'Promotion created successfully!',
                duration: 1,
                onClose: () => navigate('/admin/promotions')
            });
        } catch (error) {
            console.error(error);
            messageApi.open({
                type: 'error',
                content: error.message || 'Failed to create promotion!',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const renderScopeSelector = () => {
        if (scopeType === 'ALL') return null;

        if (scopeType === 'CATEGORY') {
            return (
                <Form.Item
                    name="appliedIds"
                    label="Select Categories"
                    rules={[{ required: true, message: 'Please select at least one category' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Choose categories..."
                        optionFilterProp="children"
                        maxTagCount="responsive"
                    >
                        {categories.map(cat => (
                            <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            );
        }

        if (scopeType === 'PRODUCT') {
            return (
                <Form.Item
                    name="appliedIds"
                    label="Select Products"
                    rules={[{ required: true, message: 'Please select at least one product' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Search products..."
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        maxTagCount="responsive"
                    >
                        {products.map(prod => (
                            <Select.Option key={prod.id} value={prod.id}>{prod.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            );
        }
    };

    return (
        <>
            {contextHolder}

            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Title level={2} style={{ margin: 0, color: '#008ECC' }}>Add Promotion</Title>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    status: 'ACTIVE',
                    scopeType: 'ALL'
                }}
            >
                <Row gutter={24}>
                    <Col span={14}>
                        <Card title="General Information" style={{ borderRadius: 12, height: '100%' }}>
                            <Form.Item
                                name="name"
                                label="Campaign Name"
                                rules={[{ required: true, message: 'Please enter campaign name' }]}
                            >
                                <Input placeholder="e.g. Black Friday Sale" size="large" />
                            </Form.Item>

                            <Form.Item name="description" label="Description">
                                <Input.TextArea rows={4} placeholder="Describe your promotion..." />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={16}>
                                    <Form.Item
                                        name="dateRange"
                                        label="Duration"
                                        rules={[{ required: true, message: 'Please select start & end date' }]}
                                    >
                                        <RangePicker
                                            format="DD/MM/YYYY"
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="status" label="Status">
                                        <Select>
                                            <Select.Option value="ACTIVE">Active</Select.Option>
                                            <Select.Option value="INACTIVE">Inactive</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col span={10}>
                        <Card title="Application Scope" style={{ borderRadius: 12, height: '100%' }}>
                            <Form.Item label="Apply Discount To" name="scopeType">
                                <Radio.Group
                                    onChange={(e) => {
                                        setScopeType(e.target.value);
                                        form.setFieldsValue({ appliedIds: [] });
                                    }}
                                    buttonStyle="solid"
                                >
                                    <Radio.Button value="ALL">All Products</Radio.Button>
                                    <Radio.Button value="CATEGORY">Categories</Radio.Button>
                                    <Radio.Button value="PRODUCT">Products</Radio.Button>
                                </Radio.Group>
                            </Form.Item>

                            <Divider />

                            <div style={{ minHeight: 150 }}>
                                {scopeType === 'ALL' ? (
                                    <Typography.Text type="secondary" italic>
                                        * This promotion will be applied to all products in your store.
                                    </Typography.Text>
                                ) : (
                                    renderScopeSelector()
                                )}
                            </div>
                        </Card>
                    </Col>
                </Row>

                <div style={{ marginTop: 24, textAlign: 'right' }}>
                    <Button style={{ marginRight: 12 }} onClick={() => navigate('/admin/promotions')}>
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<PlusOutlined />}
                        loading={submitting}
                        style={{ backgroundColor: '#008ECC' }}
                    >
                        Create Promotion
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default AddPromotion;