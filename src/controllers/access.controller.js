'use strict'

const AccesService = require( "../services/access.service" )

class AccessController {

	signUp = async ( req, res, next ) => {
		return res.status(201).json(await AccesService.signUp(req.body))
	}
}

module.exports = new AccessController()