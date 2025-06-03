'use strict'

const {cart} = require( "../models/cart.model" );
const {createUserCart, updateUserCartQuantity} = require( "../models/repositories/cart.repo" );

/**
	Key features:
	1. Add product to the cart [User]
	2. Reduce product quantity [User]
	3. Increase product quantity [User]
	4. Get cart details [User]
	5. Delete cart [User]
	6. Remove product from cart [User]
*/

class CartService {

	static async addToCart({ userId, product = {} }) {
		// check cart exists for user
		const userCart = await cart.findOne({ cart_userId: userId }).lean();

		// If cart does not exist, create a new cart with the product
		if (!userCart) {
			return await createUserCart({ userId, product });
		}

		// if cart exists and the product is not in the cart, add the product to the cart
		if (!userCart.products.length) {
			userCart.cart_products.push(product);
			return await userCart.save();
		}

		// if product already exists in the cart, update the quantity
		return await updateUserCartQuantity({ userId, product });
	}
}

module.exports = CartService;