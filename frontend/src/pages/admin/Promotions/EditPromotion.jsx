import { useNavigate, useParams } from "react-router";
import { Button, Card, Col, DatePicker, Divider, Form, Input, message, Row, Select, Radio, Typography, Upload, Image, Avatar, Flex } from "antd";
import { useEffect, useState } from "react";
import promotionService from "../../../services/promotionService.js";
import productService from "../../../services/productService.js";
import categoriesService from "../../../services/categoryService.js";
import uploadService from "../../../services/uploadService.js";
import { SaveOutlined, PictureTwoTone } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const EditPromotion = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [scopeType, setScopeType] = useState('ALL');
    const [messageApi, contextHolder] = message.useMessage();

    const [cachedProductIds, setCachedProductIds] = useState([]);
    const [cachedCategoryIds, setCachedCategoryIds] = useState([]);

    const [initialProductIds, setInitialProductIds] = useState([]);
    const [initialCategoryIds, setInitialCategoryIds] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);
    const [initialImageUrl, setInitialImageUrl] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const promoResponse = await promotionService.getPromotionById(id);
                const productsResponse = await productService.getAllProducts();
                const categoriesResponse = await categoriesService.getAllCategoriesSimple();

                const promo = promoResponse?.data || [];

                if (productsResponse && productsResponse.data) {
                    const data = productsResponse.data?.products || productsResponse.data || [];
                    setProducts(data);
                }

                if (categoriesResponse && categoriesResponse.data) {
                    const data = categoriesResponse.data?.categories || categoriesResponse.data || [];
                    setCategories(data);
                }

                let currentScope = "ALL";
                let initProdIds = [];
                let initCatIds = [];

                if (promo.appliedCategories && promo.appliedCategories.length > 0) {
                    currentScope = 'CATEGORY';
                    initCatIds = promo.appliedCategories.map(c => c.id);
                } else if (promo.appliedProducts && promo.appliedProducts.length > 0) {
                    currentScope = 'PRODUCT';
                    initProdIds = promo.appliedProducts.map(p => p.id);
                }

                setInitialProductIds(initProdIds);
                setInitialCategoryIds(initCatIds);

                setScopeType(currentScope);
                setCachedCategoryIds(initCatIds);
                setCachedProductIds(initProdIds);

                let currentAppliedIds = [];
                if (currentScope === 'CATEGORY') currentAppliedIds = initCatIds;
                if (currentScope === 'PRODUCT') currentAppliedIds = initProdIds;

                form.setFieldsValue({
                    name: promo.name,
                    description: promo.description,
                    dateRange: [dayjs(promo.startDate), dayjs(promo.endDate)],
                    status: promo.status,
                    scopeType: currentScope,
                    appliedIds: currentAppliedIds,
                });

                // Handle existing image
                if (promo.image) {
                    setInitialImageUrl(promo.image);
                    setFileList([{
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: promo.image,
                    }]);
                }
            }
            catch (error) {
                message.error('Failed to load data needed for editing.');
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, form]);

    const handleScopeChange = (e) => {
        const newScope = e.target.value;
        setScopeType(newScope);

        if (newScope === 'PRODUCT') {
            form.setFieldsValue({ appliedIds: cachedProductIds });
        } else if (newScope === 'CATEGORY') {
            form.setFieldsValue({ appliedIds: cachedCategoryIds });
        } else {
            form.setFieldsValue({ appliedIds: [] });
        }
    };

    const handleChange = async ({ fileList: newList }) => {
        // Handle file removal from storage
        if (newList.length < fileList.length) {
            const removedFile = fileList.find(f => !newList.some(nf => nf.uid === f.uid));
            const urlToDelete = removedFile?.response?.data?.url || removedFile?.url;
            // Only delete if it's not the initial image or if it was uploaded in this session
            if (urlToDelete && urlToDelete !== initialImageUrl) {
                try {
                    await uploadService.deleteFile(urlToDelete);
                } catch (error) {
                    console.error("Failed to delete file from storage:", error);
                }
            }
        }
        setFileList(newList)
    }

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await new Promise((resolve) => {
                getBase64(file.originFileObj, resolve)
            })
        }
        setPreviewImage(file.url || file.preview)
        setPreviewOpen(true)
    }

    const onFinish = async (values) => {
        setSubmitting(true);
        try {
            const basicPayload = {
                name: values.name,
                description: values.description,
                image: fileList[0]?.response?.data?.url || fileList[0]?.url || null,
                startDate: values.dateRange[0].toISOString(),
                endDate: values.dateRange[1].toISOString(),
                status: values.status,
            };

            await promotionService.updatePromotion(id, basicPayload);

            let targetProductIds = [];
            let targetCategoryIds = [];

            if (values.scopeType === 'PRODUCT') targetProductIds = values.appliedIds;
            if (values.scopeType === 'CATEGORY') targetCategoryIds = values.appliedIds;

            const promises = [];

            const productsToAdd = targetProductIds.filter(id => !initialProductIds.includes(id));

            const productsToRemove = initialProductIds.filter(id => !targetProductIds.includes(id));

            if (productsToAdd.length > 0) promises.push(promotionService.addProductsToPromotion(id, productsToAdd));
            if (productsToRemove.length > 0) promises.push(promotionService.removeProductsFromPromotion(id, productsToRemove));


            const catsToAdd = targetCategoryIds.filter(id => !initialCategoryIds.includes(id));

            const catsToRemove = initialCategoryIds.filter(id => !targetCategoryIds.includes(id));

            if (catsToAdd.length > 0) promises.push(promotionService.addCategoriesToPromotion(id, catsToAdd));
            if (catsToRemove.length > 0) promises.push(promotionService.removeCategoriesFromPromotion(id, catsToRemove));

            await Promise.all(promises);

            messageApi.open({
                type: 'success',
                content: 'Promotion updated successfully!',
                duration: 0.5,
                onClose: () => {
                    navigate('/admin/promotions');
                }
            });
        }
        catch (error) {
            messageApi.open({
                type: 'error',
                content: error.message || 'Failed to update promotion!',
            });
        }
        finally {
            setSubmitting(false);
        }
    }

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
                        onChange={(values) => setCachedCategoryIds(values)}
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
                        onChange={(values) => setCachedProductIds(values)}
                    >
                        {products.map(prod => (
                            <Select.Option key={prod.id} value={prod.id}>{prod.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            );
        }
    }

    return (
        <>
            {contextHolder}

            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div>
                        <Title level={2} style={{ margin: 0, color: '#008ECC' }}>Edit Promotion</Title>
                    </div>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Row gutter={24}>
                    <Col span={14}>
                        <Card title="General Information" style={{ borderRadius: 12, height: '100%' }}>
                            <Form.Item
                                name="name"
                                label="Campaign Name"
                                rules={[{ required: true, message: 'Please enter campaign name' }]}
                            >
                                <Input placeholder="e.g. Summer Sale 2025" size="large" />
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

                            <Typography.Text>Banner Image</Typography.Text>
                            <Form.Item name="thumbnail" valuePropName="fileList">
                                <div
                                    style={{
                                        width: '100%',
                                        aspectRatio: '16 / 9',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 8
                                    }}
                                >
                                    <Upload
                                        listType="picture-card"
                                        maxCount={1}
                                        fileList={fileList}
                                        onChange={handleChange}
                                        customRequest={async ({ file, onSuccess, onError }) => {
                                            try {
                                                const response = await uploadService.uploadFile(file);
                                                onSuccess(response);
                                            } catch (err) {
                                                onError(err);
                                            }
                                        }}
                                        onPreview={handlePreview}
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        {fileList.length >= 1 ? null : uploadButton}
                                    </Upload>

                                    <Image
                                        preview={{
                                            visible: previewOpen,
                                            onVisibleChange: (v) => setPreviewOpen(v),
                                        }}
                                        src={previewImage}
                                        style={{ display: "none" }}
                                    />
                                </div>
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col span={10}>
                        <Card title="Application Scope" style={{ borderRadius: 12, height: '100%' }}>
                            <Form.Item label="Apply Discount To" name="scopeType">
                                <Radio.Group
                                    onChange={handleScopeChange}
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
                        icon={<SaveOutlined />}
                        loading={submitting}
                        style={{ backgroundColor: '#008ECC' }}
                    >
                        Save Changes
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default EditPromotion;

const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
}

const uploadButton = (
    <Flex
        vertical
        justify='center'
        align="center"
        gap={8}
        style={{
            width: '100%',
            aspectRatio: '16 / 9',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '5px',
            border: '1px dashed #d9d9d9',
        }}
    >
        <Avatar>
            <PictureTwoTone />
        </Avatar>
        <Typography.Text align='center'>Drop or drag image here, or click add image</Typography.Text>
        <Button>Add image</Button>
    </Flex>
)