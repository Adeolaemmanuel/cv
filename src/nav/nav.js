import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import dash from '../assets/img/dash.svg'
import mail from '../assets/img/email.svg'
import add from '../assets/img/add.svg';
import menu from '../assets/img/menu.svg';
import settings from '../assets/img/settings.svg';
import exit from '../assets/img/exit.svg';
import './nav.css'

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
                        <div className='w3-right w3-hide-large w3-hide-medium w3-padding w3-margin-top' id='menu' onClick={this.nav}>
                            <img onClick={this.nav} src={menu} alt={menu} style={{width:'30px', height:'30px'}} />
                            <Sidebar state={this.state.nav} />
                        </div>
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
            nav: this.props.state
        }
        console.log(this.props);
    }
    
    render() {
        if(window.matchMedia("(max-width: 767px)").matches){
            return (
                <div>
                    <div className='w3-sidebar w3-margin-right w3-marin-top w3-padding' style={{width: '100px', right:'0', display: this.state.nav}}>
                        <Link to='Admin'><img src={dash} alt={dash} className='svg w3-bar-item' /></Link>
                        <Link to='Add'><img src={add} alt={add} className='svg w3-bar-item add' /></Link>
                        <Link to='Mail'><img src={mail} alt={mail} className='svg w3-bar-item mail' /></Link>
                        <Link to='Settings'><img src={settings} alt={settings} className='svg w3-bar-item settings' /></Link>
                        <img src={exit} alt={exit} className='svg w3-bar-item exit' />
                    </div>
                </div>
            )
        }else{
            return (
                <div>
                    <div className='w3-sidebar w3-padding' style={{width: '100px'}}>
                        <Link to='Admin'><img src={dash} alt={dash} className='svg w3-bar-item' /></Link>
                        <Link to='Add'><img src={add} alt={add} className='svg w3-bar-item add' /></Link>
                        <Link to='Mail'><img src={mail} alt={mail} className='svg w3-bar-item mail' /></Link>
                        <Link to='Settings'><img src={settings} alt={settings} className='svg w3-bar-item settings' /></Link>
                        <img src={exit} alt={exit} className='svg w3-bar-item exit' />
                    </div>
                </div>
            )
        }
    }
}

export { Sidebar }