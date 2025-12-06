import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Row,
  Space,
  Table,
  Tag,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import productService from '../../../services/productService.js';
import authService from '../../../services/authService.js';
import ActionButtons from '../../../components/common/ActionButtons/ActionButtons.jsx';
import StockBadge from '../../../components/common/StockBadge/StockBadge.jsx';
import TablePagination from '../../../components/common/TablePagination/TablePagination.jsx';

const Product = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchSellerAndProducts = async () => {
    setLoading(true);
    try {
      // First, get the current user to get seller ID
      console.log('Starting to fetch seller and products...');
      const userResponse = await authService.checkSession();
      console.log('User response:', userResponse);
      
      // Extract seller ID from the seller relation
      const sellerId = userResponse?.data?.user?.seller?.id;
      
      console.log('Extracted seller ID:', sellerId);
      console.log('Full user data:', userResponse?.data?.user);

      if (!sellerId) {
        console.error('No seller ID found. User might not be a seller.');
        message.error('You are not registered as a seller');
        setLoading(false);
        return;
      }

      // Then fetch products using seller ID
      console.log(`Fetching products for seller ID: ${sellerId}`);
      const response = await productService.getSellerProductsBySellerId(sellerId);
      console.log('Products response:', response);
      
      if (response && response.data) {
        const data = Array.isArray(response.data) ? response.data : response.data.products || [];
        console.log('Processed products data:', data);
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      console.error('Error details:', error.response || error.message);
      message.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerAndProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id);
      message.success('Product deleted successfully');
      fetchSellerAndProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Failed to delete product');
    }
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {record.images && record.images[0] && (
            <img
              src={record.images[0]}
              alt={text}
              style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
            />
          )}
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            {record.variantTypes && record.variantTypes.length > 0 && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                {record.variantTypes.length} Variants
              </div>
            )}
          </div>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category',
      render: (text) => <Tag color="blue">{text || 'N/A'}</Tag>,
    },
    {
      title: 'Stock',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      render: (quantity) => <StockBadge quantity={quantity} />,
      sorter: (a, b) => a.stockQuantity - b.stockQuantity,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span>₫{price?.toLocaleString() || 0}</span>,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Added',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <ActionButtons
          onEdit={() => navigate(`/seller/products/${record.id}`)}
          onDelete={() => handleDelete(record.id)}
          deleteConfirmTitle="Delete Product"
          deleteConfirmDesc="Are you sure you want to delete this product?"
        />
      ),
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  return (
    <>

      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <h2>Products</h2>
        </Col>
        <Col>
          <Space>
            <Button icon={<ExportOutlined />}>Export</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ backgroundColor: '#008ECC' }}
              onClick={() => navigate('/seller/products/new')}
            >
              Add Product
            </Button>
          </Space>
        </Col>
      </Row>

      <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Input
            placeholder="Search by product name or category..."
            prefix={<SearchOutlined />}
            style={{ width: 400 }}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPagination({ ...pagination, current: 1 }); // Reset to page 1 on search
            }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={paginatedProducts}
          rowKey="id"
          loading={loading}
          pagination={false}
        />

        <TablePagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={filteredProducts.length}
          onChange={handlePaginationChange}
        />
      </Card>
    </>
  );
};

export default Product;