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

// init routes
app.use('/', require('./routes'))

// handle error

// middleware (có 3 tham số)
app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
})

// handle error (quản lý lỗi, có 4 tham số)
app.use((error, req, res, next) => {
	const statusCode = error.status || 500; // HTTP status code, mặc định là 500

	return res.status(statusCode).json({
		status: 'error',
		code: statusCode,
		stack: error.stack, // log stack trace in development
		message: error.message || 'Internal Server Error',
	})
})

module.exports = app;