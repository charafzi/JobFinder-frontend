import {combineReducers} from "redux";
import AuthReducer from "./reducers/authReducer";
import forgotPasswordReducer from "./reducers/forgotPasswordReducer";

const rootReducer = combineReducers({
    auth : AuthReducer,
    forgotPassword : forgotPasswordReducer
})

export default rootReducer;