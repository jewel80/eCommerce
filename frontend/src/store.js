import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';


import { productsReducer, productDetailsReducer, newProductReducer, productReducer,  newReviewReducer } from './reducers/productReducers';
import { authReducer, userReducer,allUsersReducer, forgotPasswordReducer } from './reducers/userReducers';
import { cartReducer } from "./reducers/cartReducers";
import {
  newOrderReducer,
  myOrdersReducer,
  orderDetailsReducer,
  allOrdersReducer
  // orderReducer
} from "./reducers/orderReducers";


const reducer = combineReducers({
  products: productsReducer,
  product: productReducer,
  productDetails: productDetailsReducer,
  newProduct: newProductReducer,
  auth: authReducer,
  user: userReducer,
  allUsers: allUsersReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  allOrders: allOrdersReducer,
  newReview: newReviewReducer
});


let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};
const middlware = [thunk];
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))

export default store;