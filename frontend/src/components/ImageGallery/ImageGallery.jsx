import { useState } from "react"
import './ImageGallery.css'

const ImageGallery = ({images, width='100%'}) => {
    const [selectedImage, setSelectedImage] = useState(images[0])

    return (
        <div className="product-detail__gallery" style={{width: width}}>
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
                        onClick={() => setSelectedImage(image)}
                    >
                        <img src={image} alt="thumbnail" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ImageGallery