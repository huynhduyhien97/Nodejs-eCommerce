'use strict'

const { Client, GatewayIntentBits } = require('discord.js')
const {
	DISCORD_BOT_TOKEN,
	DISCORD_BOT_CHANNEL_ID
} = process.env


class LoggerService {

	constructor() {
		this.client = new Client({
			intents: [
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent
			]
		})

		// add channelId
		this.channelId = DISCORD_BOT_CHANNEL_ID

		this.client.on('ready', () => {
			console.log(`Discord bot logged in as ${this.client.user.tag}!`)
		})

		this.client.login(DISCORD_BOT_TOKEN)
			.then(() => console.log('Discord client logged in successfully'))
			.catch(err => console.error('Failed to login to Discord:', err))
	}

	sendToFormatCode(logData) {
		const { code, message = 'This is some additional information about the code', title = 'Code example' } = logData

		const codeMessage = {
			content: message,
			embeds: [
				{
					color: parseInt('00ff00', 16), // Green color
					title,
					description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
				}
			],
		}

		this.sendToMessage(codeMessage)
	}

	sendToMessage(message = `message`) {
		const channel = this.client.channels.cache.get(this.channelId)

		if (!channel) {
			console.error('Channel not found:', this.channelId)
			return
		}

		channel.send(message).catch(err => {
			console.error('Failed to send message to Discord channel:', err)
		})
	}
}

// const loggerService = new LoggerService()

module.exports = new LoggerService()