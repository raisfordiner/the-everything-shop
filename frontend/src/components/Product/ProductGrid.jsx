import React, { useEffect, useRef } from "react";
import { Row, Col } from "antd";
import ProductCard from "./ProductCard";
<<<<<<< HEAD
import { Link } from "react-router"; // Lưu ý: 'react-router-dom' thường được sử dụng cho web
=======
import { useDispatch, useSelector } from 'react-redux'
import { Link } from "react-router";
import { selectedProduct } from "../../redux/actions/productAction";
>>>>>>> ee8b7d9 (add product detail)

const ProductGrid = ({ products }) => {
    return (
        <Row gutter={[16, 16]}>
            {products.slice(0, 8).map((p) => (
                <Col 
<<<<<<< HEAD
                    key={p.id} // Đặt key ở đây là tốt nhất
=======
                    key={p.id}
>>>>>>> ee8b7d9 (add product detail)
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
<<<<<<< HEAD
                        className="product-link" 
=======
                        className="product-link"
>>>>>>> ee8b7d9 (add product detail)
                    >
                        <ProductCard product={p} />
                    </Link>
                </Col>
            ))}
        </Row>
    );
};

export default ProductGrid;