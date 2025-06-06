const amqp = require('amqplib');
const messages = 'Hello RabbitMQ user!';

const runProducer = async () => {
	try {
		const connection = await amqp.connect('amqp://guest:12345@localhost');
		const channel = await connection.createChannel();

		const queue_name = 'test-queue';
		await channel.assertQueue(queue_name, {
			durable: true,
		})

		// Send a message to the queue
		channel.sendToQueue(queue_name, Buffer.from(messages));
	} catch (error) {
		console.error(error)
	}
}

runProducer().catch(e => {
	console.error(e);
})