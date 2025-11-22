import React from "react"
import './ProductGallery.css'

const ProductGallery = ({ images = [], selectedImage, onSelectImage }) => {
    return (
        <div className="product-detail__gallery">
            <div className="gallery__main">
                <img src={selectedImage} alt="product" />
            </div>
            <div className="gallery__thumbnails">
                {images.map((image) => (
                    <div
                        key={image}
                        className={`thumbnail ${
                            selectedImage === image ? "thumbnail--active" : ""
                        }`}
                        onClick={() => onSelectImage(image)}
                    >
                        <img src={image} alt="thumbnail" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductGallery
