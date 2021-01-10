import React, { Component } from 'react'
import { Cookies } from 'react-cookie'
import './main.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { db, firebase } from '../database'
import delet from '../assets/img/delete.svg';
import cv from '../assets/img/cv.svg'
import cvl from '../assets/img/cvl.svg'
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import axios from 'axios'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
require('react-big-calendar/lib/css/react-big-calendar.css');


export default class Main extends Component{
    constructor(props) {
        super(props);
        this.state = {
          permissionCheck: [],
          redirect: '',
          eventsList: [],
        }
      }
    
      cookies = new Cookies();
      
      componentDidMount(){
        this.permissionCheck()
        this.getCalendar()
      }

      event = []

      getCalendar = () => {
        db.collection('Calendar').doc(this.cookies.get('user')).get()
        .then(c=>{
            if(c.exists){
                let all = [...c.data().todo]
                for(let c=0; c<all.length; c++){
                    this.event.push({
                        id: c,
                        title: all[c].title,
                        allDay: false,
                        start: new Date(parseInt(all[c].startyear), all[c].startmonth, parseInt(all[c].startday)),
                        end: new Date(parseInt(all[c].stopyear), all[c].stopmonth, parseInt(all[c].stopday)),
                    })
                }
            }
            this.setState({eventsList: this.event})
        })
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
            //this.setState({redirect: sides[0].value})
            }
        })
        }
      }

      localizer = momentLocalizer(moment)


    render() {
       if(window.matchMedia("(max-width: 767px)").matches){
        return (
            <div>
                <Router>
                    {
                        this.state.permissionCheck.map((arr,ind)=>{
                        return(
                            <Route path={'/'+arr.value} exact key={ind}>
                                <arr.component />
                            </Route>
                        )
                        })
                    }
                    <Redirect to='/Main' />
                </Router>

                <div className='w3-center'>
                    <Calendar
                    localizer={this.localizer}
                    events={this.state.eventsList}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, width: '100%', display: 'inline-block' }}
                    />
                </div>
            </div>
        )
       }else{
        return (
            <div>
                
                <Router>
                    {
                        this.state.permissionCheck.map((arr,ind)=>{
                        return(
                            <Route path={'/'+arr.value} exact key={ind}>
                                <arr.component />
                            </Route>
                        )
                        })
                    }
                </Router>

                <div className='w3-center'>
                    <Calendar
                    localizer={this.localizer}
                    events={this.state.eventsList}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, width: 950, display: 'inline-block' }}
                    />
                </div>
            </div>
        )
       }
    }
}
class Dashboard extends Component{
    constructor(props) {
        const cookies = new Cookies()
        super(props);
        this.state = {
            user: cookies.get('user'),
            filter: ['Name','Email','Paid','Type', 'Date'],
            details: [],
            pending: 0,
            paid: 0,
            users: 0,
            filterM: 'name',
            selectedOption: null,
            option: '',
            eventsList: [],
        }
    }

    componentDidMount(){
        this.getCustomers()
        this.getUsers()
        this.getCalendar()
    }

    event = []

    getCalendar = () => {
        db.collection('Calendar').doc(this.state.user).get()
        .then(c=>{
            if(c.exists){
                let all = [...c.data().todo]
                for(let c=0; c<all.length; c++){
                    this.event.push({
                        id: c,
                        title: all[c].title,
                        startyear: all[c].startyear,
                        startday:all[c].startday,
                        startmonth: all[c].startmonth,
                        stopyear: all[c].stopyear,
                        stopday:all[c].stopday,
                        stopmonth: all[c].stopmonth,
                    })
                }
            }
            this.setState({eventsList: this.event})
        })
    }

    getUsers = () => {
        db.collection('Admin').doc('Users').get()
        .then(e=>{
            if(e.exists){
                let users = [...e.data().users]
                let set = []
                for(let u=0; u< users.length; u++){
                    set.push({value: users[u], label: users[u]})
                }
                this.setState({users: users.length})
                this.setState({option: set})
            }
        })
    }

    customers = []

    getCustomers = () => {
        db.collection('Admin').doc('Emails').onSnapshot(e=>{
            if(e.exists){
                let emails = [...e.data()['emails']]
                //console.log(emails);
                for(let x=0; x<emails.length; x++){
                    db.collection('Custormers').doc(emails[x]).get()
                    .then(c=>{
                        if(c.exists){
                            for(let p=0; p< c.data().details.length; p++){
                                this.customers.push(c.data().details[p])  
                                if(c.data().details[p].paid === 'Pending'){
                                    this.setState({pending: this.state.pending + 1})
                                }else if(c.data().details[p].paid === 'Paid'){
                                    this.setState({paid: this.state.paid + 1})
                                }                          
                            }
                        }
                        //console.log(this.customers);
                    }).then(()=>{this.setState({details: this.customers})})
                }
            }
        })
       
    }

    filter = (e) => {
        e.preventDefault()
        this.setState({filterM: e.target.value.toLowerCase()})
    }

    search = (e) => {
        e.preventDefault()
        let search = []
        this.state.details.filter(arr=>{
            if(arr[this.state.filterM] === e.target.value || arr[this.state.filterM].toLowerCase() === e.target.value.toLowerCase()){
                search.push(arr)
                this.setState(state=>({details: search}))
            }else if(e.target.value === ''){
                let customer = []
                this.setState({details: []})
                db.collection('Admin').doc('Emails').get().then(e=>{
                    if(e.exists){
                        let emails = [...e.data()['emails']]
                        //console.log(emails);
                        for(let x=0; x<emails.length; x++){
                            db.collection('Custormers').doc(emails[x]).get()
                            .then(c=>{
                                for(let p=0; p< c.data().details.length; p++){
                                    customer.push(c.data().details[p])                          
                                }
                                this.setState({details: customer})
                            })
                        }
                    }
                })
            }
            return arr
        })
    }

    customersOption = (e,pram) => {
        e.preventDefault()
        //console.log(e.target.id);
        if(pram === 'delete'){
            db.collection('Custormers').doc(e.target.id).get()
            .then(pend=>{
                const P = pend.data().details
                let pen = []
                //console.log(P);
                for(let y=0; y<P.length; y++){
                    if(P[y].paid === 'Pending'){
                        pen.push(P)
                        pen.splice(P[y])
                        db.collection('Custormers').doc(e.target.id)
                        .update({details: pen})
                    }
                }
            })
        }else if(pram === 'send'){
            db.collection('Custormers').doc(e.target.id).get()
            .then(e=>{
                let users = e.data().details
                for(let r=0; r<users.length; r++){
                    if(users[r].paid === 'Pending'){
                        let data = {name: users[r].name, type: users[r].type, email: users[r].email, price: users[r].price}
                        axios.post('/remind', data)
                    }
                }
            })
        }else if(pram === 'add'){
            let reminders = [...this.state.reminders];
            reminders.push(e.target.id)
            this.setState({reminders: reminders})
        }
    }


    accorodion = (id) => {
        let x = document.getElementById(id);
        if (x.className.indexOf("w3-show") === -1) {
            x.className += " w3-show";
        } else {
            x.className = x.className.replace(" w3-show", "");
        }
    }

    setCalendar = (e, pram) => {
        e.preventDefault()
        let month = ['January','Feburary','March','April','May','June','July','August','September','October','November', 'December']
        //let day = ['Sunday','Monday','Tuesday', 'Wednesday','Thursday','Friday','Saturday']
        if(pram === 'set'){
            let data = {
                title: e.target.elements.title.value,
                startyear: e.target.elements.year1.value,
                startmonth: month.indexOf(e.target.elements.month1.value),
                startday: e.target.elements.day1.value,
                stopyear: e.target.elements.year2.value,
                stopmonth: month.indexOf(e.target.elements.month2.value),
                stopday: e.target.elements.day2.value,
            }
    
            let data2 = {
                title: `${e.target.elements.title.value} given to ${this.state.option[0].value}`,
                startyear: e.target.elements.year1.value,
                startmonth: month.indexOf(e.target.elements.month1.value),
                startday: e.target.elements.day1.value,
                stopyear: e.target.elements.year2.value,
                stopmonth: month.indexOf(e.target.elements.month2.value),
                stopday: e.target.elements.day2.value,
            }
            db.collection('Calendar').doc(this.state.option[0].value).get()
            .then(c=>{
                if(c.exists){
                    let all = [...c.data().todo]
                    all.push(data)
                    db.collection('Calendar').doc(this.state.option[0].value).update({todo: all})
                }else{
                    db.collection('Calendar').doc(this.state.option[0].value).set({todo: [data]})
                }
            })
            db.collection('Calendar').doc('Admin').get()
            .then(c=>{
                if(c.exists){
                    let all = [...c.data().todo]
                    all.push(data2)
                    db.collection('Calendar').doc('Admin').update({todo: all})
                }else{
                    db.collection('Calendar').doc('Admin').set({todo: [data2]})
                }
            })
        }else if (pram === 'setT') {
            document.getElementById('set').classList.remove('w3-hide')
            document.getElementById('viewSet').classList.add('w3-hide')
        }else if (pram === 'setV') {
            document.getElementById('set').classList.add('w3-hide')
            document.getElementById('viewSet').classList.remove('w3-hide')
        }
    }

    animatedComponents = makeAnimated();
    handlePermision = selectedOption => {
        this.setState(
            { selectedOption }
        );
        console.log(this.state.option);
    };
    
    render() {
        if(window.matchMedia("(max-width: 767px)").matches){
            return (
                <div>
                    <div className='w3-row w3-center'>
                        <div className='w3-col s6'>
                            <div className='w3-card w3-container w3-padding w3-round w3-margin-top' style={{width:'200px', display:'inline-block'}}>
                                <div className='w3-padding'><h6 className='w3-bold'>Registered Users</h6></div>
                                <div className='w3-padding w3-blue'><h6>{this.state.users}</h6></div>
                            </div>
                        </div>
                        <div className='w3-col s6'>
                            <div className='w3-container w3-padding w3-card w3-round w3-margin-top' style={{width:'200px', display:'inline-block'}}>
                                <div className='w3-padding'><h6 className='w3-bold'>Paid Custormers</h6></div>
                                <div className='w3-padding w3-green'><h6>{this.state.paid}</h6></div>
                            </div>
                        </div>
                        <div className='w3-container w3-padding w3-card w3-round w3-margin-top' style={{width:'200px', display:'inline-block'}}>
                        <div className='w3-padding'><h6 className='w3-bold'>Pending Custormers</h6></div>
                            <div className='w3-padding w3-red'><h6>{this.state.pending}</h6></div>
                        </div>
                    </div>
                    <div className='w3-row' style={{marginTop: '50px'}}>
                        <form>
                            <div className='w3-col s12 m8 l8 w3-padding'>
                                <input type='text'className='w3-input w3-border' placeholder='Search'  onChange={this.search} />
                            </div>
                            <div className='w3-rest w3-padding'>
                                <select className='w3-input w3-border w3-round' onChange={this.filter} defaultValue='Filter' style={{width: '200px'}}>
                                    <option value='Filter' disabled>Filter</option>
                                    {
                                        this.state.filter.map(arr=>{
                                            return( <option value={arr} key={arr}>{arr}</option> )
                                        })
                                    }
                                </select>
                            </div>
                        </form>
                    </div>
    
                    <div className='w3-paddng'>
                        <div className='w3-container'>
                            <div className='w3-row'>
                                <div className='w3-col s4 w3-padding'><h4 className='w3-bold'>Name</h4></div>
                                <div className='w3-col s4 w3-padding'><h4 className='w3-bold'>Product</h4></div>
                                <div className='w3-col s4 w3-padding'><h4 className='w3-bold'>Email</h4></div>
                            </div>
                            <div className='w3-paddng details'>
                                {
                                    this.state.details.map((arr,ind)=>{
                                            return(
                                                <div>
                                                    <div className='w3-row w3-card w3-margin-top w3-button w3-block' key={ind} onClick={()=>{this.accorodion(ind)}}>
                                                        <div className='w3-col s4 w3-padding' style={{overflowWrap: 'break-word'}}><h6 className='w3-small'>{arr.name}</h6></div>
                                                        <div className='w3-col s4 w3-padding' style={{overflowWrap: 'break-word'}}><h6 className='w3-small'>{arr.type}</h6></div>
                                                        <div className='w3-col s4 w3-padding' style={{overflowWrap: 'break-word'}}><h6 className='w3-small'>{arr.email}</h6></div>
                                                    </div>
                                                    <div className='w3-container w3-padding w3-hide' id={ind}>
                                                        <div className='w3-row w3-padding'>
                                                            <div className='w3-col s6 m6 l6 w3-padding'><b>Gender: </b>{arr.gender}</div>
                                                            <div className='w3-col s6 m6 l6 w3-padding'><b>DOB</b>: {arr.dob}</div>
                                                            <div className='w3-col s6 m6 l6 w3-padding'><b>Industry: </b>{arr.industry}</div>
                                                            <div className='w3-col s6 m6 l6 w3-padding'><b>Register Date: </b>{arr.date}</div>
                                                            <div className='w3-col s6 m6 l6 w3-padding'><b>State: </b>{arr.state}</div>
                                                            <div className='w3-col s6 m6 l6 w3-padding'><b>Experience: </b>{arr.exp}</div>
                                                            <div className='w3-col s6 m6 l6 w3-padding'><b>Communication: </b>{arr.com}</div>
                                                            <div className='w3-col s6 m6 l6 w3-padding'><b>Price: </b>{arr.price}</div>
                                                        </div>
                                                        <div className='w3-row'>
                                                            <button className='w3-col s6 w3-btn w3-red w3-padding' id={arr.email} onClick={(e)=>{this.customersOption(e, 'delete')}} >Delete</button>
                                                            <button className='w3-col s6 w3-btn w3-green w3-padding' id={arr.email} onClick={(e)=>{this.customersOption(e, 'send')}}>Send Reminder</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                    }) 
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else{
            return (
                <div>
                    <div className='w3-row section'>
                        <div className='w3-col m3 l3 w3-card w3-round w3-margin-left'>
                            <div className='w3-col m7 l7 w3-padding'><h6>Registered Users</h6></div>
                            <div className='w3-rest w3-padding w3-right w3-blue'><h6>{this.state.users}</h6></div>
                        </div>
                        <div className='w3-col m3 l3 w3-card w3-round w3-margin-left'>
                        <div className='w3-col m7 l7 w3-padding'><h6>Paid Custormers</h6></div>
                            <div className='w3-rest w3-padding w3-right w3-green'><h6>{this.state.paid}</h6></div>
                        </div>
                        <div className='w3-col m3 l3 w3-card w3-round w3-margin-left'>
                        <div className='w3-col m7 l7 w3-padding'><h6>Pending Custormers</h6></div>
                            <div className='w3-rest w3-padding w3-right w3-red'><h6>{this.state.pending}</h6></div>
                        </div>
                    </div>
                    <div className='w3-row section' style={{marginTop: '50px'}}>
                        <div>
                            <form className='w3-col m8 l8 w3-padding'>
                                <input type='text'className='w3-input w3-border' placeholder='Search' onChange={this.search} />
                                <div className='w3-container'>
                                    <div className='w3-row'>
                                        <div className='w3-col m3 l3 w3-padding'><h4 className='w3-bold'>Name</h4></div>
                                        <div className='w3-col m3 l3 w3-padding'><h4 className='w3-bold'>Product</h4></div>
                                        <div className='w3-col m3 l3 w3-padding'><h4 className='w3-bold'>Email</h4></div>
                                        <div className='w3-col m3 l3 w3-padding'><h4 className='w3-bold'>Paid</h4></div>
                                    </div>
                                    <div className='w3-paddng'>
                                        {
                                        this.state.details.map((arr,ind)=>{
                                                return(
                                                    <div className=''>
                                                        <div className='w3-row w3-card w3-margin-top w3-button w3-block' key={ind} onClick={()=>{this.accorodion(ind)}}>
                                                            <div className='w3-col m5 l3 w3-padding' style={{overflowWrap: 'break-word'}}><h6 className='w3-small'>{arr.name}</h6></div>
                                                            <div className='w3-col m3 l3 w3-padding' style={{overflowWrap: 'break-word'}}><h6 className='w3-small'>{arr.type}</h6></div>
                                                            <div className='w3-col m3 l3 w3-padding' style={{overflowWrap: 'break-word'}}><h6 className='w3-small'>{arr.email}</h6></div>
                                                            <div className='w3-col m3 l3 w3-padding' style={{overflowWrap: 'break-word'}}><h6 className='w3-small'>{arr.paid}</h6></div>
                                                        </div>
                                                        <div className='w3-container w3-padding w3-hide' id={ind}>
                                                            <div className='w3-row w3-padding'>
                                                                <div className='w3-col s6 m6 l6 w3-padding'><b>Gender: </b>{arr.gender}</div>
                                                                <div className='w3-col s6 m6 l6 w3-padding'><b>DOB</b>: {arr.dob}</div>
                                                                <div className='w3-col s6 m6 l6 w3-padding'><b>Industry: </b>{arr.industry}</div>
                                                                <div className='w3-col s6 m6 l6 w3-padding'><b>Register Date: </b>{arr.date}</div>
                                                                <div className='w3-col s6 m6 l6 w3-padding'><b>State: </b>{arr.state}</div>
                                                                <div className='w3-col s6 m6 l6 w3-padding'><b>Experience: </b>{arr.exp}</div>
                                                                <div className='w3-col s6 m6 l6 w3-padding'><b>Communication: </b>{arr.com}</div>
                                                                <div className='w3-col s6 m6 l6 w3-padding'><b>Price: </b>{arr.price}</div>
                                                            </div>
                                                            <div className='w3-row'>
                                                                <button className='w3-col m6 l6 w3-btn w3-red w3-padding' id={arr.email} onClick={(e)=>{this.customersOption(e, 'delete')}} >Delete</button>
                                                                <button className='w3-col m6 l6 w3-btn w3-green w3-padding' id={arr.email} onClick={(e)=>{this.customersOption(e, 'send')}}>Send Reminder</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                        }) 
                                        }
                                    </div>
                                </div>
                            </form>
                            <div className='w3-rest w3-padding'>
                                <select className='w3-input w3-border w3-round' onChange={this.filter} defaultValue='Filter' style={{width: '200px'}}>
                                    <option value='Filter' disabled>Filter</option>
                                    {
                                        this.state.filter.map(arr=>{
                                            return( <option value={arr} key={arr}>{arr}</option> )
                                        })
                                    }
                                </select>

                                <div className='w3-padding w3-margin-top' style={{width: '250px'}}>
                                    <h3 className='w3-padding w3-text-blue w3-center'>TOOLS</h3>
                                    <button className='w3-btn w3-grey w3-round w3-text-white w3-block' onClick={()=>{document.getElementById('todo').style.display = 'block'}}>SET TODO</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id='modals'>
                        <div className='w3-modal' id='todo'>
                            <div className='w3-modal-content'>
                                <span className='w3-right w3-padding w3-button w3-bold' onClick={()=>{document.getElementById('todo').style.display = 'none'}}>X</span>
                                <div className='w3-row w3-padding'>
                                    <div className='w3-half w3-blue w3-padding w3-center w3-btn w3-padding'  onClick={e=>{this.setCalendar(e,'setT')}}>Set Todo</div>
                                    <div className='w3-half w3-blue w3-padding w3-center w3-btn w3-padding' onClick={e=>{this.setCalendar(e,'setV')}}>View Todo</div>
                                </div>
                                <div className='w3-padding' id='set'>
                                    <form onSubmit={e=>{this.setCalendar(e,'set')}}>
                                        <input type='text' className='w3-input w3-border' placeholder='Title' id='title' />
                                        <div className='w3-row'>
                                            <h6 className='w3-center w3-text-blue'>Set start date</h6>
                                            <div className='w3-col m4 l4 w3-padding'>
                                                <input type='text' className='w3-input w3-border' placeholder='year in number' id='year1' />
                                            </div>
                                            <div className='w3-col m4 l4 w3-padding'>
                                                <input type='text' className='w3-input w3-border' placeholder='Month in letter' id='month1' />
                                            </div>
                                            <div className='w3-col m4 l4 w3-padding'>
                                                <input type='text' className='w3-input w3-border' placeholder='Day in number' id='day1' />
                                            </div>
                                        </div>

                                        <div className='w3-row'>
                                            <h6 className='w3-center w3-text-blue'>Set end date</h6>
                                            <div className='w3-col m4 l4 w3-padding'>
                                                <input type='text' className='w3-input w3-border' placeholder='year in number' id='year2' />
                                            </div>
                                            <div className='w3-col m4 l4 w3-padding'>
                                                <input type='text' className='w3-input w3-border' placeholder='Month in letter' id='month2' />
                                            </div>
                                            <div className='w3-col m4 l4 w3-padding'>
                                                <input type='text' className='w3-input w3-border' placeholder='Day in number' id='day2' />
                                            </div>
                                        </div>
                                        <div>
                                            <h6 className='w3-center w3-text-blue'>Select user</h6>
                                            <Select
                                                required
                                                className='w3-margin-top'
                                                closeMenuOnSelect={false}
                                                value={this.state.selectedOption}
                                                onChange={this.handlePermision}
                                                components={this.animatedComponents}
                                                options={this.state.option}
                                            />
                                        </div>

                                        <div className='w3-center'>
                                            <button className='w3-btn w3-block w3-round w3-margin-top w3-green'>Set</button>
                                        </div>
                                    </form>
                                </div>
                                <div id='viewSet' className='w3-padding w3-hide'>
                                    {
                                        this.state.eventsList.map(arr => {
                                            return(
                                                <div>
                                                    <button className='w3-button w3-block' onClick={e=>{this.accorodion(`${arr.id}C`)}}>{arr.title}</button>

                                                    <div className='w3-padding w3-hide' id={`${arr.id}C`}>
                                                        <form onSubmit={e=>{this.setCalendar(e,'update')}}>
                                                            <input type='text' className='w3-input w3-border' placeholder={arr.title} id='title' />
                                                            <div className='w3-row'>
                                                                <h6 className='w3-center w3-text-blue'>Set start date</h6>
                                                                <div className='w3-col m4 l4 w3-padding'>
                                                                    <input type='text' className='w3-input w3-border' placeholder={arr.startyear} id='Uyear1' />
                                                                </div>
                                                                <div className='w3-col m4 l4 w3-padding'>
                                                                    <input type='text' className='w3-input w3-border' placeholder={arr.startmonth} id='Umonth1' />
                                                                </div>
                                                                <div className='w3-col m4 l4 w3-padding'>
                                                                    <input type='text' className='w3-input w3-border' placeholder={arr.startday} id='Uday1' />
                                                                </div>
                                                            </div>

                                                            <div className='w3-row'>
                                                                <h6 className='w3-center w3-text-blue'>Set end date</h6>
                                                                <div className='w3-col m4 l4 w3-padding'>
                                                                    <input type='text' className='w3-input w3-border' placeholder={arr.stopyear} id='Uyear2' />
                                                                </div>
                                                                <div className='w3-col m4 l4 w3-padding'>
                                                                    <input type='text' className='w3-input w3-border' placeholder={arr.stopmonth} id='Umonth2' />
                                                                </div>
                                                                <div className='w3-col m4 l4 w3-padding'>
                                                                    <input type='text' className='w3-input w3-border' placeholder={arr.stopday} id='Uday2' />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h6 className='w3-center w3-text-blue'>Select user</h6>
                                                                <Select
                                                                    required
                                                                    className='w3-margin-top'
                                                                    closeMenuOnSelect={false}
                                                                    value={this.state.selectedOption}
                                                                    //defaultValue={arr}
                                                                    onChange={this.handlePermision}
                                                                    components={this.animatedComponents}
                                                                    options={this.state.option}
                                                                />
                                                            </div>

                                                            <div className='w3-center'>
                                                                <button className='w3-btn w3-block w3-round w3-margin-top w3-green'>Set</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
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
            option: [ {value: 'Dashboard', label: 'Dashboard'}, {value: 'Mail', label: 'Mail'},  {value: 'Add', label: 'Add'}, {value: 'Settings', label: 'Settings'}],
            selectedOption: null,
            users: []
        }
    }

    componentDidMount(){
        this.getUsers()
    }

    animatedComponents = makeAnimated();
    handlePermision = selectedOption => {
        this.setState(
            { selectedOption }
        );
    };

    users = []

    getUsers = () => {
        db.collection('Admin').doc('Users').get()
        .then(e=>{
            if(e.exists){
                let users = [...e.data().users]
                for(let x=0; x<users.length; x++){
                    db.collection('Users').doc(users[x]).get()
                    .then(u=>{
                        this.users.push(u.data())
                        this.setState({users: this.users})
                    })
                }
            }
        })
    }

    add = e => {
        e.preventDefault()
        let formData = [
            {name: 'Name', value: e.target.elements.name.value},
            {name: 'User', value: e.target.elements.user.value},
            {name: 'Password', value: e.target.elements.password.value},
            {name: 'Permission', value: this.state.selectedOption},
        ]
        //console.log(formData);
        if(formData[0].value !== "" && formData[1].value !== "" && formData[2].value !== "" && formData[3].value !== ""){
            db.collection('Users').doc(formData[1].value).get()
            .then(u=>{
                if(u.exists){
                    db.collection('Users').doc(formData[1].value).update({
                        Name: formData[0].value,
                        User: formData[1].value,
                        Password:  formData[2].value,
                        Permission:  formData[3].value,
                    }).then(()=>{db.collection('Admin').doc('Users').update({users: firebase.firestore.FieldValue.arrayUnion(formData[1].value)})})
                }else{
                    db.collection('Admin').doc('Users').get()
                    .then(user=>{
                        if(user.exists){
                            let users = user.data().users
                            //console.log(users);
                            if(users.indexOf(formData[1].value) === -1){
                                db.collection('Users').doc(formData[1].value).set({
                                    Name: formData[0].value,
                                    User: formData[1].value,
                                    Password:  formData[2].value,
                                    Permission:  formData[3].value,
                                }).then(()=>{db.collection('Admin').doc('Users').set({users: firebase.firestore.FieldValue.arrayUnion(formData[1].value)})})
                            }
                        }else{
                            db.collection('Users').doc(formData[1].value).set({
                                Name: formData[0].value,
                                User: formData[1].value,
                                Password:  formData[2].value,
                                Permission:  formData[3].value,
                            }).then(()=>{db.collection('Admin').doc('Users').set({users: firebase.firestore.FieldValue.arrayUnion(formData[1].value)})})
                        }
                    })
                }
            })
        }
    }

    accorodion = (id) => {
        let x = document.getElementById(id);
        if (x.className.indexOf("w3-show") === -1) {
            x.className += " w3-show";
        } else {
            x.className = x.className.replace(" w3-show", "");
        }
    }

    deleteUser = (id) => {
        db.collection('Admin').doc('Users').get()
        .then(u=>{
            if(u.exists){
                let users = u.data().users 
                let name = users.splice(id)
                db.collection('Admin').doc('Users').update({users: users})
                .then(()=>{
                    db.collection('Users').doc(name[0]).delete()
                    this.setState({users: users})
                })
            }
        })
    }

    render() {
        //console.log(this.state.users);
        if(window.matchMedia("(max-width: 767px)").matches){
            return (
                <>
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
                            {
                                this.state.users.map((arr,ind)=>{
                                    return(
                                        <div>
                                            <div className='w3-row w3-card w3-padding'>
                                                <div className='w3-col s4 m4 l4 w3-padding'>{arr.Name}</div>
                                                <div className='w3-col s4 m4 l4 w3-padding'>{arr.Email}</div>
                                                <div className='w3-col s1 m1 l1 w3-margin-left w3-center w3-padding'><img src={delet} alt={delet} style={{width:'30px', height:'30px', cursor: 'pointer'}} onClick={()=>{this.deleteUser(ind)}} /></div>
                                            </div>
                                            <div className='w3-container w3-padding w3-hide' id={ind}>
                                                <div className='w3-row w3-padding'>
                                                    <div className='w3-col s6 m6 l6 w3-padding'><b>: </b>{arr.gender}</div>
                                                    
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </>
            )
        }else{
            return (
                <>
                    <div className='w3-row section'>
                        <div className='w3-col m4 l4 w3-center'>
                            <div className='w3-container w3-card w3-padding'>
                                <h3 className='w3-text-blue'>Add User</h3>
                                <form onSubmit={this.add}>
                                    <input type='text' className='w3-input w3-round w3-border' name='user' placeholder="Username" id='user' required />
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
                            {
                                this.state.users.map((arr,ind)=>{
                                    return(
                                        <div>
                                            <div className='w3-row w3-card w3-padding'>
                                                <div className='w3-col s4 m4 l4 w3-padding'>{arr.Name}</div>
                                                <div className='w3-col s4 m4 l4 w3-padding'>{arr.Email}</div>
                                                <div className='w3-col s1 m1 l1 w3-margin-left w3-center w3-padding'><img src={delet} alt={delet} style={{width:'30px', height:'30px', cursor: 'pointer'}} onClick={()=>{this.deleteUser(ind)}} /></div>
                                            </div>
                                            <div className='w3-container w3-padding w3-hide' id={ind}>
                                                <div className='w3-row w3-padding'>
                                                    <div className='w3-col s6 m6 l6 w3-padding'><b>: </b>{arr.gender}</div>
                                                    
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
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
            delievryEmails: [],
            attachmentCount: [{ cvName: 'Upload CV', cvlName: 'Upload Cover Letter'}],
        }
    }

    componentDidMount(){
        this.getDelievryEmails()
    }

    getDelievryEmails = () =>{
        db.collection('Admin').doc('Settings').collection('Delivery').doc('Emails').onSnapshot(d=>{
            if(d.exists){
                let emails = d.data().emails
                this.setState({delievryEmails: emails})
            }
        })
    }

    attachmentCount = (e, pram) => {
        if(pram ==='add'){
            let currentCount = [...this.state.attachmentCount]
            currentCount.push({ cvName: 'Upload CV', cvlName: 'Upload Cover Letter'})
            this.setState({attachmentCount: currentCount})
           // console.log(currentCount);
        }else if(pram === 'sunmit'){}
    }

    name = (pram, id) => {
        let cv = document.getElementById(id.target.id).value
        let cvl = document.getElementById(id.target.id).value
        let att = [...this.state.attachmentCount]
        if (pram === 'cv') {
            att[id.target.id].cvName = cv.substr(12)
            this.setState({attachmentCount: att})
            
        }else if (pram === 'cvl') {
            att[id.target.id].cvlame =  cvl.substr(12)
            this.setState({cvlName: att})
            
        }
    }

    render() {
        if(window.matchMedia("(max-width: 767px)").matches){
            return (
                <div>
                    <div className='w3-row'>
                        <div className='w3-col s12'>
                            <div className='w3-padding'>
                               <form>
                                    <h5 className='w3-text-blue w3-center w3-padding'>Delievery Tool</h5>
                                    <input className='w3-border w3-input w3-round' placeholder='To'  />
                                    <select className='w3-border w3-input w3-round w3-margin-top' defaultValue='Email'>
                                        <option value='Email' disabled>Select Email</option>
                                        {
                                            this.state.delievryEmails.map(arr=>{
                                                return(
                                                    <option value={arr.email} key={arr.email}>{arr.email}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <div>
                                        {
                                            this.state.attachmentCount.map((arr,ind)=>{
                                                return(
                                                    <div className='w3-row' id={arr}>
                                                        <div className='w3-col s6 w3-center' id='cC'>
                                                            <div className='w3-padding w3-card w3-margin-top w3-margin-bottom w3-round' style={{display: 'inline-block'}}>
                                                                <label htmlFor ={ind}><img src={cv} alt='' style={{width: '100px', height: '100px'}} /></label>
                                                                <p className='w3-center w3-padding w3-bold' style={{overflowWrap: 'break-word'}}>{arr.cvName}</p>
                                                                <input id={ind} onChange={(e)=>{this.name('cv',e)}} name='cv' type='file' className='w3-hide' />
                                                            </div>
                                                        </div>
                                                        <div className='w3-col s6 w3-center' id='clC'>
                                                            <div className='w3-padding w3-card w3-margin-top w3-margin-bottom w3-round' style={{display: 'inline-block'}}>
                                                                <label htmlFor ={ind}><img src={cvl} alt='' style={{width: '100px', height: '100px'}} /></label>
                                                                <p className='w3-center w3-padding w3-bold' style={{overflowWrap: 'break-word'}}>{arr.cvlName}</p>
                                                                <input id={ind} name='cover letter' onChange={(e)=>{this.name('cvl', e)}} type='file' className='w3-hide' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        <div className='w3-center'>
                                            <span className='w3-padding w3-btn w3-green' onClick={e=>{this.attachmentCount(e,'add')}}>Add</span>
                                        </div>
                                        <textarea placeholder='Enter Message...' name='message' className='w3-input w3-margin-top w3-border w3-round'></textarea>
                                        <div className='w3-center w3-margin-top'>
                                            <span className='w3-padding w3-btn w3-round w3-block w3-green' onClick={e=>{this.attachmentCount(e,'submit')}}>Submit</span>
                                        </div>
                                    </div>
                               </form>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else{
            return (
                <div>
                    <div className='w3-row section'>
                        <div className='w3-col s6 m5 l5'>
                            <div className='w3-padding'>
                               <form>
                               <h5 className='w3-text-blue w3-center w3-padding'>Delievery Tool</h5>
                                    <input className='w3-border w3-input w3-round' placeholder='To'  />
                                    <select className='w3-border w3-input w3-round w3-margin-top' defaultValue='Email'>
                                        <option value='Email' disabled>Select Email</option>
                                        {
                                            this.state.delievryEmails.map(arr=>{
                                                return(
                                                    <option value={arr.email} key={arr.email}>{arr.email}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <div>
                                        {
                                            this.state.attachmentCount.map((arr,ind)=>{
                                                return(
                                                    <div className='w3-row' id={arr}>
                                                        <div className='w3-half w3-center' id='cC'>
                                                            <div className='w3-padding w3-card w3-margin-top w3-margin-bottom w3-round' style={{display: 'inline-block'}}>
                                                                <label htmlFor ={ind}><img src={cv} alt='' style={{width: '100px', height: '100px'}} /></label>
                                                                <p className='w3-center w3-padding w3-bold' style={{overflowWrap: 'break-word'}}>{arr.cvName}</p>
                                                                <input id={ind} onChange={(e)=>{this.name('cv',e)}} name='cv' type='file' className='w3-hide' />
                                                            </div>
                                                        </div>
                                                        <div className='w3-half w3-center' id='clC'>
                                                            <div className='w3-padding w3-card w3-margin-top w3-margin-bottom w3-round' style={{display: 'inline-block'}}>
                                                                <label htmlFor ={ind}><img src={cvl} alt='' style={{width: '100px', height: '100px'}} /></label>
                                                                <p className='w3-center w3-padding w3-bold' style={{overflowWrap: 'break-word'}}>{arr.cvlName}</p>
                                                                <input id={ind} name='cover letter' onChange={(e)=>{this.name('cvl', e)}} type='file' className='w3-hide' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        <div className='w3-center'>
                                            <span className='w3-padding w3-btn w3-green' onClick={e=>{this.attachmentCount(e,'add')}}>Add</span>
                                        </div>
                                        <textarea placeholder='Enter Message...' name='message' className='w3-input w3-margin-top w3-border w3-round'></textarea>
                                        <div className='w3-center w3-margin-top'>
                                            <span className='w3-padding w3-btn w3-round w3-block w3-green' onClick={e=>{this.attachmentCount(e,'submit')}}>Submit</span>
                                        </div>
                                    </div>
                               </form>
                            </div>
                        </div>
                        <div className = 'w3-col s6 m6 l6'>
                            
                        </div>
                    </div>
                </div>
            )
        }
    }
    
}

class Settings extends Component{
    constructor(props) {
        super(props);
        this.state = {
            not: '',
            type: [],
            delievryEmails: [],
            searchCustumers: [],
            templates: []
        }
    }

    componentDidMount(){
        this.getProducts()
        this.getDelievryEmails()
        this.mobileInit()
    }

    mobileInit = () => {
        let mobile = document.getElementsByClassName('mob')
        for(let x=0; x<mobile.length; x++){
            if(x === 0){
                mobile[x].style.display = 'block'
            }else{
                mobile[x].style.display = 'none'
            }
        }
    }
    current = 0
    previous
    switch = (pram) => {
        let mobile = document.getElementsByClassName('mob')
        if(pram === 'prod'){
            mobile[0].style.display = 'block'
            mobile[1].style.display = 'none'
            mobile[2].style.display = 'none'
        }else if(pram === 'mail'){
            mobile[0].style.display = 'none'
            mobile[1].style.display = 'block'
            mobile[2].style.display = 'none'
        } if(pram === 'cus'){
            mobile[0].style.display = 'none'
            mobile[1].style.display = 'none'
            mobile[2].style.display = 'block'
        }
    }

    getDelievryEmails = () =>{
        db.collection('Admin').doc('Settings').collection('Delivery').doc('Emails').onSnapshot(d=>{
            if(d.exists){
                let emails = d.data().emails
                this.setState({delievryEmails: emails})
            }
        })
    }

    getProducts = () => {
        db.collection('Admin').doc('Settings').collection('Products').doc('Type').onSnapshot(doc=>{
            if(doc.exists){
                let products = doc.data()['products']
                let type = []
                for(let x=0; x<products.length; x++){
                    type.push(products[x])
                }
                this.setState({type: type})
            }
        })
    }

    delProduct = (id) => {
        db.collection('Admin').doc('Settings').collection('Products').doc('Type').get()
        .then(p=>{
            let prod = [...p.data()['products']]
            prod.splice(id)
            db.collection('Admin').doc('Settings').collection('Products').doc('Type').set({products: prod}).then(e=>{alert('Done')})
        })
    }

    productsUpdate = (e) => {
        e.preventDefault()
        let formData = {type: document.getElementById('type').value, price: document.getElementById('price').value}
        let not = document.getElementById('nott')
        db.collection('Admin').doc('Settings').collection('Products').doc('Type').get()
        .then(p=>{
            if(p.exists){
                db.collection('Admin').doc('Settings').collection('Products').doc('Type')
                .update({products: firebase.firestore.FieldValue.arrayUnion(formData)}).then(()=>{
                    not.classList.remove('w3-hide')
                    this.setState({not: `${formData.type} added to database`})
                    setTimeout(()=>{
                        not.classList.add('w3-hide') 
                    },8000)
                })

            }else{
                db.collection('Admin').doc('Settings').collection('Products').doc('Type')
                .set({products: firebase.firestore.FieldValue.arrayUnion(formData)})
                not.classList.remove('w3-hide')
                this.setState({not: `${formData.type} added to database`})
                setTimeout(()=>{
                    not.classList.add('w3-hide') 
                },8000)
            }
        })
    }

    deliveryEmails = (e,pram,id='') =>{
        e.preventDefault()
        if(pram === 'submit'){
            let data = {email: e.target.elements.email.value, password: e.target.elements.password.value}
            db.collection('Admin').doc('Settings').collection('Delivery').doc('Emails').get()
            .then(d=>{
                if(d.exists){
                    let emails = d.data().emails
                    let update = [...emails]
                    if(emails.indexOf(data.email) === -1){
                        update.push(data)
                        db.collection('Admin').doc('Settings').collection('Delivery').doc('Emails').update({emails: update})
                    }
                }else{
                    db.collection('Admin').doc('Settings').collection('Delivery').doc('Emails').set({emails: [data]}) 
                }
            })
        }else if(pram === 'delete'){
            db.collection('Admin').doc('Settings').collection('Delivery').doc('Emails').get()
            .then(d=>{
                    if(d.exists){
                        let emails = [...d.data().emails]
                        //console.log(emails);
                       // console.log(e.target.id);
                        emails.splice(id)
                        //console.log(emails);
                        db.collection('Admin').doc('Settings').collection('Delivery').doc('Emails').update({emails: emails})
                    }
            })
        }
    }

    searchCustumers = (e) => {
        e.preventDefault()
        db.collection('Custormers').doc(e.target.elements.search.value).get()
        .then(c=>{
            if(c.exists){
                let customers = [...c.data().details]
                this.setState({searchCustumers: customers})
                //console.log(customers);
            }
        })
    }

    testimonials = (e) => {
        e.preventDefault()
        var data = {
            name: e.target.elements.cName.value,
            testimonials: e.target.elements.testim.value,
            star1: e.target.elements.star1.checked,
            star2: e.target.elements.star2.checked,
            star3: e.target.elements.star3.checked,
            star4: e.target.elements.star4.checked,
            star5: e.target.elements.star5.checked,
        }
        db.collection('Admin').doc('Settings').collection('Testimonials').doc('all').get()
        .then(t=>{
            if(t.exists){
                let testimonials = [...t.data().testimonials]
                testimonials.push(data)
                db.collection('Admin').doc('Settings').collection('Testimonials').doc('all')
                .update({testimonials: testimonials}).then(e=>{alert('Done')})
            }else{
                db.collection('Admin').doc('Settings').collection('Testimonials').doc('all')
                .set({testimonials: [data]}).then(e=>{alert('Done')})
            }
        })
    }

    index 
    accorodion = (e, pram, ind) =>{
        e.preventDefault()
        this.index = ind
        let show = document.getElementById(pram)
        if(show.classList.contains('w3-hide')){
            show.classList.remove('w3-hide')
        }else{
            show.classList.add('w3-hide')
        }
    }

    updateCustumers = (e) =>{
        e.preventDefault()
        let formData = {
            id: this.index,
            name: document.getElementById('name').value,
            email: document.getElementById('emailU').value,
            type: document.getElementById('type').value,
            gender: document.getElementById('gender').value,
            dob: document.getElementById('dob').value,
            state: document.getElementById('state').value,
            industry: document.getElementById('ind').value,
            exp: document.getElementById('exp').value,
            paid: document.getElementById('paid').value,
            price: document.getElementById('name').value
        }
        let previous = this.state.searchCustumers
        if(formData.name !== ""){
            previous[formData.id].name = formData.name
        }else if(formData.email !== ""){
             previous[formData.id].email = formData.email 
        }else if(formData.type !== ""){
            previous[formData.id].type = formData.type  
        }else if(formData.gender !== ""){
            previous[formData.id].gender = formData.gender  
        }else if(formData.dob !== ""){
            previous[formData.id].dob = formData.dob
        }else if(formData.state !== ""){
            previous[formData.id].state = formData.state  
        }else if(formData.industry !== ""){
            previous[formData.id].industry = formData.industry 
        }else if(formData.exp !== ""){
            previous[formData.id].exp = formData.exp 
        }else if(formData.paid !== ""){
            previous[formData.id].paid = formData.paid 
        }else if(formData.price !== ""){
            previous[formData.id].price = formData.price 
        }

        db.collection('Custormers').doc(previous[formData.id].email).update({details: previous})
    }

    render() {
        if(window.matchMedia("(max-width: 767px)").matches){
            return (
                <div>
                    <div className='w3-row'>
                        
                        <div className='w3-bar w3-margin-top'>
                            <div className='w3-bar-item w3-black' onClick={e=>{this.switch('prod')}}>Products</div>
                            <div className='w3-bar-item w3-black ' onClick={e=>{this.switch('mail')}}>Emails</div>
                            <div className='w3-bar-item w3-black ' onClick={e=>{this.switch('cus')}}>Custom</div>
                        </div>
                        <div className='w3-center'>
                            <div className='w3-padding w3-blue w3-round w3-hide w3-animate-top not' id='nott'>{this.state.not}</div>
                        </div>
                        <div className='mob w3-border w3-round'>
                            <h5 className='w3-center w3-text-blue'>Add Products</h5>
                            <form className='w3-padding'>
                                <input className='w3-input w3-border' type='text' placeholder='Input product name' id='type' required />
                                <input className='w3-input w3-border w3-margin-top' type='number' placeholder='Input Price' id='price' required />
                                <div className='w3-center'>
                                    <button className='w3-blue w3-btn w3-round w3-margin-top' onClick={this.productsUpdate} >Update</button>
                                </div>
                            </form>
                            <div className = 'w3-border-top' >
                                <div className='w3-row'>
                                    <div className='w3-col s4 m4 l4 w3-center w3-bold w3-padding'>Products</div>
                                    <div className='w3-col s4 m4 l4 w3-center w3-bold w3-padding'>Price</div>
                                    <div className='w3-col s4 m4 l4 w3-center w3-bold w3-padding'>Delete</div>
                                </div>
                                <div>
                                    {
                                        this.state.type.map((arr,ind)=>{
                                            return(
                                                <div className='w3-row w3-card w3-margin-top w3-round'>
                                                    <div className='w3-col s4 m4 l4 w3-center m6 w3-padding'>{arr.type}</div>
                                                    <div className='w3-col s4 m4 l4 w3-center m6 w3-padding'>₦{arr.price}</div>
                                                    <div className='w3-col s4 m4 l4 w3-center m6 w3-padding'><img src={delet} alt={delet} style={{width:'30px', height:'30px', cursor: 'pointer'}} onClick={()=>{this.delProduct(ind)}} /></div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='mob w3-border w3-round'>
                            <h5 className='w3-center w3-text-blue'>Add Emails For Delievry</h5>
                            <div className='w3-padding'>
                                <form onSubmit={e=>{this.deliveryEmails(e, 'submit')}}>
                                    <input className='w3-input w3-border w3-round' ty='email' placeholder='Email' id='email' />
                                    <input className='w3-input w3-border w3-round w3-margin-top' type='password' placeholder='Password' id='password' />
                                    <div className='w3-center w3-margin-top'>
                                        <button className='w3-btn w3-blue w3-round'>Submit</button>
                                    </div>
                                </form>
                                <div >
                                    {
                                        this.state.delievryEmails.map((arr, ind)=>{
                                            return(
                                                <div className='w3-row w3-card w3-margin-top w3-round'>
                                                    <div className='w3-padding w3-col s4 m4 l4'>{arr.email} <img src={delet} alt={delet} key={arr.email} id={ind} style={{width:'30px', height:'30px', cursor: 'pointer'}} onClick={e=>{this.deliveryEmails(e,'delete', ind)}} /></div> 
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='mob w3-border w3-round' id='customerSettings'>
                            <div className='w3-padding w3-container'>
                                <button className='w3-button w3-padding w3-grey w3-text-white w3-block w3-padding w3-margin-top' onClick={()=>{document.getElementById('1').style.display='block'}}>Customers Settings</button>
                                <div className='w3-modal' id='1'>
                                    <div className='w3-modal-content'>
                                    <span onClick={()=>{document.getElementById('1').style.display='none'}}
                                        className="w3-button w3-display-topright">&times;</span>
                                    </div>
                                    <div className='w3-container w3-padding' style={{marginTop: '40px'}}>
                                        <form onSubmit={this.searchCustumers}>
                                            <input className='w3-input w3-border w3-round' placeholder='Custormers Record' id='search' />
                                            <div className='w3-center w3-margin-top'>
                                                <button className='w3-btn w3-blue'>Search</button>
                                            </div>
                                        </form>
                                        <div className='w3-container w3-row w3-white w3-round w3-margin-top w3-padding'>
                                            <form  id='update' onSubmit={e=>{this.updateCustumers(e)}}>
                                                    {
                                                        this.state.searchCustumers.map((arr,ind)=>{
                                                            return(
                                                                <div>
                                                                    <div className='w3-padding w3-block w3-margin-top w3-button' onClick={e=>{this.accorodion(e, `${arr.email}${ind}`)}}>{arr.name}</div>
                                                                    <div className='w3-row w3-hide' key={ind} id={`${arr.email}${ind}`}>
                                                                        <input className='w3-input w3-border w3-round w3-padding w3-col s6 m6 l6 w3-margin-top' value={arr.name} id='name' name='name' />
                                                                        <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' value={arr.email} id='email' name='email' />
                                                                        <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' value={arr.type} id='type' name='type' />
                                                                        <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' value={arr.gender} id='gender' name='gender' />
                                                                        <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' value={arr.dob} id='dob' name='dob' />
                                                                        <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' value={arr.state} id='state' name='state' />
                                                                        <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' value={arr.industry} id='ind' name='ind' />
                                                                        <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' value={arr.exp} id='exp' name='exp' />
                                                                        <div className='w3-center w3-margin-top'>
                                                                            <button className='w3-btn w3-blue'>Update</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    
                                                </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w3-padding w3-container'>
                                <button className='w3-button w3-padding w3-grey w3-text-white w3-block w3-padding w3-margin-top' onClick={()=>{document.getElementById('2').style.display='block'}}>Testimonials Settings</button>
                                <div className='w3-modal' id='2'>
                                    <div className='w3-modal-content'>
                                    <span onClick={()=>{document.getElementById('2').style.display='none'}}
                                        className="w3-button w3-display-topright">&times;</span>
                                    </div>
                                    <div className='w3-container w3-white w3-padding' style={{marginTop: '40px'}}>
                                        <form id='testimonialsForm' onSubmit={this.testimonials}>
                                            <h5 className='w3-text-blue w3-center'>Update Testimonials</h5>
                                            <input className='w3-input w3-border w3-margin-top' placeholder='Customers name' name='name' id='cName' />
                                            <textarea className='w3-input w3-border w3-margin-top' id='testim'></textarea>
                                            <h5 className='w3-center w3-text-yellow'>Rate</h5>
                                            <div className='w3-row w3-center w3-margin-top'>
                                                <input type='checkbox' className='w3-padding' id='star1' />
                                                <input type='checkbox' className='w3-padding w3-margin-left' id='star2' />
                                                <input type='checkbox' className='w3-padding w3-margin-left' id='star3' />
                                                <input type='checkbox' className='w3-padding w3-margin-left' id='star4' />
                                                <input type='checkbox' className='w3-padding w3-margin-left' id='star5' />
                                            </div>
                                            <div className='w3-center w3-margin-top'>
                                                <button className='w3-round w3-btn w3-padding w3-margin-top w3-blue'>Submit</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )
        }else{
            return (
                <div>
                    <div className='w3-row section'>
                        <div className='w3-center'>
                            <div className='w3-padding w3-blue w3-round w3-hide w3-animate-top not' id='nott'>{this.state.not}</div>
                        </div>
                        <div className='w3-col m3 l3 w3-border w3-round'>
                            <h5 className='w3-center w3-text-blue'>Add Products</h5>
                            <form className='w3-padding'>
                                <input className='w3-input w3-border' type='text' placeholder='Input product name' id='type' required />
                                <input className='w3-input w3-border w3-margin-top' type='number' placeholder='Input Price' id='price' required />
                                <div className='w3-center'>
                                    <button className='w3-blue w3-btn w3-round w3-margin-top' onClick={this.productsUpdate} >Update</button>
                                </div>
                            </form>
                            <div className = 'w3-border-top' >
                                <div className='w3-row'>
                                    <div className='w3-col s4 m4 l4 w3-center w3-bold w3-padding'>Products</div>
                                    <div className='w3-col s4 m4 l4 w3-center w3-bold w3-padding'>Price</div>
                                    <div className='w3-col s4 m4 l4 w3-center w3-bold w3-padding'>Delete</div>
                                </div>
                                <div>
                                    {
                                        this.state.type.map((arr,ind)=>{
                                            return(
                                                <div className='w3-row w3-card w3-margin-top w3-round'>
                                                    <div className='w3-col s4 m4 l4 w3-center m6 w3-padding'>{arr.type}</div>
                                                    <div className='w3-col s4 m4 l4 w3-center m6 w3-padding'>₦{arr.price}</div>
                                                    <div className='w3-col s4 m4 l4 w3-center m6 w3-padding'><img src={delet} alt={delet} style={{width:'30px', height:'30px', cursor: 'pointer'}} onClick={()=>{this.delProduct(ind)}} /></div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='w3-col m3 l3 w3-border w3-round'>
                            <h5 className='w3-center w3-text-blue'>Add Emails For Delievry</h5>
                            <div className='w3-padding'>
                                <form onSubmit={e=>{this.deliveryEmails(e, 'submit')}}>
                                    <input className='w3-input w3-border w3-round' type='email' placeholder='Email' id='email' />
                                    <input className='w3-input w3-border w3-round w3-margin-top' type='password' placeholder='Password' id='password' />
                                    <div className='w3-center w3-margin-top'>
                                        <button className='w3-btn w3-blue w3-round'>Submit</button>
                                    </div>
                                </form>
                                <div >
                                    {
                                        this.state.delievryEmails.map((arr, ind)=>{
                                            return(
                                                <div className='w3-row w3-card w3-margin-top w3-round'>
                                                    <div className='w3-padding w3-col s4 m4 l4'>{arr.email} <img src={delet} alt={delet} key={arr.email} id={ind} style={{width:'30px', height:'30px', cursor: 'pointer'}} onClick={e=>{this.deliveryEmails(e,'delete')}} /></div>
                                                    
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='w3-col m3 l3 w3-border w3-round w3-margin-left' id='customerSettings'>
                            <div className='w3-padding w3-container'>
                                <button className='w3-button w3-padding w3-grey w3-text-white w3-block w3-padding w3-margin-top' onClick={()=>{document.getElementById('Cus').style.display='block'}}>Customers Settings</button>
                                <div className='w3-modal' id='Cus'>
                                    <div className='w3-modal-content'>
                                    <span onClick={()=>{document.getElementById('Cus').style.display='none'}}
                                        className="w3-button w3-display-topright">&times;</span>
                                    </div>
                                    <div className='w3-container w3-padding' style={{marginTop: '40px'}}>
                                        <form onSubmit={this.searchCustumers}>
                                            <input className='w3-input w3-border w3-round' placeholder='Custormers Record' id='search' />
                                            <div className='w3-center w3-margin-top'>
                                                <button className='w3-btn w3-blue'>Search</button>
                                            </div>
                                        </form>
                                        <div className='w3-container w3-row w3-white w3-round w3-margin-top w3-padding'>
                                            <form  id='update' onSubmit={e=>{this.updateCustumers(e)}}>
                                                {
                                                    this.state.searchCustumers.map((arr,ind)=>{
                                                        return(
                                                            <div>
                                                                <div className='w3-padding w3-block w3-margin-top w3-button' onClick={e=>{this.accorodion(e, `${arr.email}${ind}`, ind)}}>{arr.name}</div>
                                                                <div className='w3-row w3-hide' key={ind} id={`${arr.email}${ind}`}>
                                                                    <input type='hidden' value={ind} id={ind} />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-col s6 m6 l6 w3-margin-top' type='text' placeholder={arr.name} id='name' name='name' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' type='text' placeholder={arr.email} id='emailU' name='email' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' type='text' placeholder={arr.type} id='type' name='type' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' type='text' placeholder={arr.gender} id='gender' name='gender' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' type='text' placeholder={arr.dob} id='dob' name='dob' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' type='text' placeholder={arr.state} id='state' name='state' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' type='text' placeholder={arr.industry} id='ind' name='ind' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' type='text' placeholder={arr.exp} id='exp' name='exp' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' type='text' placeholder={arr.paid} id='paid' name='paid' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' type='text' placeholder={arr.price} id='price' name='price' />
                                                                    <div className='w3-center w3-margin-top'>
                                                                        <button className='w3-btn w3-round w3-margin-top w3-blue'>Update</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w3-padding w3-container'>
                                <button className='w3-button w3-padding w3-grey w3-text-white w3-block w3-padding w3-margin-top' onClick={()=>{document.getElementById('testim').style.display='block'}}>Testimonials Settings</button>
                                <div className='w3-modal' id='testim'>
                                    <div className='w3-modal-content'>
                                    <span onClick={()=>{document.getElementById('testim').style.display='none'}}
                                        className="w3-button w3-display-topright">&times;</span>
                                    </div>
                                    <div className='w3-container w3-white w3-padding' style={{marginTop: '40px'}}>
                                       <form id='testimonialsForm' onSubmit={this.testimonials}>
                                        <h5 className='w3-text-blue w3-center'>Update Testimonials</h5>
                                            <input className='w3-input w3-border w3-margin-top' placeholder='Customers name' name='name' id='cName' />
                                            <textarea className='w3-input w3-border w3-margin-top' id='testim'></textarea>
                                            <h5 className='w3-center w3-text-yellow'>Rate</h5>
                                            <div className='w3-row w3-center w3-margin-top'>
                                                <input type='checkbox' className='w3-padding' id='star1' />
                                                <input type='checkbox' className='w3-padding w3-margin-left' id='star2' />
                                                <input type='checkbox' className='w3-padding w3-margin-left' id='star3' />
                                                <input type='checkbox' className='w3-padding w3-margin-left' id='star4' />
                                                <input type='checkbox' className='w3-padding w3-margin-left' id='star5' />
                                            </div>
                                            <div className='w3-center w3-margin-top'>
                                                <button className='w3-round w3-btn w3-padding w3-margin-top w3-blue'>Submit</button>
                                            </div>
                                       </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
    
}



export { Add,Mail,Settings, Dashboard }