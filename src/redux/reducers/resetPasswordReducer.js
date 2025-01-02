const initialState = {
  isLoading: false,
  passwordChanged: false,
  error: null,
};

const resetPasswordReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RESETPASSWORD_REQUEST":
      return { ...state, isLoading: true, error: null };
    case "RESETPASSWORD_SUCCESS":
      return { ...state, isLoading: false, passwordChanged: true };
    case "RESETPASSWORD_FAILURE":
      return {
        ...state,
        isLoading: false,
        passwordChanged: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default resetPasswordReducer;
