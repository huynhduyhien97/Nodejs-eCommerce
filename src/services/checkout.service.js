'use strict'

const {BadRequestError} = require( "../core/error.response" );
const {findCartById} = require( "../models/repositories/cart.repo" );
const {checkProductByServer} = require( "../models/repositories/product.repo" );
const {getDiscountAmount} = require( "./discount.service" );

class CheckoutService {

	/**
		login and without login
		{
			cartId,
			userId,
			shop_order_ids: [
				{
					shopId,
					shop_discounts: [
						{
							shopId, discountId, productId
						}
					],
					item_products: [
						{
							price, quantity, productId
						}
					]
				}
			]
		}
	*/
	static async checkoutReview({ cartId, userId, shop_order_ids }) {
		// check cart
		const foundCart = await findCartById(cartId);
		if (!foundCart) {
			throw new BadRequestError('Cart not found');
		}

		const checkout_order = {
			totalPrice: 0, // tong tien hang
			feeShip: 0,
			totalDiscount: 0,
			totalCheckout: 0,
		}

		const shop_order_ids_new = []

		for (let i = 0; i < shop_order_ids.length; i++)
		{
			const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i];
			// check product available in shop
			const checkProductServer = await checkProductByServer(item_products);
			console.log(`checkProductServer`, checkProductServer)

			if (!checkProductServer[0]) throw new BadRequestError(`order wrong`)

			const checkoutPrice = checkProductServer.reduce((total, item) => {
				return total + (item.price * item.quantity);
			}, 0);

			checkout_order.totalPrice += checkoutPrice;

			const itemCheckout = {
				shopId,
				shop_discounts,
				priceRaw: checkoutPrice, // truoc khi giam gia
				priceApplyDiscount: checkoutPrice, // sau khi giam gia
				item_products: checkProductServer,
			}

			if (shop_discounts.length > 0) {
				// gia su chi co 1 discount
				// get amount discount
				const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
					codeId: shop_discounts[0].codeId,
					userId,
					shopId,
					products: checkProductServer,
				})

				checkout_order.totalDiscount += discount;

				if (discount > 0) {
					itemCheckout.priceApplyDiscount = checkoutPrice - discount;
				}
			}

			checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
			shop_order_ids_new.push(itemCheckout);
		}

		return {
			checkout_order,
			shop_order_ids,
			shop_order_ids_new,
		}
	}
}

module.exports = CheckoutService