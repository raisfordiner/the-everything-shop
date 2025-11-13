import { useEffect, useState } from "react"
import { useParams } from 'react-router'
import { Button, Divider, Rate, Typography } from "antd"
import { ShoppingCartOutlined } from "@ant-design/icons"
import { get } from '../../utils/request.js'
import "./ProductDetail.css"

const { Title, Text } = Typography

const ProductDetail = () => {
    const findMatchingKey = (variantOptions, type) => {
         const lowerType = type.toLowerCase()
        const keys = Object.keys(variantOptions)

        // Ưu tiên match chính xác hoặc chứa type
        let key = keys.find(k => k.toLowerCase() === lowerType)
        if (!key) key = keys.find(k => k.toLowerCase().includes(lowerType))
        if (!key) {
            // thử các dạng plural phổ biến
            
            const pluralCandidates = [
                lowerType + "s",
                lowerType + "es",
                lowerType.replace(/y$/, "ies")
            ]
            key = keys.find(k =>
                pluralCandidates.some(p => k.toLowerCase() === p)
            )
        }
        return key
    }
    
    const [isLoading, setIsLoading] = useState(true)
    const [productData, setProductData] = useState(null)
    const { productId } = useParams()
    const [selectedProductVariant, setSelectedProductVariant] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedAttributes, setSelectedAttributes] = useState({})
    const [amount, setAmount] = useState(1)

    useEffect(() => {
        setIsLoading(true)
        console.log("Product ID từ URL:", productId);
        const fetchProductData = async () => {
            try {
                const data = await get(`/products/${productId}`)
                setProductData(data.data)

                const defaultVariant = data.productVariants?.[0] || null
                setSelectedProductVariant(defaultVariant)
                setSelectedImage(defaultVariant?.images?.[0] || data.images?.[0] || null)
                setSelectedAttributes(defaultVariant?.variantAttributes || {})
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
                setProductData(null);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProductData()
    }, [productId])

    useEffect(() => {
        if (!productData || !selectedAttributes) return

        const matchedVariant = productData.productVariants?.find((v) =>
            Object.entries(selectedAttributes).every(
                ([key, val]) => v.variantAttributes[key.toLowerCase()] === val
            )
        )

        setSelectedProductVariant(matchedVariant || null)
        setSelectedImage(
            matchedVariant?.images?.[0] || productData.images?.[0] || null
        )
    }, [selectedAttributes, productData])

    if (isLoading) return <div>Loading....</div>;
    if (!productData) return <div>No product was found</div>;

    const basePrice = productData.price || 0
    const adjustment = selectedProductVariant?.priceAdjustment || 0
    const finalPrice = basePrice + adjustment

    const discount = productData.promotions?.[0]?.status === "ACTIVE" ? 20 : 0

    const salePrice = finalPrice * (1 - discount / 100)

    return (
        <div className="product-detail">
            <div className="product-detail__gallery">
                <div className="gallery__main">
                    <img src={selectedImage} alt="product" />
                </div>
                <div className="gallery__thumbnails">
                    {(selectedProductVariant?.images || productData.images || []).map((image) => (
                        <div
                            key={image}
                            className={`thumbnail ${
                                selectedImage === image ? "thumbnail--active" : ""
                            }`}
                            onClick={() => setSelectedImage(image)}
                        >
                            <img src={image} alt="thumbnail" />
                        </div>
                    ))}
                </div>
            </div>

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

                {/* <div className="info__vouchers">
                    <Text strong>Voucher của Shop:</Text>
                    <div className="voucher-list">
                        <div className="voucher">VC1</div>
                        <div className="voucher">VC2</div>
                        <div className="voucher">VC3</div>
                    </div>
                </div> */}

                {productData.promotions?.length > 0 && (
                    <div className="info__vouchers">
                        <Text strong>Voucher của Shop:</Text>
                        <div className="voucher-list">
                            {productData.promotions.map((promo) => (
                                <div key={promo.id} className="voucher">
                                {promo.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {productData.variantTypes && productData.variantTypes.length > 0 && (
                    <div className="info__variants">
                        {productData.variantTypes.map((type) => {
                            const optionsKey = findMatchingKey(productData.variantOptions, type)
                            if (!optionsKey) return null

                            const options = productData.variantOptions[optionsKey]
                            // const displayName = variantDisplayNames[type] || type
                            const displayName = type

                            return (
                                <div key={type} className="variant-group">
                                    <Text strong>{displayName}:</Text>
                                    <div className="variant-options">
                                        {options.map((option) => {
                                            const isValid = productData.productVariants.some((v) => (
                                                Object.entries(selectedAttributes).every(
                                                    ([attrKey, attrValue]) => v.variantAttributes[attrKey.toLowerCase()] === attrValue) 
                                                    && 
                                                    v.variantAttributes[type.toLowerCase()] === option
                                            ))

                                            const isSelected = selectedAttributes[type.toLowerCase()] === option

                                            return (
                                                <Button
                                                    key={option}
                                                    type={isSelected ? "primary" : "default"}
                                                    disabled={!isValid}
                                                    onClick={() => {
                                                        setSelectedAttributes((prev) => {
                                                            const key = type.toLowerCase()

                                                            if (prev[key] === option) {
                                                                const updated = { ...prev }
                                                                delete updated[key]
                                                                return updated
                                                            }

                                                            return {
                                                                ...prev,
                                                                [key]: option,
                                                            }
                                                        })
                                                    }}

                                                    className="variant-option"
                                                >{option}</Button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                <div className="info__quantity">
                    <Button 
                        shape="circle" 
                        onClick={() => setAmount(prev => prev-1)}
                        disabled={amount == 1}
                    >-</Button>
                    <div className="quantity__value">{amount}</div>
                    <Button shape="circle" onClick={() => setAmount(prev => prev+1)}>+</Button>
                </div>

                <div className="info__actions">
                    <Button
                        icon={<ShoppingCartOutlined />}
                        type="default"
                        size="large"
                        className="action__add-cart"
                    >
                        Thêm vào giỏ
                    </Button>
                    <Button type="primary" size="large" className="action__buy-now">
                        Mua ngay
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail
