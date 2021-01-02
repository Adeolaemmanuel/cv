import React, { Component } from 'react'
import { Cookies } from 'react-cookie'
import '../Dasboard/dashboard.css';
import Nav, { Sidebar } from '../nav/nav';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { db, firebase } from '../database'
import delet from '../assets/img/delete.svg';

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
            filterM: 'name'
        }
    }

    componentDidMount(){
        this.getCustomers()
    }

    custormers = []

    getCustomers = () => {
        db.collection('Admin').doc('Emails').onSnapshot(e=>{
            if(e.exists){
                let emails = [...e.data()['emails']]
                //console.log(emails);
                for(let x=0; x<emails.length; x++){
                    db.collection('Custormers').doc(emails[x]).get()
                    .then(c=>{
                        for(let p=0; p< c.data().details.length; p++){
                            this.custormers.push(c.data().details[p])  
                            if(c.data().details[p].paid === 'Pending'){
                                this.setState({pending: this.state.pending + 1})
                            }else if(c.data().details[p].paid === 'Paid'){
                                this.setState({pending: this.state.paid + 1})
                            }                          
                        }
                        console.log(this.custormers);
                    }).then(()=>{this.setState({details: this.custormers})})
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
                this.custormers = []
                this.setState({details: []})
                db.collection('Admin').doc('Emails').onSnapshot(e=>{
                    if(e.exists){
                        let emails = [...e.data()['emails']]
                        //console.log(emails);
                        for(let x=0; x<emails.length; x++){
                            db.collection('Custormers').doc(emails[x]).get()
                            .then(c=>{
                                for(let p=0; p< c.data().details.length; p++){
                                    this.custormers.push(c.data().details[p])                          
                                }
                            }).then(()=>{this.setState({details: this.custormers})})
                        }
                    }
                })
            }
            return arr
        })
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
            option: [{value: 'Mail', label: 'Mail'}, {value: 'Dashboard', label: 'Dashboard'}, {value: 'Settings', label: 'Settings'}],
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
                let emails = [...e.data().email]
                for(let x=0; x<emails.length; x++){
                    db.collection('Users').doc(emails[x]).get()
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
            {name: 'Email', value: e.target.elements.email.value},
            {name: 'Password', value: e.target.elements.password.value},
            {name: 'Permission', value: this.state.selectedOption},
        ]
        console.log(formData);
        if(formData[0].value !== "" && formData[1].value !== "" && formData[2].value !== "" && formData[3].value !== ""){
            db.collection('Users').doc(formData[1].value).get()
            .then(u=>{
                if(u.exists){
                    db.collection('Users').doc(formData[1].value).update({
                        Name: formData[0].value,
                        Email: formData[1].value,
                        Password:  formData[2].value,
                        Permission:  formData[3].value,
                    }).then(()=>{db.collection('Admin').doc('Users').update({emails: firebase.firestore.FieldValue.arrayUnion(formData[1].value)})})
                }else{
                    db.collection('Admin').doc('Users').get()
                    .then(email=>{
                        if(email.exists){
                            let emails = email.data().email
                            if(emails.indexOf(formData[1].value) === -1){
                                db.collection('Users').doc(formData[1].value).set({
                                    Name: formData[0].value,
                                    Email: formData[1].value,
                                    Password:  formData[2].value,
                                    Permission:  formData[3].value,
                                }).then(()=>{db.collection('Admin').doc('Users').set({emails: firebase.firestore.FieldValue.arrayUnion(formData[1].value)})})
                            }
                        }else{
                            db.collection('Users').doc(formData[1].value).set({
                                Name: formData[0].value,
                                Email: formData[1].value,
                                Password:  formData[2].value,
                                Permission:  formData[3].value,
                            }).then(()=>{db.collection('Admin').doc('Users').set({emails: firebase.firestore.FieldValue.arrayUnion(formData[1].value)})})
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
        console.log(this.state.users);
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

        }
    }

    render() {
        return (
            <div>
                <Nav />
                <Sidebar />
                <div className='w3-row section'>
                    <div className='w3-col m6 l6'>
                        <div className='w3-padding'>

                        </div>
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
            not: '',
            type: []
        }
    }

    componentDidMount(){
        this.getProducts()
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
                        <div className='w3-col 12 m4 l4 w3-border w3-round'>
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
                        <div className='w3-col 12 m4 l4 w3-border w3-round'>
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
                    </div>
                </div>
            )
        }
    }
    
}



export { Add,Mail,Settings }