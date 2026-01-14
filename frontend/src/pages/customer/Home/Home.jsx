import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import CategoryListing from '../../../components/Category/CategoryListing'
import ProductSection from '../../../components/Product/ProductSection'
import PromotionFlag from '../../../components/PromotionFlag/PromotionFlag'
import { setProducts } from '../../../redux/actions/productAction.js'
import { useDispatch, useSelector } from 'react-redux'
import { get } from '../../../utils/request'

const Home = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [topSelling, setTopSelling] = useState([])
  const [topRated, setTopRated] = useState([])

  const allProducts = useSelector(state => state.allProducts.products)
  const allCategories = useSelector(state => state.allCategories.categories)
  const user = useSelector(state => state.authReducer.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin/dashboard')
    } else if (user?.role === 'SELLER') {
      navigate('/seller/products')
    }
  }, [user, navigate])

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true)
        const data = await get('/products')

        dispatch(setProducts(data.data.products))
        setError(null)
      } catch (error) {
        console.error("Error loading products:", error);
        setError("Unable to load product data.");
      } finally {
        setIsLoading(false)
      }
    }
    getProducts()
  }, [])

  // Calculate Top Selling and Top Rated when products load
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      // Top Selling: sort by sold count (descending)
      const sortedBySold = [...allProducts]
        .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
        .slice(0, 6)
      setTopSelling(sortedBySold)

      // Top Rated: use backend provided averageRating
      const sortedByRating = [...allProducts]
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0))
        .slice(0, 6)
      setTopRated(sortedByRating)
    }
  }, [allProducts])

  return (
    <div>
      <PromotionFlag />
      <CategoryListing />

      {/* Top Selling Section */}
      {topSelling.length > 0 && (
        <ProductSection
          title="Top Selling"
          products={topSelling}
        />
      )}

      {/* Top Rated Section */}
      {topRated.length > 0 && (
        <ProductSection
          title="Top Rated"
          products={topRated}
        />
      )}

      {/* Category Sections */}
      {allCategories.slice(0, 3).map(category => (
        <ProductSection
          key={category.id}
          title={`Top ${category.name}`}
          products={allProducts.filter(p => p.categoryId === category.id)}
          categoryId={category.id}
        />
      ))}
    </div>
  )
}

export default Home