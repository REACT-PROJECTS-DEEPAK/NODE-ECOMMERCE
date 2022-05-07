// import {
//   legacy_createStore as createStore,

//   combineReducers,
//   applyMiddleware,
// } from "redux";
import { configureStore } from "@reduxjs/toolkit";
// import { Reducer } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
// import { composeWithDevTools } from "redux-devtools-extension"; // through this only we would able to see redux devtool glowoing in green

import {
  productsReducer,
  productDetailsReducer,
} from "./Reducers/productReducers";

import { authReducer } from "./Reducers/userReducer.js";

// here we will add all our reducers to it.
// to what value we tag the reducer name that value will be the state controling object. here in our example its products.
// so if we change products to productsState it should be seen in redux dev tools as state.
// const reducer = combineReducers({
//   products: productsReducer,
//   productDetails: productDetailsReducer,
// });
// this is new enhancement with react js toolkit where if we are combining reducers we can directly keep without using combine reducers.

const reducer = {
  products: productsReducer,
  productDetails: productDetailsReducer,
  authDetails: authReducer,
};

// we should keep initial state
// it contains all the data that we want to put in the state just before loading the application
let initialState = {};

// Now at third step we should create our store for that use middleware funciton it contains all the middle ware data we use basically it would be thunk
const middleware = [thunk];
// const store = createStore(
//   reducer, // for keeping above combined reducers
//   initialState, // for keeping initail state befor openig the application.
//   composeWithDevTools(applyMiddleware(...middleware)) // this first we linked our redux tool chrome to app with composewithDevtool to we are applying our middleware.
// );

// even the store can be configured like this easily with out keeping all the redundent code like the above. dev tools will get automaticall intiated.
const store = configureStore({
  reducer: reducer,
  initialState: initialState,
  middleware: middleware,
});

// all the is boiler plate code which we should do with empty combineReducers({}) as application progress we would add all our reducers.
export default store;

// first we create a reducer for that we have to create an action to update the state.
