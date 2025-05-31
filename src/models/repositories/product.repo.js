'use strict'

const {Schema} = require( 'mongoose' );
const { product, electronic, clothing, furniture } = require('../../models/product.model');

const findAllDraftsForShop = async ({ query, limit, skip }) => {
	return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
	return await queryProduct({ query, limit, skip })
}

const searchProductByUser = async ({ keySearch }) => {
	const regexSearch = new RegExp(keySearch);
	const results = await product.find({
		isDraft: false, 
		$text: { $search: regexSearch },
	}, {score: { $meta: 'textScore' }})
	.sort({score: { $meta: 'textScore' }})
	.lean()

	return results
} 

const queryProduct = async ({ query, limit, skip }) => {
	return await product.find(query)
		.populate('product_shop', 'name email -_id') // Relationship with shop
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit)
		.lean()
		.exec()
}

const publishProductByShop = async ({ product_shop, product_id }) => {
	const foundShop = await product.findOne({ 
		product_shop: product_shop,
		_id: product_id,
	});

	if (!foundShop) return null

	foundShop.isDraft = false
	foundShop.isPublished = true

	const { modifiedCount } = await foundShop.updateOne(foundShop);

	return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
	const foundShop = await product.findOne({ 
		product_shop: product_shop,
		_id: product_id,
	});

	if (!foundShop) return null

	foundShop.isDraft = true
	foundShop.isPublished = false

	const { modifiedCount } = await foundShop.updateOne(foundShop);

	return modifiedCount
}

module.exports = {
	findAllDraftsForShop,
	findAllPublishForShop,
	publishProductByShop,
	unPublishProductByShop,
	searchProductByUser,
}