const amqp = require('amqplib');
const messages = 'Hello RabbitMQ user!';

const log = console.log

console.log = function() {
	log.apply(console, [new Date()].concat(arguments));
}

const runProducer = async () => {
	try {
		const connection = await amqp.connect('amqp://guest:12345@localhost');
		const channel = await connection.createChannel();

		const notificationExchange = 'notificationExchange'; // notification exchange (thuộc loại direct)
		const notiQueue = 'notificationQueueProcess'; // assertQueue
		const notificationExchangeDLX = 'notificationExchangeDLX';
		const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'; // assertQueue

		// 1. create Exchante
		await channel.assertExchange(notificationExchange, 'direct', { durable: true });

		// 2. create Queue
		const queueResult = await channel.assertQueue(notiQueue, { 
			exclusive: false, // cho phép các kết nối truy cập vào cùng một hàng đợi
			deadLetterExchange: notificationExchangeDLX, // chỉ định DLX
			deadLetterRoutingKey: notificationRoutingKeyDLX // chỉ định routing key cho DLX
		});

		// 3. Bind queue
		await channel.bindQueue(queueResult.queue, notificationExchange);

		// 4. send message
		const msg = 'a new product has been created';
		console.log(`producer ms::`, msg);
		await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {	
			expiration: '10000',
		}); // thời gian sống của tin nhắn (10 giây), hết hạn sau 10 giây

		setTimeout(() => {
			connection.close()
			process.exit(0)
		}, 500);
	} catch (error) {
		console.error(error)
	}
}

runProducer().catch(e => {
	console.error(e);
})