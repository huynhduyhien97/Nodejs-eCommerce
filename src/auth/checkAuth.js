'use strict'

const {findById} = require( "../services/apiKey.service" );

const HEADER = {
	API_KEY: 'x-api-key',
	AUTHORIZATION: 'authorization',
}

const apiKey = async (req, res, next) => {
	try {
		const key = await req.headers[HEADER.API_KEY]?.toString();
		if (!key) {
			return res.status(403).json({
				message: 'Forbidden Error',
			})
		}

		// check objKey
		const objKey = await findById(key);

		if (!objKey) {
			return res.status(403).json({
				message: 'Forbidden Error',
			})
		}

		req.objKey = objKey;
		return next()
	} catch (err) {
		
	}
}

// trả về 1 hàm closure, có thể sử dụng các biến (params) của hàm cha
const permission = (permission) => {
	return (req, res, next) => {
		if (!req.objKey.permissions) {
			return res.status(403).json({
				message: 'Permission denied',
			})
		}

		console.log(`permission: `, req.objKey.permissions);
		const validPermission = req.objKey.permissions.includes(permission);

		if (!validPermission) {
			return res.status(403).json({
				message: 'Permission denied',
			})
		}

		return next()
	}
}

module.exports = {
	apiKey,
	permission,
}