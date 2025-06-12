const compression = require( 'compression' );
const express = require('express');
const morgan = require( 'morgan' );
const cookieParser = require('cookie-parser');
const configs = require('./configs/config')
const {checkEnable} = require("./utils");
const app = express();

// test redis pub sub
// require('./tests/inventory.test')
// const productTest = require('./tests/product.test');
// productTest.purchaseProduct('product:001', 10);
// productTest.purchaseProduct('product:002', 10);


// init redis
// require('./redis/init.redis');

// init middleware
// init middlewares
app.use(morgan('dev'));
// app.use(morgan('compile'));
// app.use(morgan('common'));
// app.use(morgan('short'));
// app.use(morgan('tiny'));

// setting security helmet - hạn chế các thông tin về server, bảo mật hơn
const helmet = require('helmet');
// setting base
app.use(helmet.frameguard({
    action: 'deny'
}));
// strict transport security
const reqDuration = 2629746000;
app.use(
    helmet.hsts({
        maxAge: reqDuration,
    })
);
// content security policy
app.use(helmet.contentSecurityPolicy({
    directives: {
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
    },
}))
// x content type options
app.use(helmet.noSniff());
// x xss protection
app.use(helmet.xssFilter())
// referrer policy
app.use(helmet.referrerPolicy({
    policy: "no-referrer",
}))

// nén dữ liệu trả về, giảm băng thông, tăng tốc độ tải trang
app.use(compression({
    level: 6,// level compress
    threshold: 100 * 1024, // > 100kb threshold to compress
    filter: (req) => {
        return !req.headers['x-no-compress'];
    }
}));

// setting body parser, cookie parser
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(cookieParser());


// init database
if (checkEnable(configs.db.enable)) {
    require('./configs/config.mongodb');
    const {checkOverload} = require('./helpers/check.connect');
    checkOverload();
}

// init redis
if (checkEnable(configs.redis.enable)) {
    require('./configs/config.redis')
}


// init routes
app.use('/', require('./routes'))


// middleware
app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
})

// handle error
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