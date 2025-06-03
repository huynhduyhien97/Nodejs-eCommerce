'use strict'

const {getUnSelectData, getSelectData} = require( "../../utils" );

const findAllDiscountCodesSelect = async ({ limit, page, sort = 'ctime', filter, select, model }) => {
	const skip = (page - 1) * limit;
	const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
	
	const documents = await model.find(filter)
		.sort(sortBy)
		.skip(skip)
		.limit(limit)
		.select(getSelectData(select))
		.lean()

	return documents
}

const findAllDiscountCodesUnSelect = async ({ limit, page, sort = 'ctime', filter, unSelect, model }) => {
	const skip = (page - 1) * limit;
	const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
	
	const documents = await model.find(filter)
		.sort(sortBy)
		.skip(skip)
		.limit(limit)
		.select(getUnSelectData(unSelect))
		.lean()

	return documents
}

const findDiscount = async ({model, filter}) => {
	return await model.findOne(filter).lean()
}

module.exports = {
	findAllDiscountCodesSelect,
	findAllDiscountCodesUnSelect,
	findDiscount
}