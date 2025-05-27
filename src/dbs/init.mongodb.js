'use strict'

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');

const connectString = `mongodb://localhost:27017/shopDEV`

// Singleton Pattern - chỉ khởi tạo một kết nối duy nhất
class Database {
	constructor() {
		this.connect()
	}
	// connect
	connect(type = 'mongodb') {
		// dev
		if (1 === 1) {
		  mongoose.set('debug', true)
		  mongoose.set('debug', { color : true })
		}

		mongoose.connect(connectString, {
			maxPoolSize: 50,
		}).then( _ => {
			console.log(`Connected MongoDB Success Pro`, countConnect())
		})
		.then( err => console.log(`Error Connect!`) )
	}
	static getInstance() {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
