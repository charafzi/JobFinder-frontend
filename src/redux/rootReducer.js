import { combineReducers } from "redux";
import AuthReducer from "./reducers/authReducer";
import forgotPasswordReducer from "./reducers/forgotPasswordReducer";
import checkEmailReducer from "./reducers/checkEmailReducer";
import resetPasswordReducer from "./reducers/resetPasswordReducer";

const rootReducer = combineReducers({
  auth: AuthReducer,
  forgotPassword: forgotPasswordReducer,
  checkEmail: checkEmailReducer,
  resetPassword: resetPasswordReducer,
});

export default rootReducer;
