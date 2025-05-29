'use strict'

const {CREATED} = require( "../core/success.response" )
const AccesService = require( "../services/access.service" )

class AccessController {

	signUp = async ( req, res, next ) => {
		new CREATED({
			message: 'Registered!',
			metadata: await AccesService.signUp(req.body),
			options: {
				limit: 10
			}
		}).send(res)
	}
}

module.exports = new AccessController()