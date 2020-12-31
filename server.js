const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var multer = require('multer');
//var nodemailer = require('nodemailer')
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

app.get('/*', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

let url = "mongodb+srv://Orisha:Neutron360@cluster0.lih3q.mongodb.net/Test?retryWrites=true&w=majority"
const DB = ['Customers']
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  client.db(DB[0])
  console.log("Connected");
});

app.post('/', (req, res) => {
  
  console.log(req.body);
})


let port = 3000

app.listen(process.env.baseURL || port, ()=>{
    console.log(`http://localhost:${port}`);
});