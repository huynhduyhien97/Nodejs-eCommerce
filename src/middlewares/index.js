'use strict'

const Logger = require('../loggers/discord.log.v2')

const pushLogToDiscord = async (req, res, next) => {
	try {
		Logger.sendToFormatCode({
			title: `Method: ${req.method}`,
			code: req.method === 'GET' ? req.query : req.body,
			message: `${req.get('host')}${req.originalUrl}`
		})

		return next()
	} catch (err) {
		next(err)
	}
}

const exit = () => {
    process.exit(1)
}

module.exports = {
	pushLogToDiscord,
	exit
}