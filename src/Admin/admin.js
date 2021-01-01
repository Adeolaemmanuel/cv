import React, { Component } from 'react'
import './admin.css'
import { Cookies } from 'react-cookie'
import Nav from '../nav/nav';
import Dashboard from '../Dasboard/dashboard';


export default class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'Login'
        }

        this.log = this.log.bind(this)
    }

    cookies = new Cookies()

    componentDidMount(){
        if(this.cookies.get('email') && this.cookies.get('email') !== undefined){
            this.setState({email: this.cookies.get('email')})
        }
    }

    log(){
        this.setState({email: 'Dashboard'})
    }


    render() {
        if(this.state.email === 'Login'){
            return (
                <div>
                    <Nav />
                    <Login log={this.log} />
                </div>
            )
        }else{
            return (
                <div>
                    <Nav />
                    <Dashboard />
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
        this.cookies.set('email')
        this.props.log()
    }
    
    render() {
        if(window.matchMedia("(max-width: 767px)").matches){
            return(
                <div className='w3-center top'>
                    <div className='w3-container w3-card w3-padding'>
                        <h3 className='w3-text-blue'>Admin Login</h3>
                        <form>
                            <input type='email' className='w3-input w3-round w3-border' name='email' placeholder="Email" id='email' />
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
                            <input type='email' className='w3-input w3-round w3-border' name='email' placeholder="Email" id='email' />
                            <input type='password' className='w3-input w3-round w3-border w3-margin-top' name='password' placeholder="Password" id='password' />
                            <button className='w3-btn w3-blue w3-padding w3-round w3-margin-top' onClick={this.login}>Login</button>
                        </form>
                    </div>
                </div>
            )
        }
    }
    
}


