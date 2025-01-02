import axiosInstance, {API_BASE_URL} from "../../config/axiosConfig";

export const CHECKEMAIL_REQUEST = "CHECKEMAIL_REQUEST";
export const CHECKEMAIL_SUCCESS = "CHECKEMAIL_SUCCESS";
export const CHECKEMAIL_FAILURE = "CHECKEMAIL_FAILURE";

export const checkEmail = ({email, otp}) =>{
    return async (dispatch)=>{
        dispatch({type : CHECKEMAIL_REQUEST});
        const apiURL = API_BASE_URL + "/api/auth/validate-otp?email="+email+"&otp="+otp;
        await axiosInstance.get(apiURL)
            .then((response)=>{
                dispatch({type : CHECKEMAIL_SUCCESS});
            })
            .catch((error)=>{
                dispatch({type : CHECKEMAIL_FAILURE, payload : 'OTP is incorrect or expired.'});
            });
    }
}