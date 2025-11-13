import { ProductActionTypes } from "../constants/product-action-types"

const initialState = {
    products: [],
    selectedProduct: {}
}

export const productReducer = (state = initialState, {type, payload}) => {
    switch(type) {
        case ProductActionTypes.SET_PRODUCTS:
            return {
                ...state,
                products: payload
            }
        case ProductActionTypes.SELECTED_PRODUCT:
            return {
                ...state,
                selectedProduct: payload
            }
        default:
            return state
    }
}