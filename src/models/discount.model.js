'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

// Declare the Schema of the Mongo model
var discountSchema = new Schema({
	discount_name: { type: String, required: true, unique: true },
	discount_description: { type: String, required: true, },
	discount_type: { type: String, default: 'fixed_amount' }, // fixed_amount, percentage
	discount_value: { type: Number, required: true },
	discount_code: { type: String, required: true },
	discount_start_date: { type: Date, required: true },
	discount_end_date: { type: Date, required: true },
	discount_max_uses: { type: Number, required: true }, // the maximum number of discount uses
	discount_uses_count: { type: Number, required: true }, // the number of times the discount has been used
	discount_users_used: { type: Array, default: [] }, // array of user who have used the discount
	discount_max_users_per_user: { type: Number, required: true }, // the maximum number of times a user can use the discount
	discount_min_order_value: { type: Number, required: true }, // the minimum order value to apply the discount
	discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true }, // the shop that created the discount

	discount_is_active: { type: Boolean, default: true }, // whether the discount is active or not
	discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] },
	discount_product_ids: { type: Array, default: [] }, // array of product the discount applies to, if 'specific' is chosen
}, {
	timestamps: true,
	collection: COLLECTION_NAME,
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);