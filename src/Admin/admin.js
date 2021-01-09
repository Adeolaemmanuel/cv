import React, { Component } from 'react'
import './admin.css'
import { Cookies } from 'react-cookie'
import Nav from '../nav/nav';
import { db } from '../database'
import Main from '../Main/main'


export default class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.cookies.get('user'),
        }

        this.log = this.log.bind(this)
    }

    cookies = new Cookies()

    componentDidMount(){
        
    }

    log(){
        this.setState({user: this.cookies.get('user')})
    }


    render() {
        if(this.state.user){
            return (
                <div>
                    <Main />
                </div>
            )
            
        }else{
            return (
                <div>
                    <Nav />
                    <Login log={this.log} />
                </div>
            )
        }
    }
}

class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {}
        this.login = this.login.bind(this)
    }

    cookies = new Cookies()

    login(e){
        e.preventDefault()
        let data = {
            user: document.getElementById('user').value,
            password: document.getElementById('password').value
        }
        //console.log(data);
        db.collection('Users').doc(data.user).get()
        .then(e=>{
            if(e.exists){
                let user = e.data().User
                let password = e.data().Password
                if(data.user === user && data.password === password){
                    this.cookies.set('user', user)
                    this.props.log()
                }else{
                    alert('Wrong username and password')
                }
            }
        })
    }
    
    render() {
        if(window.matchMedia("(max-width: 767px)").matches){
            return(
                <div className='w3-center top'>
                    <div className='w3-container w3-card w3-padding'>
                        <h3 className='w3-text-blue'>Admin Login</h3>
                        <form>
                            <input type='text' className='w3-input w3-round w3-border' name='user' placeholder="Username" id='user' />
                            <input type='password' className='w3-input w3-round w3-border w3-margin-top' name='password' placeholder="Password" id='password' />
                            <button className='w3-btn w3-blue w3-padding w3-round w3-margin-top' onClick={this.login}>Login</button>
                        </form>
                    </div>
                </div>
            )
        }else{
            return (
                <div className='w3-center top'>
                    <div className='w3-container w3-card w3-padding' style={{display: 'inline-block', width: '400px'}}>
                        <h3 className='w3-text-blue'>Admin Login</h3>
                        <form>
                            <input type='text' className='w3-input w3-round w3-border' name='user' placeholder="Username" id='user' />
                            <input type='password' className='w3-input w3-round w3-border w3-margin-top' name='password' placeholder="Password" id='password' />
                            <button className='w3-btn w3-blue w3-padding w3-round w3-margin-top' onClick={this.login}>Login</button>
                        </form>
                    </div>
                </div>
            )
        }
    }
    
}


