const initialState = {
  isLoading: false,
  isLoggedIn: false,
  id : null,
  email: null,
  phoneNumber: null,
  candidat : {
    firstName: null,
    lastName: null,
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
          isCandidat: true,
          candidat: {
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
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
    default:
      return state;
  }
};

export default authReducer;
