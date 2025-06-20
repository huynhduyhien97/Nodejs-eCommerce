'use strict'

const {CREATED, SuccessResponse} = require( "../core/success.response" )
const AccesService = require( "../services/access.service" )

class AccessController {

	handlerRefreshToken = async ( req, res, next ) => {
		// new SuccessResponse({
		// 	message: 'Get token success',
		// 	metadata: await AccesService.handlerRefreshToken(req.body.refreshToken),
		// }).send(res)

		// v2 fixed, no need accesstoken
		new SuccessResponse({
			message: 'Get token success',
			metadata: await AccesService.handlerRefreshTokenV2({
				refreshToken: req.refreshToken,
				user: req.user,
				keyStore: req.keyStore,
			}),
		}).send(res)
	}

	logout = async ( req, res, next ) => {
		new SuccessResponse({
			message: 'Logout success!',
			metadata: await AccesService.logout(req.keyStore),
		}).send(res)
	}

	login = async ( req, res, next ) => {
		new SuccessResponse({
			metadata: await AccesService.login(req.body),
		}).send(res)
	}

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