const compression = require( 'compression' );
const express = require('express');
const { default : helmet } = require('helmet');
const morgan = require( 'morgan' );
require('dotenv').config();
const app = express();

// init middleware
app.use(morgan("dev"));  // log request to console
app.use(helmet()); 		 // hạn chế các thông tin về server, bảo mật hơn
app.use(compression());  // nén dữ liệu trả về, giảm băng thông, tăng tốc độ tải trang
app.use(express.json()); // parse json request body
app.use(express.urlencoded({ extended: true }));

// init database
require('./dbs/init.mongodb');
// const { checkOverload } = require('./helpers/check.connect');
// checkOverload();

// inti routes
app.use('/', require('./routes'))

// handle error

module.exports = app;