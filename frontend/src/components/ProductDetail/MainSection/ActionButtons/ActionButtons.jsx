import React, { useState } from "react"
import { Button, message, notification, Modal, Select } from "antd"
import { ShoppingCartOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import cartService from "../../../../services/cartService"
import orderService from "../../../../services/orderService"
import './ActionButtons.css'

const ActionButtons = ({ selectedProductVariant, amount, productData }) => {
    const [loading, setLoading] = useState(false)
    const [buyNowLoading, setBuyNowLoading] = useState(false)
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const { isAuthenticated, user } = useSelector(state => state.authReducer || { isAuthenticated: false, user: {} })
    const navigate = useNavigate()

    // Debug logging
    console.log("ActionButtons props:", { selectedProductVariant, amount, productData })
    console.log("selectedProductVariant:", selectedProductVariant)
    console.log("selectedProductVariant stockQuantity:", selectedProductVariant?.stockQuantity)

    // If product doesn't have variants, treat the product itself as the variant
    const effectiveVariant = selectedProductVariant || productData
    const hasVariants = productData?.variantTypes?.length > 0
    console.log("hasVariants:", hasVariants)
    const isVariantRequired = hasVariants && !selectedProductVariant
    const isOutOfStock = effectiveVariant && effectiveVariant.stockQuantity <= 0

    console.log("effectiveVariant:", effectiveVariant)
    console.log("hasVariants:", hasVariants)
    console.log("isVariantRequired:", isVariantRequired)
    console.log("isOutOfStock:", isOutOfStock)

    const handleAddToCart = async () => {
        // Validation checks
        if (!isAuthenticated) {
            notification.warning({
                message: "Login Required",
                description: "Please login to add products to cart",
                placement: "topRight"
            })
            return
        }

        if (isVariantRequired) {
            notification.warning({
                message: "Variant Not Selected",
                description: "Please select a product variant before adding to cart",
                placement: "topRight"
            })
            return
        }

        if (amount <= 0) {
            notification.warning({
                message: "Invalid Quantity",
                description: "Quantity must be greater than 0",
                placement: "topRight"
            })
            return
        }

        // Check stock availability
        if (effectiveVariant.stockQuantity < amount) {
            notification.warning({
                message: "Insufficient Stock",
                description: `Only ${effectiveVariant.stockQuantity} items available in stock`,
                placement: "topRight"
            })
            return
        }

        try {
            setLoading(true)
            
            // Get or create cart for the user
            console.log("User from Redux:", user)
            console.log("User ID for cart creation:", user.id)
            console.log("Customer data:", user.customer)
            
            if (!user.customer) {
                throw new Error("Customer information not found")
            }
            
            const customerId = user.customer.id
            console.log("Customer ID for cart:", customerId)
            
            let cart = null
            try {
                const cartsResponse = await cartService.getCarts(customerId)
                console.log("Get carts response:", cartsResponse)
                if (cartsResponse && cartsResponse.data && cartsResponse.data.carts && cartsResponse.data.carts.length > 0) {
                    cart = cartsResponse.data.carts[0] // Get the first cart
                    console.log("Found existing cart:", cart)
                }
            } catch (error) {
                console.log("No existing cart found, will create new cart...")
            }

            // Create cart if it doesn't exist
            if (!cart) {
                try {
                    console.log("Creating cart for customer ID:", customerId)
                    const createCartResponse = await cartService.createCart(customerId)
                    console.log("Cart creation response:", createCartResponse)
                    cart = createCartResponse.cart
                } catch (createError) {
                    console.error("Cart creation error:", createError)
                    throw new Error("Cannot create cart: " + (createError.message || "Unknown error"))
                }
            }

            // Add item to cart
            const variantId = effectiveVariant.id || selectedProductVariant?.id
            await cartService.addCartItem(cart.id, variantId, amount)
            
            // Show success notification
            notification.success({
                message: "Added to Cart Successfully",
                description: `Added ${amount} ${productData.name} to cart`,
                placement: "topRight"
            })

        } catch (error) {
            console.error("Error adding to cart:", error)
            notification.error({
                message: "Error",
                description: error.message || "An error occurred while adding product to cart",
                placement: "topRight"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleBuyNow = () => {
        if (!isAuthenticated) {
            notification.warning({
                message: "Login Required",
                description: "Please login to purchase products",
                placement: "topRight"
            })
            return
        }
        
        if (isVariantRequired) {
            notification.warning({
                message: "Variant Not Selected",
                description: "Please select a product variant",
                placement: "topRight"
            })
            return
        }

        if (amount <= 0) {
            notification.warning({
                message: "Invalid Quantity",
                description: "Quantity must be greater than 0",
                placement: "topRight"
            })
            return
        }

        if (effectiveVariant.stockQuantity < amount) {
            notification.warning({
                message: "Insufficient Stock",
                description: `Only ${effectiveVariant.stockQuantity} items available in stock`,
                placement: "topRight"
            })
            return
        }

        // Check if user has addresses
        if (!user.customer?.addresses || user.customer.addresses.length === 0) {
            notification.warning({
                message: "No Address Found",
                description: "Please add a delivery address first",
                placement: "topRight"
            })
            return
        }

        // Show address selection modal
        setSelectedAddress(user.customer.addresses[0].id) // Pre-select first address
        setShowAddressModal(true)
    }

    const handleConfirmBuyNow = async () => {
        if (!selectedAddress) {
            notification.warning({
                message: "Address Not Selected",
                description: "Please select a delivery address",
                placement: "topRight"
            })
            return
        }

        try {
            setBuyNowLoading(true)
            const variantId = effectiveVariant.id || selectedProductVariant?.id

            const response = await orderService.createDirectOrder(selectedAddress, variantId, amount)
            
            notification.success({
                message: "Order Created Successfully",
                description: `Your order for ${amount} ${productData.name} has been placed`,
                placement: "topRight"
            })

            // Close modal and navigate to orders page
            setShowAddressModal(false)
            navigate('/orders/' + response.data.id)

        } catch (error) {
            console.error("Error creating order:", error)
            notification.error({
                message: "Error",
                description: error.message || "An error occurred while creating the order",
                placement: "topRight"
            })
        } finally {
            setBuyNowLoading(false)
        }
    }

    return (
        <>
            <div className="info__actions">
                <Button
                    icon={<ShoppingCartOutlined />}
                    type="default"
                    size="large"
                    className="action__add-cart"
                    onClick={handleAddToCart}
                    loading={loading}
                    disabled={isVariantRequired || isOutOfStock || loading}
                    title={
                        isVariantRequired 
                            ? "Please select a product variant"
                            : isOutOfStock
                            ? "Product out of stock"
                            : loading
                            ? "Processing..."
                            : "Add to cart"
                    }
                >
                    {isVariantRequired 
                        ? "Select Variant" 
                        : isOutOfStock 
                        ? "Out of Stock" 
                        : "Add to Cart"
                    }
                </Button>
                <Button 
                    type="primary" 
                    size="large" 
                    className="action__buy-now"
                    onClick={handleBuyNow}
                    disabled={isVariantRequired || isOutOfStock}
                    title={
                        isVariantRequired 
                            ? "Please select a product variant"
                            : isOutOfStock
                            ? "Product out of stock"
                            : "Buy now"
                    }
                >
                    {isVariantRequired 
                        ? "Select Variant" 
                        : isOutOfStock 
                        ? "Out of Stock" 
                        : "Buy Now"
                    }
                </Button>
            </div>

            <Modal
                title="Select Delivery Address"
                open={showAddressModal}
                onOk={handleConfirmBuyNow}
                onCancel={() => setShowAddressModal(false)}
                confirmLoading={buyNowLoading}
                okText="Confirm Order"
                cancelText="Cancel"
            >
                <div style={{ marginBottom: 16 }}>
                    <p>Select a delivery address for your order:</p>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Select address"
                        value={selectedAddress}
                        onChange={setSelectedAddress}
                    >
                        {user.customer?.addresses?.map(address => (
                            <Select.Option key={address.id} value={address.id}>
                                {address.phoneNumber}
                                {address.address}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                    <p style={{ margin: 0, fontWeight: 500 }}>Order Summary:</p>
                    <p style={{ margin: '8px 0 0 0' }}>
                        {productData.name} × {amount}
                    </p>
                </div>
            </Modal>
        </>
    )
}

export default ActionButtons
