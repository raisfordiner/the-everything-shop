import React from "react";
import { Row, Col } from "antd";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {
    return (
        <Row gutter={[16, 16]}>
            {products.slice(0, 8).map((p) => (
            <Col 
                key={p.id}
                xs={12}
                sm={8}
                md={6}
                lg={4}
                xl={4}
                xxl={3}
                style={{ height: "100%" }}
            >
                <ProductCard product={p} />
            </Col>
        ))}
        </Row>
    );
};

export default ProductGrid;
