import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { loadUser } from './actions/userActions';

//Cart Imports 
import Cart from "./components/cart/Cart";
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import Payment from './components/cart/Payment'
import OrderSuccess from './components/cart/OrderSuccess'

//Order Imports
import ListOrder from './components/order/ListOrders'
import OrderDetails from "./components/order/OrderDetails";

import Home from "./components/Home";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import ProductDetails from './components/product/ProductDetails';
import ProtectedRoute from "./components/route/ProtectedRoute";


//Auth or User Imports
import Login from './components/user/Login';
import NewPassword from "./components/user/NewPassword";
import ForgotPassword from "./components/user/ForgotPassword";
import Profile from './components/user/Profile';
import Register from './components/user/Register';
import UpdatePassword from "./components/user/UpdatePassword";
import UpdateProfile from "./components/user/UpdateProfile";

//Admin imports
import Dashboard from './components/admin/Dashboard';
import ProductList from './components/admin/ProductList';

import store from './store';
import axios from 'axios';


// Payment
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'






function App() {

  const [stripeApiKey, setStripeApiKey] = useState('');

  useEffect(() => {
    store.dispatch(loadUser())

    async function getStripApiKey() {
      const { data } = await axios.get('/api/v1/stripeapi');

      setStripeApiKey(data.stripeApiKey)
    }

    getStripApiKey();

  }, [])

  // useEffect(() => {
  //   store.dispatch(loadUser())
  // }, [])


  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path="/" component={Home} exact />
          <Route path="/search/:keyword" component={Home} />
          <Route path="/product/:id" component={ProductDetails} exact />

          <Route path="/cart" component={Cart} exact />
          <ProtectedRoute path="/shipping" component={Shipping} />
          <ProtectedRoute path="/order/confirm" component={ConfirmOrder} />
          <ProtectedRoute path="/success" component={OrderSuccess} />
          {stripeApiKey && (
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment" component={Payment} />
            </Elements>
          )}

          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/password/forgot" component={ForgotPassword} exact />
          <Route path="/password/reset/:token" component={NewPassword} exact />
          <ProtectedRoute path="/me" component={Profile} exact />
          <ProtectedRoute path="/me/update" component={UpdateProfile} exact />
          <ProtectedRoute path="/password/update" component={UpdatePassword} exact/>

          <Route path="/orders/me" component={ListOrder} exact />
          <ProtectedRoute path="/order/:id" component={OrderDetails} exact />

        </div>

          <ProtectedRoute path="/dashboard" isAdmin={true} component={Dashboard} exact />
          <ProtectedRoute path="/admin/products" isAdmin={true} component={ProductList} exact />

        <Footer />
      </div>
    </Router>
  );
}

export default App;

