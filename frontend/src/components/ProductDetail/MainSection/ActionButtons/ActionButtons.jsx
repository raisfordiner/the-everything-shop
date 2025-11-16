import React from "react"
import { Button } from "antd"
import { ShoppingCartOutlined } from "@ant-design/icons"
import './ActionButtons.css'

const ActionButtons = () => (
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
)

export default ActionButtons
