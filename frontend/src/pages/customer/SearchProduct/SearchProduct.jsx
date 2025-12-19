import React from 'react'
import { useSearchParams } from 'react-router'
import { useEffect } from 'react'
import productService from '../../../services/productService'
import ProductGrid from '../../../components/Product/ProductGrid'
import { Flex, Typography, Pagination } from 'antd'
import { FrownOutlined } from '@ant-design/icons'

const SearchProduct = () => {
    const [searchParam] = useSearchParams();
    const key = searchParam.get('key');
    const [productsByName, setProductsByName] = React.useState([])
    const [currentPage, setCurrentPage] = React.useState(1)

    const fetchAllProductsByName = async () => {
        const products = await productService.getAllProducts(key)
        setProductsByName(products.data.products)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    useEffect(() => {
        fetchAllProductsByName()
    }, [key])

    return (
        <div>
            {productsByName.length === 0 ? <NoProductsFound /> : <ProductsFound products={productsByName} currentPage={currentPage} handlePageChange={handlePageChange} />}
        </div>
    )
}

export default SearchProduct

const NoProductsFound = () => {
    return (
        <Flex vertical justify='center' align='center'>
            <FrownOutlined style={{color: 'red', fontSize: '24px'}}/>
            <Typography.Title level={3} style={{margin: '16px 0'}}>Sorry no results were found matching the keyword</Typography.Title>
            <Typography.Paragraph>
                <Typography.Text strong>Please try different keywords or remove filters to broaden your search</Typography.Text>
                <ul>
                    <li>Check your spelling</li>
                    <li>Try different or more general keywords</li>
                    <li>Try fewer keywords</li>
                </ul>
            </Typography.Paragraph>
        </Flex>
    )
}

const ProductsFound = ({ products, currentPage, handlePageChange }) => {
    return (
        <>
            <ProductGrid products={products} from={(currentPage - 1) * 24} end={currentPage * 24} />
            <Pagination 
                style={{marginTop: '16px'}} 
                current={currentPage} 
                total={products.length} 
                pageSize={24} 
                onChange={handlePageChange} />
        </>
    )
}