import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Collapse,
  Upload,
  Select,
  Divider,
  Empty,
  Spin,
  Space,
  Image,
  Alert,
  Typography,
  Tag,
  Tooltip,
  Switch,
  AutoComplete,
} from 'antd';
import {
  UploadOutlined,
  SaveOutlined,
  DeleteOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import DescriptionEditor from '../../../components/common/DescriptionEditor/DescriptionEditor';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import './ProductDetail.css';

const { Text, Title } = Typography;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formReady, setFormReady] = useState(false);
  const [activeKeys, setActiveKeys] = useState(['basic', 'description', 'images', 'variants']);

  // Product-level data
  const [productImages, setProductImages] = useState([]);
  const [description, setDescription] = useState('');
  const [descriptionImages, setDescriptionImages] = useState([]);

  // Variant configuration
  const [variantTypes, setVariantTypes] = useState([]); // e.g., ['Size', 'Color']

  // Variant type cards (like sections) - each has id, type name, options[], and editing state
  const [variantTypeCards, setVariantTypeCards] = useState([]);
  const [editingTypeId, setEditingTypeId] = useState(null);
  const [editingTypeData, setEditingTypeData] = useState({ name: '', options: [] });

  // Actual ProductVariant entities with inventory
  const [variants, setVariants] = useState([]);

  const isEditMode = !!id;

  // Form validation state for button
  const [formValues, setFormValues] = useState({});

  // Check if form is valid for submission
  const isFormValid = useMemo(() => {
    const hasName = formValues.name && formValues.name.trim().length >= 3;
    const hasCategory = !!formValues.categoryId;
    const hasPrice = formValues.price > 0;
    const hasImages = productImages.length > 0;

    // Check for simpleText in the new description format
    let hasDescription = false;
    if (description && description.trim() !== '' && description.trim() !== '{}') {
      try {
        const parsed = JSON.parse(description);
        hasDescription = parsed.simpleText && parsed.simpleText.trim().length > 0;
      } catch {
        // Legacy format - just check if not empty
        hasDescription = true;
      }
    }

    // Only enabled variants count for stock validation
    const enabledVariants = variants.filter(v => v.enabled !== false);
    const hasStock = enabledVariants.some(v => v.quantity > 0);

    return hasName && hasCategory && hasPrice && hasImages && hasDescription && hasStock;
  }, [formValues, productImages, description, variants]);

  // Generate variant key from attributes for uniqueness
  const getVariantKey = (attributes) => {
    return Object.entries(attributes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');
  };

  // Generate all possible variant combinations from type cards
  const generateVariantsFromCards = (cards, existingVariants = []) => {
    const typesWithOptions = cards.filter(c => c.options.length > 0);

    if (typesWithOptions.length === 0) {
      // No variant types with options - create default variant
      return [createDefaultVariant()];
    }

    const combinations = [];

    const generate = (index, current) => {
      if (index === typesWithOptions.length) {
        combinations.push({ ...current });
        return;
      }

      const card = typesWithOptions[index];
      for (const option of card.options) {
        current[card.name] = option;
        generate(index + 1, { ...current });
      }
    };

    generate(0, {});

    // Map combinations to variant objects
    // Use existingVariants if provided, otherwise use current variants state
    const variantsToCheck = existingVariants.length > 0 ? existingVariants : variants;

    return combinations.map(attributes => {
      const key = getVariantKey(attributes);
      const existing = variantsToCheck.find(v => getVariantKey(v.attributes) === key);

      if (existing) {
        // Preserve existing data and enabled state (defaults to true if not set)
        return {
          ...existing,
          enabled: existing.enabled !== false,
        };
      }

      // New combination - disabled by default when loading existing product, enabled for new products
      return {
        id: `temp-${Date.now()}-${Math.random()}`,
        attributes,
        quantity: 0,
        priceAdjustment: 0,
        images: [],
        enabled: existingVariants.length === 0, // Enabled for new products, disabled for existing
      };
    });
  };

  // Generate FULL board of all combinations, merging with DB data
  // Existing variants from DB are marked enabled, non-existing are disabled
  const generateFullBoard = (cards, dbVariants) => {
    const typesWithOptions = cards.filter(c => c.options.length > 0);

    if (typesWithOptions.length === 0) {
      // No variant types - use default variant if exists, or create new
      if (dbVariants.length > 0) {
        return dbVariants.map(v => ({ ...v, enabled: true }));
      }
      return [createDefaultVariant()];
    }

    // Generate all possible combinations
    const combinations = [];
    const generate = (index, current) => {
      if (index === typesWithOptions.length) {
        combinations.push({ ...current });
        return;
      }
      const card = typesWithOptions[index];
      for (const option of card.options) {
        current[card.name] = option;
        generate(index + 1, { ...current });
      }
    };
    generate(0, {});

    // Map to variant objects, merging with DB data
    return combinations.map(attributes => {
      const key = getVariantKey(attributes);
      const existing = dbVariants.find(v => getVariantKey(v.attributes) === key);

      if (existing) {
        // Variant exists in DB - mark as enabled with its data
        return {
          ...existing,
          enabled: true,
        };
      }

      // Variant doesn't exist in DB - mark as disabled with default data
      return {
        id: `temp-${Date.now()}-${Math.random()}`,
        attributes,
        quantity: 0,
        priceAdjustment: 0,
        images: [],
        enabled: false,
      };
    });
  };

  // Create a default variant for products without variant types
  const createDefaultVariant = () => ({
    id: `temp-${Date.now()}`,
    attributes: {},
    quantity: 0,
    priceAdjustment: 0,
    images: [],
    enabled: true,
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        let categoryList = [];
        if (response?.data?.categories && Array.isArray(response.data.categories)) {
          categoryList = response.data.categories;
        } else if (Array.isArray(response?.data)) {
          categoryList = response.data;
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          categoryList = response.data.data;
        }
        setCategories(categoryList);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch product if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await productService.getProductById(id);
          const productData = response?.data;

          if (!productData) {
            message.error('Product not found');
            setLoading(false);
            navigate('/seller/products');
            return;
          }

          setProduct(productData);
          setDescription(productData.description || '');
          setProductImages(productData.images || []);

          // Reconstruct variant type cards from variantTypes and variantOptions
          const cards = (productData.variantTypes || []).map((type, idx) => ({
            id: Date.now() + idx,
            name: type,
            options: productData.variantOptions?.[type] || [],
          }));
          setVariantTypeCards(cards);
          setVariantTypes(productData.variantTypes || []);

          // Map existing productVariants from DB
          const existingDbVariants = (productData.productVariants || []).map(v => ({
            id: v.id,
            attributes: v.variantAttributes || {},
            quantity: v.quantity || 0,
            priceAdjustment: v.priceAdjustment || 0,
            images: v.images || [],
          }));

          // Generate FULL board of all combinations, merging with existing DB data
          // Existing variants are enabled, non-existing are disabled but visible
          const fullBoard = generateFullBoard(cards, existingDbVariants);
          setVariants(fullBoard);

          setFormReady(true);
          setTimeout(() => {
            const fieldValues = {
              name: productData.name,
              price: productData.price,
              categoryId: productData.categoryId,
            };
            form.setFieldsValue(fieldValues);
            setFormValues(fieldValues);
          }, 50);

          setLoading(false);
        } catch (error) {
          console.error('Error fetching product:', error);
          message.error('Failed to load product details');
          setLoading(false);
          navigate('/seller/products');
        }
      };
      fetchProduct();
    } else {
      // Create mode - start with a default variant
      setVariants([createDefaultVariant()]);
      setFormReady(true);
    }
  }, [id, isEditMode, form, navigate]);

  // Sync variants when type cards change
  const syncVariants = (cards) => {
    const newVariants = generateVariantsFromCards(cards);
    setVariants(newVariants);

    // Update variantTypes array
    const types = cards.map(c => c.name).filter(n => n.trim());
    setVariantTypes(types);
  };

  // Add new variant type card
  const handleAddVariantType = () => {
    const newCard = {
      id: Date.now(),
      name: 'New Variant Type',
      options: [],
    };
    const newCards = [...variantTypeCards, newCard];
    setVariantTypeCards(newCards);
    setEditingTypeId(newCard.id);
    setEditingTypeData({ name: 'New Variant Type', options: [] });
  };

  // Start editing a variant type card
  const handleEditVariantType = (card) => {
    setEditingTypeId(card.id);
    setEditingTypeData({ name: card.name, options: [...card.options] });
  };

  // Save variant type card
  const handleSaveVariantType = () => {
    if (!editingTypeData.name.trim()) {
      message.error('Variant type name is required');
      return;
    }

    const newCards = variantTypeCards.map(card =>
      card.id === editingTypeId
        ? { ...card, name: editingTypeData.name.trim(), options: editingTypeData.options }
        : card
    );
    setVariantTypeCards(newCards);
    syncVariants(newCards);
    setEditingTypeId(null);
    setEditingTypeData({ name: '', options: [] });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    // If it's a new unsaved card with default name, remove it
    const card = variantTypeCards.find(c => c.id === editingTypeId);
    if (card && card.name === 'New Variant Type' && card.options.length === 0) {
      setVariantTypeCards(variantTypeCards.filter(c => c.id !== editingTypeId));
    }
    setEditingTypeId(null);
    setEditingTypeData({ name: '', options: [] });
  };

  // Delete variant type card
  const handleDeleteVariantType = (cardId) => {
    const newCards = variantTypeCards.filter(c => c.id !== cardId);
    setVariantTypeCards(newCards);
    syncVariants(newCards);
  };

  // Handle variant data change
  const handleVariantChange = (variantId, field, value) => {
    setVariants(prev => prev.map(v =>
      v.id === variantId ? { ...v, [field]: value } : v
    ));
  };

  // Image upload handler
  const handleImageUpload = async (file, onSuccess) => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('Image must be smaller than 10MB!');
      return false;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const apiDomain = import.meta.env.VITE_API_DOMAIN;
      const response = await fetch(`${apiDomain}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      onSuccess(data.data.url);
      message.success('Image uploaded successfully');
      return false;
    } catch (error) {
      message.error('Failed to upload image');
      console.error('Upload error:', error);
      return false;
    }
  };

  // Delete image
  const handleDeleteImage = async (imageUrl, setter) => {
    try {
      const apiDomain = import.meta.env.VITE_API_DOMAIN;
      await fetch(`${apiDomain}/upload`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: imageUrl }),
      });
      setter(prev => prev.filter(url => url !== imageUrl));
      message.success('Image deleted');
    } catch (error) {
      console.error('Error deleting image:', error);
      message.error('Failed to delete image');
    }
  };

  // Form field change handler
  const handleFormChange = (_, allValues) => {
    setFormValues(allValues);
  };

  // Submit form
  const handleSubmit = async (values) => {
    try {
      // Build variantOptions object from cards
      const variantOptionsObj = {};
      variantTypeCards.forEach(card => {
        if (card.name.trim() && card.options.length > 0) {
          variantOptionsObj[card.name] = card.options;
        }
      });

      const productData = {
        name: values.name,
        description,
        price: values.price,
        categoryId: values.categoryId,
        images: productImages,
        variantTypes: variantTypeCards.map(c => c.name).filter(n => n.trim()),
        variantOptions: variantOptionsObj,
        // Only send enabled variants to backend
        variants: variants
          .filter(v => v.enabled !== false)
          .map(v => ({
            variantAttributes: v.attributes,
            quantity: v.quantity,
            priceAdjustment: v.priceAdjustment,
            images: v.images,
          })),
      };

      setLoading(true);

      if (isEditMode) {
        await productService.updateProduct(id, productData);
        message.success('Product updated successfully');
      } else {
        await productService.createProduct(productData);
        message.success('Product created successfully');
      }

      navigate('/seller/products');
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to save product';
      message.error(errorMessage);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setLoading(true);
      await productService.deleteProduct(id);
      message.success('Product deleted successfully');
      navigate('/seller/products');
    } catch (error) {
      message.error(error?.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && isEditMode) {
    return (
      <div className="product-detail-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="Loading product details..." />
      </div>
    );
  }

  if (isEditMode && !product) {
    return (
      <div className="product-detail-container">
        <Card><Empty description="Product not found" /></Card>
      </div>
    );
  }

  if (!formReady) return null;

  // Calculate total stock for display
  const totalStock = variants.reduce((sum, v) => sum + (v.quantity || 0), 0);

  const collapseItems = [
    {
      key: 'basic',
      label: 'Basic Information',
      children: (
        <div className="section-content">
          <Form.Item
            label="Product Name"
            name="name"
            rules={[
              { required: true, message: 'Product name is required' },
              { min: 3, message: 'Product name must be at least 3 characters' },
            ]}
          >
            <Input placeholder="Enter product name" size="large" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: 'Category is required' }]}
          >
            <Select
              placeholder="Type to search or select a category"
              size="large"
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={categories.map(cat => ({ label: cat.name, value: cat.id }))}
            />
          </Form.Item>

          <Form.Item
            label="Base Price ($)"
            name="price"
            rules={[
              { required: true, message: 'Price is required' },
              { type: 'number', min: 0.01, message: 'Price must be positive' },
            ]}
          >
            <InputNumber
              placeholder="0.00"
              min={0}
              step={1}
              size="large"
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      children: (
        <div className="section-content">
          <DescriptionEditor
            value={description}
            onChange={setDescription}
            onUploadedImages={(url) => setDescriptionImages(prev => [...prev, url])}
          />
        </div>
      ),
    },
    {
      key: 'images',
      label: `Product Images (${productImages.length}/10)`,
      children: (
        <div className="section-content">
          <Alert
            message="These images will be used as default if variant-specific images are not provided."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Upload
            listType="picture-card"
            beforeUpload={(file) => handleImageUpload(file, (url) => setProductImages(prev => [...prev, url]))}
            accept="image/*"
            maxCount={10}
            multiple
            showUploadList={false}
          >
            {productImages.length < 10 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>

          {productImages.length > 0 && (
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
              {productImages.map((url, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <Image
                    src={url}
                    style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8 }}
                  />
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteImage(url, setProductImages)}
                    style={{ position: 'absolute', top: 4, right: 4 }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'variants',
      label: `Variants & Inventory (Total Stock: ${totalStock})`,
      children: (
        <div className="section-content">
          {/* Variant Type Cards */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0 }}>Variant Types</Title>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={handleAddVariantType}
                disabled={editingTypeId !== null}
              >
                Add Variant Type
              </Button>
            </div>

            {variantTypeCards.length === 0 ? (
              <Alert
                message="No Variant Types"
                description="This product will have a single default variant. Click 'Add Variant Type' to create variants like Size, Color, etc."
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {variantTypeCards.map(card => (
                  <Card
                    key={card.id}
                    size="small"
                    title={
                      editingTypeId === card.id ? (
                        <Input
                          value={editingTypeData.name}
                          onChange={(e) => setEditingTypeData({ ...editingTypeData, name: e.target.value })}
                          placeholder="Variant type name (e.g., Size, Color)"
                          style={{ width: 250 }}
                        />
                      ) : (
                        <span>{card.name}</span>
                      )
                    }
                    extra={
                      editingTypeId === card.id ? (
                        <Space>
                          <Button type="primary" size="small" icon={<CheckOutlined />} onClick={handleSaveVariantType}>
                            Done
                          </Button>
                          <Button size="small" icon={<CloseOutlined />} onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </Space>
                      ) : (
                        <Space>
                          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditVariantType(card)}>
                            Edit
                          </Button>
                          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteVariantType(card.id)}>
                            Delete
                          </Button>
                        </Space>
                      )
                    }
                  >
                    {editingTypeId === card.id ? (
                      <div>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                          Add options (type and press Enter):
                        </Text>
                        <Select
                          mode="tags"
                          placeholder={`Add ${editingTypeData.name} options (e.g., S, M, L)`}
                          value={editingTypeData.options}
                          onChange={(options) => setEditingTypeData({ ...editingTypeData, options })}
                          tokenSeparators={[',']}
                          style={{ width: '100%' }}
                        />
                      </div>
                    ) : (
                      <div>
                        {card.options.length === 0 ? (
                          <Text type="secondary">No options added yet</Text>
                        ) : (
                          <Space wrap>
                            {card.options.map((opt, idx) => (
                              <Tag key={idx}>{opt}</Tag>
                            ))}
                          </Space>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Divider />

          {/* Inventory Section */}
          <div>
            <Title level={5}>Inventory</Title>

            {variantTypeCards.length === 0 || !variantTypeCards.some(c => c.options.length > 0) ? (
              // Default variant (no variant types or no options)
              <div style={{ padding: 16, background: '#fafafa', borderRadius: 8 }}>
                <Form.Item label="Stock Quantity" style={{ marginBottom: 0 }}>
                  <InputNumber
                    min={0}
                    value={variants[0]?.quantity || 0}
                    onChange={(val) => handleVariantChange(variants[0]?.id, 'quantity', val || 0)}
                    style={{ width: 150 }}
                    size="large"
                  />
                </Form.Item>
              </div>
            ) : (
              // Variant inventory table
              <div>
                <Alert
                  message={`${variants.filter(v => v.enabled !== false).length} of ${variants.length} variant combination(s) enabled`}
                  type="info"
                  style={{ marginBottom: 12 }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {variants.map(variant => {
                    const isEnabled = variant.enabled !== false;
                    return (
                      <Card
                        key={variant.id}
                        size="small"
                        style={{
                          opacity: isEnabled ? 1 : 0.6,
                          background: isEnabled ? undefined : '#f5f5f5'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                          {/* Toggle */}
                          <Tooltip title={isEnabled ? 'Disable this variant' : 'Enable this variant'}>
                            <Switch
                              checked={isEnabled}
                              onChange={(checked) => handleVariantChange(variant.id, 'enabled', checked)}
                              size="small"
                            />
                          </Tooltip>

                          {/* Variant attributes */}
                          <div style={{ flex: '1 1 200px' }}>
                            <Space wrap>
                              {Object.entries(variant.attributes).map(([type, value]) => (
                                <Tag key={type} color={isEnabled ? 'blue' : 'default'}>{type}: {value}</Tag>
                              ))}
                            </Space>
                          </div>

                          {/* Quantity */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Text type={isEnabled ? undefined : 'secondary'}>Qty:</Text>
                            <InputNumber
                              min={0}
                              value={variant.quantity}
                              onChange={(val) => handleVariantChange(variant.id, 'quantity', val || 0)}
                              style={{ width: 80 }}
                              disabled={!isEnabled}
                            />
                          </div>

                          {/* Price adjustment */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Tooltip title="Price adjustment added to base price (use negative for discount)">
                              <Text type={isEnabled ? undefined : 'secondary'}>$</Text>
                            </Tooltip>
                            <InputNumber
                              value={variant.priceAdjustment}
                              onChange={(val) => handleVariantChange(variant.id, 'priceAdjustment', val ?? 0)}
                              style={{ width: 90 }}
                              disabled={!isEnabled}
                              placeholder="0"
                            />
                          </div>

                          {/* Images */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Text type="secondary">{variant.images?.length || 0} images</Text>
                            <Upload
                              beforeUpload={(file) => handleImageUpload(file, (url) => {
                                handleVariantChange(variant.id, 'images', [...(variant.images || []), url]);
                              })}
                              showUploadList={false}
                              accept="image/*"
                              disabled={!isEnabled}
                            >
                              <Button size="small" icon={<UploadOutlined />} disabled={!isEnabled} />
                            </Upload>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="product-detail-container">
      <Card
        title={
          <Title level={4} style={{ margin: 0 }}>
            {isEditMode ? 'Edit Product' : 'Create New Product'}
          </Title>
        }
        extra={
          isEditMode && (
            <Button danger icon={<DeleteOutlined />} onClick={handleDelete} loading={loading}>
              Delete
            </Button>
          )
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleFormChange}
          autoComplete="off"
        >
          <Collapse
            items={collapseItems}
            activeKey={activeKeys}
            onChange={setActiveKeys}
            style={{ marginBottom: 24 }}
          />

          <Divider />

          <Form.Item>
            <Space>
              <Tooltip title={!isFormValid ? 'Please fill all required fields: name, category, price, description, images, and stock quantity' : ''}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                  size="large"
                  disabled={!isFormValid}
                >
                  {isEditMode ? 'Update Product' : 'Create Product'}
                </Button>
              </Tooltip>
              <Button onClick={() => navigate('/seller/products')} size="large">
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
