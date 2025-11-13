import { useDispatch, useSelector } from 'react-redux'
import { get } from '../../utils/request'
import { setCategories } from '../../redux/actions/categoryAction'
import CategoryList from './CategoryList'
import { useEffect } from 'react'

const CategoryListing = () => {
    const dispatch = useDispatch();

    // const path = 'https://fakestoreapi.com/products/categories'
    // const path = 'https://api.escuelajs.co/api/v1/categories'

<<<<<<< HEAD
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await get('/categories')
                dispatch(setCategories(categories))
            }
            catch(error) {
                console.error(error)
            }
        }
        fetchCategories()
    }, [])
=======
    // useEffect(() => {
    //     const fetchCategories = async () => {
    //         try {
    //             const categories = await get('/categories')
    //             dispatch(setCategories(categories))
    //         }
    //         catch(error) {
    //             console.error(error)
    //         }
    //     }
    //     fetchCategories()
    // }, [])
>>>>>>> ee8b7d9 (add product detail)

    return (
        <>
            <CategoryList/>
            tạm thời chưa có gì ở đây
        </>
    )
}

export default CategoryListing