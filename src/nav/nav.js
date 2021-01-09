import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Dash from '../assets/img/dash.svg'
import Mail from '../assets/img/email.svg'
import Add from '../assets/img/add.svg';
//import menu from '../assets/img/menu.svg';
import Settings from '../assets/img/settings.svg';
import exit from '../assets/img/exit.svg';
import './nav.css'
import gmail from '../assets/img/gmail.svg'
import whats from '../assets/img/whatsapp.svg'
import up from '../assets/img/up-arrow.svg'
import { db } from '../database'
import { Cookies } from 'react-cookie'


export default class Nav extends Component {

    constructor(props) {
        super(props);
        this.state={
            nav: 'none'
        }
    }



    render() {
        if(window.matchMedia("(max-width: 767px)").matches){
            return (
                <div>
                    <nav className='w3-bar'>
                        <Link to='/'><p className='w3-bar-item w3-text-blue w3-bold'>KIGENNI</p></Link>
                    </nav>
                </div>
                
            )
        }else{
            return (
                <div>
                    <nav className='w3-bar'>
                    <Link to='/'><p className='w3-bar-item w3-text-blue w3-bold'>KIGENNI</p></Link>
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
        this.cookies.remove('user')
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
                        value: 'Dashboard'
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
            //console.log(sides);
            this.setState({permissionCheck: sides})
            }
        })
    }
    
    render() {
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
                    <img src={exit} alt={exit} onClick={this.logout} className='svgm w3-bar-item w3-padding' />
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
                    <img src={exit} alt={exit} onClick={this.logout} className='svg w3-bar-item w3-padding' />
                </div>
            )
        }
    }
}


class Contactbar extends Component {


    contact = (pram) => {
        let mails = document.getElementById('mail');
        let mailBtn =  document.getElementById('mailBtn');
        //let whatsapp = document.getElementById('whatsapp');
        let whatsBtn = document.getElementById('whatsBtn');
        let up = document.getElementById('upBtn');
        if(pram === 'mails'){
            mails.classList.remove('w3-hide');
            mailBtn.classList.add('w3-hide');
            whatsBtn.classList.add('w3-hide');
            up.classList.add('w3-hide');
        }else if (pram === 'can') {
            mails.classList.add('w3-hide');
            mailBtn.classList.remove('w3-hide');
            whatsBtn.classList.remove('w3-hide');
            up.classList.remove('w3-hide');
        }
    }

    render() {
        return (
            <div className='contact w3-padding w3-round w3-white'>
                <div className =''>
                    <img src={gmail} alt='mail' className='w3-margin-top' id='mailBtn' style={{width: '40px', height: '40px', display: 'block'}} onClick={()=>{this.contact('mails')}} />
                    <a href="https://wa.me/2348186013412?text=Hi%20I'm%20contacting%20you%20from%20Kigenni"><img src={whats} alt='whtasapp' className='w3-margin-top' id='whatsBtn' style={{width: '40px', height: '40px', display: 'block'}} /></a>
                    <a href='#Home'><img src={up} alt='up' className='w3-margin-top' id='upBtn' style={{width: '40px', height: '40px', display: 'block'}}  /></a>

                    <div id='mail' className='w3-padding w3-white w3-container w3-hide'>
                        <form>
                            <h5 className='w3-text-blue w3-center'>Send us a message</h5>
                            <span className='w3-right w3-padding w3-button w3-bold' onClick={()=>{this.contact('can')}}>X</span>
                            <input className='w3-input w3-border w3-round' placeholder='Name' name='name' />
                            <input className='w3-input w3-border w3-round w3-margin-top' placeholder='Email' name='email' />
                            <input className='w3-input w3-border w3-round w3-margin-top' placeholder='Subject' name='subject' />
                            <textarea className='w3-input w3-border w3-round w3-margin-top' placeholder='Message...' name='message'></textarea>
                            <div className='w3-center w3-margin-top'>
                                <button className='w3-btn w3-round w3-blue'>Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}



export { Sidebar, Contactbar }