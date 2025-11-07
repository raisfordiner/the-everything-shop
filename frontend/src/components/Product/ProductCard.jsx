import React from "react";
import { Card, Rate, Typography, Tag } from "antd";
import { StarFilled } from "@ant-design/icons";
import "./ProductCard.css";

const { Text } = Typography;

const ProductCard = ({ product }) => {
    const discountPercent = Math.round(
        ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
    );

    return (
        <Card
            hoverable
            cover={
                <img
                alt={product.name}
                src={product.image}
                style={{ height: 200, objectFit: "contain" }}
                />
            }
        >
            <div className="product-info">
                <Text strong ellipsis={{ tooltip: product.name }}>
                    {product.name}
                </Text>

                <div className="product-prices">
                    <Text className="product-sale-price" type="danger" strong>
                        {product.salePrice.toLocaleString()}₫
                    </Text>

                    <div className="product-old">
                        <Text delete type="secondary" className="product-original">
                            {product.originalPrice.toLocaleString()}₫
                        </Text>
                        <Text className="product-discount">-{discountPercent}%</Text>
                    </div>
                </div>

                <div className="product-rating">
                    <div className="rating-left">
                        <StarFilled style={{ color: "#faad14" }} />
                        <Text className="rating-score">{product.rating.toFixed(1)}</Text>
                    </div>
                    <Text type="secondary" className="sold-count">
                        Đã bán {product.sold.toLocaleString()}
                    </Text>
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;
