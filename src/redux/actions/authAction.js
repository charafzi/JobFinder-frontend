import axiosInstance, {API_BASE_URL} from "../../config/axiosConfig";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const login = ({email, password}) =>{
    return async (dispatch)=>{
        dispatch({type : LOGIN_REQUEST});
        const apiURL = API_BASE_URL + "/api/auth/login";
        await axiosInstance.post(apiURL,{email: email, password : password})
            .then((response)=>{
                dispatch({type : LOGIN_SUCCESS, payload : response.data});

            })
            .catch((error)=>{
                let errorMessage = '';
                switch (error.response.status){
                    case 404:
                        errorMessage = 'No account registered with this email. Try to sign up.';
                        break;
                    case 401:
                        errorMessage = 'Password is incorrect.';
                        break;
                    default:
                        errorMessage = 'Unable to connect to the server. Please check your internet connection.'
                }
                dispatch({type : LOGIN_FAILURE, payload : errorMessage})
            })
    };
}

