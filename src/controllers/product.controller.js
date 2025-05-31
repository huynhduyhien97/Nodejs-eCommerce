'use strict'

const ProductService = require('../services/product.service.xxx');
const { SuccessResponse } = require('../core/success.response');

class ProductController {

	createProduct = async (req, res, next) => {
		new SuccessResponse({
			message: 'Create new product success',
			metadata: await ProductService.createProduct(req.body.product_type, {
				...req.body,
				product_shop: req.user.userId,
			})
		}).send(res);
	}

	publishProductByShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Publish product by shop success',
			metadata: await ProductService.publishProductByShop({
				product_shop: req.user.userId,
				product_id: req.params.id,
			})
		}).send(res);
	}

	unPublishProductByShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Unpublish product by shop success',
			metadata: await ProductService.unPublishProductByShop({
				product_shop: req.user.userId,
				product_id: req.params.id,
			})
		}).send(res);
	}

	// QUERY

	/**
	 * @description Find all drafts for shop
	 * @param {String} req.user.userId - The ID of the shop owner 
	 * @param {Number} req.query.limit - The maximum number of drafts to return
	 * @param {Number} req.query.skip - The number of drafts to skip (for pagination)
	 * @return {JSON}
	 */
	getAllDraftsForShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get all drafts for shop success',
			metadata: await ProductService.findAllDraftsForShop({
				product_shop: req.user.userId,
				// limit: req.query.limit || 50,
				// skip: req.query.skip || 0
			})
		}).send(res);
	}

	getAllPublishForShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get all publish for shop success',
			metadata: await ProductService.findAllPublishForShop({
				product_shop: req.user.userId,
				// limit: req.query.limit || 50,
				// skip: req.query.skip || 0
			})
		}).send(res);
	}

	getListSearchProduct = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get list product success',
			metadata: await ProductService.searchProducts(req.params)
		}).send(res);
	}
}

module.exports = new ProductController()