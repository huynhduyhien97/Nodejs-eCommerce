'use strict'

const redis = require('redis');
const {redis: {host, port}} = require('./config')

class RedisConfig {
    constructor() {
        this.connect()
    }

    connect() {
        const client = redis.createClient({
            port: port,
            host: host
        });

        client.on('connect', () => {
            console.log(`Connected: Redis connected host ${host} port ${port}!`)
        });

        client.on('error', () => {
            console.log(`Error: Redis connected host ${host} port ${port}!`)
        });
    }

    static getInstance() {
        if (!RedisConfig.instance) {
            RedisConfig.instance = new RedisConfig()
        }

        return RedisConfig.instance
    }
}

const instanceRedis = RedisConfig.getInstance();
module.exports = instanceRedis;