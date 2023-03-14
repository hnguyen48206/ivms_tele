require("dotenv").config();
const express = require('express');
var home_router = require('./routers/home');
var email_router = require('./routers/email');
var cors = require('cors')
const PORT = process.env.PORT || 3000
var app = module.exports = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/home',home_router);
app.use('/email',email_router);
var corsOptions = {
  "origin": "*",
  "methods": ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
app.use(cors(corsOptions))
app.listen(PORT, () => {
  console.info('Server is running on PORT:', PORT);
});




