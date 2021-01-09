const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var multer = require('multer');
var crypto = require("crypto");
var nodemailer = require('nodemailer')
const app = express();
app.use(cors({origin:"*"}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({'contentType': "application/json"}));
app.use(express.static(path.join(__dirname, 'build')));


var maxSize = 10 * 1000 * 1000;
var storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, path.basename(file.originalname) ) 
    })
  }
});
var upload = multer({ storage: storage,limits: { fileSize: maxSize }});

/**

  let url = "mongodb+srv://Orisha:Neutron360@cluster0.lih3q.mongodb.net/Test?retryWrites=true&w=majority"
  const DB = ['Customers']
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    client.db(DB[0])
    console.log("Connected");
  });

 */


// create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'emmanuelcox39@gmail.com', // generated ethereal user
      pass: '', // generated ethereal password
    },
  });




app.get('/*', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});


let name,email,phone_number,gender,role,sector,state,type,industry,experience,communicate,file,dob,price;
app.post('/data', upload.single('file'), (req, res, next)=>{ 
  name = req.body.name
  type = req.body.type
  email = req.body.email
  communicate = req.body.com
  gender = req.body.gender
  dob = req.body.dob
  state = req.body.state
  industry = req.body.industry
  experience = req.body.exp
  price =  req.body.price
  transporter.sendMail({
    from: `emmanuelcox39@gmail.com`, // sender address
    to: `${email}`, // list of receivers
    subject: "Confirmation for the "+ type +" package just for you, "+ name+".", // Subject line
    html: `
          <p style="padding:20px; background-color:#2196F3; color: white; font-size:30px; border-radius:20px; text-align:center">KIGENNI</p>
          <div style="margin-top: 50px">
            <h2 style="text-align: center"><b>Hello ${name}<b></h2>
            <p>Thank you for applying our ${type} package</p>
            <p>We would get back to you as soon as possible once payment has been made.</p>
            <p>If you have not already made your payment on the website, go ahead and make it <a href=''>here</a></p>
            <p>or make a direct transfer to the account details below</p>
            <h3><b>Bank Details</b></h3>
            <div>
              <p>Account Number: 1014119229</p>
              <p>Bank Name: Zenith Bank</p>
              <p>Account Name: Rigutsmile</p>
              <p>Amount: ₦${price}</p>
              <p>Your Lifelong Partner To Career Fulfillment,</p><p>The Kigenni Team.</p>
            </div>
          </div>
          `,
  });
})

app.post('/cv', upload.single('file'), (req, res, next)=>{ 
  console.log(req.body)
  file = req.file
})

app.post('/reminders', (req,res)=>{
  console.log(req.body);
})

app.post('/', (req, res) => {
  console.log(req.body);
  res.json({data: true})
})


let port = 3000

app.listen(process.env.baseURL || port, ()=>{
    console.log(`http://localhost:${port}`);
});