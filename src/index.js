import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home/home';
import Cart from './Cart/cart';
import Admin from './Admin/admin';
import Dashboard, { Add, Settings, Mail } from './Dasboard/dashboard';
import { db } from './database'
import { Cookies } from 'react-cookie'


export default class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      permissionCheck: []
    }
  }

  cookies = new Cookies();
  
  componentDidMount(){
    this.permissionCheck()
  }

  permissionCheck = () =>{
    if(this.cookies.get('user')){
      db.collection('Users').doc(this.cookies.get('user')).get()
    .then(e=>{
        if(e.exists){
            let check = e.data().Permission
        let sides = []
        for(let x =0; x< check.length; x++){
            if(check[x].value === 'Dashboard'){
                sides.push({
                    value: 'Dashboard',
                    component: Dashboard
                })
            }else if(check[x].value === 'Mail'){
                sides.push({
                    value: 'Mail',
                    component: Mail,
                })
            }else if(check[x].value === 'Add'){
                sides.push({
                    value: 'Add',
                    component: Add
                })
            }if(check[x].value === 'Settings'){
                sides.push({
                    value: 'Settings',
                    component: Settings
                })
            }
        }
        //console.log(sides);
        this.setState({permissionCheck: sides})
        }
    })
    }
  }


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
          {
            this.state.permissionCheck.map((arr,ind)=>{
              return(
                <Route path={'/'+arr.value} key={ind}>
                  <arr.component />
                </Route>
              )
            })
          }
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
