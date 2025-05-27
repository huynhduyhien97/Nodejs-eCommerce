'use strict'

// const {  }
const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');
const { db : {host, name, port}} = require('../configs/config.mongodb');

const connectString = `mongodb://${host}:${port}/${name}`;

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
		.catch( err => console.log(err) )
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
