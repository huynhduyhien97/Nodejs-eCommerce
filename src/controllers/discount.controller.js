'use strict'

const {SuccessResponse} = require( "../core/success.response" );
const DiscountService = require( "../services/discount.service" );

class DiscountController {
	
	createDiscountCode = async (req, res, next) => {
		new SuccessResponse({
			message: 'Create discount success',
			metadata: await DiscountService.createDiscountCode({
				...req.body,
				shopId: req.user.userId
			})
		}).send(res);
	}

	updateDiscountCode = async (req, res, next) => {
		new SuccessResponse({
			message: 'Update discount success',
			metadata: await DiscountService.updateDiscountCode(req.params.discountId, {
				...req.body,
			})
		}).send(res);
	}

	getAllDiscountCodesWithProduct = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get all discount codes with product success',
			metadata: await DiscountService.getAllDiscountCodesWithProduct({
				...req.query,
			})
		}).send(res);
	}

	getAllDiscountCodesByShop = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get all discount codes by shop success',
			metadata: await DiscountService.getAllDiscountCodesByShop({
				...req.query,
				shopId: req.user.userId,
			})
		}).send(res);
	}

	getDiscountAmount = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get discount amount success',
			metadata: await DiscountService.getDiscountAmount({
				...req.body,
			})
		}).send(res);
	}
}

module.exports = new DiscountController();