import {useNavigate} from "react-router";
import {Button, Card, Col, DatePicker, Divider, Form, Input, InputNumber, message, Row, Statistic, Switch} from "antd";
import {useState} from "react";
import couponService from "../../../services/couponService.js";
import {GiftOutlined, PercentageOutlined, PlusOutlined} from "@ant-design/icons";

const AddCoupon = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const discountValue = Form.useWatch('discount', form);
    const couponCode = Form.useWatch('code', form);

    const onFinish = async (values) => {
        setSubmitting(true);
        try {
            const newCoupon = {
                ...values,
            };

            await couponService.createCoupon(newCoupon);

            messageApi.open({
                type: 'success',
                content: 'Coupon created successfully!',
                duration: 0.5,
                onClose: () => {
                    navigate('/admin/coupons');
                }
            });
        } catch (error) {
            console.error(error);

            messageApi.open({
                type: 'error',
                content: error.message || 'Failed to create coupon!',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {contextHolder}

            <h2 style={{marginBottom: "24px"}}>Add Coupon</h2>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    isActive: true
                }}
            >
                <Row gutter={24}>
                    <Col span={8}>
                        <Card style={{ borderRadius: 12, marginBottom: 24 }}>
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <GiftOutlined style={{ fontSize: '48px', color: '#008ECC', marginBottom: 16 }} />
                                <h4 style={{ margin: 0, textTransform: 'uppercase' }}>
                                    {couponCode || 'COUPON CODE'}
                                </h4>
                                <span>Percentage Discount</span>
                            </div>

                            <Divider />

                            <Form.Item name="isActive" label="Coupon Status" valuePropName="checked">
                                <Switch
                                    checkedChildren="Active"
                                    unCheckedChildren="Inactive"
                                />
                            </Form.Item>

                            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginTop: 16 }}>
                                <Statistic
                                    title="Discount Value"
                                    value={discountValue || 0}
                                    suffix="%"
                                    valueStyle={{ color: '#008ECC' }}
                                />
                            </div>
                        </Card>
                    </Col>

                    <Col span={16}>
                        <Card title="Coupon Details" style={{ borderRadius: 12 }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="code"
                                        label="Coupon Code"
                                        rules={[{ required: true, message: 'Please enter coupon code' }]}
                                    >
                                        <Input
                                            placeholder="e.g. SUMMER2024"
                                            style={{ textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="expiresAt" label="Expiration Date">
                                        <DatePicker
                                            showTime
                                            style={{ width: '100%' }}
                                            format="DD/MM/YYYY HH:mm"
                                            placeholder="Select expiration date"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item name="description" label="Description">
                                <Input.TextArea rows={3} placeholder="Describe the coupon..." />
                            </Form.Item>

                            <Divider orientation="left" style={{ borderColor: '#f0f0f0' }}>Configuration</Divider>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="discount"
                                        label="Discount Percentage"
                                        rules={[{ required: true, message: 'Please enter percentage' }]}
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            min={0}
                                            max={100}
                                            prefix={<PercentageOutlined />}
                                            placeholder="e.g. 10"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="usage" label="Usage Limit (Total)">
                                        <InputNumber style={{ width: '100%' }} min={1} placeholder="Unlimited if empty" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                                <Button style={{ marginRight: 12 }} onClick={() => navigate('/admin/coupons')}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={submitting} style={{ backgroundColor: '#008ECC' }}>
                                    Create Coupon
                                </Button>
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default AddCoupon;