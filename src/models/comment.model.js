'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'Comments'

const commentSchema = new Schema({
	comment_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
	comment_userId: { type: Number },
	comment_content: { type: String, default: 'comment' },
	comment_left: { type: Number, default: 0 },
	comment_right: { type: Number, default: 0 },
	comment_parentId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
	isDeleted: { type: Boolean, default: false },
}, {
	timestamps: true,
	collection: COLLECTION_NAME,
});

//Export the model
module.exports = {
	comment : model(DOCUMENT_NAME, commentSchema)
}