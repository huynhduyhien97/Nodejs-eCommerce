'use strict'

const express = require('express')
const productController = require( '../../controllers/product.controller' )
const {authenticationV2} = require( '../../auth/authUtils' )
const asyncHandler = require( '../../helpers/asyncHandler' )
const router = express.Router()

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('/all', asyncHandler(productController.findAllProducts))
router.get('/:productId', asyncHandler(productController.findProduct))

// authentication
router.use(authenticationV2)
//
router.post('', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

// QUERY
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))

module.exports = router