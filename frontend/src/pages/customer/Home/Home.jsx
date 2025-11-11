import React, { useEffect, useState } from 'react'
import CategoryListing from '../../../components/Category/CategoryListing'
import ProductSection from '../../../components/Product/ProductSection'
import { setProducts } from '../../../redux/actions/productAction.js'
import { useDispatch, useSelector } from 'react-redux'
import { get } from '../../../utils/request'

const Home = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const allProducts = useSelector(state => state.allProducts.products)

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true)
        const data = await get('/products')

        dispatch(setProducts(data.data.products))
        setError(null)
      } catch(error) {
          console.error("Lỗi khi tải sản phẩm:", error);
          setError("Không thể tải dữ liệu sản phẩm.");
      } finally {
        setIsLoading(false)
      }
    }
    getProducts()
  },[])


  return (
    <div>
      <CategoryListing/>
      <ProductSection
        title='test'
        products={allProducts}
      />
      <ProductSection
        title='đề xuất đây nên là sản phẩm bán chạy trong tuần/tháng'
        products={allProducts}
      />
      <ProductSection
        title='đề xuất đây nên là sản phẩm gợi ý cho người dùng'
        products={allProducts}
      />
    </div>
  )
}

export default Home