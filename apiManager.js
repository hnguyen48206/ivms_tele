import { app } from './index.js'
const news_scraper = require('./news_scraper.js')

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

  app.get('/news', (req, res, next) => {
    news_scraper.getNews('https://tuoitre.vn/tin-moi-nhat.htm').then(result => {
      res.send(result)
    }).catch(err => {
      console.log(err)
      res.send('Failed to get news')
    })
  })
  