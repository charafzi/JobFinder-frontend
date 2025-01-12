import axiosInstance, { API_BASE_URL } from "../../config/axiosConfig";

export const RESETPASSWORD_REQUEST = "RESETPASSWORD_REQUEST";
export const RESETPASSWORD_SUCCESS = "RESETPASSWORD_SUCCESS";
export const RESETPASSWORD_FAILURE = "RESETPASSWORD_FAILURE";

export const resetPassword = ({ email, newPassword }) => {
  return async (dispatch) => {
    dispatch({ type: RESETPASSWORD_REQUEST });
    const apiURL = API_BASE_URL + "/api/auth/resetPassword";
    console.log(email);
    console.log(newPassword);
    await axiosInstance
      .post(apiURL, { email: email, newPassword: newPassword })
      .then(() => {
        dispatch({ type: RESETPASSWORD_SUCCESS });
      })
      .catch((error) => {
        let errorMessage = "";
        switch (error.response.status) {
          case 400:
            errorMessage =
              "The new password cannot be the same as the old password.";
            break;
          case 404:
            errorMessage = "Email does not exist.";
            break;
          default:
            errorMessage = "Internal server error. Please try again later.";
        }
        dispatch({ type: RESETPASSWORD_FAILURE, payload: errorMessage });
      });
  };
};
