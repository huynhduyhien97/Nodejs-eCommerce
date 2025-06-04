// 'use strict'

const redisPubSubService = require('../services/redisPubSub.service')

class InventoryService {
	
	constructor() {
		redisPubSubService.subscribe('purchase_events', (channel, message) => {
			InventoryService.updateInventory(JSON.parse(message))
		})
	}

	static updateInventory({ productId, quantity }) {
		console.log(`Updating inventory for product ${productId} with quantity ${quantity}`)
	}
}

module.exports = new InventoryService()