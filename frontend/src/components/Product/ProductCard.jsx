import React from "react";
import { Card, Rate, Typography, Tag } from "antd";
import { StarFilled } from "@ant-design/icons";
import "./ProductCard.css";

const { Text } = Typography;

const ProductCard = ({ product }) => {
    // Giả định thêm: product.originalPrice và product.sold
    // Giả định giá gốc: 250, số lượng đã bán: 1540
    const originalPrice = product.originalPrice || 250; 
    const soldCount = product.sold || 1540; // Giả định số lượng đã bán

    const discountPercent = Math.round(
        ((originalPrice - product.price) / originalPrice) * 100
    );

    const formatSoldCount = (count) => {
        if (count < 1000) {
            return `Đã bán ${count}`;
        } else {
            const k = Math.floor(count / 1000);
            return `Đã bán ${k}k+`;
        }
    };

    return (
        <Card
            hoverable
            cover={
                <div className="product-image-container">
                    <img
                        alt={product.name}
                        src={product.images && product.images.length > 0 ? product.images[0] : ''} // Lấy ảnh đầu tiên
                        style={{ height: 200, objectFit: "contain" }}
                    />

                    {discountPercent > 0 && (
                        <Tag color="red" className="discount-tag">
                            -{discountPercent}%
                        </Tag>
                    )}
                </div>
            }
            className="product-card"
        >
            <div className="product-info">
                <Text strong ellipsis={{ tooltip: product.name }} className="product-name">
                    {product.name}
                </Text>

<<<<<<< HEAD
                // có thể thêm trong tương lai nếu có nhu cầu
=======
                {/* có thể thêm trong tương lai nếu có nhu cầu */}
>>>>>>> ee8b7d9 (add product detail)
                {/* <div className="price-and-original">
                    <Text delete type="secondary" className="product-original">
                        {originalPrice.toLocaleString()}₫
                    </Text>
                </div> */}

                <div className="product-bottom-bar">
                    <Text className="product-sale-price" type="danger" strong>
                        {product.price.toLocaleString()}₫
                    </Text>

                    <Text type="secondary" className="sold-count">
                        {formatSoldCount(soldCount)}
                    </Text>
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;