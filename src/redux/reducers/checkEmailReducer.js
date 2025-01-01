const initialState = {
    isLoading: false,
    otpIsValid: false,
    error: null
};

const checkEmailReducer = (state = initialState, action ) =>{
    switch (action.type) {
        case 'CHECKEMAIL_REQUEST':
            return { ...state, isLoading: true, error: null };
        case 'CHECKEMAIL_SUCCESS':
            return { ...state, isLoading: false, otpIsValid: true};
        case 'CHECKEMAIL_FAILURE':
            return { ...state, isLoading: false, otpIsValid: false, error: action.payload};
        default:
            return state;
    }
}

export default checkEmailReducer;