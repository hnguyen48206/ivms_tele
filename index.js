const express = require('express');
const emailValidator = require("email-validator");
var admin = require("firebase-admin");
const news_scraper = require('./news_scraper.js')

//deploy to vercel for testing 
//test redeploy when pushing to deployment branch

var serviceAccount = require("./fbCert/vietnamagron-be-fb-firebase-adminsdk-63suj-361b8f9b86.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const usersDb = db.collection('users');
const liam = usersDb.doc('lragozzine');


const PORT = process.env.PORT || 3000
const app = express()

/* JSON body parse*/
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/news', (req, res, next) =>{
  news_scraper.getNews('https://tuoitre.vn/tin-moi-nhat.htm').then(result=>{
    res.send(result)
  }).catch(err=>{
    console.log(err)
    res.send('Failed to get news')
  })
})

app.get('/hello', (req, res, next) => {
  console.info('/hello call success ');
  liam.update({
    'name': 'abc',
    'age': 41
  })
    .then(
      result => console.log(result)
    )
  liam.get()
    .then(result => {
      console.log(result.data())
      res.send(result.data());

    }) 
    .catch(err => {
      console.log(err)
      res.send(err);
    })
  // res.send('Welcome to Firebase Cloud Functions');
});

app.post('/emailValidate', async (req, res, next) => {
  const postData = req.body;
  if (postData.email) {
    console.info('/emailValidate call success ');
    res.json({ 'status': emailValidator.validate(postData.email) });
  } else {
    console.warn('/emailValidate wrong input ');
    res.status(500).json({ 'status': 'wrong input' });
  }

});

app.listen(PORT, () => {
  console.info('Server is running on PORT:', PORT);
});
