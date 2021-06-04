const express = require('express');
const emailValidator = require("email-validator");
var admin = require("firebase-admin");
const news_scraper = require('./news_scraper.js')
const { v4: uuidv4 } = require('uuid');

// deploy to vercel for testing 
// Vercel platform is event-driven, therefore not maintaining a running server,
// we recommend using a third-party service to schedule these tasks.
// Simply means no automation, no scheduler, no cron job of any sort. 

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

app.listen(PORT, () => {
  console.info('Server is running on PORT:', PORT);
  // Automatically start connection to DB right after the server goes live. Does not work on event-driven server like Vercel.
  startDBConnection();
});

module.exports= {app}


app.post('/thaibinhnews/:type', (req, res, next) => {
  if (req.params.type == 'general' || req.params.type == 'medic' || req.params.type == 'edu') {
    news_scraper.getThaibinhNews(req.params.type).then(result => {
      res.status(200).json({ data: result })
    }).catch(err => {
      console.log(err)
      res.status(500).send('Failed to get news')
    })
  }
  else
    res.status(500).send('News type is not valid')
})

app.post('/songcongnews/:type', (req, res, next) => {
  if (req.params.type == 'general' || req.params.type == 'medic' || req.params.type == 'edu') {
    news_scraper.getSongCongNews(req.params.type).then(result => {
      res.status(200).json({ data: result })
    }).catch(err => {
      console.log(err)
      res.status(500).send('Failed to get news')
    })
  }
  else
    res.status(500).send('News type is not valid')
})

app.post('/caobangnews/:type', (req, res, next) => {
  if (req.params.type == 'general') {
    news_scraper.getCaoBangNews(req.params.type).then(result => {
      res.status(200).json({ data: result })
    }).catch(err => {
      console.log(err)
      res.status(500).send('Failed to get news')
    })
  }
  else
    res.status(500).send('News type is not valid')
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


/////////////////////////////////////////////// CronJob scheduler////////////////////////////////
const { ToadScheduler } = require('toad-scheduler')
const cronJobsManager = require('./cronjobsMangers.js')

const scheduler = new ToadScheduler()

app.post('/setAutoNewsScrapping', async (req, res, next) => {
  const postData = req.body;
  postData['jobID']=uuidv4();
  console.log(postData.jobID)
  cronJobsManager.autoNewsScrappingtoDBEvery(postData, scheduler).then(result=>{
    res.status(200).send('Set cron job '+ postData.jobID + ' OK')
  })
  .catch(err=>{
    res.status(500).send('Set cron job '+ postData.jobID + ' Fail')
  })
});

app.get('/removeCronJob/:jobID',  (req, res, next) =>{
  if(cronJobsManager.cancelCronJob(req.params.jobID, scheduler))
  res.status(200).send('Remove cron job '+ req.params.jobID + ' OK')
  else
  res.status(500).send('Remove cron job '+ req.params.jobID + ' Fail')
})

//create another express app just for proxy processing
// const appProxy = express()
// const { createProxyMiddleware } = require('http-proxy-middleware');

// appProxy.use('*', createProxyMiddleware({ target: 'http://thainguyen.edu.vn/', changeOrigin: true }));

// appProxy.listen(3500);

// const proxyTable = {
//   'edu.localhost:3500': 'http://thainguyen.edu.vn', 
//   'general.localhost:3500': 'http://songcong.thainguyen.gov.vn', 
//   'medic.localhost:3500': 'http://soytethainguyen.gov.vn',
// };

// const options = {
//   target: 'http://localhost:3500',
//   router: proxyTable,
//   changeOrigin: true
// };

// const proxyserver = createProxyMiddleware(options);
// appProxy.use(proxyserver)
// appProxy.listen(3500)



///////////////////////////////MongoDBtest///////////////////////////////////////


const dbManager = require('./mongoDB/connectionManager.js')
//busboy is a middleware to handle parsing data sent through multipart form-data
const Busboy = require('busboy');
const { ObjectID } = require('bson');
global.gfs = null
global.dbClient = null
function startDBConnection() {
  dbManager.dbConnectionInit().then(client => {
    // res is DB client
    dbClient = client
    dbManager.gridFsInit(client).then(res => {
      gfs = res
    }).catch(err => { console.log(err) })
  })
    .catch(err => {
      DBError = err
      console.log(err)
    });
}


//////////////////////////////////////////GRID Fs operations///////////////////////////////
app.post('/uploadfile', function (req, res) {

  var busboy = new Busboy({ headers: req.headers });

  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    console.log('got file', filename, mimetype, encoding);
    var writeStream
    try {
      writeStream = gfs.createWriteStream({
        filename: filename,
        content_type: mimetype,
      });
    } catch (error) {
      console.log(error)
    }
    if (writeStream != null) {
      writeStream.on('close', (file) => {
        //All the info of the uploaded file has been return. Storing the fileID to your data model for later use. 
        console.log(file)
      });
      file.pipe(writeStream);
    }
  }).on('finish', function () {
    // show a link to the uploaded file
    res.status(200).send('uploaded successfully');
  });
  req.pipe(busboy);
});

app.get('/downloadFileByFileName/:filename', function (req, res) {
  //download file using file name. 
  let filename = req.params.filename
  console.log('filename:' + filename)
  gfs.exist({ filename: filename }, (err, file) => {
    if (err || !file) {
      res.status(404).send('File Not Found');
      return
    }
    var readstream = gfs.createReadStream({ filename: filename });
    readstream.pipe(res);
  });
});

app.get('/downloadFileByFileID/:fileID', function (req, res) {
  //download file using file name. 
  var file_id = req.params.fileID;

  gfs.files.find({ _id: new ObjectID(file_id) }).toArray(function (err, files) {
    if (err) {
      res.json(err);
    }
    if (files.length > 0) {
      var mime = files[0].contentType;
      var filename = files[0].filename;
      res.set('Content-Type', mime);
      // res.set('Content-Disposition', "inline; filename=" + filename);
      var read_stream = gfs.createReadStream({ _id: file_id });
      read_stream.pipe(res);
    } else {
      res.status(404).json('File Not Found');
    }
  });
});

app.get('/deleteFileByFileID/:fileID', function (req, res) {
  //download file using file name. 
  var file_id = req.params.fileID;
  gfs.remove({ _id: new ObjectID(file_id) }, (err, gridStore) => {
    if (err) {
      res.status(404).send('File Not Found');
      return
    }
    else {
      res.status(200).send('File ID:' + file_id + 'has been removed from Database');
    }
  });
});

app.get('/manuallyTriggerDatabaseConnection', function (req, res) {

  // This api is used in cased you need to start or restart connection to mongoDB. And even a sleeping cloud server.
  dbManager.dbConnectionInit().then(client => {
    dbClient=client;
    dbManager.gridFsInit(client).then(res => {
      gfs = res
    }).catch(err => { console.log(err) })
    res.status(200).send('DB kết nối ổn')

  })
    .catch(err => {
      console.log(err)
      res.status(500).json({ errorMessage: 'Fail' })
    });

});