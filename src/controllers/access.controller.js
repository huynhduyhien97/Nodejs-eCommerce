'use strict'

const AccesService = require( "../services/access.service" )

class AccessController {

	signUp = async ( req, res, next ) => {
		try {
			console.log(`[P]::signUp::`, req.body)
			/**
				200 OK
				201 Created
			 */
			return res.status(201).json(await AccesService.signUp(req.body))
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new AccessController()