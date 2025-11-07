import React from 'react'
import CategoryListing from '../../../components/Category/CategoryListing'
import { productSample } from '../../../components/Product/productSample'
import ProductSection from '../../../components/Product/ProductSection'

const Home = () => {
  return (
    <div>
      <CategoryListing/>
      <ProductSection
        title='test'
        products={productSample.suggested}
      />
      <ProductSection
        title="Flash Sale"
        products={productSample.flashSale}
        bannerImage="https://cdn.tgdd.vn/2024/08/banner/flashsale-800x400.jpg"
      />
      <ProductSection
        title="Sản phẩm nổi bật"
        products={productSample.trending}
      />
    </div>
  )
}

export default Home