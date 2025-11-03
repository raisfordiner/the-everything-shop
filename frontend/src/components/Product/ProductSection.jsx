import React from "react";
import { Button, Typography, Row, Col } from "antd";
import ProductGrid from "./ProductGrid";
import "./ProductSection.css";

const { Title } = Typography;

const ProductSection = ({ title, products, bannerImage, onViewAll }) => {
    const hasBanner = !!bannerImage;

    return (
        <div className="product-section">
            <div className="section-header">
                <Title level={4}>{title}</Title>
                <Button type="link" onClick={onViewAll}>
                    Xem tất cả
                </Button>
            </div>

            <Row gutter={[16, 16]}>
                {hasBanner && (
                    <Col xs={24} md={6}>
                        <div className="banner-box">
                        <img src={bannerImage} alt="banner" />
                        </div>
                    </Col>
                )}

                <Col xs={24} md={hasBanner ? 18 : 24}>
                    <ProductGrid products={products} />
                </Col>
            </Row>
        </div>
    );
};

export default ProductSection;
