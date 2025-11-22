import { useEffect, useState } from "react"
import { useParams } from 'react-router'
import productService from '../../../services/productService.js'
import { Typography } from "antd"
import ProductGallery from "../ProductGallery/ProductGallery"
import ProductInfo from "../ProductInfo/ProductInfo"
import "./ProductDetail.css"

const { Title } = Typography

// const data = {
//   "ok": true,
//   "message": "Product fetched successfully",
//   "data": {
//     "id": "cmhxbweiw000ro83wf3t4icif",
//     "name": "Smartphone X",
//     "description": "5G smartphone with 128GB storage",
//     "stockQuantity": 50,
//     "images": [
//       "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/341837/tecno-spark-go-2-xanh-thumb-638899027806878098-600x600.jpg",
//       "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/341837/tecno-spark-go-2-black-4-638925101014228510-750x500.jpg"
//     ],
//     "createdBy": "cmhxbwehf0008o83wzutv1thl",
//     "price": 899.99,
//     "categoryId": "cmhxbweie000lo83w1edbfqsh",
//     "variantTypes": [
//       "COLOR",
//       "SIZE"
//     ],
//     "variantOptions": {
//       "sizes": [
//         "64GB",
//         "128GB",
//         "256GB"
//       ],
//       "colors": [
//         "Black",
//         "Silver",
//         "Gold"
//       ]
//     },
//     "is_deleted": false,
//     "createdAt": "2025-11-13T11:11:21.224Z",
//     "updatedAt": "2025-11-13T11:11:21.224Z",
//     "category": {
//       "id": "cmhxbweie000lo83w1edbfqsh",
//       "name": "Electronics",
//       "description": "Electronic devices and gadgets",
//       "createdAt": "2025-11-13T11:11:21.206Z",
//       "updatedAt": "2025-11-13T11:11:21.206Z"
//     },
//     "seller": {
//       "id": "cmhxbwehf0008o83wzutv1thl",
//       "user": {
//         "username": "Seller One",
//         "email": "seller1@example.com"
//       }
//     },
//     "productVariants": [
//       {
//         "id": "cmhxbweja0011o83wuy5yl5k7",
//         "quantity": 30,
//         "variantAttributes": {
//           "size": "128GB",
//           "color": "Black"
//         },
//         "productId": "cmhxbweiw000ro83wf3t4icif",
//         "images": [
//           "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/341837/tecno-spark-go-2-black-1-638925101036906076-750x500.jpg"
//         ],
//         "priceAdjustment": 0,
//         "createdAt": "2025-11-13T11:11:21.239Z",
//         "updatedAt": "2025-11-13T11:11:21.239Z",
//         "cartItems": [
//           {
//             "id": "cmhxbwejt001do83wk5h1k6cm",
//             "customerId": "cmhxbwehz000eo83wzvgde74c",
//             "cartId": "cmhxbwejm0019o83wmaxphjot",
//             "productVariantId": "cmhxbweja0011o83wuy5yl5k7",
//             "quantity": 1,
//             "createdAt": "2025-11-13T11:11:21.257Z",
//             "updatedAt": "2025-11-13T11:11:21.257Z"
//           }
//         ],
//         "orderItems": [
//           {
//             "id": "cmhxbwekd001no83wwmwx5an8",
//             "orderId": "cmhxbwek1001ho83w0n3006mj",
//             "productVariantId": "cmhxbweja0011o83wuy5yl5k7",
//             "quantity": 1,
//             "createdAt": "2025-11-13T11:11:21.277Z",
//             "updatedAt": "2025-11-13T11:11:21.277Z"
//           }
//         ]
//       },
//       {
//         "id": "cmhxbwejd0013o83wti9ve9gd",
//         "quantity": 25,
//         "variantAttributes": {
//           "size": "256GB",
//           "color": "Silver"
//         },
//         "productId": "cmhxbweiw000ro83wf3t4icif",
//         "images": [
//           "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/341837/tecno-spark-go-2-xam-1-638925124442876676-750x500.jpg"
//         ],
//         "priceAdjustment": 49.99,
//         "createdAt": "2025-11-13T11:11:21.241Z",
//         "updatedAt": "2025-11-13T11:11:21.241Z",
//         "cartItems": [],
//         "orderItems": []
//       }
//     ],
//     "promotions": [
//       {
//         "id": "cmhxbweky001xo83w65u44kou",
//         "name": "Summer Sale 2024",
//         "description": "20% off on electronics",
//         "startDate": "2024-06-01T00:00:00.000Z",
//         "endDate": "2024-08-31T00:00:00.000Z",
//         "createdBy": "cmhxbweh50006o83wzmt1icpf",
//         "status": "ACTIVE",
//         "createdAt": "2025-11-13T11:11:21.298Z",
//         "updatedAt": "2025-11-13T11:11:21.298Z"
//       }
//     ]
//   }
// }

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
    )
}

export default ProductDetail
