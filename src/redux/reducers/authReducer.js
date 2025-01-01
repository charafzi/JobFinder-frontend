const initialState = {
    isLoading: false,
    isLoggedIn: false,
    error: null,
    token: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_REQUEST':
            return { ...state, isLoading: true, error: null };
        case 'LOGIN_SUCCESS':
            return { ...state, isLoading: false, isLoggedIn: true, token: action.payload.token};
        case 'LOGIN_FAILURE':
            return { ...state, isLoading: false, isLoggedIn: false, error: action.payload};
        default:
            return state;
    }
};

export default authReducer;