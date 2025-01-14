import { createStore, applyMiddleware } from "redux";
import rootReducer from "./rootReducer";
import { thunk } from "redux-thunk";
import {configureStore} from "@reduxjs/toolkit";

/*const store = createStore(rootReducer, applyMiddleware(thunk));*/

const store = configureStore({
    reducer : rootReducer
})

export default store;
