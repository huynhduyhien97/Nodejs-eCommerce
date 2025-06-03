'use strict'

const {BadRequestError, NotFoundError} = require( "../core/error.response" );
const discountModel = require( "../models/discount.model" );
const {findAllDiscountCodesUnSelect, findDiscount} = require( "../models/repositories/discount.repo" );
const {findAllProducts} = require( "../models/repositories/product.repo" );
const {removeUndefinedObject} = require( "../utils" );

/**
	Discount Services
	1 - Generate Discount Code [Shop|Admin]
	2 - Get discount amount [User]
	3 - Get all discount codes [User|Shop]
	4 - Verify discount code [User]
	5 - Delete discount code [Admin|Shop]
	6 - Cancel discount code [User]
*/

class DiscountService {

	static async createDiscountCode(body) {
		const {
			code, start_date, end_date, is_active,
			shopId, min_order_value, product_ids, applies_to, name, description,
			type, value, max_value, max_uses, uses_count, users_used, max_uses_per_user
		} = body
		
		// if (new Date < new Date(start_date) || new Date > new Date(end_date)) {
		// 	throw new BadRequestError(`Invalid date range for discount`);
		// }

		if (new Date(start_date) > new Date(end_date)) {
			throw new BadRequestError(`Start date must be before end date`);
		}

		const foundDiscount = await discountModel.findOne({
			discount_code: code,
			discount_shopId: shopId
		}).lean()

		if (foundDiscount && foundDiscount.discount_is_active) {
			throw new BadRequestError(`Discount code ${code} already exists for this shop`);
		}

		const newDiscount = await discountModel.create({
			discount_name: name,
			discount_description: description,
			discount_type: type,
			discount_code: code,
			discount_value: value,
			discount_min_order_value: min_order_value || 0,
			discount_max_value: max_value,
			discount_start_date: new Date(start_date),
			discount_end_date: new Date(end_date),
			discount_max_uses: max_uses,
			discount_uses_count: uses_count,
			discount_users_used: users_used,
			discount_shopId: shopId,
			discount_max_users_per_user: max_uses_per_user,
			discount_is_active: is_active,
			discount_applies_to: applies_to,
			discount_product_ids: applies_to === 'all' ? [] : product_ids,
		})

		return newDiscount
	}

	static async updateDiscountCode(discountId, body) {

		const objectParams = removeUndefinedObject(body)
		const updatedDiscount = await discountModel.findOneAndUpdate(
			discountId,
			updateNestedObjectParser(objectParams),
		)

		return updatedDiscount
	}

	static async getAllDiscountCodesWithProduct({ code, shopId, userId, limit = 10, page = 1 }) {
		const foundDiscount = await discountModel.findOne({
			discount_code: code,
			discount_shopId: shopId
		}).lean()

		if (!foundDiscount || !foundDiscount.discount_is_active) {
			throw new BadRequestError(`Discount code ${code} is not valid or not active`);
		}

		const { discount_applies_to, discount_product_ids } = foundDiscount;
		let products
		if (discount_applies_to === 'all') {
			products = await findAllProducts({
				limit: +limit,
				page: +page,
				filter: { 
					product_shop: shopId,
					isPublished: true,
				},
				sort: 'ctime',
				select: ['product_name'],
			});
		}

		if (discount_applies_to === 'specific') {
			products = await findAllProducts({
				limit: +limit,
				page: +page,
				filter: { 
					_id: { $in: discount_product_ids },
					isPublished: true,
				},
				sort: 'ctime',
				select: ['product_name'],
			});
		}

		return products
	}

	static async getAllDiscountCodesByShop({ limit, page, shopId }) {
		const discount = await findAllDiscountCodesUnSelect({
			limit: +limit,
			page: +page,
			filter: { 
				discount_shopId: shopId,
				discount_is_active: true,
			},
			unSelect: ['__v', 'discount_shopId'],
			model: discountModel
		})

		return discount
	}

	/**
		Apply Discount Code
		products = [
			{ productId, shopId, quantity, name, price }
		]
	*/
	static async getDiscountAmount({ codeId, userId, shopId, products }) {
		
		const foundDiscount = await findDiscount({
			model: discountModel,
			filter: {
				discount_code: codeId,
				discount_shopId: shopId,
			}
		})

		if (!foundDiscount) {
			throw new BadRequestError(`Discount code is not valid or not active`);
		}

		const { 
			discount_is_active, 
			discount_max_uses,
			discount_min_order_value,
			discount_max_users_per_user,
			discount_users_used,
			discount_type,
			discount_start_date,
			discount_end_date,
			discount_value,
		} = foundDiscount;

		if (!discount_is_active) throw new BadRequestError(`Discount code is expired or not active`);
		if (discount_max_uses <= 0) throw new BadRequestError(`Discount code has reached its maximum uses`);

		if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
			throw new BadRequestError(`Discount code is expired`);
		}

		// check có set giá trị tối thiểu hay không
		let totalOrder = 0
		if (discount_min_order_value > 0) {
			totalOrder = products.reduce((acc, product) => {
				return acc + (product.price * product.quantity)
			}, 0)

			if (totalOrder < discount_min_order_value) {
				throw new NotFoundError(`Discount requires a minimum order value of ${discount_min_order_value}`);
			}
		}

		if (discount_max_users_per_user > 0) {
			const userUseDiscount = discount_users_used.find(user => user.userId === userId);
			if (userUseDiscount) {
				throw new BadRequestError(`You have already used this discount code`);
			}
		}
		
		// fix amount or percentage
		const discount_amount = discount_type === 'fixed_amount' ? discount_value : (totalOrder * discount_value / 100);

		return {
			totalOrder,
			discount: discount_amount,
			totalPrice: totalOrder - discount_amount,
		}
	}

	static async deleteDiscountCode({ shopId, codeId }) {
		const deleted = await discountModel.findOneAndDelete({
			discount_code: codeId,
			discount_shopId: shopId
		})
		if (!deleted) {
			throw new NotFoundError(`Discount code ${codeId} not found for shop ${shopId}`);
		}

		return deleted
	}

	static async cancelDiscountCode({ userId, codeId, shopId }) {
		const foundDiscount = await findDiscount({
			model: discountModel,
			filter: {
				discount_code: codeId,
				discount_shopId: shopId,
			}
		})
		if (!foundDiscount) {
			throw new NotFoundError(`Discount does not exist`);
		}

		const result = await discountModel.findOneAndUpdate(foundDiscount._id, {
			$pull: {
				discount_users_used: userId
			},
			$inc: {
				discount_max_uses: 1,
				discount_uses_count: -1,
			}
		})

		return result
	}
}

module.exports = DiscountService;