'use strict'

const { product, clothing, electronic, furniture } = require('../models/product.model');
const {BadRequestError} = require( "../core/error.response" );
const {
	findAllDraftsForShop, 
	findAllPublishForShop, 
	publishProductByShop, 
	unPublishProductByShop,
	searchProductByUser,
	findAllProducts,
	findProduct,
	updateProductById
} = require( '../models/repositories/product.repo' );
const {removeUndefinedObject, updateNestedObjectParser} = require( '../utils' );
const {insertInventory} = require( '../models/repositories/inventory.repo' );
const {pushNotiToSysttem} = require( './notification.service' );


// define Factory class to create product
class ProductFactory {
	static productRegistry = {} // key : class

	static registerProductType(type, classRef) {
		ProductFactory.productRegistry[type] = classRef;
	}

	static async createProduct( type, payload ) {
		const productClass = ProductFactory.productRegistry[type];
		if (!productClass) throw new BadRequestError(`Product type ${type} is not supported`);
		
		return new productClass(payload).createProduct();
	}

	static async updateProduct(type, productId, payload) {
		const productClass = ProductFactory.productRegistry[type];
		if (!productClass) throw new BadRequestError(`Product type ${type} is not supported`);

		return new productClass(payload).updateProduct(productId);
	}

	static async publishProductByShop ({ product_shop, product_id }) {
		return await publishProductByShop({ product_shop, product_id });
	}

	static async unPublishProductByShop ({ product_shop, product_id }) {
		return await unPublishProductByShop({ product_shop, product_id });
	}

	// query

	static async findAllDraftsForShop( {product_shop, limit = 50, skip = 0} ) {
		const query = { product_shop, isDraft: true };
		return await findAllDraftsForShop({ query, limit, skip });
	}

	static async findAllPublishForShop( {product_shop, limit = 50, skip = 0} ) {
		const query = { product_shop, isPublished: true };
		return await findAllPublishForShop({ query, limit, skip });
	}

	static async searchProducts( {keySearch} ) {
		return await searchProductByUser({ keySearch })
	}

	static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
		return await findAllProducts({ limit, sort, page, filter, 
			select: ['product_name', 'product_price', 'product_thumb', 'product_shop']
		});
	}

	static async findProduct({ product_id }) {
		return await findProduct({ product_id, unSelect: ['__v'] });
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
	async createProduct(productId) {
		const newProduct = await product.create({ ...this, _id: productId })

		if (newProduct) {
			// add product_stock in inventory collection
			await insertInventory({ 
				productId: newProduct._id,
				shopId: this.product_shop,
				stock: this.product_quantity,
			})

			// push notification to system
			pushNotiToSysttem({
				type: 'SHOP-001',
				receiverId: 1,
				senderId: this.product_shop,
				options: {
					product_name: this.product_name,
					shop_name: this.product_shop,
				}
			}).then(res => console.log(res))
			.catch(err => console.error(err));
		}

		return newProduct;
	}

	// update product
	async updateProduct(productId, payload) {
		return await updateProductById({ productId, payload, model: product });
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

	async updateProduct(productId) {
		// 1. remove undefined/null attributes

		const objectParams = removeUndefinedObject(this)

		if (objectParams.product_attributes) {
			// update child
			await updateProductById({ 
				productId, 
				payload: updateNestedObjectParser(objectParams.product_attributes), 
				model: clothing
			})
		}

		const updatedProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));

		return updatedProduct
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

	async updateProduct(productId) {
		// 1. remove undefined/null attributes

		const objectParams = removeUndefinedObject(this)

		if (objectParams.product_attributes) {
			// update child
			await updateProductById({ 
				productId, 
				payload: updateNestedObjectParser(objectParams.product_attributes), 
				model: electronic
			})
		}

		const updatedProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));

		return updatedProduct
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

	async updateProduct(productId) {
		// 1. remove undefined/null attributes

		const objectParams = removeUndefinedObject(this)

		if (objectParams.product_attributes) {
			// update child
			await updateProductById({ 
				productId, 
				payload: updateNestedObjectParser(objectParams.product_attributes), 
				model: furniture
			})
		}

		const updatedProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));

		return updatedProduct
	}
}

// register product types
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;