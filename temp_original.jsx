import { useState, useEffect } from 'react';
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
} from 'antd';
import { UploadOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import DescriptionEditor from '../../../components/DescriptionEditor/DescriptionEditor';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [description, setDescription] = useState('');
  const [descriptionImages, setDescriptionImages] = useState([]); // Track images used in description
  const [selectedVariantTypes, setSelectedVariantTypes] = useState([]);
  const [variantOptions, setVariantOptions] = useState({});
  const [activeKeys, setActiveKeys] = useState(['basic', 'description', 'images']);
  const [formReady, setFormReady] = useState(false);

  const isEditMode = !!id;

  // Clean up unused description images
  const cleanupUnusedDescriptionImages = async () => {
    try {
      // Images in description content that aren't in the description HTML anymore
      const imagesToDelete = descriptionImages.filter(
        (img) => !description.includes(img)
      );

      for (const imageUrl of imagesToDelete) {
        try {
          const apiDomain = import.meta.env.VITE_API_DOMAIN;
          await fetch(`${apiDomain}/upload`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileUrl: imageUrl }),
          });
        } catch (error) {
          console.error('Failed to delete unused image:', error);
        }
      }
    } catch (error) {
      console.error('Error in cleanup:', error);
    }
  };

  // Track uploaded images in descriptions
  const handleDescriptionImageUpload = (imageUrl) => {
    setDescriptionImages((prev) => [...prev, imageUrl]);
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        console.log('Categories response:', response);
        // Handle the API response structure: response.data.categories
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
          setUploadedImages(productData.images || []);
          setSelectedVariantTypes(productData.variantTypes || []);
          setVariantOptions(productData.variantOptions || {});

          // Set form values after form is ready
          setFormReady(true);
          setTimeout(() => {
            form.setFieldsValue({
              name: productData.name,
              price: productData.price,
              stockQuantity: productData.stockQuantity,
              categoryId: productData.categoryId,
            });
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
      // Not in edit mode, form is ready
      setFormReady(true);
    }
  }, [id, isEditMode, form, navigate]);

  const handleDescriptionChange = (content) => {
    setDescription(content);
  };

  const handleBeforeUpload = async (file) => {
    // Check file size (max 10MB)
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('Image must be smaller than 10MB!');
      return false;
    }

    // Check file type
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }

    // Upload file to backend
    try {
      const formData = new FormData();
      formData.append('file', file);

      const apiDomain = import.meta.env.VITE_API_DOMAIN;
      const response = await fetch(`${apiDomain}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Add the uploaded image URL to the state immediately
      setUploadedImages((prevImages) => [...prevImages, data.data.url]);
      message.success('Image uploaded successfully');
      return false; // Prevent Upload component from trying to upload again
    } catch (error) {
      message.error('Failed to upload image');
      console.error('Upload error:', error);
      return false;
    }
  };

  const handleVariantTypesChange = (selected) => {
    setSelectedVariantTypes(selected);
    const newOptions = {};
    selected.forEach((type) => {
      newOptions[type] = variantOptions[type] || [];
    });
    setVariantOptions(newOptions);
  };

  const handleVariantOptionChange = (type, index, value) => {
    const newOptions = { ...variantOptions };
    if (!newOptions[type]) newOptions[type] = [];
    newOptions[type][index] = value;
    setVariantOptions(newOptions);
  };

  const handleAddVariantOption = (type) => {
    const newOptions = { ...variantOptions };
    if (!newOptions[type]) newOptions[type] = [];
    newOptions[type].push('');
    setVariantOptions(newOptions);
  };

  const handleRemoveVariantOption = (type, index) => {
    const newOptions = { ...variantOptions };
    newOptions[type].splice(index, 1);
    setVariantOptions(newOptions);
  };

  const handleDeleteImage = async (imageUrl) => {
    try {
      // Call backend to delete from S3
      const apiDomain = import.meta.env.VITE_API_DOMAIN;
      const response = await fetch(`${apiDomain}/upload`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileUrl: imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      // Remove from local state
      const newImages = uploadedImages.filter((url) => url !== imageUrl);
      setUploadedImages(newImages);
      message.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      message.error('Failed to delete image');
    }
  };

  const handleSubmit = async (values) => {
    try {
      // Validation
      if (!description || description.trim() === '{}' || description.trim() === '') {
        message.error('Description is required');
        return;
      }

      if (uploadedImages.length === 0) {
        message.error('At least one product image is required');
        return;
      }

      const productData = {
        name: values.name,
        description, // description is already stringified JSON
        price: values.price,
        stockQuantity: values.stockQuantity,
        categoryId: values.categoryId,
        images: uploadedImages,
        variantTypes: selectedVariantTypes,
        variantOptions,
      };

      setLoading(true);

      if (isEditMode) {
        // Update product
        await productService.updateProduct(id, productData);
        // Clear tracking after successful save
        setDescriptionImages([]);
        message.success('Product updated successfully');
        navigate('/seller/products');
      } else {
        // Create new product
        await productService.createProduct(productData);
        // Clear tracking after successful save
        setDescriptionImages([]);
        message.success('Product created successfully');
        navigate('/seller/products');
      }
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to save product';
      message.error(errorMessage);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setLoading(true);
      await productService.deleteProduct(id);
      message.success('Product deleted successfully');
      navigate('/seller/products');
    } catch (error) {
      const errorMessage = error?.message || 'Failed to delete product';
      message.error(errorMessage);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
              { max: 255, message: 'Product name must not exceed 255 characters' },
            ]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: 'Category is required' }]}
          >
            <Select
              placeholder="Select a category"
              options={Array.isArray(categories) ? categories.map((cat) => ({
                label: cat.name,
                value: cat.id,
              })) : []}
            />
          </Form.Item>

          <Form.Item
            label="Price (Γé½)"
            name="price"
            rules={[
              { required: true, message: 'Price is required' },
              { type: 'number', min: 0.01, message: 'Price must be positive' },
            ]}
          >
            <InputNumber
              placeholder="0.00"
              min={0}
              step={1000}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            label="Stock Quantity"
            name="stockQuantity"
            rules={[
              { required: true, message: 'Stock quantity is required' },
              {
                type: 'number',
                min: 0,
                message: 'Stock quantity must be non-negative',
              },
            ]}
          >
            <InputNumber placeholder="0" min={0} />
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
            onChange={handleDescriptionChange}
            onUploadedImages={handleDescriptionImageUpload}
          />
        </div>
      ),
    },
    {
      key: 'images',
      label: 'Images',
      children: (
        <div className="section-content">
          <Form.Item
            label="Product Images"
            tooltip="Upload at least one product image"
          >
            <Upload
              listType="picture-card"
              beforeUpload={handleBeforeUpload}
              accept="image/*"
              maxCount={10}
              multiple
              onChange={() => {}}
            >
              {uploadedImages.length < 10 && (
                <div>
                  <UploadOutlined />
                  <div>Upload</div>
                </div>
              )}
            </Upload>
            <div className="image-count">
              {uploadedImages.length} / 10 images uploaded
            </div>

            {/* Display uploaded images with delete buttons */}
            {uploadedImages.length > 0 && (
              <div className="uploaded-images-container" style={{ marginTop: '20px' }}>
                <h4>Uploaded Images</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                  {uploadedImages.map((imageUrl, index) => (
                    <div key={index} style={{ position: 'relative', textAlign: 'center' }}>
                      <Image
                        src={imageUrl}
                        alt={`Product image ${index + 1}`}
                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                        preview
                      />
                      <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteImage(imageUrl)}
                        style={{ marginTop: '8px', width: '100%' }}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'variants',
      label: 'Variants',
      children: (
        <div className="section-content">
          <p className="section-hint">
            Configure variant types (Size, Color, Material) for your product.
          </p>

          <Form.Item label="Variant Types">
            <Select
              mode="multiple"
              placeholder="Select variant types"
              value={selectedVariantTypes}
              onChange={handleVariantTypesChange}
              options={[
                { label: 'Size', value: 'SIZE' },
                { label: 'Color', value: 'COLOR' },
                { label: 'Material', value: 'MATERIAL' },
              ]}
            />
          </Form.Item>

          {selectedVariantTypes.length > 0 && (
            <div className="variant-options-container">
              {selectedVariantTypes.map((type) => (
                <div key={type} className="variant-type-section">
                  <h4>{type}</h4>
                  <div className="variant-inputs">
                    {(variantOptions[type] || []).map((option, index) => (
                      <div key={index} className="variant-input-row">
                        <Input
                          placeholder={`Enter ${type.toLowerCase()} option`}
                          value={option}
                          onChange={(e) =>
                            handleVariantOptionChange(type, index, e.target.value)
                          }
                        />
                        <Button
                          danger
                          onClick={() => handleRemoveVariantOption(type, index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="dashed"
                    block
                    onClick={() => handleAddVariantOption(type)}
                    style={{ marginTop: '10px' }}
                  >
                    + Add {type} Option
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
  ];

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
        <Card>
          <Empty description="Product not found" />
        </Card>
      </div>
    );
  }

  if (!formReady) {
    return null;
  }

  return (
    <div className="product-detail-container">
      <Card
        title={isEditMode ? 'Edit Product' : 'Create New Product'}
        extra={
          isEditMode && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              loading={loading}
            >
              Delete Product
            </Button>
          )
        }
        className="product-detail-card"
      >
        <Form
          key="product-form"
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Collapse
            items={collapseItems}
            activeKey={activeKeys}
            onChange={setActiveKeys}
            className="product-collapse"
          />

          <Divider />

          <Form.Item className="form-actions">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
              >
                {isEditMode ? 'Update Product' : 'Create Product'}
              </Button>
              <Button
                onClick={async () => {
                  await cleanupUnusedDescriptionImages();
                  navigate('/seller/products');
                }}
                size="large"
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
