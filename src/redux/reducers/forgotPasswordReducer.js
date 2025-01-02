const initialState = {
  isLoading: false,
  mailIsSent: false,
  error: null,
};

const forgotPasswordReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FORGOTPASSWORD_REQUEST":
      return { ...state, isLoading: true, error: null };
    case "FORGOTPASSWORD_SUCCESS":
      return { ...state, isLoading: false, mailIsSent: true };
    case "FORGOTPASSWORD_FAILURE":
      return {
        ...state,
        isLoading: false,
        mailIsSent: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default forgotPasswordReducer;
