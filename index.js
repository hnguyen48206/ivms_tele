#!/usr/bin/env node

const yargs = require("yargs");
const path = require('path');
const options = yargs
 .usage("Usage: -e <env_path>")
 .option("e", { alias: "env_path", describe: "Đường dẫn đến file môi trường", type: "string", demandOption: true })
 .argv;
// console.log(options.env_path)
require("dotenv").config({path:path.resolve(options.env_path)});
const express = require('express');
var cors = require('cors')
var app = module.exports = express();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
var morgan = require("morgan");
var compression = require("compression");
var helmet = require("helmet");
//custom middleware
var custom = require('./utilities/sampleMiddleware')

//Routers
var home_router = require('./routers/home');
var email_router = require('./routers/email');
var tele_router = require('./routers/tele');

//custom middleware
app.use(custom({
  'name:':'name'
}));
app.use(helmet()); //For extra network security
app.use(compression()); //For transport data compression
app.use(morgan(`:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`)); //For logging
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/home',home_router);
app.use('/email',email_router);
app.use('/tele',tele_router);
app.use(errors()); //For handling celebrate error, must be put last in the middleware chain for it to work.

var corsOptions = {
  "origin": "*",
  "methods": ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
app.use(cors(corsOptions))
app.listen(process.env.PORT || 3000, () => {
  console.info('Server is running on PORT:', process.env.PORT || 3000);
});





