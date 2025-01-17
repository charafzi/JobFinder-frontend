import { combineReducers } from "redux";
import AuthReducer from "./reducers/authReducer";
import forgotPasswordReducer from "./reducers/forgotPasswordReducer";
import checkEmailReducer from "./reducers/checkEmailReducer";
import resetPasswordReducer from "./reducers/resetPasswordReducer";
import offresReducer from './slices/offres/offreSlice';
import candidaturesReducer from './slices/candidaturesCandidat/candidaturesSlice'
import candidatProfileReducer from "./slices/candidat/candidatProfileSlice";
import entrepriseOffresReducer from './slices/entrepriseOffres/entrepriseOffreSlice';

const rootReducer = combineReducers({
  auth: AuthReducer,
  forgotPassword: forgotPasswordReducer,
  checkEmail: checkEmailReducer,
  resetPassword: resetPasswordReducer,
  offres : offresReducer,
  entrepriseOffres : entrepriseOffresReducer,
  candidatures : candidaturesReducer,
  candidatProfile: candidatProfileReducer
});

export default rootReducer;
