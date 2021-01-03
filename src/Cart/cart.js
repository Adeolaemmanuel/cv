import React, { Component } from 'react'
import './cart.css'
import axios from 'axios'
import { db, firebase } from '../database'
import { PaystackButton } from 'react-paystack';
export default class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: this.props.formData,
            pend: []
        }
        this.continue = this.continue.bind(this)
        //console.log(this.state);
    }
    

    date =  new Date()
    check = true
    config
    continue =(e, pram=this.check) => {
        e.preventDefault()
        let info = document.getElementById('info')
        let modal = document.getElementById('id01')
        let result  = {
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
            date: `${this.date.getMonth()}/${this.date.getDate()}/${this.date.getFullYear()}`
        };
        
        db.collection('Admin').doc('Emails').get().then(e=>{
            if(e.exists){               
                db.collection('Admin').doc('Emails').update({emails: firebase.firestore.FieldValue.arrayUnion(this.state.formData[2].value)})
                .then(()=>{
                    db.collection('Custormers').doc(this.state.formData[2].value).get()
                    .then(d=>{
                        if(d.exists){
                            const P = d.data().details
                            let pen = []
                            //console.log(P);
                            if(pram){
                                for(let y=0; y<P.length; y++){
                                    if(P[y].paid === 'Pending'){
                                       if(P.length > 0){
                                            pen.push(P[P.length -1])
                                            this.setState({pend: pen})
                                            modal.style.display = 'block'
                                       }else{
                                            pen.push(P)
                                            console.log(pen.length-1);
                                            this.setState({pend: pen[0]})
                                            modal.style.display = 'block'
                                       }
                                    }
                                }
                                if(P.length <= 0){
                                    info.classList.remove('w3-hide')
                                    
                                    db.collection('Custormers').doc(this.state.formData[2].value).update({details: firebase.firestore.FieldValue.arrayUnion(result)})
                                    if(result.cv){
                                        axios.post('/cv', result).then(res => {
                                            //console.log(res.data);
                                             
                                        })
                                    }else if(result.cv){
                                        axios.post('/cvL', result).then(res => {
                                            //console.log(res.data);
                                             
                                        })
                                    }else if(result.cvl && result.cv){
                                        axios.post('/both', result).then(res => {
                                            //console.log(res.data);
                                             
                                        })
                                    }
                                }
                            }else{
                                console.log(result);
                                info.classList.remove('w3-hide')
                                document.getElementById('payBtn').classList.remove('w3-hide')
                                document.getElementById('conBtn').classList.add('w3-hide')
                                if(this.state.formData[9].value){
                                    axios.post('/cv', result).then(res => {
                                        //console.log(res.data);
                                         
                                    })
                                }else if(this.state.formData[10].value){
                                    axios.post('/cvL', result).then(res => {
                                        //console.log(res.data);
                                         
                                    })
                                }else if(result.cvl && result.cv){
                                    axios.post('/both', result).then(res => {
                                        //console.log(res.data);
                                         
                                    })
                                }
                                this.config  = {
                                    reference: (new Date()).getTime(),
                                    email: document.getElementById('payEmail').innerHTML,
                                    amount: document.getElementById('payPrice').innerHTML,
                                    publicKey: 'sk_live_b0b9f25b25234b9e553b0cef835cfd5c477af3a8',
                                  };
                            }
                        }else{
                            info.classList.remove('w3-hide')
                            db.collection('Custormers').doc(this.state.formData[2].value).set({details: firebase.firestore.FieldValue.arrayUnion(result)})
                            if(result.cv !=="" && result.cvl === ""){
                                    axios.post('/cv', result).then(res => {
                                        //console.log(res.data);
                                         
                                    })
                                }else if(result.cvl !=="" && result.cv === ""){
                                    axios.post('/cv', result).then(res => {
                                        //console.log(res.data);
                                         
                                    })
                                }else if(result.cvl !=="" && result.cv !==""){
                                    axios.post('/both', result).then(res => {
                                        //console.log(res.data);
                                         
                                    })
                                }
                        }
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

    cartPend = (pram) => {
        let modal = document.getElementById('id01')
        if(pram === 'con'){
            let original = [...this.state.formData]
            const P = [...this.state.pend]
            //console.log(original);
            //console.log(P);
            original[0].value = P[0].type
            original[0].price = P[0].price
            original[1].value = P[0].name
            original[2].value = P[0].email
            original[3].value = P[0].com
            original[4].value = P[0].gender
            original[5].value = P[0].dob
            original[6].value = P[0].state
            original[7].value = P[0].industry
            original[8].value = P[0].exp
            this.setState({formData: original})
            modal.classList.add('w3-hide')
            this.check = false
                
        }else if(pram === 'del'){
            db.collection('Custormers').doc(this.state.formData[2].value).get()
            .then(pend=>{
                const P = pend.data().details
                let pen = []
                //console.log(P);
                for(let y=0; y<P.length; y++){
                    if(P[y].paid === 'Pending'){
                        pen.push(P)
                        pen.splice(P[y])
                        db.collection('Custormers').doc(this.state.formData[2].value)
                        .update({details: pen})
                        modal.style.display = 'none'
                    }
                }
            })
        }
    }


    handlePaystackSuccessAction = (reference) => {
        // Implementation for whatever you want to do with reference and after success call.
        console.log(reference);
      };
  
      // you can call this function anything
      handlePaystackCloseAction = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        console.log('closed')
      }
  
      componentProps = {
          ...this.config,
          text: 'Pay with Paystack',
          onSuccess: (reference) => this.handlePaystackSuccessAction(reference),
          onClose: this.handlePaystackCloseAction,
      };

    render() {
        return (
            <div> 
                <div id="id01" className="w3-modal">
                    <div className="w3-modal-content">
                        <div className="w3-container">
                            <span onClick={()=>{document.getElementById('id01').style.display='none'}}
                            className="w3-button w3-display-topright">&times;</span>
                            <div className='w3-center'>
                                <h5 className='w3-blue w3-padding w3-round'>You have a product pending in your cart will you like to continue ?</h5>
                                <div className='w3-container'>
                                    {
                                        this.state.pend.map(arr=>{
                                            return(
                                                <div className='w3-row w3-padding'>
                                                    <div className='w3-col s6 m6 l6 w3-padding w3-margin-top'>{arr.type}</div>
                                                    <div className='w3-col s6 m6 l6 w3-padding w3-margin-top'>₦{arr.price}</div>
                                                    <div className='w3-col s6 m6 l6 w3-padding w3-margin-top'>{arr.email}</div>
                                                    <div className='w3-col s6 m6 l6 w3-padding w3-margin-top'>{arr.date}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className='w3-row'>
                                    <button className='w3-btn w3-blue w3-round w3-col s6 m6 l6 w3-padding' onClick={()=>{this.cartPend('con')}}>Continue</button>
                                    <button className='w3-btn w3-red w3-round w3-col s6 m6 l6 w3-padding' onClick={()=>{this.cartPend('del')}}>Delete</button>
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
                                <div className='w3-col s6 m6 l6 w3-bold w3-padding w3-text-blue'><h4 className='w3-bold w3-left'>Name</h4></div>
                                <div className='w3-col s6 m6 l6 w3-bold w3-padding' style={{overflowWrap:'break-word'}}><h6 id='payName'  className='w3-right'>{this.state.formData[1].value}</h6></div>
                            </div>
                            <div className='w3-row w3-border-top'>
                                <div className='w3-col s6 m6 l6 w3-bold w3-padding w3-text-blue'><h4 className='w3-bold w3-left'>Email</h4></div>
                                <div className='w3-col s6 m6 l6 w3-bold w3-padding' style={{overflowWrap:'break-word'}}><h6 id='payEmail' className='w3-right'>{this.state.formData[2].value}</h6></div>
                            </div>
                            <div className='w3-row w3-border-top'>
                                <div className='w3-col s6 m6 l6 w3-bold w3-padding w3-text-blue'><h4 className='w3-bold w3-left'>Product</h4></div>
                                <div className='w3-col s6 m6 l6 w3-bold w3-padding' style={{overflowWrap:'break-word'}}><h6 id='payProd' className='w3-right'>{this.state.formData[0].value}</h6></div>
                            </div>
                            <div className='w3-row w3-border-top'>
                                <div className='w3-col s6 m6 l6 w3-bold w3-padding w3-text-blue'><h4 className='w3-bold w3-left'>Amount</h4></div>
                                <div className='w3-col s6 m6 l6 w3-bold w3-padding'><h4  style={{display:'inline-block'}}>₦</h4> <h4 id='payPrice' className='w3-right' style={{display:'inline-block'}}>{this.state.formData[0].price}</h4></div>
                            </div>
                        </div>
                        <button className='w3-block w3-card w3-blue w3-button w3-hover-blue btn' id='conBtn' onClick={this.continue}><h3>Contuine</h3></button>
                        <div id='payBtn' className=' w3-hide'>
                            <PaystackButton  className='w3-block w3-card w3-green w3-button w3-bold w3-hover-green btn' {...this.componentProps} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
