/* The code snippet you provided is a JavaScript file that sets up routes for a web application using
the Express framework. Here is a breakdown of what the code is doing: */
'use strict'

const express = require('express')
const productController = require( '../../controllers/product.controller' )
const {authenticationV2} = require( '../../auth/authUtils' )
const asyncHandler = require( '../../helpers/asyncHandler' )
const router = express.Router()

// authentication
router.use(authenticationV2)
//
router.post('', asyncHandler(productController.createProduct))

module.exports = router