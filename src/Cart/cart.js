import React, { Component } from 'react'
import './cart.css'
import axios from 'axios'
import { db, firebase } from '../database'
export default class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: this.props.formData,
            pend: []
        }
        this.continue = this.continue.bind(this)
        console.log(this.state);
    }
    

    date =  new Date()
    continue =(e) => {
        e.preventDefault()
        let info = document.getElementById('info')
        let modal = document.getElementById('id01')
        info.classList.remove('w3-hide')
        let result = {
            type: this.state.formData[0].value,
            name: this.state.formData[1].value,
            email: this.state.formData[2].value,
            com: this.state.formData[3].value,
            gender: this.state.formData[4].value,
            dob: this.state.formData[5].value,
            state: this.state.formData[6].value,
            industry: this.state.formData[7].value,
            exp: this.state.formData[8].value,
            cv: this.state.formData[9].value,
            cvl: this.state.formData[10].value,
            price: this.state.formData[0].price,
            paid: 'Pending',
            date: `${this.date.getMonth()}-${this.date.getDate()}-${this.date.getFullYear()}`
        };
        console.log(result);
        db.collection('Admin').doc('Emails').get().then(e=>{
            if(e.exists){               
                db.collection('Admin').doc('Emails').update({emails: firebase.firestore.FieldValue.arrayUnion(this.state.formData[2].value)})
                .then(()=>{
                    db.collection('Custormers').doc(this.state.formData[2].value).get()
                    .then(d=>{
                        if(d.exists){
                            db.collection('Custormers').doc(this.state.formData[2].value).get()
                            .then(pend=>{
                                const P = pend.data().details
                                let pen = []
                                console.log(P);
                                for(let y=0; y<P.length; y++){
                                    if(P[y].paid === 'Pending'){
                                        pen.push(P[y])
                                        this.setState({pend: pen[0]})
                                        modal.style.display = 'block'
                                    }else{
                                        db.collection('Custormers').doc(this.state.formData[2].value).update({details: firebase.firestore.FieldValue.arrayUnion(result)})
                                    }
                                }
                            })
                        }else{
                            db.collection('Custormers').doc(this.state.formData[2].value).set({details: firebase.firestore.FieldValue.arrayUnion(result)})
                        }
                    })
                }).then(()=>{
                    axios.post('/', this.state.formData).then(res => {
                        console.log(res.data);
                        
                    })
                })
            }else{
                db.collection('Admin').doc('Emails').set({emails: firebase.firestore.FieldValue.arrayUnion(this.state.formData[2].value)})
                .then(()=>{
                    db.collection('Custormers').doc(this.state.formData[2].value).get()
                    .then(d=>{
                        if(d.exists){
                            db.collection('Custormers').doc(this.state.formData[2].value).update({details: firebase.firestore.FieldValue.arrayUnion(result)})
                        }else{
                            db.collection('Custormers').doc(this.state.formData[2].value).set({details: firebase.firestore.FieldValue.arrayUnion(result)})
                        }
                    })
                })
            }
        })
        setTimeout(()=>{info.classList.add('w3-hide')}, 9000)
    }

    render() {
        return (
            <div> 
                <div id="id01" className="w3-modal">
                    <div className="w3-modal-content">
                        <div className="w3-container">
                            <span onClick={()=>{document.getElementById('id01').style.display='none'}}
                            className="w3-button w3-display-topright">&times;</span>
                            <div className='w3-center'>
                                <h5 className='w3-red w3-padding w3-round'>You have a product pending in your cart will you like to continue ?</h5>
                                <div className='w3-container'>
                                    {
                                        this.state.pend.map(arr=>{
                                            return(
                                                <div className='w3-row'>
                                                    <div className='w3-padding'>{arr.type}</div>
                                                    <div className='w3-padding'>{arr.price}</div>
                                                    <div className='w3-padding'>{arr.email}</div>
                                                    <div className='w3-padding'>{arr.date}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className='w3-row'>
                                    <button className='w3-btn w3-blue w3-col s6 m6 l6 w3-padding'>Continue</button>
                                    <button className='w3-btn w3-blue w3-col s6 m6 l6 w3-padding'>Delete</button>
                                </div>
                            </div>
                            <div className='w3-center w3-margin-bottom w3-round'>
                                <button className='w3-btn w3-blue w3-round w3-hide' id='SubmitBtn' onClick={e=>{this.props.rout(this.formData)}}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w3-bar w3-blue w3-padding w3-hide w3-animate-top' style={{position: 'absolute'}} id='info'>
                    <div className='w3-bar-item w3-center w3-bold'><h6>You will recieve a Mail in you Please check your inbox to proceed</h6></div>
                    <div className='w3-bar-item w3-right' style={{cursor: 'pointer'}} onClick={()=>{document.getElementById('info').classList.add('w3-hide')}}>X</div>
                </div>
                <div className='w3-center'>
                    <div style={{display: 'inline-block'}}>
                        <h1 className='w3-padding w3-text-blue cart'>CART</h1>
                        <div className='w3-container cart w3-border w3-padding w3-card' style={{borderRadius: '5px 5px 0px 0px'}}>
                            <div className='w3-row'>
                                <div className='w3-col s6 m6 l6 w3-bold w3-padding'><h4>Name</h4></div>
                                <div className='w3-col s6 m6 l6 w3-bold w3-padding' style={{overflowWrap:'break-word'}}><h6>{this.state.formData[1].value}</h6></div>
                            </div>
                            <div className='w3-row w3-border-top'>
                                <div className='w3-col s6 m6 l6 w3-bold w3-padding'><h4>Email</h4></div>
                                <div className='w3-col s6 m6 l6 w3-bold w3-padding' style={{overflowWrap:'break-word'}}><h6>{this.state.formData[2].value}</h6></div>
                            </div>
                            <div className='w3-row w3-border-top'>
                                <div className='w3-col s6 m6 l6 w3-bold w3-padding'><h4>Product</h4></div>
                                <div className='w3-col s6 m6 l6 w3-bold w3-padding' style={{overflowWrap:'break-word'}}><h6>{this.state.formData[0].value}</h6></div>
                            </div>
                            <div className='w3-row w3-border-top'>
                                <div className='w3-col s6 m6 l6 w3-bold w3-padding'><h4>Amount</h4></div>
                                <div className='w3-col s6 m6 l6 w3-bold w3-padding'><h4>₦{this.state.formData[0].price}</h4></div>
                            </div>
                        </div>
                        <button className='w3-block w3-card w3-blue w3-button w3-hover-blue btn' onClick={this.continue}><h3>Contuine</h3></button>
                    </div>
                </div>
            </div>
        )
    }
}
