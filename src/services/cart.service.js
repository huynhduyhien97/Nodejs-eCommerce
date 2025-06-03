'use strict'

const {cart} = require( "../models/cart.model" );
const {createUserCart, updateUserCartQuantity} = require( "../models/repositories/cart.repo" );
const {findProductById} = require( "../models/repositories/product.repo" );

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
		const userCart = await cart.findOne({ cart_userId: userId })

		// If cart does not exist, create a new cart with the product
		if (!userCart) {
			return await createUserCart({ userId, product });
		}

		// if cart exists and the product is not in the cart, add the product to the cart
		if (!userCart.cart_products.length) {
			userCart.cart_products = [product];
			return await userCart.save();
		}

		// if product already exists in the cart, update the quantity
		return await updateUserCartQuantity({ userId, product });
	}

	/**
		shop_order_ids: [
			{
				shopId,
				item_products: [
					{
						productId, quantity, price, shopId, old_quantity
					}
				],
				version (khóa bi quan / khóa lạc quan / khóa phân tán)
			}
		]
	*/
	static async updateUserCart({ userId, shop_order_ids = {} }) {
		const { productId, quantity, old_quantity } = shop_order_ids[0].item_products[0];
		// check 
		const foundProduct = await findProductById({ productId });
		if (!foundProduct) throw new Error('Product not found');

		// compare
		if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
			throw new Error('Product does not belong to the shop');
		}

		if (quantity < 0) {
			// remove from cart
		}

		return await updateUserCartQuantity({ 
			userId, 
			product : {
				productId,
				quantity: quantity - old_quantity,
			} 
		});
	}

	static async deleteUserCart({ userId, productId }) {
		const query = { cart_userId: userId, cart_state: 'active' };
		const update = {
			$pull: { cart_products: { productId } },
		}
		
		const deletedCart = await cart.updateOne(query, update);

		return deletedCart
	}

	static async getListUserCart({ userId }) {
		return await cart.findOne({
			cart_userId: +userId
		}).lean()
	}
}

module.exports = CartService;