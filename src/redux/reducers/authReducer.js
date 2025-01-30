const initialState = {
  isLoading: false,
  isLoggedIn: false,
  id : null,
  email: null,
  phoneNumber: null,
  candidat : {
    firstName: null,
    lastName: null,
    cvDocumentsId : [] // representing list of CV ids at backend
  },
  entreprise:{
    name: null,
    about: null,
    adress: {
      city: null,
      adress: null,
      longitude: null,
      latitude: null
    }
  },
  isCandidat : false,
  error: null,
  token: null,
  refreshToken: null,
  fcmToken : null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      if (action.payload.role === "CANDIDAT") {
        return {
          ...state,
          id: action.payload.id,
          email: action.payload.email,
          phoneNumber: action.payload.phoneNumber,
          token: action.payload.token,
          refreshToken: action.payload.refreshToken,
          isCandidat: true,
          candidat: {
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            cvDocumentsId : action.payload.cvDocumentsId
          },
          isLoading: false,
          isLoggedIn: true,
        };
      } else {
        return {
          ...state,
          id: action.payload.id,
          email: action.payload.email,
          phoneNumber: action.payload.phoneNumber,
          token: action.payload.token,
          refreshToken: action.payload.refreshToken,
          isCandidat: false,
          entreprise: {
            name: action.payload.name,
            about: action.payload.about,
            adress: {
              city: action.payload.adress.city,
              adress: action.payload.adress.adress,
              longitude: action.payload.adress.longitude,
              latitude: action.payload.adress.latitude,
            },
          },
          isLoading: false,
          isLoggedIn: true,
        };
      }
    case "LOGIN_FAILURE":
      return {
        ...state,
        isLoading: false,
        isLoggedIn: false,
        error: action.payload,
      };
    case "LOGOUT":
      return initialState;
    case "REFRESH_TOKEN_SUCCESS":
      return {
        ...state,
        token: action.payload.token
      };
    default:
      return state;
  }
};

export default authReducer;
