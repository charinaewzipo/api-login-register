var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const dbConnection = require('./database');

const bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');
const { json } = require('express/lib/response')

app.use(cors())


app.post('/register', jsonParser, (req, res, next) => {
  bcrypt.hash(req.body.password, 12).then((hash_pass) => {
    dbConnection.execute("INSERT INTO users (name,email,password) VALUES (? , ? ,?)", [req.body.name, req.body.email,hash_pass])
      .then(result => {
        res.json({ status: 'Your account has been created' })
      }).catch(err => {
        if (err) throw err;
      })
  })
})

app.post('/login',jsonParser,(req,res,next) => {
  dbConnection.execute("SELECT * FROM users WHERE email= ?",[req.body.email])
  .then(([rows])=> {
    bcrypt.compare(req.body.password,rows[0].password)
    .then((compare_result)=>{
      if(compare_result == true){
        var token = jwt.sign({ email:rows[0].email }, 'secret-secret' , { expiresIn: '1h' });
        res.json({ status: 'login successfully',token})
      }else{
        res.json({ status: 'login failed' })
      }
    })
  })
})

app.post('/authen',jsonParser,(req,res,next) => {
  try{
    let token = req.headers.authorization.split(' ')[1];
    var decoded = jwt.verify(token, 'secret-secret');
    res.json ({status:'ok',decoded});
  }catch(error){
    res.json ({status:'error',message:error.message});
  }
})

app.listen(3333, function () {
  console.log('CORS-enabled web server listening on port 3333')
})