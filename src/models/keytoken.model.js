'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

const keyTokenSchema = new Schema({
	user:{
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Shop',
	},
	privateKey:{
		type: String,
		required: true,
	},
	publicKey:{
		type: String,
		required: true,
	},
	refreshTokensUsed:{
		type: Array,
		default: [], // những refresh token đã được dùng, nếu sử dụng lại sẽ đặt nghi vấn
	},
	refreshToken: {
		type: String,
		required: true,
	}
}, {
	timestamps: true,
	collection: COLLECTION_NAME,
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);