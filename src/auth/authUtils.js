'use strict'

const JWT = require('jsonwebtoken');

const createTokenPair = async ( payload, publicKey, privateKey ) => {
	try {
		// accessToken
		const accessToken = await JWT.sign( payload, privateKey, {
			expiresIn: '2 days',
		})

		// refreshToken
		const refreshToken = await JWT.sign( payload, privateKey, {
			expiresIn: '7 days',
		})

		//

		JWT.verify( accessToken, publicKey, (err, decoded) => {
			if (err) {
				console.error('Access Token verification failed:', err);
			} else {
				console.log('Access Token is valid:', decoded);
			}
		})

		return { accessToken, refreshToken }
	} catch (error) {

	}
}

module.exports = {
	createTokenPair
}