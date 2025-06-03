'use strict'

const {BadRequestError} = require( "../core/error.response" );
const {inventory} = require( "../models/inventory.model" );
const {findProductById} = require( "../models/repositories/product.repo" );

class InventoryService {
	
	static async addStockToInventory({ stock, productId, shopId, location = 'unknow' }) {

		const product = await findProductById(productId)
		if (!product) throw new BadRequestError('Product not found');

		const query = { inven_shopId: shopId, inven_productId: productId }
		const update = {
			$inc: { inven_stock: stock },
			$set: { inven_location: location }
		}
		const options = { upsert: true, new: true }

		return await inventory.findOneAndUpdate(query, update, options)
	}
}

module.exports = InventoryService