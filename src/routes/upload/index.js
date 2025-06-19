'use strict'

const express = require('express')
const {authenticationV2} = require( '../../auth/authUtils' )
const asyncHandler = require( '../../helpers/asyncHandler' )
const uploadController = require( '../../controllers/upload.controller' )
const {uploadDisk} = require( '../../configs/config.multer' )
const router = express.Router()


// router.use(authenticationV2)

router.post('/product', asyncHandler(uploadController.uploadFile))
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadImageFromLocal))
router.post('/product/multiple', uploadDisk.array('files', 3), asyncHandler(uploadController.uploadImageFromLocalFiles))

module.exports = router