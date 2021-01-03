import React, { Component } from 'react'
import './home.css'
import cv from '../assets/img/cv.svg'
import cvl from '../assets/img/cvl.svg'
import cv1 from '../assets/img/1.png'
import cv2 from '../assets/img/2.png'
import cv3 from '../assets/img/3.jpg'
import star from '../assets/img/star.svg'
import reg from '../assets/img/id.svg'
import card from '../assets/img/card.svg'
import mail from '../assets/img/mail.svg'
import Nav from '../nav/nav';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import Cart from '../Cart/cart'
import axios from 'axios'
import { db } from '../database'

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            route: '/',
            formData: []
        }
        this.route = this.route.bind(this)
    }
    
    componentDidMount(){
        
    }
    
    route(pram){
        this.setState({route: 'cart', formData: pram})
    }

    render() {
        if(this.state.route === '/'){
            return(
                <div>
                    <Nav />
                    <Kigenni rout={this.route} />
                </div>
            )
        }else if(this.state.route === 'cart'){
            return(
                <div>
                    <Nav />
                    <Cart formData={this.state.formData} />
                </div>
            )
        }
    }
}


class Kigenni extends Component{
    constructor(props) {
        super(props);
        this.state = {
            type: [],
            commun: ['Email', 'Phone', 'Skype (Text)', 'Skype (Call)'],
            gender: ['Male', 'Female'],
            state: ['Abuja'],
            not: 'yes',
            industry: ['Oil & Gas'],
            cvName: 'Upload CV',
            cvlName: 'Upload Cover Letter',
            slide: [cv1,cv2,cv3],
            testimonials: [],
        }

        //formSelect = formSelect.bind(this)
    }
    
    componentDidMount(){
        this.getProducts()
        this.getTestimonials()
    }

    getTestimonials = () =>{
        db.collection('Admin').doc('Settings').collection('Testimonials').doc('all').get()
        .then(t=>{
            if(t.exists){
                let testimonials = t.data().testimonials
                for(let x=0; x<testimonials.length; x++){
                    if(testimonials[x].star1 === false){
                        delete testimonials[x].star1
                    }else{
                        testimonials[x].star = [testimonials[x].star1]
                    }
                    if(testimonials[x].star2 === false){
                        delete testimonials[x].star2
                    }else{
                        testimonials[x].star.push(testimonials[x].star2)
                    }
                    if(testimonials[x].star3 === false){
                        delete testimonials[x].star3
                    }else{
                        testimonials[x].star.push(testimonials[x].star3)
                    }
                    if(testimonials[x].star4 === false){
                        delete testimonials[x].star4
                    }else{
                        testimonials[x].star.push(testimonials[x].star4)
                    }
                    if(testimonials[x].star5 === false){
                        delete testimonials[x].star5
                    } else{
                        testimonials[x].star.push(testimonials[x].star5)
                    }
                }
                console.log(testimonials);
                this.setState({testimonials: testimonials})
            }
        })
    }

    formData = []
    products = []
    
    getProducts = () => {
        db.collection('Admin').doc('Settings').collection('Products').doc('Type').onSnapshot(doc=>{
            if(doc.exists){
                let products = doc.data()['products']
                let type = []
                for(let x=0; x<products.length; x++){
                    type.push(products[x].type)
                    this.products.push(products[x])
                }
                this.setState({type: type})
                //console.log(this.products);
            }
        })
    }


    formSelect = (e,pram)=>{
        e.preventDefault()
        let btnSec1 = document.getElementsByClassName('btnSec1')
        let btnCon = document.getElementById('btnCon')
        let formContainer = document.getElementById('formContainer')
        let newWrite = document.getElementById('new')
        let section1 = document.getElementById('section1')
        let section2 = document.getElementById('section2')
        let SubmitBtn = document.getElementById('SubmitBtn')
        let not = document.getElementById('nott')
        let slide = document.getElementById('me')
        let cvC = document.getElementById('cC')
        let cvlC = document.getElementById('clC')
        
        this.formData = [
            {value: document.getElementById('type').value, name: 'Type'},
            {value: document.getElementById('name').value, name: 'Name'},
            {value: document.getElementById('email').value, name: 'Email'},
            {value: document.getElementById('com').value, name: 'Communication'},
            {value: document.getElementById('gender').value, name: 'Gender'},
            {value: document.getElementById('dob').value, name: 'DOB'},
            {value: document.getElementById('state').value, name: 'State'},
            {value: document.getElementById('ind').value, name: 'Industry'},
            {value: document.getElementById('exp').value, name: 'Experience'},
            {value: document.getElementById('cv').value, name: 'CV'},
            {value: document.getElementById('cvl').value, name: 'Cover Letter'},
        ]

        if(pram === 'new'){
            btnSec1[1].style.display = 'none'
            btnSec1[0].style.display = 'none'
            formContainer.classList.remove('w3-hide')
            newWrite.classList.remove('w3-hide')
            formContainer.classList.add('formanim')
            slide.style.display = 'none';
            btnCon.classList.add('w3-animate-fade')
        }if(pram === 'next'){
            if(this.formData[0].value === "default" || this.formData[0].value === ""){
                not.classList.remove('w3-hide')
                this.setState({not: `Missing Details ${this.formData[0].name}`})
                setTimeout(()=>{
                    not.classList.add('w3-hide') 
                },8000)
                
            }else if(this.formData[1].value === "" || this.formData[1].value === "default"){
                not.classList.remove('w3-hide')
                this.setState({not: `Missing Details ${this.formData[1].name}`})
                setTimeout(()=>{
                    not.classList.add('w3-hide') 
                },8000)
            }else if(this.formData[2].value === "" || this.formData[2].value === "default"){
                not.classList.remove('w3-hide')
                this.setState({not: `Missing Details ${this.formData[2].name}`})
                setTimeout(()=>{
                    not.classList.add('w3-hide') 
                },8000)
            }else if(this.formData[3].value === "" || this.formData[3].value === "default"){
                not.classList.remove('w3-hide')
                this.setState({not: `Missing Details ${this.formData[3].name}`})
                setTimeout(()=>{
                    not.classList.add('w3-hide') 
                },8000)
            }else if(this.formData[4].value === "" || this.formData[4].value === "default"){
                not.classList.remove('w3-hide')
                this.setState({not: `Missing Details ${this.formData[1].name}`})
                setTimeout(()=>{
                    not.classList.add('w3-hide') 
                },8000)
            }else if(this.formData[5].value === "" || this.formData[5].value === "default"){
                not.classList.remove('w3-hide')
                this.setState({not: `Missing Details ${this.formData[5].name}`})
                setTimeout(()=>{
                    not.classList.add('w3-hide') 
                },8000)
            }else if(this.formData[6].value === "" || this.formData[6].value === "default"){
                not.classList.remove('w3-hide')
                this.setState({not: `Missing Details ${this.formData[6].name}`})
                setTimeout(()=>{
                    not.classList.add('w3-hide') 
                },8000)
            }else if(this.formData[7].value === "" || this.formData[7].value === "default"){
                not.classList.remove('w3-hide')
                this.setState({not: `Missing Details ${this.formData[7].name}`})
                setTimeout(()=>{
                    not.classList.add('w3-hide') 
                },8000)
            }else if(this.formData[8].value === "" || this.formData[8].value === "default"){
                not.classList.remove('w3-hide')
                this.setState({not: `Missing Details ${this.formData[8].name}`})
                setTimeout(()=>{
                    not.classList.add('w3-hide') 
                },8000)
            }else{
                if(this.formData[0].value === 'CV'){
                    cvC.classList.remove('w3-hide')
                    cvC.classList.remove('w3-half')
                }else if(this.formData[0].value === 'Cover Letter'){
                    cvlC.classList.remove('w3-hide')
                    cvlC.classList.remove('w3-half')
                }else if(this.formData[0].value === 'CV + Cover Letter'){
                    cvC.classList.remove('w3-hide')
                    cvlC.classList.remove('w3-hide')
                }else{
                    cvC.classList.remove('w3-hide')
                    cvlC.classList.remove('w3-hide')
                }
                section1.classList.add('w3-hide')
                section2.classList.remove('w3-hide')
                SubmitBtn.classList.remove('w3-hide')
                
            }
            
        }if(pram === 'submit'){
            let modal = document.getElementById('id01')
            for(let x in this.products){
                if(this.products[x].type === this.formData[0].value){
                    if(this.formData[9].value === ""){
                        this.formData[0].price = this.products[x].price
                        modal.style.display = 'block'
                    }else{
                        this.formData[0].price = this.products[x].price
                        this.props.rout(this.formData)
                    }
                }else if(this.products[x].type === this.formData[0].value){
                    this.props.rout(this.formData)
                }else if(this.products[x].type === this.formData[0].value){
                    this.props.rout(this.formData)
                    axios.post('/', this.formData).then(res => {
                        //console.log(res.data);
                    })
                }
            }
        }
    }

    name = (pram) => {
        let cv = document.getElementById('cv').value
        let cvl = document.getElementById('cvl').value
        if (pram === 'cv') {
            this.setState({cvName: cv.substr(12)})
            
        }else if (pram === 'cvl') {
            this.setState({cvlName: cvl.substr(12)})
            
        }
    }
    
    steps = (id) => {
        let steps = document.getElementsByClassName('steps')
        let stepsBtn = document.getElementsByClassName('stepsBtn')
        if(id === 'one'){
            stepsBtn[0].classList.add('w3-border-blue')
            steps[0].classList.remove('w3-hide')

            stepsBtn[1].classList.remove('w3-border-blue')
            steps[1].classList.add('w3-hide')

            stepsBtn[2].classList.remove('w3-border-blue')
            steps[2].classList.add('w3-hide')
        }else if(id === 'two'){
            stepsBtn[0].classList.remove('w3-border-blue')
            steps[0].classList.add('w3-hide')

            stepsBtn[1].classList.add('w3-border-blue')
            steps[1].classList.remove('w3-hide')

            stepsBtn[2].classList.remove('w3-border-blue')
            steps[2].classList.add('w3-hide')
        }else if(id === 'three'){
            stepsBtn[0].classList.remove('w3-border-blue')
            steps[0].classList.add('w3-hide')

            stepsBtn[1].classList.remove('w3-border-blue')
            steps[1].classList.add('w3-hide')

            stepsBtn[2].classList.add('w3-border-blue')
            steps[2].classList.remove('w3-hide')
        }
    }

    render() {
        if(window.matchMedia("(max-width: 767px)").matches){
            return (
                <>
                    <div id='Home' className='w3-row'>
                        <div className='w3-col m5 l5'>
                            <div className='w3-container w3-padding'>
                                <h2 className='w3-bold w3-text-blue'>CAREER FULFILLMENT IS ALL ABOUT YOU.</h2>
                                <h5 className=''>WE ARE EXCITED TO HELP YOU BEGIN YOUR JOURNEY TO CAREER FULFILLMENT!</h5>
                            </div>
                        </div>
                        <div className="bgm">
                                <div className="mountain">
                                    <div className="mountain-top">
                                    <div className="mountain-cap-1"></div>
                                    <div className="mountain-cap-2"></div>
                                    <div className="mountain-cap-3"></div>
                                    </div>
                                </div>
                                <div className="mountain-two">
                                    <div className="mountain-top">
                                    <div className="mountain-cap-1"></div>
                                    <div className="mountain-cap-2"></div>
                                    <div className="mountain-cap-3"></div>
                                    </div>
                                </div>
                                <div className="mountain-three">
                                    <div className="mountain-top">
                                    <div className="mountain-cap-1"></div>
                                    <div className="mountain-cap-2"></div>
                                    <div className="mountain-cap-3"></div>
                                    </div>
                                </div>
                                <div className="cloud"></div>
                            </div>
                        <div className='w3-rest w3-padding'>
                            <div className='w3-padding w3-blue w3-round w3-hide w3-animate-top not' id='nott'>{this.state.not}</div>
                            <div className='w3-container w3-center'>
                                <Splide
                                    options={ {
                                        type         : 'loop',
                                        gap          : '1rem',
                                        autoplay     : true,
                                    } }
                                    id="me"
                                >
                                    { this.state.slide.map( slide => (
                                        <SplideSlide key={ slide }>
                                            <img src={ slide } alt={ slide } style={{width: '300px', height:'300px'}} />
                                        </SplideSlide>
                                    ) ) }
                                </Splide>
                            </div>
                            <div className='w3-center w3-margin-bottom' id='btnCon' style={{marginTop: '70px'}}>
                                <button className='w3-btn w3-border w3-text-white w3-blue w3-round w3-mobile btnSec1' onClick={(e)=>{this.formSelect(e,'new')}}>WRITE A NEW ONE</button>
                                <button className='w3-btn w3-border w3-text-white w3-blue w3-round w3-mobile w3-margin-top btnSec1'>GET A REVIEW</button>
                            </div>
    
                            <div className='w3-row w3-border w3-round w3-hide w3-white' id='formContainer'>
                                <div id ='new' className='w3-margin-top w3-hide'>
                                    <h2 className='w3-center w3-text-blue'>WRITING FORM</h2>
                                    <form>
                                        <div id='section1'>
                                            <div className='w3-row'>
                                                <div className='w3-half w3-padding'>
                                                    <select className='w3-input w3-hover-border-blue' name='type' id='type' defaultValue ="default">
                                                        <option value='default' disabled>What would you like to write today?</option>
                                                        {
                                                            this.state.type.map(arr=>{
                                                                return( <option key={arr}>{arr}</option> )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div className='w3-half w3-padding'>
                                                    <input className='w3-input w3-hover-border-blue' name='fullname' id='name' placeholder="Full name" />
                                                </div>
                                            </div>
                                            <div className='w3-row'>
                                                <div className='w3-half w3-padding'>
                                                    <input className='w3-input w3-hover-border-blue' name='email' id='email' placeholder='Email' />
                                                </div>
                                                <div className='w3-half w3-padding'>
                                                    <select className='w3-input w3-hover-border-blue' name='com' id='com' defaultValue='default'>
                                                        <option value='default' disabled>Mode Of Communication</option>
                                                        {
                                                            this.state.commun.map(arr=>{
                                                                return( <option key={arr}>{arr}</option> )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='w3-row'>
                                                <div className='w3-half w3-padding'>
                                                    <input className='w3-input w3-hover-border-blue'  name='phone' id='phone' placeholder='Phone number' />
                                                </div>
                                                <div className='w3-half w3-padding'>
                                                    <select className='w3-input w3-hover-border-blue' id='gender' name='gender' defaultValue='default'>
                                                        <option value='default' disabled>Gender</option>
                                                        {
                                                            this.state.gender.map(arr=>{
                                                                return( <option key={arr}>{arr}</option> )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='w3-row'>
                                                <div className='w3-half w3-padding'>
                                                    <select className='w3-input w3-hover-border-blue' name='state' id='state' defaultValue='default'>
                                                        <option value='default' disabled>State</option>
                                                        {
                                                            this.state.state.map(arr=>{
                                                                return( <option key={arr}>{arr}</option> )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div className='w3-half w3-padding'>
                                                    <input className='w3-input w3-hover-border-blue' name='dob' id='dob' placeholder='DOB formart(MM/DD/YYYY)' />
                                                </div>
                                            </div>
                                            <div className='w3-row w3-margin-bottom'>
                                                <div className='w3-half w3-padding'>
                                                    <input className='w3-input w3-hover-border-blue' id='exp' name='exp' placeholder='Work Experience in months' />
                                                </div>
                                                <div className='w3-half w3-padding'>
                                                    <select className='w3-input w3-hover-border-blue' id='ind' name='ind' defaultValue="default">
                                                        <option value='default' disabled>Industry</option>
                                                        {
                                                            this.state.industry.map(arr=>{
                                                                return( <option key={arr}>{arr}</option> )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <div className='w3-center w3-margin-bottom w3-round'>
                                                <button className='w3-btn w3-blue w3-round' id='nextBtn' onClick={e=>{this.formSelect(e, 'next')}}>Next</button>
                                            </div>
                                        </div>
                                        <div id='section2' className='w3-hide w3-animate-right'>
                                            <div className='w3-row'>
                                                <div className='w3-half w3-center w3-hide' id='cC'>
                                                    <div className='w3-padding w3-card w3-margin-top w3-margin-bottom w3-round' style={{display: 'inline-block'}}>
                                                        <label htmlFor ='cv'><img src={cv} alt='' style={{width: '150px', height: '150px'}} /></label>
                                                        <p className='w3-center w3-padding w3-bold' style={{overflowWrap: 'break-word'}}>{this.state.cvName}</p>
                                                        <input id='cv' onChange={()=>{this.name('cv')}} name='cv' type='file' className='w3-hide' />
                                                    </div>
                                                </div>
                                                <div className='w3-half w3-center w3-hide' id='clC'>
                                                    <div className='w3-padding w3-card w3-margin-top w3-margin-bottom w3-round' style={{display: 'inline-block'}}>
                                                        <label htmlFor ='cvl'><img src={cvl} alt='' style={{width: '150px', height: '150px'}} /></label>
                                                        <p className='w3-center w3-padding w3-bold' style={{overflowWrap: 'break-word'}}>{this.state.cvlName}</p>
                                                        <input id='cvl' name='cover letter' onChange={()=>{this.name('cvl')}} type='file' className='w3-hide' />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='w3-center w3-margin-bottom w3-round'>
                                                <button className='w3-btn w3-blue w3-round w3-hide' id='SubmitBtn' onClick={e=>{this.formSelect(e, 'submit')}}>Submit</button>
                                            </div>
                                        </div>
                                        <div id="id01" className="w3-modal">
                                            <div className="w3-modal-content">
                                                <div className="w3-container">
                                                    <span onClick={()=>{document.getElementById('id01').style.display='none'}}
                                                    className="w3-button w3-display-topright">&times;</span>
                                                    <div className='w3-center'>
                                                        <h5 className='w3-red w3-padding w3-round'>We strongly advise that you add your CV above as it will help us work faster to develop one for you.</h5>
                                                        <div className='w3-center'>
                                                            <div className='w3-padding w3-card w3-margin-top w3-margin-bottom w3-round' style={{display: 'inline-block'}}>
                                                                <label htmlFor ='cv'><img src={cv} alt='' style={{width: '150px', height: '150px'}} /></label>
                                                                <p className='w3-center w3-padding w3-bold' style={{overflowWrap: 'break-word'}}>{this.state.cvName}</p>
                                                                <input id='cv' onChange={()=>{this.name('cv')}} name='cv' type='file' className='w3-hide' />
                                                            </div>
                                                            <div className='w3-center w3-margin-bottom w3-round'>
                                                                <button className='w3-btn w3-blue w3-round' onClick={e=>{this.props.rout(this.formData)}}>I don't have</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='w3-center w3-margin-bottom w3-round'>
                                                        <button className='w3-btn w3-blue w3-round w3-hide' id='SubmitBtn' onClick={e=>{this.props.rout(this.formData)}}>Submit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='w3-center w3-margin-bottom w3-round'>
                                            <button className='w3-btn w3-blue w3-round w3-hide' id='SubmitBtn' onClick={e=>{this.formSelect(e, 'submit')}}>Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div id='Steps' className='w3-row' style={{marginTop: '150px'}}>
                        <div className='w3-center'>
                            <div className='w3-display-container'>
                                <div className='w3-display middle w3-bold'><h1>How it works</h1></div>
                            </div>
                            <div className='w3-container' >
                                <div className='w3-padding steps'>
                                    <img src={reg} className='w3-image' alt={reg} style={{width: '70px', height: '70px'}} />
                                    <div className='w3-padding'>
                                        <h4 className='w3-bold'>Fill Form</h4>
                                        <div className='w3-container'>
                                            It only takes a couple of seconds to Fill your details.
                                        </div>
                                    </div>
                                </div>
                                <div className='w3-padding steps w3-hide'>
                                    <img src={card} className='w3-image' alt={card} style={{width: '70px', height: '70px'}} />
                                    <div className='w3-padding'>
                                        <h4 className='w3-bold'>Payment</h4>
                                        <div className='w3-container'>
                                         Pay.
                                        </div>
                                    </div>
                                </div>
                                <div className='w3-padding steps w3-hide'>
                                    <img src={mail} className='w3-image' alt={mail} style={{width: '70px', height: '70px'}} />
                                    <div className='w3-padding'>
                                        <h4 className='w3-bold'>Delivery</h4>
                                        <div className='w3-container'>
                                        Deliver directly in your mail
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w3-padding'>
                                <span className='w3-padding w3-margin-left w3-border-blue w3-bottombar stepsBtn' onClick={()=>{this.steps('one')}}><h1 onClick={()=>{this.steps('one')}} style={{display: 'inline-block'}}>1</h1></span>
                                <span className='w3-padding w3-margin-left w3-bottombar stepsBtn' onClick={()=>{this.steps('two')}}><h1 onClick={()=>{this.steps('two')}} style={{display: 'inline-block'}}>2</h1></span>
                                <span className='w3-padding w3-margin-left w3-bottombar stepsBtn' onClick={()=>{this.steps('three')}}><h1 onClick={()=>{this.steps('three')}} style={{display: 'inline-block'}}>3</h1></span>
                            </div>
                        </div>
                    </div>
    
                    <div id='Testimonials' className='w3-row' style={{marginTop: '70px'}}>
                        <div className='w3-center'  style={{marginTop: '70px'}}>
                            <h1 className='test'>Testimonials</h1>
                        </div>
                        <div className='w3-col m4 l4 w3-padding' style={{marginTop: '70px'}}>
                            <div className='w3-container w3-center' >
                                <Splide
                                    options={ {
                                        type         : 'loop',
                                        gap          : '1rem',
                                        autoplay     : true,
                                    } }
                                >
                                    
                                    { this.state.testimonials.map( slide => (
                                        <SplideSlide key={ slide }>
                                            <div>
                                                <div className='w3-container card w3-center'  style={{height: '450px'}}>
                                                    <p className='w3-padding' style={{display:'inline-block'}}>{slide.testimonials}</p>
                                                    <div className='w3-row'>
                                                            {
                                                                slide.star.map(arr=>{
                                                                    return(<img src={star} alt={star} id={arr} className='w3-padding' style={{width:'50px',height:'50px'}} />)
                                                                })
                                                            }
                                                        <p className='w3-bold'>{slide.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </SplideSlide>
                                    ) ) }
                                </Splide>
                            </div>
                        </div>
                    </div>
                </>
            )
        }else{
            return (
                <>
                    <div className='w3-row' id="Home">
                        <div className='w3-col m5 l5'>
                            <div className="bg">
                                <div className="mountain">
                                    <div className="mountain-top">
                                    <div className="mountain-cap-1"></div>
                                    <div className="mountain-cap-2"></div>
                                    <div className="mountain-cap-3"></div>
                                    </div>
                                </div>
                                <div className="mountain-two">
                                    <div className="mountain-top">
                                    <div className="mountain-cap-1"></div>
                                    <div className="mountain-cap-2"></div>
                                    <div className="mountain-cap-3"></div>
                                    </div>
                                </div>
                                <div className="mountain-three">
                                    <div className="mountain-top">
                                    <div className="mountain-cap-1"></div>
                                    <div className="mountain-cap-2"></div>
                                    <div className="mountain-cap-3"></div>
                                    </div>
                                </div>
                                <div className="cloud"></div>
                            </div>
                            <div className='w3-container w3-padding' style={{marginTop: '170px', marginLeft: '50px'}}>
                                <h2 className='w3-bold w3-text-blue'>CAREER FULFILLMENT IS ALL ABOUT YOU.</h2>
                                <h5 className=''>WE ARE EXCITED TO HELP YOU BEGIN YOUR JOURNEY TO CAREER FULFILLMENT!</h5>
                                <button className='w3-btn w3-round w3-blue w3-margin-top' onClick={(e)=>{this.formSelect(e, 'new')}} style={{width: '200px', height:'50px'}}>GET STARTED</button>
                            </div>
                        </div>
                        <div className='w3-rest w3-padding'>
                            <div className='w3-padding w3-blue w3-round w3-hide w3-animate-top not' id='nott'>{this.state.not}</div>
                            <div className='w3-container w3-center'>
                                <Splide
                                    options={ {
                                        type         : 'loop',
                                        gap          : '1rem',
                                        autoplay     : true,
                                    } }
                                >
                                    { this.state.slide.map( slide => (
                                        <SplideSlide key={ slide }>
                                            <img src={ slide } alt={ slide } style={{width: '300px', height:'300px'}} />
                                        </SplideSlide>
                                    ) ) }
                                </Splide>
                            </div>
                            <div className='w3-center w3-margin-bottom' id='btnCon' style={{marginTop: '70px'}}>
                                <button className='w3-btn w3-border w3-text-blue w3-hover-blue w3-border-blue w3-round btnSec1' onClick={(e)=>{this.formSelect(e,'new')}} style={{display: 'inline-block', width: '350px'}}>WRITE A NEW ONE</button>
                                <button className='w3-btn w3-border w3-text-blue w3-hover-blue w3-border-blue w3-round w3-margin-top btnSec1' style={{display: 'inline-block', width: '400px'}}>GET A REVIEW</button>
                            </div>
    
                            <div className='w3-row w3-border w3-round w3-hide w3-white' id='formContainer'>
                                <div id ='new' className='w3-margin-top w3-hide'>
                                    <h2 className='w3-center w3-text-blue'>WRITING FORM</h2>
                                    <form>
                                        <div id='section1'>
                                            <div className='w3-row'>
                                                <div className='w3-half w3-padding'>
                                                    <select className='w3-input w3-hover-border-blue' name='type' id='type' defaultValue ="default">
                                                        <option value='default' disabled>What would you like to write today?</option>
                                                        {
                                                            this.state.type.map(arr=>{
                                                                return( <option key={arr}>{arr}</option> )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div className='w3-half w3-padding'>
                                                    <input className='w3-input w3-hover-border-blue' name='fullname' id='name' placeholder="Full name" />
                                                </div>
                                            </div>
                                            <div className='w3-row'>
                                                <div className='w3-half w3-padding'>
                                                    <input className='w3-input w3-hover-border-blue' name='email' id='email' placeholder='Email' />
                                                </div>
                                                <div className='w3-half w3-padding'>
                                                    <select className='w3-input w3-hover-border-blue' name='com' id='com' defaultValue='default'>
                                                        <option value='default' disabled>Mode Of Communication</option>
                                                        {
                                                            this.state.commun.map(arr=>{
                                                                return( <option key={arr}>{arr}</option> )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='w3-row'>
                                                <div className='w3-half w3-padding'>
                                                    <input className='w3-input w3-hover-border-blue'  name='phone' id='phone' placeholder='Phone number' />
                                                </div>
                                                <div className='w3-half w3-padding'>
                                                    <select className='w3-input w3-hover-border-blue' id='gender' name='gender' defaultValue='default'>
                                                        <option value='default' disabled>Gender</option>
                                                        {
                                                            this.state.gender.map(arr=>{
                                                                return( <option key={arr}>{arr}</option> )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='w3-row'>
                                                <div className='w3-half w3-padding'>
                                                    <select className='w3-input w3-hover-border-blue' name='state' id='state' defaultValue='default'>
                                                        <option value='default' disabled>State</option>
                                                        {
                                                            this.state.state.map(arr=>{
                                                                return( <option key={arr}>{arr}</option> )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div className='w3-half w3-padding'>
                                                    <input className='w3-input w3-hover-border-blue' name='dob' id='dob' placeholder='DOB formart(MM/DD/YYYY)' />
                                                </div>
                                            </div>
                                            <div className='w3-row w3-margin-bottom'>
                                                <div className='w3-half w3-padding'>
                                                    <input className='w3-input w3-hover-border-blue' id='exp' name='exp' placeholder='Work Experience in months' />
                                                </div>
                                                <div className='w3-half w3-padding'>
                                                    <select className='w3-input w3-hover-border-blue' id='ind' name='ind' defaultValue="default">
                                                        <option value='default' disabled>Industry</option>
                                                        {
                                                            this.state.industry.map(arr=>{
                                                                return( <option key={arr}>{arr}</option> )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <div className='w3-center w3-margin-bottom w3-round'>
                                                <button className='w3-btn w3-blue w3-round' id='nextBtn' onClick={e=>{this.formSelect(e, 'next')}}>Next</button>
                                            </div>
                                        </div>
                                        <div id='section2' className='w3-hide w3-animate-right'>
                                            <div className='w3-row'>
                                                <div className='w3-half w3-center w3-hide' id='cC'>
                                                    <div className='w3-padding w3-card w3-margin-top w3-margin-bottom w3-round' style={{display: 'inline-block'}}>
                                                        <label htmlFor ='cv'><img src={cv} alt='' style={{width: '150px', height: '150px'}} /></label>
                                                        <p className='w3-center w3-padding w3-bold' style={{overflowWrap: 'break-word'}}>{this.state.cvName}</p>
                                                        <input id='cv' onChange={()=>{this.name('cv')}} name='cv' type='file' className='w3-hide' />
                                                    </div>
                                                </div>
                                                <div className='w3-half w3-center w3-hide' id='clC'>
                                                    <div className='w3-padding w3-card w3-margin-top w3-margin-bottom w3-round' style={{display: 'inline-block'}}>
                                                        <label htmlFor ='cvl'><img src={cvl} alt='' style={{width: '150px', height: '150px'}} /></label>
                                                        <p className='w3-center w3-padding w3-bold' style={{overflowWrap: 'break-word'}}>{this.state.cvlName}</p>
                                                        <input id='cvl' name='cover letter' onChange={()=>{this.name('cvl')}} type='file' className='w3-hide' />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='w3-center w3-margin-bottom w3-round'>
                                                <button className='w3-btn w3-blue w3-round w3-hide' id='SubmitBtn' onClick={e=>{this.formSelect(e, 'submit')}}>Submit</button>
                                            </div>
                                        </div>
                                        <div id="id01" className="w3-modal">
                                            <div className="w3-modal-content">
                                                <div className="w3-container">
                                                    <span onClick={()=>{document.getElementById('id01').style.display='none'}}
                                                    className="w3-button w3-display-topright">&times;</span>
                                                    <div className='w3-center'>
                                                        <h5 className='w3-red w3-padding w3-round'>We strongly advise that you add your CV above as it will help us work faster to develop one for you.</h5>
                                                        <div className='w3-center'>
                                                            <div className='w3-padding w3-card w3-margin-top w3-margin-bottom w3-round' style={{display: 'inline-block'}}>
                                                                <label htmlFor ='cv'><img src={cv} alt='' style={{width: '150px', height: '150px'}} /></label>
                                                                <p className='w3-center w3-padding w3-bold' style={{overflowWrap: 'break-word'}}>{this.state.cvName}</p>
                                                                <input id='cv' onChange={()=>{this.name('cv')}} name='cv' type='file' className='w3-hide' />
                                                            </div>
                                                            <div className='w3-center w3-margin-bottom w3-round'>
                                                                <button className='w3-btn w3-blue w3-round' onClick={e=>{this.props.rout(this.formData)}}>I don't have</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='w3-center w3-margin-bottom w3-round'>
                                                        <button className='w3-btn w3-blue w3-round w3-hide' id='SubmitBtn' onClick={e=>{this.props.rout(this.formData)}}>Submit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div className='w3-row' id='Steps' style={{marginTop: '150px'}}>
                        <div className='w3-center'>
                            <div className='w3-display-container'>
                                <div className='w3-display middle w3-bold'><h1>How it works</h1></div>
                            </div>
                            <div className='w3-container' style={{display: 'inline-block', marginTop: '120px'}}>
                                <div className='w3-padding steps'>
                                    <img src={reg} className='w3-image' alt={reg} style={{width: '70px', height: '70px'}} />
                                    <div className='w3-padding'>
                                        <h4 className='w3-bold'>Fill Form</h4>
                                        <div className='w3-container' style={{width: '400px'}}>
                                            It only takes a couple of seconds to Fill your details.
                                        </div>
                                    </div>
                                </div>
                                <div className='w3-padding steps w3-hide'>
                                    <img src={card} className='w3-image' alt={card} style={{width: '70px', height: '70px'}} />
                                    <div className='w3-padding'>
                                        <h4 className='w3-bold'>Payment</h4>
                                        <div className='w3-container' style={{width: '400px'}}>
                                            Pay.
                                        </div>
                                    </div>
                                </div>
                                <div className='w3-padding steps w3-hide'>
                                    <img src={mail} className='w3-image' alt={mail} style={{width: '70px', height: '70px'}} />
                                    <div className='w3-padding'>
                                        <h4 className='w3-bold'>Delivery</h4>
                                        <div className='w3-container' style={{width: '400px'}}>
                                            Deliver directly in your mail
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w3-padding'>
                                <span className='w3-padding w3-margin-left w3-border-blue w3-bottombar stepsBtn' onClick={()=>{this.steps('one')}}><h1 onClick={()=>{this.steps('one')}} style={{display: 'inline-block', cursor: 'pointer'}}>1</h1></span>
                                <span className='w3-padding w3-margin-left w3-bottombar stepsBtn' onClick={()=>{this.steps('two')}}><h1 onClick={()=>{this.steps('two')}} style={{display: 'inline-block', cursor: 'pointer'}}>2</h1></span>
                                <span className='w3-padding w3-margin-left w3-bottombar stepsBtn' onClick={()=>{this.steps('three')}}><h1 onClick={()=>{this.steps('three')}} style={{display: 'inline-block', cursor: 'pointer'}}>3</h1></span>
                            </div>
                        </div>
                    </div>
    
                    <div className='w3-row' id='Testimonials' style={{marginTop: '70px'}}>
                        <div className='w3-center'  style={{marginTop: '70px'}}>
                            <h1 className='test'>Testimonials</h1>
                        </div>
                        <div className='w3-col m4 l4 w3-padding'><br/></div>
                        <div className='w3-col m4 l4 w3-padding' style={{marginTop: '70px'}}>
                            <div className='w3-container w3-center ' >
                                <Splide
                                    options={ {
                                        type         : 'loop',
                                        gap          : '1rem',
                                        autoplay     : true,
                                    } }
                                >
                                    
                                    { this.state.testimonials.map( slide => (
                                        <SplideSlide key={ slide }>
                                            <div>
                                                <div className='w3-container card w3-center'  style={{height: '450px'}}>
                                                    <p className='w3-padding'>{slide.testimonials}</p>
                                                    <div className='w3-row'>
                                                        {
                                                            slide.star.map(arr=>{
                                                                return(<img src={star} alt={star} id={arr} className='w3-padding' style={{width:'50px',height:'50px'}} />)
                                                            })
                                                        }
                                                        <p className='w3-bold'>{slide.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </SplideSlide>
                                    ) ) }
                                </Splide>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    }
}