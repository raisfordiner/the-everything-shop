import React from "react"
import { Button, Divider, Rate, Typography } from "antd"
import { ShoppingCartOutlined } from "@ant-design/icons"
import VariantSelector from "../VariantSelector/VariantSelector"
import QuantitySelector from "../QuantitySelector/QuantitySelector"
import ActionButtons from "../ActionButtons/ActionButtons"
import './ProductInfo.css'

const { Title, Text } = Typography

const ProductInfo = ({
    productData,
    selectedProductVariant,
    selectedAttributes,
    setSelectedAttributes,
    amount,
    setAmount
}) => {
    const basePrice = productData.price || 0
    const adjustment = selectedProductVariant?.priceAdjustment || 0
    const finalPrice = basePrice + adjustment
    const discount = productData.promotions?.[0]?.status === "ACTIVE" ? 20 : 0
    const salePrice = finalPrice * (1 - discount / 100)

    return (
        <div className="product-detail__info">
            <Title level={3} className="info__name">
                {productData.name}
            </Title>

            <div className="info__meta">
                <div className="meta__rating">
                    <Rate allowHalf disabled value={2.8} />
                    <Text type="secondary">(2.8/5)</Text>
                </div>
                <Divider type="vertical" />
                <Text type="secondary">128 đánh giá</Text>
                <Divider type="vertical" />
                <Text type="secondary">Đã bán 512</Text>
            </div>

            <div className="info__price">
                <Text className="price--sale">{salePrice.toLocaleString()}₫</Text>
                {discount > 0 && (
                    <>
                        <Text className="price--original">{finalPrice.toLocaleString()}₫</Text>
                        <span className="price--discount">-{discount}%</span>
                    </>
                )}
            </div>

            {productData.promotions?.length > 0 && (
                <div className="info__vouchers">
                    <Text strong>Voucher của Shop:</Text>
                    <div className="voucher-list">
                        {productData.promotions.map((promo) => (
                            <div key={promo.id} className="voucher">{promo.name}</div>
                        ))}
                    </div>
                </div>
            )}

            {productData.variantTypes?.length > 0 && (
                <VariantSelector
                    variantTypes={productData.variantTypes}
                    variantOptions={productData.variantOptions}
                    productVariants={productData.productVariants}
                    selectedAttributes={selectedAttributes}
                    setSelectedAttributes={setSelectedAttributes}
                />
            )}

            <QuantitySelector amount={amount} setAmount={setAmount} />

            <ActionButtons />
        </div>
    )
}

export default ProductInfo
