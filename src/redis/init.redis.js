'use strict'

const { createClient } = require('redis')

const client = createClient()

client.on('error', err => console.log('Redis Client Error', err));

client.connect();

client.ping('connected')
	.then(pong => console.log('Redis ping response:', pong))
	.catch(err => console.error('Error on ping:', err));

module.exports = client
