import {combineReducers} from "redux";
import AuthReducer from "./reducers/authReducer";

const rootReducer = combineReducers({
    auth : AuthReducer,
})

export default rootReducer;