import { useEffect, useState } from "react"
import { useParams } from 'react-router'
import productService from '../../services/productService.js'
import { Tabs, Typography } from "antd"
import ProductGallery from "./MainSection/ProductGallery/ProductGallery.jsx"
import ProductInfo from "./MainSection/ProductInfo/ProductInfo.jsx"
import "./ProductDetail.css"
import ProductDescriptionTemplate from "./SubSection/ProductDescriptionTemplate/ProductDescriptionTemplate"

const { Title } = Typography

const tabItems = [
    { key: '1', label: 'Description', children: <ProductDescriptionTemplate/> },
    { key: '2', label: 'Reviews', children: <p>Nothing here yet</p>}
]

const ProductDetail = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [productData, setProductData] = useState(null)
    const { productId } = useParams()
    const [selectedProductVariant, setSelectedProductVariant] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedAttributes, setSelectedAttributes] = useState({})
    const [amount, setAmount] = useState(1)

    // --- Load sản phẩm ---
    useEffect(() => {
        setIsLoading(true)
        const fetchProductData = async () => {
            try {
                // const data = await get(`/products/${productId}`)
                const data = await productService.getProductById(productId)
                setProductData(data.data)

                const defaultVariant = data.productVariants?.[0] || null
                setSelectedProductVariant(defaultVariant)
                setSelectedImage(defaultVariant?.images?.[0] || data.images?.[0] || null)
                setSelectedAttributes(defaultVariant?.variantAttributes || {})
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu sản phẩm:", error)
                setProductData(null)
            } finally {
                setIsLoading(false)
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

    if (isLoading) return <div>Loading...</div>
    if (!productData) return <div>No product was found</div>

    return (
        <div className="product-detail">
            <div className="main">
                <ProductGallery
                    images={selectedProductVariant?.images || productData.images}
                    selectedImage={selectedImage}
                    onSelectImage={setSelectedImage}
                />

                <ProductInfo
                    productData={productData}
                    selectedProductVariant={selectedProductVariant}
                    selectedAttributes={selectedAttributes}
                    setSelectedAttributes={setSelectedAttributes}
                    amount={amount}
                    setAmount={setAmount}
                />
            </div>
            <div className="sub">
                <Tabs items={tabItems} style={{padding: '0 20px'}}/>
            </div>
        </div>
    )
}

export default ProductDetail
