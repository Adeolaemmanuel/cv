import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import dash from '../assets/img/dash.svg'
import mail from '../assets/img/email.svg'
import add from '../assets/img/add.svg';
import settings from '../assets/img/settings.svg';
import exit from '../assets/img/exit.svg';
import './nav.css'

export default class Nav extends Component {
    render() {
        return (
            <div>
                <nav className='w3-bar'>
                    <p className='w3-bar-item w3-text-blue w3-bold'>KIGENNI</p>
                </nav>
            </div>
        )
    }
}

class Sidebar extends Component{
    render() {
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

export { Sidebar }