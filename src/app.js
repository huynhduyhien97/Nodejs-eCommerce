const compression = require( 'compression' );
const express = require('express');
const { default : helmet } = require('helmet');
const morgan = require( 'morgan' );
require('dotenv').config();
const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init database
require('./dbs/init.mongodb');
// const { checkOverload } = require('./helpers/check.connect');
// checkOverload();

// inti routes
app.get('/', (req, res, next) => {
	const strCompress = 'Hello DISCONMEMAY';

	return res.status(200).json({
		message: 'Welcome to WSV eCommerce API',
		// metadata: strCompress.repeat(10000),
	});
})

// handle error

module.exports = app;