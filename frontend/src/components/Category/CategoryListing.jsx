import { useDispatch, useSelector } from 'react-redux'
import { get } from '../../utils/request'
import { setCategories } from '../../redux/actions/categoryAction'
import CategoryList from './CategoryList'
import { useEffect } from 'react'

const CategoryListing = () => {
    const dispatch = useDispatch();

    // const path = 'https://fakestoreapi.com/products/categories'
    const path = 'https://api.escuelajs.co/api/v1/categories'
        
    const fetchCategories = async () => {
        try {
            const categories = await get(path)
            dispatch(setCategories(categories))
        }
        catch(error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    return (
        <>
            <CategoryList/>
        </>
    )
}

export default CategoryListing