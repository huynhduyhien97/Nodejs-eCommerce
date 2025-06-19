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

		// Set prefetch : mỗi tác vụ chỉ được thực hiện cùng 1 lần mà thôi, không cho lần thứ 2. Thằng này xong thì mới cho thằng khác làm
		channel.prefetch(1); 

		channel.consume(queue_name, (msg) => {
			const message = msg.content.toString();

			setTimeout(() => {
				console.log(`processed:`, message);	
				channel.ack(msg); // Xác nhận đã xử lý xong tin nhắn này
			}, Math.random() * 1000);
		});
	} catch (error) {
		console.error(error)
	}
}

consumerOrderedMessage().catch(error => {
	console.error(error);
});