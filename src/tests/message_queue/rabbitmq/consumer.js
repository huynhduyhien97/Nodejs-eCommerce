const amqp = require('amqplib');

const runConsumer = async () => {
	try {
		const connection = await amqp.connect('amqp://guest:12345@localhost');
		const channel = await connection.createChannel();

		const queue_name = 'test-queue';
		await channel.assertQueue(queue_name, {
			durable: true,
		})

		channel.consume(queue_name, (msg) => {
			console.log(`Received message: ${msg.content.toString()}`);
		}, {
			noAck: false
		})
	} catch (err) {
		console.error(err);
	}
}

runConsumer().catch(e => {
	console.error(e);
});