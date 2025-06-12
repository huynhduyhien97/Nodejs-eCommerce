'use strict'

const mongoose = require('mongoose');
const {db: {host, name, port}} = require('./config')

const connectString = `mongodb://${host}:${port}/${name}`;

const { countConnect } = require('../helpers/check.connect');
const MAX_POLL_SIZE = 50;
const TIME_OUT_CONNECT = 3000;

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
            maxPoolSize: MAX_POLL_SIZE,
			serverSelectionTimeoutMS: TIME_OUT_CONNECT,
		}).then(
			() => {
				try {
					countConnect();
				} catch (e) {
					console.log(e);
				}
				_ => console.log(`Connected mongodb success `);
			}
		).catch(
			err => console.error(`Error connect!`)
		);

		mongoose.connection.on('connected', () => {
            console.log('Mongodb connected to db success');
        });

        mongoose.connection.on('error', err => {
            console.error('Mongodb connected to db error' + err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongodb disconnected db success');
        });
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
