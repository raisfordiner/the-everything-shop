import { ProductActionTypes } from '../constants/product-action-types'

export const setProducts = products => {
    return {
        type: ProductActionTypes.SET_PRODUCTS,
        payload: products
    }
}

export const selectedProduct = product => {
    return {
        type: ProductActionTypes.SELECTED_PRODUCT,
        payload: product
    }
}