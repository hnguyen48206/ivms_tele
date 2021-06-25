const express = require('express');
var router = require('./apiManager')
var admin = require("firebase-admin");
var cors = require('cors')
var os = require("os");

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
var app = module.exports = express();
/* JSON body parse*/
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = app.listen(PORT, () => {
  console.info('Server is running on PORT:', PORT);
  // Automatically start connection to DB right after the server goes live. Does not work on event-driven server like Vercel.
  startDBConnection();
  console.log(os.hostname())
});

app.use(router)
// var whitelist = ['*']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//     callback(null, true)
//   },
//   optionsSuccessStatus:200
// }

var corsOptions = {
  "origin": "*",
  "methods": ["GET","HEAD","PUT","PATCH","POST","DELETE"],
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}

app.use(cors(corsOptions))
app.get('/', (req, res, next) => {
  res.sendFile('index.html', {
    root: '.'
  });
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

/////////////////////////////////////////////////////////socket.io ////////////////////////////////////////
const io = require("socket.io")(server,{cors: {
  origin: "*",
  methods: ["GET", "POST"]
}});
const activeUsers = new Set();

io.on("connection", function (socket) {
  console.log("Made socket connection");

  socket.on("newUser", function (data) {
    socket.userId = data;
    activeUsers.add(data);
    io.emit("new user", [...activeUsers]);
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });

  socket.on("priceAlertSubscribe", function (data) {

    // Data Model Expectation
    // data = {
    //   targetCoin: '',
    //   alertAtPrice: ''
    // }
    // io.emit("chat message", data);

    console.log(data)
  });

  socket.on("cancelPriceAlert", function (data) {

    // Data Model Expectation
    // data = {
    //   alertID: ''
    // }
    // io.emit("chat message", data);

    console.log(data)

  });

  // socket.on("typing", function (data) {
  //   socket.broadcast.emit("typing", data);
  // });
});


///////////////////////////////////////////// Worker Thread /////////////////////////////////////
const { Worker } = require('worker_threads')

const runService = (param) => {
    return new Promise((resolve, reject) => {
    
        // import workerExample.js script, option is the data passing from main thread to the worker thread    
        const worker = new Worker('./workerThreadSample.js', { workerData: param });
        console.log(`ID của thread vừa tạo: ${worker.threadId}`)

        worker.postMessage('this is the message coming from main thread')
        //These events work when worker send messages to main thread
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`stopped with  ${code} exit code`));
        })
    })
}

const run = async () => {
    const result = await runService('hello John Doe')
    console.log(result);
}

// for(let i=0; i<10; ++i)
run().catch(err => console.error(err))


///////////////////////////////////////////////////APNs push notification/////////////////////////////////////
var apns= require('./apnsPushManager')
// apns.createNewNotification()