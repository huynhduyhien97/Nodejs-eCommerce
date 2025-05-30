'use strict'

const JWT = require('jsonwebtoken');
const {asyncHandler} = require( './checkAuth' );
const {AuthFailureError, NotFoundError} = require( '../core/error.response' );
const {findByUserId} = require( '../services/keyToken.service' );

const HEADER = {
	API_KEY: 'x-api-key',
	CLIENT_ID : 'x-client-id',
	AUTHORIZATION: 'authorization',
}

const createTokenPair = async ( payload, publicKey, privateKey ) => {
	try {
		// accessToken
		const accessToken = await JWT.sign( payload, publicKey, {
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

/**
	1 - check userId missing ?
	2 - get accessToken
	3 - verify token
	4 - check user in db
	5 - check keyStore with this userId
	6 - OK => return next()
*/
const authentication = asyncHandler( async (req, res, next) => {
	// 1
	const userId = req.headers[HEADER.CLIENT_ID];
	if (!userId) throw new AuthFailureError('Invalid request!')
	
	// 2
	const keyStore = await findByUserId(userId);
	if (!keyStore) throw new AuthFailureError('KeyStore not found!')

	// 3
	const accessToken = req.headers[HEADER.AUTHORIZATION];
	if (!accessToken) throw new AuthFailureError('Invalid request!')

	try {
		const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
		if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid user!')
		console.log(`keyStore`, keyStore)
		req.keyStore = keyStore;
		return next()
	} catch (error) {
		throw error
	}
})

const verifyJWT = async (token, keySecret) => {
	return await JWT.verify(token, keySecret)
}

module.exports = {
	createTokenPair,
	authentication,
	verifyJWT
}