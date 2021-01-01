import React, { Component } from 'react'
import { Cookies } from 'react-cookie'
import '../Dasboard/dashboard.css';
import Nav, { Sidebar } from '../nav/nav';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { db } from '../database'


export default class Dashboard extends Component{
    constructor(props) {
        const cookies = new Cookies()
        super(props);
        this.state = {
            email: cookies.get('email'),
            filter: ['Paid','Pending','CV','Cover Letter']
        }
    }
    
    render() {
        if(window.matchMedia("(max-width: 767px)").matches){
            return (
                <div>
                    <div className='w3-row w3-center w3-margin-bottom'>
                        <div className='w3-col s6'>
                            <div className='w3-card w3-container w3-padding w3-round w3-margin-top' style={{width:'200px', display:'inline-block'}}>
                                <div className='w3-padding'><h6 className='w3-bold'>Registered Users</h6></div>
                                <div className='w3-padding w3-blue'><h6>3</h6></div>
                            </div>
                        </div>
                        <div className='w3-col s6'>
                            <div className='w3-container w3-padding w3-card w3-round w3-margin-top' style={{width:'200px', display:'inline-block'}}>
                                <div className='w3-padding'><h6 className='w3-bold'>Paid Custormers</h6></div>
                                <div className='w3-padding w3-green'><h6>4</h6></div>
                            </div>
                        </div>
                        <div className='w3-container w3-padding w3-card w3-round w3-margin-top' style={{width:'200px', display:'inline-block'}}>
                        <div className='w3-padding'><h6 className='w3-bold'>Pending Custormers</h6></div>
                            <div className='w3-padding w3-red'><h6>5</h6></div>
                        </div>
                    </div>
                    <div className='w3-row' style={{marginTop: '50px'}}>
                        <form>
                            <div className='w3-col s12 m8 l8 w3-padding'>
                                <input type='text'className='w3-input w3-border' placeholder='Search' />
                            </div>
                            <div className='w3-rest w3-padding'>
                                <select className='w3-input w3-border w3-round' defaultValue='Filter' style={{width: '200px'}}>
                                    <option value='Filter' disabled>Filter</option>
                                    {
                                        this.state.filter.map(arr=>{
                                            return( <option value={arr}>{arr}</option> )
                                        })
                                    }
                                </select>
                            </div>
                        </form>
                    </div>
    
                    <div className='w3-paddng'>
    
                    </div>
                    <Sidebar />
                </div>
            )
        }else{
            return (
                <div>
                    <Sidebar />
                    <div className='w3-row section'>
                        <div className='w3-col m3 l3 w3-card w3-round w3-margin-left'>
                            <div className='w3-col m7 l7 w3-padding'><h6>Registered Users</h6></div>
                            <div className='w3-rest w3-padding w3-right w3-blue'><h6>3</h6></div>
                        </div>
                        <div className='w3-col m3 l3 w3-card w3-round w3-margin-left'>
                        <div className='w3-col m7 l7 w3-padding'><h6>Paid Custormers</h6></div>
                            <div className='w3-rest w3-padding w3-right w3-green'><h6>4</h6></div>
                        </div>
                        <div className='w3-col m3 l3 w3-card w3-round w3-margin-left'>
                        <div className='w3-col m7 l7 w3-padding'><h6>Pending Custormers</h6></div>
                            <div className='w3-rest w3-padding w3-right w3-red'><h6>5</h6></div>
                        </div>
                    </div>
                    <div className='w3-row section' style={{marginTop: '50px'}}>
                        <form>
                            <div className='w3-col m8 l8 w3-padding'>
                                <input type='text'className='w3-input w3-border' placeholder='Search' />
                            </div>
                            <div className='w3-rest w3-padding'>
                                <select className='w3-input w3-border w3-round' defaultValue='Filter' style={{width: '200px'}}>
                                    <option value='Filter' disabled>Filter</option>
                                    {
                                        this.state.filter.map(arr=>{
                                            return( <option value={arr}>{arr}</option> )
                                        })
                                    }
                                </select>
                            </div>
                        </form>
                    </div>
    
                    <div className='w3-paddng'>
    
                    </div>
                </div>
            )
        }
    }
    
}


class Add extends Component{
    constructor(props) {
        super(props);
        this.state = {
            option: [{value: 'Mail', label: 'Mail'}, {value: 'Dashboard', label: 'Dashboard'}, {value: 'Settings', label: 'Settings'}],
            selectedOption: null,
        }
    }

    animatedComponents = makeAnimated();
    handlePermision = selectedOption => {
        this.setState(
            { selectedOption }
        );
    };

    add = e => {
        e.preventDefault()
        let formData = [
            {name: 'Name', value: e.target.elements.name.value},
            {name: 'Email', value: e.target.elements.email.value},
            {name: 'Password', value: e.target.elements.password.value},
            {name: 'Permission', value: this.state.selectedOption},
        ]
        console.log(formData);
        if(formData[0].value !== "" && formData[1].value !== "" && formData[2].value !== "" && formData[3].value !== ""){
            db.collection('Admin').doc('Emails').get()
            .then(email=>{})
            db.collection('Admin').doc('Users').collection(formData[1].value).doc('Details').set('')
        }
    }

    render() {
        if(window.matchMedia("(max-width: 767px)").matches){
            return (
                <>
                    <Nav />
                    <Sidebar />
                    <div className='w3-row' style={{marginTop: '50px'}}>
                        <div className='w3-col m4 l4 w3-center'>
                            <div className='w3-container w3-card w3-padding'>
                                <h3 className='w3-text-blue'>Add User</h3>
                                <form onSubmit={this.add}>
                                    <input type='email' className='w3-input w3-round w3-border' name='email' placeholder="Email" id='email' required />
                                    <input type='text' className='w3-input w3-round w3-border w3-margin-top' name='name' placeholder="Fullname" id='name' required />
                                    <input type='password' className='w3-input w3-round w3-border w3-margin-top' name='password' required placeholder="Password" id='password' />
                                    <h5>Set Permission</h5>
                                    <Select
                                        required
                                        className='w3-margin-top'
                                        closeMenuOnSelect={false}
                                        value={this.state.selectedOption}
                                        onChange={this.handlePermision}
                                        components={this.animatedComponents}
                                        defaultValue={[this.state.option[0].value]}
                                        isMulti
                                        options={this.state.option}
                                        />
                                    <div className='w3-center'>
                                        <button className='w3-btn w3-blue w3-padding w3-round w3-margin-top'>Add</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className='w3-rest w3-padding'>
    
                        </div>
                    </div>
                </>
            )
        }else{
            return (
                <>
                    <Nav />
                    <Sidebar />
                    <div className='w3-row section'>
                        <div className='w3-col m4 l4 w3-center'>
                            <div className='w3-container w3-card w3-padding'>
                                <h3 className='w3-text-blue'>Add User</h3>
                                <form onSubmit={this.add}>
                                    <input type='email' className='w3-input w3-round w3-border' name='email' placeholder="Email" id='email' required />
                                    <input type='text' className='w3-input w3-round w3-border w3-margin-top' name='name' placeholder="Fullname" id='name' required />
                                    <input type='password' className='w3-input w3-round w3-border w3-margin-top' name='password' required placeholder="Password" id='password' />
                                    <h5>Set Permission</h5>
                                    <Select
                                        required
                                        className='w3-margin-top'
                                        closeMenuOnSelect={false}
                                        value={this.state.selectedOption}
                                        onChange={this.handlePermision}
                                        components={this.animatedComponents}
                                        defaultValue={[this.state.option[0].value]}
                                        isMulti
                                        options={this.state.option}
                                        />
                                    <div className='w3-center'>
                                        <button className='w3-btn w3-blue w3-padding w3-round w3-margin-top'>Add</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className='w3-rest w3-padding'>
    
                        </div>
                    </div>
                </>
            )
        }
    }
    
}

class Mail extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div>
                <Nav />
                <Sidebar />
                <div className='w3-row section'>
                    <div className='w3-col s6 m6 l6'>
                        
                    </div>
                </div>
            </div>
        )
    }
    
}

class Settings extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div>
                <Nav />
                <Sidebar />
            </div>
        )
    }
    
}



export { Add,Mail,Settings }