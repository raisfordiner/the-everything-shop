import React from "react";
import { Card, Rate, Typography, Tag, Space, Image, Flex } from "antd";
import { StarFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
// import "./ProductCard.css";

const ProductCard = ({ product }) => {
    const soldCount = product.soldCount || 0;

    // Calculate the highest discount percentage from all available coupons
    // Checks both direct product promotions AND category-based promotions
    const getMaxDiscountPercentage = () => {
        const now = new Date();
        let maxDiscount = 0;

        const checkPromotions = (promotions) => {
            if (!promotions || promotions.length === 0) return;

            promotions.forEach(promotion => {
                const isActive = promotion.status === 'ACTIVE';
                const isInDateRange = new Date(promotion.startDate) <= now && new Date(promotion.endDate) >= now;

                if (isActive && isInDateRange && promotion.coupons) {
                    promotion.coupons.forEach(coupon => {
                        if (coupon.discountPercentage > maxDiscount && coupon.usageCount < coupon.maxUsage) {
                            maxDiscount = coupon.discountPercentage;
                        }
                    });
                }
            });
        };

        // Check direct product promotions
        checkPromotions(product.promotions);

        // Check category-based promotions (for all-store and category-wide vouchers)
        checkPromotions(product.category?.promotions);

        return Math.round(maxDiscount);
    };

    const discountPercent = getMaxDiscountPercentage();
    const originalPrice = product.price;
    const discountedPrice = discountPercent > 0
        ? originalPrice * (1 - discountPercent / 100)
        : originalPrice;

    const formatSoldCount = (count) => {
        if (count < 1000) {
            return `${count} sold`;
        } else {
            const k = Math.floor(count / 1000);
            return `${k}k+ sold`;
        }
    };

    return (
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
            <Card hoverable className="product-card">
                <Space direction="vertical" size="small" className="product-image-container" style={{ width: '100%' }}>
                    <div style={{ height: 24, marginBottom: 4 }}>
                        {discountPercent > 0 && (
                            <Tag color="red" className="discount-tag">
                                -{discountPercent}%
                            </Tag>
                        )}
                    </div>
                    <div
                        className="product-image-wrapper"
                        style={{
                            height: 200,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            transition: 'transform 0.3s ease'
                        }}
                    >
                        <Image
                            alt={product.name}
                            src={product.images && product.images.length > 0 ? product.images[0] : ''} // Get first image
                            preview={false}
                            height={200}
                            style={{
                                objectFit: 'contain',
                                width: '100%',
                            }}
                        />
                    </div>
                    <Space direction="vertical" className="product-info" style={{ width: '100%' }}>
                        <Typography.Title
                            level={4}
                            strong
                            ellipsis={{ tooltip: product.name }}
                            className="product-name"
                            style={{ transition: 'color 0.3s ease' }}
                        >
                            {product.name}
                        </Typography.Title>

                        <Typography.Paragraph
                            className="product-description"
                            ellipsis={{ rows: 2, tooltip: product.description }}
                            style={{ marginBottom: 8, wordBreak: 'break-word' }}
                        >
                            {product.description}
                        </Typography.Paragraph>

                        <Flex justify="space-between" align="center" className="product-bottom-bar" style={{ width: '100%' }}>
                            {discountPercent > 0 ? (
                                <Flex gap={8} align="center">
                                    <Typography.Text delete type="secondary" style={{ fontSize: '12px' }}>
                                        ${originalPrice.toLocaleString()}
                                    </Typography.Text>
                                    <Typography.Text type="danger" strong>
                                        ${discountedPrice.toLocaleString()}
                                    </Typography.Text>
                                </Flex>
                            ) : (
                                <Typography.Text type="danger" strong>
                                    ${originalPrice.toLocaleString()}
                                </Typography.Text>
                            )}

                            <Typography.Text type="secondary" className="sold-count">
                                {formatSoldCount(soldCount)}
                            </Typography.Text>
                        </Flex>
                    </Space>
                </Space>
            </Card>
        </Link>
    );
};

// Add global styles for hover effects
if (typeof document !== 'undefined') {
    const styleId = 'product-card-hover-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .product-card:hover .product-image-wrapper {
                transform: translateY(-8px);
            }
            .product-card:hover .product-name {
                color: #1890ff !important;
            }
        `;
        document.head.appendChild(style);
    }
}

export default ProductCard;