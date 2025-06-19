'use strict'

const amqp = require('amqplib');

async function consumerOrderedMessage() {
	try {
		const connection = await amqp.connect('amqp://guest:12345@localhost');
		const channel = await connection.createChannel();

		const queue_name = 'ordered-queue-message';
		await channel.assertQueue(queue_name, {
			durable: true,
		});

		for (let index = 1; index <= 10; index++)
		{
			const message = `ordered-queue-message::${index}`;
			console.log(message);
			// Send a message to the queue
			channel.sendToQueue(queue_name, Buffer.from(message), {
				persistent: true, // đảm bảo tin nhắn được lưu trữ trên đĩa
			});
		}

		setTimeout(() => {
			connection.close()
			process.exit(0)
		}, 1000);
	} catch (error) {
		console.error(error)
	}
}

consumerOrderedMessage().catch(error => {
	console.error(error);
});