import React from "react";
import { Row, Col } from "antd";
import ProductCard from "./ProductCard";
import { Link } from "react-router"; // Note: 'react-router-dom' is commonly used for web

const ProductGrid = ({ products, from=0, end=products.length }) => {
    return (
        <Row gutter={[8, 8]}>
            {products.slice(from, end).map((p) => (
                <Col 
                    key={p.id} 
                    xs={12}
                    sm={12}
                    md={8}
                    lg={6}
                    xl={{ flex: '20%' }}
                    xxl={4}
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