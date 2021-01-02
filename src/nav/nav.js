import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Dash from '../assets/img/dash.svg'
import Mail from '../assets/img/email.svg'
import Add from '../assets/img/add.svg';
//import menu from '../assets/img/menu.svg';
import Settings from '../assets/img/settings.svg';
import exit from '../assets/img/exit.svg';
import './nav.css'
import { db } from '../database'
import { Cookies } from 'react-cookie'


export default class Nav extends Component {

    constructor(props) {
        super(props);
        this.state={
            nav: 'none'
        }
    }


    async nav() {
        if(this.state.nav === 'none'){
            this.setState({nav: 'block'})
            return(this.state.nav)
        }else {
            console.log(this.state);
            this.setState({nav: 'block'})
            
        }
    }

    render() {
        if(window.matchMedia("(max-width: 767px)").matches){
            return (
                <div>
                    <nav className='w3-bar'>
                        <p className='w3-bar-item w3-text-blue w3-bold'>KIGENNI</p>
                    </nav>
                </div>
                
            )
        }else{
            return (
                <div>
                    <nav className='w3-bar'>
                        <p className='w3-bar-item w3-text-blue w3-bold'>KIGENNI</p>
                    </nav>
                </div>
                
            )
        }
    }
}

class Sidebar extends Component{
    constructor(props) {
        super(props);
        this.state = {
            nav: 'block',
            permissionCheck: []
        }
    }

    cookies = new Cookies();

    componentDidMount(){
        this.permissionCheck()
    }

    logout = () =>{
        this.cookies.remove('User')
        window.location = '/'
    }

    permissionCheck = () =>{
        db.collection('Users').doc(this.cookies.get('user')).get()
        .then(e=>{
            if(e.exists){
                let check = e.data().Permission
            let sides = []
            for(let x =0; x< check.length; x++){
                if(check[x].value === 'Dashboard'){
                    sides.push({
                        image: Dash,
                        value: 'Admin'
                    })
                }else if(check[x].value === 'Mail'){
                    sides.push({
                        image: Mail,
                        value: 'Mail',
                        css: 'mail'
                    })
                }else if(check[x].value === 'Add'){
                    sides.push({
                        image: Add,
                        value: 'Add',
                        css: 'add'
                    })
                }if(check[x].value === 'Settings'){
                    sides.push({
                        image: Settings,
                        value: 'Settings',
                        css: 'settings'
                    })
                }
            }
            console.log(sides);
            this.setState({permissionCheck: sides})
            }
        })
    }
    
    render() {
        console.log(this.state.permissionCheck)
        if(window.matchMedia("(max-width: 767px)").matches){
            return (
                <div className='w3-bar w3-card w3-bottom w3-container w3-white w3-margin-right w3-padding'>
                    {
                        this.state.permissionCheck.map(arr=>{
                            return(
                                <div>
                                    <Link to={arr.value}><img src={arr.image} alt={arr.value} className='svgm w3-padding w3-bar-item' /></Link>
                                </div>
                            )
                        })
                    }
                    <img src={exit} alt={exit} className='svg w3-bar-item exit' />
                </div>
            )
        }else{
            return (
                <div className='w3-sidebar' style={{width: '100px'}}>
                    {
                        this.state.permissionCheck.map(arr=>{
                            return(
                                <div>
                                    <Link to={arr.value}><img src={arr.image} alt={arr.value} className='svg w3-padding w3-bar-item' /></Link>
                                </div>
                            )
                        })
                    }
                    <img src={exit} alt={exit} onClick={this.logout} className='svgm w3-bar-item exit' />
                </div>
            )
        }
    }
}



export { Sidebar }