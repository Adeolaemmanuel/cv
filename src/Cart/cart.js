import React, { Component } from 'react'
import './cart.css'
import axios from 'axios'
import { db, firebase } from '../database'
export default class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: this.props.formData
        }
        this.continue = this.continue.bind(this)
        console.log(this.state);
    }
    


    continue(e){
        e.preventDefault()
        let info = document.getElementById('info')
        info.classList.remove('w3-hide')
        let data = this.state.formData
        db.collection('Admin').doc('Settings').collection('Products').doc('Price').get().then(p=>{
            if(p.exists){
                let price = p.data().price
                for(let x of price){
                     if(price[x].type === data[0].name){
                         data[0].price = price[x].price
                         this.setState({formData: data})
                     }
                }

                db.collection('Admin').doc('Emails').get().then(e=>{
                    if(e.exists){
                        db.collection('Admin').doc('Emails').update({emails: firebase.firestore.FieldValue.arrayUnion(this.state.formData[2])})
                        .then(()=>{
                            db.collection('Custormers').doc(this.state.formData[2].value).update({emails: firebase.firestore.FieldValue.arrayUnion(this.state.formData[2])})
                        }).then(()=>{
                            axios.post('/', this.state.formData).then(res => {
                                console.log(res.data);
                                this.props.setsCart()
                            })
                        })
                    }else{
                        db.collection('Admin').doc('Emails').set({emails: firebase.firestore.FieldValue.arrayUnion(this.state.formData[2])})
                        .then(()=>{
                            db.collection('Custormers').doc(this.state.formData[2].value).set({emails: firebase.firestore.FieldValue.arrayUnion(this.state.formData[2])})
                        })
                    }
                })
                
            }
        })
        setTimeout(()=>{info.classList.add('w3-hide')}, 9000)
    }

    render() {
        return (
            <div> 
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
                                <div className='w3-col s6 m6 l6 w3-bold w3-padding'><h4>Amount</h4></div>
                            </div>
                        </div>
                        <button className='w3-block w3-card w3-blue w3-button w3-hover-blue btn' onClick={this.continue}><h3>Contuine</h3></button>
                    </div>
                </div>
            </div>
        )
    }
}
