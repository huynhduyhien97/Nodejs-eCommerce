'use strict'

const shopModel = require( "../models/shop.model" )
const bcrypt = require( "bcrypt" )
const crypto = require( "node:crypto" )
const KeyTokenService = require( "./keyToken.service" )
const {createTokenPair, verifyJWT} = require( "../auth/authUtils" )
const {getInfoData} = require( "../utils" )
const {BadRequestError, AuthFailureError, ForbiddenError} = require( "../core/error.response" )
const {findByEmail} = require( "./shop.service" )

const RoleShop = {
	SHOP: 'SHOP',
	WRITER : 'WRITER',
	EDITOR: 'EDITOR',
	ADMIN: 'ADMIN',
}

class AccesService {

	static handlerRefreshToken = async (refreshToken) => {
		const foundToken = await KeyTokenService.findByRefreshTokenUsed( refreshToken )
		if (foundToken) {
			// decode xem mày là thằng nào
			const { userId, email } = await verifyJWT( refreshToken, foundToken.privateKey )
			console.log({ userId, email })
			// xóa tất cả token trong keyStore
			await KeyTokenService.deleteKeyById(userId)

			throw new ForbiddenError('Something wrong happens! Please login again!')
		}

		const holderToken = await KeyTokenService.findByRefreshToken( refreshToken )
		console.log('[1]--', holderToken)
		if (!holderToken) throw new AuthFailureError('Shop not registered 1!')

		// verify token
		const { userId, email } = await verifyJWT( refreshToken, holderToken.privateKey )
		console.log('[2]--', { userId, email })

		// check userId
		const foundShop = await findByEmail({ email })
		if (!foundShop) throw new AuthFailureError('Shop not registered 2!')

		// create new public key and private key
		const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

		// update token
		await holderToken.update({
			$set: {
				refreshToken: tokens.accessToken,
			},
			$addToSet: {
				refreshTokensUsed: refreshToken // đã được sử dụng để lấy token mới
			}
		})

		return {
			user: { userId, email },
			tokens
		}
	}

	static logout = async (keyStore) => {
		const delKey = await KeyTokenService.removeKeyById( keyStore._id )
		return delKey
	}

	/**
	 * 	1 - check email in db
	 *  2 - matching password
	 *  3 - create access token and refresh token then save
	 *  4 - generate tokens
	 *  5 - get data return login
	 */
	static login = async ({ email, password, refreshToken = null }) => {
		// Step 1
		const foundShop = await findByEmail({ email })
		if (!foundShop) throw new BadRequestError('Shop not registered!')

		// Step 2
		const match = bcrypt.compare( password, foundShop.password )
		if (!match) throw new AuthFailureError('Authentication error!')

		// Step 3
		// create public key and private key
		const publicKey = crypto.randomBytes(64).toString('hex')
		const privateKey = crypto.randomBytes(64).toString('hex')

		// Step 4
		// create token pair
		const { _id: userId } = foundShop
		const tokens = await createTokenPair({ userId: userId, email }, publicKey, privateKey)

		await KeyTokenService.createKeyToken({
			refreshToken: tokens.refreshToken,
			privateKey, publicKey, userId
		})

		return {
			shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
			tokens
		}
	}

	static signUp = async ({ name, email, password }) => {
		
		// step 1: check email exists?
		// lean() : query faster, tra về object js thuần
		const holderShop = await shopModel.findOne({ email }).lean()
		if (holderShop) {
			throw new BadRequestError('Error: Shop already registered!')
		}
		
		const passwordHash = await bcrypt.hash(password, 10)
		const newShop = await shopModel.create({
			name, email, password: passwordHash, roles: [RoleShop.SHOP]
		})

		if (newShop) {
			// create public key and private key
			const publicKey = crypto.randomBytes(64).toString('hex')
			const privateKey = crypto.randomBytes(64).toString('hex')

			console.log({ privateKey, publicKey }) // save collection KeyStore

			const keyStore = await KeyTokenService.createKeyToken({
				userId: newShop._id,
				publicKey,
				privateKey
			})

			if (!keyStore) {
				throw new BadRequestError('Error: Create key public fail!')
			}

			// create token pair
			const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
			console.log(`Created Token Success::`, tokens)

			return {
				code: 201,
				metadata: { 
					shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
					tokens
				}
			}
		}

		return {
			code: 200,
			metadata: null,
		}
	}
}

module.exports = AccesService