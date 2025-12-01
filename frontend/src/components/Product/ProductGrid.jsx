import React from "react";
import { Row, Col } from "antd";
import ProductCard from "./ProductCard";
import { Link } from "react-router"; // Lưu ý: 'react-router-dom' thường được sử dụng cho web

const ProductGrid = ({ products }) => {
    return (
        <Row gutter={[16, 16]}>
            {products.slice(0, 8).map((p) => (
                <Col 
                    key={p.id} // Đặt key ở đây là tốt nhất
                    xs={12}
                    sm={8}
                    md={6}
                    lg={4}
                    xl={4}
                    xxl={3}
                    style={{ height: "100%" }} 
                >
                    <Link 
                        to={`/products/${p.id}`} 
                        className="product-link" 
                    >
                        <ProductCard product={p} />
                    </Link>
                </Col>
            ))}
        </Row>
    );
};

export default ProductGrid;