'use strict'

const express = require('express')
const accessController = require( '../../controllers/access.controller' )
const {authenticationV2} = require( '../../auth/authUtils' )
const asyncHandler = require( '../../helpers/asyncHandler' )
const router = express.Router()

// signUp
router.post('/shop/signup',  asyncHandler(accessController.signUp))
// login
router.post('/shop/login',  asyncHandler(accessController.login))

// authentication
router.use(authenticationV2)

router.post('/shop/logout',  asyncHandler(accessController.logout))
router.post('/shop/refresh-token', asyncHandler(accessController.handlerRefreshToken))

module.exports = router