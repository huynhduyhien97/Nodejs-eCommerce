'use strict'

const {BadRequestError} = require( "../core/error.response" );
const {order} = require( "../models/order.model" );
const {findCartById} = require( "../models/repositories/cart.repo" );
const {checkProductByServer} = require( "../models/repositories/product.repo" );
const {getDiscountAmount} = require( "./discount.service" );
const {acquireLock, releaseLock} = require( "./redis.service" );

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
			// console.log(`checkProductServer`, checkProductServer)

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

	static async orderByUser({ shop_order_ids, cartId, userId, user_address = {}, user_payment = {} }) {
		const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({ 
			cartId, 
			userId, 
			shop_order_ids
		})

		// check lại sản phẩm có vượt quá tồn kho hay không
		const products = shop_order_ids_new.flatMap(order => order.item_products)
		const acquireProducts = []
		for (let i = 0; i < products.length; i++)
		{
			const { productId, quantity } = products[i]
			const keyLock = await acquireLock(productId, quantity, cartId)
			acquireProducts.push(keyLock ? true : false)

			if (keyLock) {
				await releaseLock(keyLock);
			}
		}

		// check neu co 1 san pham khong du ton kho
		if (acquireProducts.includes(false)) {
			throw new BadRequestError('Some products are out of stock, please try again later');
		}

		const newOrder = await order.create({
			order_userId: userId,
			order_checkout: checkout_order,
			order_shipping: user_address,
			order_payment: user_payment,
			order_products: shop_order_ids_new,
		})

		// case: insert thanh cong => remove products in cart
		if (newOrder) {

		}

		return newOrder
	}

	/**
		1> Query orders [Users]
	*/
	static async getOrdersByUser() {

	}

	static async getOneOrderByUser() {

	}

	static async cancelOrderByUser() {

	}

	static async updateOrderStatusByShop() {
		
	}
}

module.exports = CheckoutService