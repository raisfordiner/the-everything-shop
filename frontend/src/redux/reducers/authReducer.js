import {AuthActionTypes} from "../constants/auth-action-types.js";

const initialState = {
    isAuthenticated: false,
    user: {}
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case AuthActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload
            }
        case AuthActionTypes.LOGOUT:
            return {
                ...initialState,
            }
        default:
            return state;
    }
}

export default authReducer;