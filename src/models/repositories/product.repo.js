'use strict'

const { product, electronic, clothing, furniture } = require('../../models/product.model');
const {getSelectData, getUnSelectData} = require( '../../utils' );

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

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
	const skip = (page - 1) * limit;
	const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
	const products = await product.find(filter)
		.sort(sortBy)
		.skip(skip)
		.limit(limit)
		.select(getSelectData(select))
		.lean()
	
	return products;
}

const findProduct = async ({ productId, unSelect }) => {
	return product.findById(productId)
		.select(getUnSelectData(unSelect))
}

const updateProductById = async ({ productId, payload, model, isNew = true }) => {
	return await model.findByIdAndUpdate(productId, payload, { new: isNew });
}

const findProductById = async ({ productId }) => {
	return await product.findById(productId).lean()
}

const checkProductByServer = async (products) => {
	return await Promise.all(products.map(async (_product) => {
		const foundProduct = await product.findById(_product.productId).lean();
		if (foundProduct) {
			return {
				price: foundProduct.product_price,
				quantity: _product.quantity,
				productId: _product.productId,
			}
		}
	}))
}

module.exports = {
	findAllDraftsForShop,
	findAllPublishForShop,
	publishProductByShop,
	unPublishProductByShop,
	searchProductByUser,
	findAllProducts,
	findProduct,
	updateProductById,
	findProductById,
	checkProductByServer,
}