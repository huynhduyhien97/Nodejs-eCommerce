'use strict'

const { product, clothing, electronic, furniture } = require('../models/product.model');
const {BadRequestError} = require( "../core/error.response" )


// define Factory class to create product
class ProductFactory {
	/**
		type: 'Clothing' | 'Electronic'
		payload: data
	*/

	static productRegistry = {} // key : class

	static registerProductType(type, classRef) {
		ProductFactory.productRegistry[type] = classRef;
	}

	static async createProduct( type, payload ) {
		const productClass = ProductFactory.productRegistry[type];
		if (!productClass) throw new BadRequestError(`Product type ${type} is not supported`);
		
		return new productClass(payload).createProduct();
	}
}

// define base Product class
class Product {
	constructor({
		product_name, product_thumb, product_description, product_price,
		product_quantity, product_type, product_shop, product_attributes
	}) {
		this.product_name = product_name;
		this.product_thumb = product_thumb;
		this.product_description = product_description;
		this.product_price = product_price;
		this.product_quantity = product_quantity;
		this.product_type = product_type;
		this.product_shop = product_shop;
		this.product_attributes = product_attributes;
	}

	// create new product

	async createProduct(product_id) {
		return await product.create({ ...this, _id: product_id })
	}
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
	
	async createProduct() {
		const newClothing = await clothing.create({
			...this.product_attributes,
			product_shop: this.product_shop,
		})
		if (!newClothing) throw new BadRequestError('Failed to create clothing product');

		const newProduct = await super.createProduct(newClothing._id);
		if (!newProduct) throw new BadRequestError('Failed to create clothing product');

		return newProduct
	}
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
	
	async createProduct() {
		const newElectronic = await electronic.create({
			...this.product_attributes,
			product_shop: this.product_shop,
		})
		if (!newElectronic) throw new BadRequestError('Failed to create clothing product');

		const newProduct = await super.createProduct(newElectronic._id);
		if (!newProduct) throw new BadRequestError('Failed to create clothing product');

		return newProduct
	}
}

// Define sub-class for different product types Furniture
class Furniture extends Product {
	
	async createProduct() {
		const newFurniture = await furniture.create({
			...this.product_attributes,
			product_shop: this.product_shop,
		})
		if (!newFurniture) throw new BadRequestError('Failed to create clothing product');

		const newProduct = await super.createProduct(newFurniture._id);
		if (!newProduct) throw new BadRequestError('Failed to create clothing product');

		return newProduct
	}
}

// register product types
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;