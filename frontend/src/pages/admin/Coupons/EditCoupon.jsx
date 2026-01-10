import {useNavigate, useParams} from "react-router";
import React, {useEffect, useState} from "react";
import couponService from "../../../services/couponService.js";
import {
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Row,
    Spin,
    Statistic,
    Typography
} from "antd";
import {GiftOutlined, PercentageOutlined, SaveOutlined} from "@ant-design/icons";
const { Title} = Typography;

const EditCoupon = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [couponData, setCouponData] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchCouponDetails = async () => {
            setLoading(true);
            try {
                const response = await couponService.getCouponById(id);
                const data = response.data.coupon;
                setCouponData(data);

                form.setFieldsValue({
                    code: data.code,
                    discountPercentage: data.discountPercentage,
                    maxUsage: data.maxUsage,
                    isActive: data.isActive !== false,
                });
            }
            catch (error) {
                console.error("Failed to load coupon details: " + error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchCouponDetails();
    }, [form])

    const onFinish = async (values) => {
        setSubmitting(true);
        try {
            const updateData = {
                code: values.code,
                discountPercentage: values.discountPercentage,
                maxUsage: values.maxUsage,
                isActive: values.isActive
            };

            await couponService.updateCoupon(id, updateData);

            messageApi.open({
                type: 'success',
                content: 'Coupon updated successfully!',
                duration: 0.5,
                onClose: () => {
                    navigate('/admin/coupons');
                }
            });
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: error.message || 'Failed to update coupon!',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const discountValue = Form.useWatch('discountPercentage', form);

    return (
        <>
            {contextHolder}

            <div style={{marginBottom: "24px"}}>
                <Title level={2} style={{margin: 0, color: '#008ECC'}}>Edit Coupon</Title>
            </div>

            <Spin spinning={loading} size="large">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{isActive: true}}
                >
                    <Row gutter={24}>
                        <Col span={8}>
                            <Card style={{borderRadius: 12, marginBottom: 24}}>
                                <div style={{textAlign: 'center', padding: '20px 0'}}>
                                    <GiftOutlined style={{fontSize: '48px', color: '#008ECC', marginBottom: 16}}/>
                                    <h4 style={{margin: 0}}>
                                        {couponData?.code || 'COUPON CODE'}
                                    </h4>
                                </div>

                                <Divider/>

                                <div style={{background: '#f5f5f5', padding: 16, borderRadius: 8, marginTop: 16}}>
                                    <Statistic
                                        title="Discount Value"
                                        value={discountValue || 0}
                                        suffix={"%"}
                                        valueStyle={{color: '#008ECC'}}
                                    />
                                </div>
                            </Card>
                        </Col>

                        <Col span={16}>
                            <Card title="Coupon Details" style={{borderRadius: 12}}>
                                <Form.Item
                                    name="code"
                                    label="Coupon Code"
                                    rules={[{required: true, message: 'Please enter coupon code'}]}
                                >
                                    <Input
                                        placeholder="e.g. SUMMER2024"
                                    />
                                </Form.Item>

                                <Divider orientation="left" style={{borderColor: '#f0f0f0'}}>Discount
                                    Configuration</Divider>

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
                                            <InputNumber style={{width: '100%'}} min={1}
                                                         placeholder="Unlimited if empty"/>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Divider/>

                                <Form.Item style={{marginBottom: 0, textAlign: 'right'}}>
                                    <Button style={{marginRight: 12}} onClick={() => navigate('/admin/coupons')}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit" icon={<SaveOutlined/>} loading={submitting}
                                            style={{backgroundColor: '#008ECC'}}>
                                        Save Changes
                                    </Button>
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </>
    )
}

export default EditCoupon;