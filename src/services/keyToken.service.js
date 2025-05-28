'use strict'

const keytokenModel = require( "../models/keytoken.model" )

class KeyTokenService {

	static createKeyToken = async ({ userId, publicKey, privateKey }) => {
		try {
			// publicKey: được sinh ra từ thuât toán RSA (bất đối xứng) có kiểu dữ liệu là Buffer, chưa được Hash
			// phải chuyển đổi sang dạng String để lưu vào CSDL, nếu không sẽ bị lỗi
			// const publicKeyString = publicKey.toString()

			const tokens = await keytokenModel.create({
				user: userId,
				publicKey,
				privateKey,
			})

			return tokens ? tokens.publicKey : null
		} catch (error) {
			return error
		}
	}
}

module.exports = KeyTokenService