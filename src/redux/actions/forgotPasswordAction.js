import axiosInstance, {API_BASE_URL} from "../../config/axiosConfig";

export const FORGOTPASSWORD_REQUEST = "FORGOTPASSWORD_REQUEST";
export const FORGOTPASSWORD_SUCCESS = "FORGOTPASSWORD_SUCCESS";
export const FORGOTPASSWORD_FAILURE = "FORGOTPASSWORD_FAILURE";

export const forgotPassword = (email) =>{
    return async (dispatch)=>{
        dispatch({type : FORGOTPASSWORD_REQUEST});
        const apiURL = API_BASE_URL + "/api/auth/send-otp?email="+email;
        await axiosInstance.get(apiURL)
            .then((response)=>{
                dispatch({type : FORGOTPASSWORD_SUCCESS});
            })
            .catch((error)=>{
                let errorMessage = '';
                if(error.response){
                    if(error.response.status===404){
                        errorMessage = "No user registered with this email.";
                    }else{
                        errorMessage = "Error at server. Please try again.";
                    }
                }
                dispatch({type : FORGOTPASSWORD_FAILURE, payload : errorMessage});
            });
    }
}