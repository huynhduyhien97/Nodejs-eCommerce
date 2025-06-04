// 'use strict'

const Redis = require('redis')

class RedisPubSubService {

	constructor() {
		this.publisher = Redis.createClient();
		this.subscriber = Redis.createClient();
	}

	publish( channel, message ) {
		this.subscriber.on("subscribe", (channel) => {
			new Promise( (resolve, reject) => {
				this.publisher.publish(channel, message, (err, reply) => {
					if (err) reject(err)
					else resolve(reply)
				})
			})
		})
	}

	subscribe( channel, callback ) {
		this.subscriber.subscribe(channel)
		this.subscriber.on("message", function(subscribeChanel, message) {
			if (channel === subscribeChanel) {
				callback(channel, message)
			}
		});
	}
}

module.exports = new RedisPubSubService()