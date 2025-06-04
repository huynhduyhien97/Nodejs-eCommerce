// 'use strict'

const redisPubSubService = require('../services/redisPubSub.service')

class ProductTestService {

	purchaseProduct(productId, quantity) {
		const order = { productId, quantity }
		redisPubSubService.publish('purchase_events', JSON.stringify(order))
	}
}

module.exports = new ProductTestService()