import { Image } from "antd"
import SpecificationDescription from "../SpecificationDescription/SpecificationDescription"

const ProductDescriptionTemplate = () => {
    return (
        <div className="product-description-template">
            <Image 
                src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/Kit/iphone-17-pro-max-note-638947387842468805.jpg"
                preview={false}
            />
            <div className="product-specifications">
                <SpecificationDescription/>
            </div>
        </div>
    )
}

export default ProductDescriptionTemplate