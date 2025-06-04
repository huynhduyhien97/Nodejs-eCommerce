'use strict'

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
})

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
})

const token = 'MTM3OTc1MzI3NDI2OTI0MTM3NA.GglZup.OKhbo7rm1tXKMFu7tYhTFsIhHDWwXPfZpBVxf0'
client.login(token)
	.then(() => console.log('Discord client logged in successfully'))
	.catch(err => console.error('Failed to login to Discord:', err))

client.on('messageCreate', msg => {
	if (msg.author.bot) return // Ignore messages from bots
	if (msg.content === 'Ping') {
		msg.reply('Pong!')
	} else if (msg.content === '!hello') {
		msg.reply('Hello there!')
	} else {
		console.log(`Received message: ${msg.content}`)
	}
})