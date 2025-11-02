import {combineReducers} from "redux";
import loginReducer from "./login";
import { categoryReducer } from "./categoryReducer";
import { productReducer } from "./productReducer";

const allReducers = combineReducers({
    loginReducer,
    allCategories: categoryReducer,
    allProducts: productReducer
});

export default allReducers;