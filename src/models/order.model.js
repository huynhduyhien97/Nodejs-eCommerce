'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

// Declare the Schema of the Mongo model
var orderSchema = new Schema({
	order_userId: { type: Number, required: true },
	/**
		order_checkout = {
			totalPrice,
			totalApplyDiscount,
			feeShip
		}
	*/
	order_checkout: { type: Object, default: {} },
	/**
		street, city, state, country, zipCode
	*/
	order_shipping: { type: Object },
	order_payment: { type: Object, default: {} },
	order_products: { type: Array, required: true },
	order_trackingNumber: { type: String, default: '#0000102062025' },
	order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled'], default: 'pending' }
}, {
	collection: COLLECTION_NAME,
	timestamps: true,
});

//Export the model
module.exports = {
	order: model(DOCUMENT_NAME, orderSchema)
}