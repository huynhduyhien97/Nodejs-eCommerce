'use strict'

const InventoryService = require('../services/inventory.service')
const { BadRequestError } = require('../core/error.response')
const {SuccessResponse} = require( '../core/success.response' )

class InventoryController {

	addStockToInventory = async (req, res, next) => {
		new SuccessResponse(
			'Add stock to inventory successfully',
			await InventoryService.addStockToInventory(req.body)
		).send(res)
	}
}

module.exports = new InventoryController()