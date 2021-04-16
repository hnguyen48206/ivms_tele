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
const e = require('express');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/songcongnews/:type', (req, res, next) => {
  if (req.params.type == 'general' || req.params.type == 'medic' || req.params.type == 'edu') {
    news_scraper.getSongCongNews(req.params.type).then(result => {
      res.status(200).send(result)
    }).catch(err => {
      console.log(err)
      res.status(500).send('Failed to get news')
    })
  }
  else
    res.status(500).send('News type is not valid')
})

app.get('/news', (req, res, next) => {
  news_scraper.getNews('https://tuoitre.vn/tin-moi-nhat.htm').then(result => {
    res.send(result)
  }).catch(err => {
    console.log(err)
    res.send('Failed to get news')
  })
})

app.get('/news/:page', (req, res, next) => {
  console.log(req.params.page)
  if (Number.isInteger(parseInt(req.params.page))) {
    news_scraper.getMoreNews('https://tuoitre.vn/timeline/0/trang-' + req.params.page + '.htm').then(result => {
      res.send(result)
    }).catch(err => {
      console.log(err)
      res.send('Failed to get more news')
    })
  }
  else {
    res.send('Page number is not valid')
  }
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
  // news_scraper.autoNewsScrappingtoDB(2)
});
