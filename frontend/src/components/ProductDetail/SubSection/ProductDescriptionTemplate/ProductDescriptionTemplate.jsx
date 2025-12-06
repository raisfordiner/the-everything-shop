import { useParams } from 'react-router-dom';
import { Collapse, Spin, Empty } from 'antd';
import { useEffect, useState } from 'react';
import productService from '../../../../services/productService';
import DescriptionRenderer from '../../../common/DescriptionRenderer/DescriptionRenderer';
import './ProductDescriptionTemplate.css';

const ProductDescriptionTemplate = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(productId);
        setProduct(response?.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return <Empty description="Product not found" />;
  }

  // Parse description
  let descriptionContent = null;
  let collapseItems = [];

  try {
    const parsed =
      typeof product.description === 'string'
        ? JSON.parse(product.description)
        : product.description;

    if (parsed.type === 'sections' && Array.isArray(parsed.sections)) {
      // Sections mode - create collapsible items
      collapseItems = parsed.sections.map((section, index) => ({
        key: index,
        label: section.title,
        children: (
          <div
            className="section-content-html"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        ),
        extra: null,
      }));
    } else if (parsed.type === 'simple' && typeof parsed.content === 'string') {
      // Simple mode - render as plain HTML
      descriptionContent = parsed.content;
    }
  } catch (error) {
    // Fallback: treat as plain HTML
    descriptionContent = product.description;
  }

  return (
    <div className="product-description-template">
      {collapseItems.length > 0 ? (
        // Sections mode - show collapsible sections
        <div className="description-sections">
          <Collapse
            items={collapseItems}
            defaultActiveKey={[0]}
            accordion={false}
            className="description-collapse"
          />
        </div>
      ) : descriptionContent ? (
        // Simple mode - show as regular HTML
        <div
          className="description-simple-content"
          dangerouslySetInnerHTML={{ __html: descriptionContent }}
        />
      ) : (
        <Empty description="No description available" />
      )}
    </div>
  );
};

export default ProductDescriptionTemplate;