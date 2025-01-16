import { createStore, applyMiddleware } from "redux";
import rootReducer from "./rootReducer";
import { thunk } from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import candidatProfileReducer from './slices/candidatProfileSlice';

/*const store = createStore(rootReducer, applyMiddleware(thunk));*/

const store = configureStore({
  reducer: {
    ...rootReducer,
    candidatProfile: candidatProfileReducer,
  }
})

export default store;
