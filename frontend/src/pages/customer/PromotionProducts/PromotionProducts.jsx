import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Col, Empty, Layout, Row, Spin, Typography, Tag, Card } from "antd";
import { TagOutlined, CalendarOutlined } from "@ant-design/icons";
import ProductCard from "../../../components/Product/ProductCard.jsx";
import BreadscrumbMenu from "../../../components/BreadscrumbMenu/BreadscrumbMenu.jsx";
import ProductFilters from "../../../components/ProductFilters/ProductFilters.jsx";
import promotionService from "../../../services/promotionService.js";
import productService from "../../../services/productService.js";
import "./PromotionProducts.css";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const PromotionProducts = () => {
    const { promotionId } = useParams();
    const [promotion, setPromotion] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});

    const handleFilterChange = (key, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [key]: value,
        }));
    };

    // Fetch promotion details
    useEffect(() => {
        const fetchPromotion = async () => {
            if (!promotionId) return;
            try {
                const response = await promotionService.getPromotionById(promotionId);
                setPromotion(response.data);
            } catch (error) {
                console.error("Error fetching promotion:", error);
                setPromotion(null);
            }
        };
        fetchPromotion();
    }, [promotionId]);

    // Fetch products from all applied categories
    useEffect(() => {
        const fetchProducts = async () => {
            if (!promotion) return;
            setLoading(true);
            
            try {
                const categoryIds = promotion.appliedCategories?.map(cat => cat.id) || [];
                
                if (categoryIds.length === 0) {
                    // If no categories, try to get products directly applied to the promotion
                    // For now, show empty
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                // Fetch products from all categories in parallel
                const productPromises = categoryIds.map(categoryId => 
                    productService.getAllProducts({
                        categoryId,
                        ...filters
                    })
                );

                const results = await Promise.all(productPromises);
                
                // Combine all products and remove duplicates by id
                const allProducts = results.flatMap(res => res.data?.products || []);
                const uniqueProducts = Array.from(
                    new Map(allProducts.map(p => [p.id, p])).values()
                );

                // Apply client-side filtering for price and rating if needed
                let filteredProducts = uniqueProducts;

                if (filters.minPrice !== undefined) {
                    filteredProducts = filteredProducts.filter(p => 
                        (p.basePrice || p.price || 0) >= filters.minPrice
                    );
                }
                if (filters.maxPrice !== undefined) {
                    filteredProducts = filteredProducts.filter(p => 
                        (p.basePrice || p.price || 0) <= filters.maxPrice
                    );
                }
                if (filters.minRating !== undefined) {
                    filteredProducts = filteredProducts.filter(p => 
                        (p.rating || 0) >= filters.minRating
                    );
                }

                // Apply sorting
                if (filters.sortBy) {
                    filteredProducts.sort((a, b) => {
                        const order = filters.sortOrder === 'desc' ? -1 : 1;
                        if (filters.sortBy === 'price') {
                            return ((a.basePrice || a.price || 0) - (b.basePrice || b.price || 0)) * order;
                        }
                        if (filters.sortBy === 'name') {
                            return a.name.localeCompare(b.name) * order;
                        }
                        if (filters.sortBy === 'createdAt') {
                            return (new Date(a.createdAt) - new Date(b.createdAt)) * order;
                        }
                        return 0;
                    });
                }

                setProducts(filteredProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [promotion, filters]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const breadcrumbItems = [
        { title: 'Promotions' },
        ...(promotion ? [{ title: promotion.name }] : [])
    ];

    return (
        <>
            <BreadscrumbMenu items={breadcrumbItems} />

            {/* Promotion Header */}
            {promotion && (
                <Card className="promotion-header-card">
                    <div className="promotion-header">
                        {promotion.image && (
                            <div className="promotion-header-image">
                                <img src={promotion.image} alt={promotion.name} />
                            </div>
                        )}
                        <div className="promotion-header-info">
                            <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
                                <TagOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                {promotion.name}
                            </Title>
                            {promotion.description && (
                                <Text type="secondary" style={{ fontSize: 16 }}>
                                    {promotion.description}
                                </Text>
                            )}
                            <div className="promotion-meta">
                                <Tag icon={<CalendarOutlined />} color="blue">
                                    {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                                </Tag>
                                {promotion.appliedCategories?.length > 0 && (
                                    <div className="promotion-categories">
                                        <Text type="secondary">Categories: </Text>
                                        {promotion.appliedCategories.map(cat => (
                                            <Tag key={cat.id} color="green">{cat.name}</Tag>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            <Layout style={{ background: 'transparent' }}>
                <Sider width={300} style={{ background: 'transparent', paddingRight: '24px', marginTop: '24px' }}>
                    <ProductFilters onFilterChange={handleFilterChange} initialFilters={filters} />
                </Sider>

                <Content style={{ padding: '24px', background: '#fff', borderRadius: '8px', marginTop: '24px' }}>
                    <div className="products-header">
                        <Title level={4} style={{ margin: 0 }}>
                            Products in this promotion
                        </Title>
                        <Text type="secondary">
                            {products.length} product{products.length !== 1 ? 's' : ''} found
                        </Text>
                    </div>
                    
                    <Spin spinning={loading}>
                        {products.length > 0 ? (
                            <Row gutter={[16, 16]}>
                                {products.map(product => (
                                    <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                                        <ProductCard product={product} />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            !loading && <Empty description="No products found in this promotion." />
                        )}
                    </Spin>
                </Content>
            </Layout>
        </>
    );
};

export default PromotionProducts;
