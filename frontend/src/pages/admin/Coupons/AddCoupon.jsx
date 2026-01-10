import {useNavigate} from "react-router";
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Row,
    Select,
    Statistic,
    Switch, Typography
} from "antd";
import React, {useEffect, useState} from "react";
import couponService from "../../../services/couponService.js";
import {GiftOutlined, PercentageOutlined, PlusOutlined} from "@ant-design/icons";
import promotionService from "../../../services/promotionService.js";
const { Title} = Typography;

const AddCoupon = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [promotions, setPromotions] = useState([]);

    const discountValue = Form.useWatch('discountPercentage', form);
    const couponCode = Form.useWatch('code', form);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const res = await promotionService.getAllPromotions({ status: 'ACTIVE' });
                const promotionList = res.data?.promotions || res.data || [];
                setPromotions(promotionList);
            } catch (error) {
                console.error("Failed to fetch promotions", error);
                message.error("Could not load promotions list.");
            }
        };
        fetchPromotions();
    }, []);

    const onFinish = async (values) => {
        setSubmitting(true);
        try {
            const newCoupon = {
                code: values.code,
                discountPercentage: values.discountPercentage,
                maxUsage: values.maxUsage,
                promotionId: values.promotionId,
                isActive: values.isActive
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

            <div style={{marginBottom: "24px"}}>
                <Title level={2} style={{margin: 0, color: '#008ECC'}}>Add New Coupon</Title>
            </div>

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
                        <Card style={{borderRadius: 12, marginBottom: 24}}>
                            <div style={{textAlign: 'center', padding: '20px 0'}}>
                                <GiftOutlined style={{fontSize: '48px', color: '#008ECC', marginBottom: 16}}/>
                                <h4 style={{margin: 0, textTransform: 'uppercase'}}>
                                    {couponCode || 'COUPON CODE'}
                                </h4>
                            </div>

                            <Divider/>

                            <div style={{background: '#f5f5f5', padding: 16, borderRadius: 8, marginTop: 16}}>
                                <Statistic
                                    title="Discount Value"
                                    value={discountValue || 0}
                                    suffix="%"
                                    valueStyle={{color: '#008ECC'}}
                                />
                            </div>
                        </Card>
                    </Col>

                    <Col span={16}>
                        <Card title="Coupon Details" style={{borderRadius: 12}}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="code"
                                        label="Coupon Code"
                                        rules={[{required: true, message: 'Please enter coupon code'}]}
                                    >
                                        <Input
                                            placeholder="e.g. SUMMER2024"
                                            style={{
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold',
                                                letterSpacing: '1px'
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="promotionId"
                                        label="Select Promotion"
                                        rules={[{required: true, message: 'Please select a promotion'}]}
                                    >
                                        <Select placeholder="Select a campaign">
                                            {promotions.map(promo => (
                                                <Select.Option key={promo.id} value={promo.id}>
                                                    {promo.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>


                            <Divider orientation="left" style={{borderColor: '#f0f0f0'}}>Configuration</Divider>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="discountPercentage"
                                        label="Discount Percentage"
                                        rules={[{required: true, message: 'Please enter percentage'}]}
                                    >
                                        <InputNumber
                                            style={{width: '100%'}}
                                            min={0}
                                            max={100}
                                            prefix={<PercentageOutlined/>}
                                            placeholder="e.g. 10"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="maxUsage" label="Usage Limit (Total)">
                                        <InputNumber style={{width: '100%'}} min={1} placeholder="Unlimited if empty"/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider/>

                            <Form.Item style={{marginBottom: 0, textAlign: 'right'}}>
                                <Button style={{marginRight: 12}} onClick={() => navigate('/admin/coupons')}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit" icon={<PlusOutlined/>} loading={submitting}
                                        style={{backgroundColor: '#008ECC'}}>
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