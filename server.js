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
let url = "mongodb+srv://Orisha:Neutron360@cluster0.lih3q.mongodb.net/Test?retryWrites=true&w=majority"
const DB = ['Customers']
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  client.db(DB[0])
  console.log("Connected");
});
  let testAccount = nodemailer.createTestAccount();

// create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
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
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: `${email}`, // list of receivers
    subject: "Hello ✔", // Subject line
    html: `
            <h3 style='text-align: center'>Hello ${name} </h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="min-width:100%;">
            <tbody>
              <tr>
                <td valign="top" style="padding:5px; font-family: Arial,sans-serif; font-size: 16px; line-height:20px;"><b>Name<b></td>
                <td valign="top" style="padding:5px; font-family: Arial,sans-serif; font-size: 16px; line-height:20px;"><b>Product<b></td>
                <td valign="top" style="padding:5px; font-family: Arial,sans-serif; font-size: 16px; line-height:20px;"><b>Price<b></td>
              </tr>
              <tr>
                <td valign="top" style="padding:5px; font-family: Arial,sans-serif; font-size: 16px; line-height:20px;"><b>${name}<b></td>
                <td valign="top" style="padding:5px; font-family: Arial,sans-serif; font-size: 16px; line-height:20px;"><b>${type}<b></td>
                <td valign="top" style="padding:5px; font-family: Arial,sans-serif; font-size: 16px; line-height:20px;"><b>${price}<b></td>
              </tr>
            </tbody>
          </table>`,
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