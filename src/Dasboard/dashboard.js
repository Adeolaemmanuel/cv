import React, { Component } from 'react'
import { Cookies } from 'react-cookie'
import '../Dasboard/dashboard.css';
import Nav, { Sidebar } from '../nav/nav';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { db, firebase } from '../database'
import delet from '../assets/img/delete.svg';
import cv from '../assets/img/cv.svg'
import cvl from '../assets/img/cvl.svg'

export default class Dashboard extends Component{
    constructor(props) {
        const cookies = new Cookies()
        super(props);
        this.state = {
            email: cookies.get('email'),
            filter: ['Name','Email','Paid','Type'],
            details: [],
            pending: 0,
            paid: 0,
            users: 0,
            filterM: 'name',
            reminders: []
        }
    }

    componentDidMount(){
        this.getCustomers()
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
                        for(let p=0; p< c.data().details.length; p++){
                            this.customers.push(c.data().details[p])  
                            if(c.data().details[p].paid === 'Pending'){
                                this.setState({pending: this.state.pending + 1})
                            }else if(c.data().details[p].paid === 'Paid'){
                                this.setState({pending: this.state.paid + 1})
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
        this.state.details.filter(arr=>{
            if(arr[this.state.filterM] === e.target.value || arr[this.state.filterM].toLowerCase() === e.target.value.toLowerCase()){
                this.setState(state=>({details: [arr]}))
            }else if(e.target.value === ''){
                this.customers = []
                this.setState({details: []})
                db.collection('Admin').doc('Emails').onSnapshot(e=>{
                    if(e.exists){
                        let emails = [...e.data()['emails']]
                        //console.log(emails);
                        for(let x=0; x<emails.length; x++){
                            db.collection('Custormers').doc(emails[x]).get()
                            .then(c=>{
                                for(let p=0; p< c.data().details.length; p++){
                                    this.customers.push(c.data().details[p])                          
                                }
                            }).then(()=>{this.setState({details: this.customers})})
                        }
                    }
                })
            }
            return arr
        })
    }

    customersOption = (e,pram) => {
        e.preventDefault()
        console.log(e.target.id);
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
                                <input type='text'className='w3-input w3-border' placeholder='Search' />
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
                                                <div className='w3-row w3-cardw3-margin-top w3-button w3-block' key={ind} onClick={()=>{this.accorodion(ind)}}>
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
                    <Sidebar />
                </div>
            )
        }else{
            return (
                <div>
                    <Nav />
                    <Sidebar />
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
                        <form>
                            <div className='w3-col m8 l8 w3-padding'>
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
                                                                <button className='w3-col m4 l4 w3-btn w3-red w3-padding' id={arr.email} onClick={(e)=>{this.customersOption(e, 'delete')}} >Delete</button>
                                                                <button className='w3-col m4 l4 w3-btn w3-green w3-padding' id={arr.email} onClick={(e)=>{this.customersOption(e, 'send')}}>Send Reminder</button>
                                                                <button className='w3-col m4 l4 w3-btn w3-blue w3-padding' id={arr.email} onClick={(e)=>{this.customersOption(e, 'add')}}>Add Reminder</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                        }) 
                                        }
                                    </div>
                                </div>
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
                                <div className='w3-padding'>
                                    <h4 className='w3-padding w3-blue w3-bold'>Set Reminder</h4>
                                    <div className='w3-padding'>
                                        {
                                            this.state.reminders.map(arr=>{
                                                return(
                                                    <div className='w3-round w3-card w3-padding w3-margin-top' id={arr}>{arr}</div>
                                                )
                                            })
                                        }
                                    </div>
                                    <button className='w3-green w3-btn w3-round w3-margin-top'>Send</button>
                                </div>
                            </div>
                        </form>
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
                    }).then(()=>{db.collection('Admin').doc('Users').update({emails: firebase.firestore.FieldValue.arrayUnion(formData[1].value)})})
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
                            }).then(()=>{db.collection('Admin').doc('Users').set({user: firebase.firestore.FieldValue.arrayUnion(formData[1].value)})})
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

    render() {
        //console.log(this.state.users);
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
                                                <div className='w3-col s1 m1 l1 w3-margin-left w3-center w3-padding'><img src={delet} alt={delet} style={{width:'30px', height:'30px', cursor: 'pointer'}} onClick={()=>{this.delProduct(ind)}} /></div>
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
            console.log(currentCount);
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
                    <Nav />
                    <Sidebar />
                    <div className='w3-row'>
                        <div className='w3-col s6'>
                            <div className='w3-padding'>
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

                            </div>
                        </div>
                    </div>
                </div>
            )
        }else{
            return (
                <div>
                    <Nav />
                    <Sidebar />
                    <div className='w3-row section'>
                        <div className='w3-col s6 m5 l5'>
                            <div className='w3-padding'>
                               <form>
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
            searchCustumers: []
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

    switch = (pram) => {
        let current = 0;
        let previous
        let mobile = document.getElementsByClassName('mob')
        if(pram === 'next' && current <= mobile.length){
            current = current + 1
            previous = current - 1
            mobile[current].style.display = 'block'
            mobile[previous].style.display = 'none'
            console.log(current);
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
            db.collection('Admin').doc('Settings').collection('Products').doc('Type').set({products: prod})
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

    deliveryEmails = (e,pram) =>{
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
                        let emails = d.data().emails
                        let update = [...emails]
                        update.splice(e.target.id)
                        db.collection('Admin').doc('Settings').collection('Delivery').doc('Emails').update({emails: update})
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
            }
        })
    }

    testimonials = (e) => {
        e.preventDefault()
        console.log(e.target);
    }

    accorodion = (e, pram) =>{
        e.preventDefault()
        let show = document.getElementById(pram)
        if(show.classList.contains('w3-hide')){
            show.classList.remove('w3-hide')
        }else{
            show.classList.add('w3-hide')
        }
    }

    render() {
        if(window.matchMedia("(max-width: 767px)").matches){
            return (
                <div>
                    <Nav />
                    <Sidebar />
                    <div className='w3-row'>
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
                                                    <div className='w3-padding w3-col s4 m4 l4'>{arr.email} <img src={delet} alt={delet} key={arr.email} id={ind} style={{width:'30px', height:'30px', cursor: 'pointer'}} onClick={e=>{this.deliveryEmails(e,'delete')}} /></div>
                                                    
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
                                            <form>
                                                {
                                                    this.state.searchCustumers.map((arr,ind)=>{
                                                        return(
                                                            <div>
                                                                <div className='w3-padding w3-block w3-margin-top w3-button' onClick={e=>{this.accorodion(e, `${arr.email}${ind}`)}}>{arr.name}</div>
                                                                <div className='w3-row w3-hide' key={ind} id={`${arr.email}${ind}`}>
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-col s6 m6 l6 w3-margin-top' placeholder={arr.name} id='name' name='name' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' placeholder={arr.email} id='email' name='email' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' placeholder={arr.type} id='type' name='type' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' placeholder={arr.gender} id='gender' name='gender' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' placeholder={arr.dob} id='dob' name='dob' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' placeholder={arr.state} id='state' name='state' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' placeholder={arr.industry} id='ind' name='ind' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' placeholder={arr.exp} id='exp' name='exp' />
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
                                            <input className='w3-input w3-border w3-margin-top' placeholder='Customers name' id='cName' />
                                            <textarea className='w3-input w3-border w3-margin-top'></textarea>
                                            <h5 className='w3-center w3-text-yellow'>Rate</h5>
                                            <div className='w3-row w3-center w3-margin-top'>
                                                <input type='checkbox' className='w3-padding' value='star-1' />
                                                <input type='checkbox' className='w3-padding w3-margin-left' value='star-2' />
                                                <input type='checkbox' className='w3-padding w3-margin-left' value='star-3' />
                                                <input type='checkbox' className='w3-padding w3-margin-left' value='star-4' />
                                                <input type='checkbox' className='w3-padding w3-margin-left' value='star-5' />
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

                    <div className='w3-bar w3-margin-top'>
                        <div className='w3-bar-item w3-black'>Previous</div>
                        <div className='w3-bar-item w3-black w3-right' onClick={e=>{this.switch('next')}}>Next</div>
                    </div>
                </div>
            )
        }else{
            return (
                <div>
                    <Nav />
                    <Sidebar />
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
                                            <form>
                                                {
                                                    this.state.searchCustumers.map((arr,ind)=>{
                                                        return(
                                                            <div>
                                                                <div className='w3-padding w3-block w3-margin-top w3-button' onClick={e=>{this.accorodion(e, `${arr.email}${ind}`)}}>{arr.name}</div>
                                                                <div className='w3-row w3-hide' key={ind} id={`${arr.email}${ind}`}>
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-col s6 m6 l6 w3-margin-top' placeholder={arr.name} id='name' name='name' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' placeholder={arr.email} id='email' name='email' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' placeholder={arr.type} id='type' name='type' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' placeholder={arr.gender} id='gender' name='gender' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' placeholder={arr.dob} id='dob' name='dob' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' placeholder={arr.state} id='state' name='state' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' placeholder={arr.industry} id='ind' name='ind' />
                                                                    <input className='w3-input w3-border w3-round w3-padding w3-margin-top w3-col s6 m6 l6' placeholder={arr.exp} id='exp' name='exp' />
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
                                            <input className='w3-input w3-border w3-margin-top' placeholder='Customers name' id='cName' />
                                            <textarea className='w3-input w3-border w3-margin-top'></textarea>
                                            <h5 className='w3-center w3-text-yellow'>Rate</h5>
                                            <div className='w3-row w3-center w3-margin-top'>
                                                <input type='checkbox' className='w3-padding' value='star-1' />
                                                <input type='checkbox' className='w3-padding w3-margin-left' value='star-2' />
                                                <input type='checkbox' className='w3-padding w3-margin-left' value='star-3' />
                                                <input type='checkbox' className='w3-padding w3-margin-left' value='star-4' />
                                                <input type='checkbox' className='w3-padding w3-margin-left' value='star-5' />
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



export { Add,Mail,Settings }