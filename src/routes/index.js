'use strict'

const express = require('express')
const {apiKey, permission} = require( '../auth/checkAuth' )
// const {pushLogToDiscord} = require( '../middlewares' )
const router = express.Router()

// add log to discord
// router.use(pushLogToDiscord)

// check apiKey
// nằm ở proxy server, sẽ được cấp phát cho doanh nghiệp hoặc người dùng
// được dùng để xác thực và phân quyền truy cập (limit rate, request per minute, expiration time, etc.)
router.use(apiKey)

// check permission
router.use(permission('0000')) // example permission, replace with actual permission check

router.use('/v1/api/checkout', require('./checkout'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/inventory', require('./inventory'))
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api/comment', require('./comment'))
router.use('/v1/api/notification', require('./notification'))
router.use('/v1/api', require('./access'))

module.exports = router