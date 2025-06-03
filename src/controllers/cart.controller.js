'use strict'

const {SuccessResponse} = require( "../core/success.response" );
const CartService = require( "../services/cart.service" );

class CartController {

	addToCart = async (req, res, next) => {
		new SuccessResponse({
			message: 'Add to cart success',
			metadata: await CartService.addToCart(req.body)
		}).send(res);
	}

	updateUserCart = async (req, res, next) => {
		new SuccessResponse({
			message: 'Update user cart success',
			metadata: await CartService.updateUserCart(req.body)
		}).send(res);
	}

	deleteUserCart = async (req, res, next) => {
		new SuccessResponse({
			message: 'Delete user cart success',
			metadata: await CartService.deleteUserCart(req.body)
		}).send(res);
	}

	getListUserCart = async (req, res, next) => {
		new SuccessResponse({
			message: 'Get user cart success',
			metadata: await CartService.getListUserCart(req.query)
		}).send(res);
	}
}

module.exports = new CartController();