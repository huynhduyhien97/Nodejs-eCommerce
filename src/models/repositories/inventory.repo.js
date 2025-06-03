'use strict'

const { inventory } = require( "../inventory.model" )

const insertInventory = async ({ productId, shopId, stock, location = 'unknow' }) => {
	return await inventory.create({
		inven_productId: productId,
		inven_shopId: shopId,
		inven_stock: stock,
		inven_location: location,
	})
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
	const query = {
		inven_productId: productId,
		inven_stock: { $gte: quantity }, // check if stock is enough
	}

	const update = {
		$inc: {
			inven_stock: -quantity, // reduce stock
		},
		$push: {
			inven_reservations: {
				quantity,
				cartId,
				createdAt: new Date(),
			}
		}
	}

	const options = { upsert: true, new: true }

	return await inventory.updateOne(query, update)
}

module.exports = {
	insertInventory,
	reservationInventory
}