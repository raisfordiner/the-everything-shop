import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
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
  Typography,
} from 'antd';
import {
  DeleteOutlined,
  ExportOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import productService from '../../../services/productService.js';
import ActionButtons from '../../../components/common/ActionButtons/ActionButtons.jsx';
import StockBadge from '../../../components/common/StockBadge/StockBadge.jsx';
import TablePagination from '../../../components/common/TablePagination/TablePagination.jsx';

const { Text } = Typography;

const Product = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchSellerAndProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts();
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

    // Check if navigated from category page with search term
    if (location.state?.searchCategory) {
      setSearchText(location.state.searchCategory);
      // Clear the state after using it
      window.history.replaceState({}, document.title);
    }
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

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one product');
      return;
    }

    try {
      await Promise.all(
        selectedRowKeys.map(productId =>
          productService.deleteProduct(productId)
        )
      );
      message.success(`${selectedRowKeys.length} product(s) deleted successfully`);
      setSelectedRowKeys([]);
      fetchSellerAndProducts();
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      message.error('Failed to delete some products');
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
      key: 'stock',
      render: (_, record) => {
        // Calculate total stock from variants
        const totalStock = record.productVariants?.reduce((sum, v) => sum + (v.quantity || 0), 0) || 0;
        return <StockBadge quantity={totalStock} />;
      },
      sorter: (a, b) => {
        const stockA = a.productVariants?.reduce((sum, v) => sum + (v.quantity || 0), 0) || 0;
        const stockB = b.productVariants?.reduce((sum, v) => sum + (v.quantity || 0), 0) || 0;
        return stockA - stockB;
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span>${price?.toLocaleString() || 0}</span>,
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <>

      <Row justify="space-between" align="middle" style={{ marginBottom: '12px' }}>
        <Col>
          <h2>Products</h2>
        </Col>
        <Col>
          <Space>
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
        <Space style={{ marginBottom: '16px', width: '100%' }} direction="vertical">
          <Input
            placeholder="Search by product name or category..."
            prefix={<SearchOutlined />}
            style={{ width: 400 }}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPagination({ ...pagination, current: 1 }); // Reset to page 1 on search
            }}
            allowClear
          />

          {selectedRowKeys.length > 0 && (
            <Space>
              <Text>Selected {selectedRowKeys.length} product(s)</Text>
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={handleBulkDelete}
              >
                Delete Selected
              </Button>
              <Button
                size="small"
                onClick={() => setSelectedRowKeys([])}
              >
                Clear Selection
              </Button>
            </Space>
          )}
        </Space>

        <Table
          columns={columns}
          dataSource={paginatedProducts}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          pagination={false}
          scroll={{ x: 1200, y: 'calc(100vh - 380px)' }}
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