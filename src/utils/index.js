'use strict'

const _ = require('lodash');
const {Schema} = require( 'mongoose' );

const getInfoData = ({ fields = [], object = {} }) => {
	return _.pick(object, fields);
}

// ['a', 'b', 'c'] => { a: 1, b: 1, c: 1 }
const getSelectData = (select = []) => {
	return Object.fromEntries(select.map(el => [el, 1]))
}

// ['a', 'b', 'c'] => { a: 0, b: 0, c: 0 }
const getUnSelectData = (select = []) => {
	return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = (object = {}) => {
	return _.omitBy(object, _.isUndefined);
}

/**
	const obj = {
		a : {
			b: 1,
			c: 2,
		},
		d: 3,
	}

	return {
		'a.b': 1,
		'a.c': 2,
		'd': 3,
	}
*/
const updateNestedObjectParser = obj => {
	const final = {}

	Object.keys(obj).forEach(key => {
		if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
			const response = updateNestedObjectParser(obj[key]);
			Object.keys(response).forEach(nestedKey => {
				final[`${key}.${nestedKey}`] = response[nestedKey];
			});
		} else {
			final[key] = obj[key];
		}
	});

	return final
}

const convertToObjectIdMongodb = id => Schema.Types.ObjectId(id);

const checkEnable = (value) => {
    return value === 'true'
}

const typeOf = value => Object.prototype.toString.call(value).slice(8, -1);

module.exports = {
	getInfoData,
	getSelectData,
	getUnSelectData,
	removeUndefinedObject,
	updateNestedObjectParser,
	convertToObjectIdMongodb,
	checkEnable,
	typeOf,
}