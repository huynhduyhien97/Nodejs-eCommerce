// test squash commit 1

const config = {
	app: {
        port: process.env.PORT,
    },
	db: {
        enable: process.env.MONGO_ENABLE,
        host: process.env.MONGO_HOST,
        port: process.env.MONGO_PORT,
        name: process.env.MONGO_DATABASE,
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD
    },
	redis: {
        enable: process.env.REDIS_ENABLE,
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD
    },
    rabbitmq: {
        enable: process.env.RABBIT_ENABLE,
    },
	notification: {
        discord: {
            token: process.env.DISCORD_BOT_TOKEN,
            channelId: process.env.DISCORD_BOT_CHANNEL_ID
        },
    },
}

module.exports = config