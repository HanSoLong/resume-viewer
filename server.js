const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const nodemailer = require('nodemailer');
const port = process.env.PORT || 5000;

const DATABASE_NAME = 'testdb';
const MONGO_URL = `mongodb://localhost:27017/`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
const jsonParser = bodyParser.json();

//var redis = require("redis"),
//    client = redis.createClient();
let db = null;

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  // Client returned
  db = client.db('testdb');
});

// E-mail config
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: {
     ciphers:'SSLv3'
  },
  auth: {
      user: 'socialmedia36@outlook.com',
      pass: 'socialmedia123456'
  }
});

function sendMail(address, code){
// setup e-mail data, even with unicode symbols
  var mailOptions = {
      from: 'test-eamil-address', // sender address (who sends)
      to: address, // list of receivers (who receives)
      subject: 'Verify Code', // Subject line
      text: code, // plaintext body
      //html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }

      console.log('Message sent: ' + info.response);
  });

}

function makeVerifyCode(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

async function setResume(req, res){
  const userName = req.body.username;
  const resume = req.body.resume;
  const resumeTitle = req.body.resumetitle;
  const collection = db.collection("Resume");

  let response={
    status: 'success'
  }

  const document = {
    username: userName,
    resumetitle: resumeTitle,
    resume: resume,
    datetime: convertDate(req.body.datetime)
  }

  await collection.insertOne(document);
  res.json(response);
}
app.post('/submitresume', setResume);

async function getResume(req, res){
  const userName = req.body.username;
  const collection = db.collection("Resume");
  const query = {username: userName};

  collection.find(query).limit(1).sort({datetime: -1}).toArray(function(err, result) {
    if (err) throw err;
    //console.log(result[0]);
    const response = {
      username: userName,
      result: result[0]
    };
    res.json(response);
  });
}
app.post('/getresume', getResume);

async function handleRegistration(req, res){
  const userName = req.body.username;
  const passWord = req.body.password;
  const emailAddress = req.body.email;
  const queryUsername = {username: userName};
  const queryEmail = {email: emailAddress};
  const regAttempts = db.collection("RegistrationAttempts");
  const actualUser = db.collection("UserAccount");

  let response={
    status: ''
  }

  let tempResult = null;

  tempResult = await actualUser.find(queryUsername).toArray();
  if(tempResult.length > 0){
    response.status = 'usernameTaken'
      //console.log(" username taken in actual user");
  }

  tempResult = await regAttempts.find(queryUsername).toArray();
  if(tempResult.length > 0){
    response.status = 'usernameTaken'
      //console.log(" username taken in attempt");
  }

  tempResult = await actualUser.find(queryEmail).toArray();
  if(tempResult.length > 0){
    response.status = 'emailExists'
      //console.log(" email exists in actual user");
  }

  tempResult = await regAttempts.find(queryEmail).toArray();
  if(tempResult.length > 0){
    response.status = 'emailExists'
      //console.log(" email exists in attempt");
  }

  if(response.status === ''){
    //console.log("start to insert");
    const time = new Date();
    const verifyCode = makeVerifyCode(5);
    const document={username: userName, password: passWord, email: emailAddress, datetime:time, verifycode: verifyCode};

    await regAttempts.insertOne(document);
    await sendMail(emailAddress,verifyCode);

    response.status = 'success';
    //console.log("insert success");
  }
  //console.log("status ",response.status);
  res.json(response);
}
app.post('/submitregistration', handleRegistration);

async function finishRegistration(req, res){
  const userName = req.body.username;
  const passWord = req.body.password;
  const emailAddress = req.body.email;
  const verifyCode = req.body.verifycode;

  const regAttempts = db.collection("RegistrationAttempts");
  const actualUser = db.collection("UserAccount");

  const queryAttemp = {username: userName, password: passWord, email: emailAddress, verifycode: verifyCode};

  let tempResult = await regAttempts.find(queryAttemp).toArray();
  let response={
    status:''
  }

  const regTime = new Date();
  if(tempResult.length === 1){
    const formalUser = {
      username: userName,
      password: passWord,
      email: emailAddress,
      timeofreg: regTime
    }

    await actualUser.insertOne(formalUser);
    await regAttempts.deleteOne(queryAttemp);

    response.status='success';
  }else{
    response.status='wrongcode';
  }

  res.json(response);
}
app.post('/verifyaccount', finishRegistration);

async function getScore(req, res) {
  const routeParams = req.params;
  const userName = routeParams.username;
  const score = Array(3).fill(0);
  const collection = db.collection("ScoreRecord");

  const query = { username: userName };
  collection.find(query).limit(1).sort({datetime: -1}).toArray(function(err, result) {
    if (err) throw err;
    const response = {
      username: userName,
      result: result
    };
    res.json(response);
    //db.close();
  });
  //console.log(result);

}
app.get('/getscore/:username', getScore);

async function loginAttempt(req, res){
  const userName = req.body.username;
  const passWord = req.body.password;
  const formatDateTime = new Date();
  const query = {username: userName, password: passWord};
  const collection = db.collection("UserAccount");
  let loginFlag = false;
  //console.log(query);
  collection.find(query).toArray(function(err, result){
    if (err) throw err;
    //console.log(result.length);
    if(result.length === 1){
      loginFlag = true;
    }else{
      loginFlag = false;
    }
    const response = {
      loginsuccess: loginFlag,
      username: result[0].username
    };
    //console.log(response.loginsuccess);
    res.json(response);
  });
  
}
app.post('/loginattempt', jsonParser, loginAttempt);

function convertDate(datetime){
  return new Date(datetime.Year, datetime.Month, datetime.Day, datetime.Hour, datetime.Minute, datetime.Second, datetime.Millisecond);
}

async function setScore(req, res){
  const routeParams = req.params;
  const userName = routeParams.username;
  const score1 = req.body.score1;
  const score2 = req.body.score2;
  const score3 = req.body.score3;
  const datetime = req.body.datetime;
  const formatDateTime = new Date(datetime.Year, datetime.Month, datetime.Day, datetime.Hour, datetime.Minute, datetime.Second, datetime.Millisecond);
  //console.log(formatDateTime);
  const document = {
    username: userName,
    score1: score1,
    score2: score2,
    score3: score3,
    datetime: formatDateTime
  }

  const response = {
    success: true
  }

  const collection = db.collection("ScoreRecord");
  await collection.insertOne(document);
  res.json(response);
}
app.post('/setscore/:username', jsonParser, setScore);

async function setUserActivity(req, res){
  const routeParams = req.params;
  const userName = routeParams.username;
  let collection = null;
  //console.log("receive set activity request")
  if(req.body.activity === "mouseover"){
    collection = db.collection("UserMouseOver");
  }else if(req.body.activity === "select"){
    collection = db.collection("UserSelectItem");
  }
  const datetime = req.body.datetime;
  const activity = req.body.activity;
  const item = req.body.item;
  const formatDateTime = new Date(datetime.Year, datetime.Month, datetime.Day, datetime.Hour, datetime.Minute, datetime.Second, datetime.Millisecond);
  const document = {
    username: userName,
    activity: activity,
    item: item,
    datetime: formatDateTime
  }

  const response = {
    success: true
  }
  await collection.insertOne(document);
  res.json(response);
  //console.log("insert success");
}
app.post('/setuseractivity/:username', jsonParser, setUserActivity);

app.listen(port, () => console.log(`Listening on port ${port}`));
//client.on("error", function (err) {
//  console.log("Error " + err);
//});


// console.log that your server is up and running


/*async function getScore(req, res){
  const routeParams = req.params;
  const userName = routeParams.username;
  const score = Array(3).fill(0);
  client.HGETALL(userName, function(err, obj){
    const response = {
      score1: obj.score1,
      score2: obj.score2,
      score3: obj.score3
    }
    res.json(response);
  });
}*/
//app.get('/getscore/:username', getScore);

/*async function setScore(req, res){
  const routeParams = req.params;
  const userName = routeParams.username;
  const score1 = req.body.score1;
  const score2 = req.body.score2;
  const score3 = req.body.score3;

  client.HMSET(userName, ["score1", score1, "score2", score2, "score3", score3], function (err,res){});

}
app.post('/setscore/:username', jsonParser, setScore);*/
//redis.set('length', 123);
