'use strict'

const shopModel = require( "../models/shop.model" )
const bcrypt = require( "bcrypt" )
const crypto = require( "node:crypto" )
const KeyTokenService = require( "./keyToken.service" )
const {createTokenPair} = require( "../auth/authUtils" )
const {getInfoData} = require( "../utils" )

const RoleShop = {
	SHOP: 'SHOP',
	WRITER : 'WRITER',
	EDITOR: 'EDITOR',
	ADMIN: 'ADMIN',
}

class AccesService {

	static signUp = async ({ name, email, password }) => {
		try {

			//step 1: check email exists?
			// lean() : query faster, tra về object js thuần
			const holderShop = await shopModel.findOne({ email }).lean()
			if (holderShop) {
				return {
					code: 'xxxx',
					message: 'Shop already registered!',
				}
			}

			const passwordHash = await bcrypt.hash(password, 10)
			const newShop = await shopModel.create({
				name, email, password: passwordHash, roles: [RoleShop.SHOP]
			})

			if (newShop) {
				// created privateKey (để cho người dùng, không lưu trên hệ thống, sign token), publicKey (lưu trên hệ thống verify token)
				// giả sử hacker hack được hệ thống thì không lấy được privateKey, chỉ lấy được publicKey có nhiệm vụ verify token thôi
				// lấy được cả 2 rât khó, xác suất rất thấp

				// rsa : thuật toán bất đối xứng
				// const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
				// 	modulusLength: 4096,
				// 	publicKeyEncoding: {
				// 		type: 'pkcs1', // Public Key CryptoGraphy Standard 1
				// 		format: 'pem', // PEM (Privacy Enhanced Mail) format
				// 	},
				// 	privateKeyEncoding: {
				// 		type: 'pkcs1', // Public Key CryptoGraphy Standard 1
				// 		format: 'pem', // PEM (Privacy Enhanced Mail) format
				// 	},
				// })


				const privateKey = crypto.randomBytes(64).toString('hex')
				const publicKey = crypto.randomBytes(64).toString('hex')

				console.log({ privateKey, publicKey }) // save collection KeyStore

				const keyStore = await KeyTokenService.createKeyToken({
					userId: newShop._id,
					publicKey,
					privateKey
				})

				if (!keyStore) {
					return {
						code: 'xxxx',
						message: 'Create public key failed!',
					}
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

		} catch (error) {
			return {
				code : 400,
				message : error.message,
				status : "error",
			}
		}
	}
}

module.exports = AccesService