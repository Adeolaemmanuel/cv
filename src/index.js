import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home/home';
import Cart from './Cart/cart';
import Admin from './Admin/admin';
import Main from './Dasboard/dashboard'


export default class Index extends Component {



  render() {
    return (
      <div>
        <Router>
          <Route path='/' exact>
            <Home />
          </Route>
          <Route path='/Cart' exact>
            <Cart />
          </Route>
          <Route path='/Admin' exact>
            <Admin />
          </Route>
          <Route path='/Main' exact>
            <Main />
          </Route>
        </Router>
      </div>
    )
  }
}


ReactDOM.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
