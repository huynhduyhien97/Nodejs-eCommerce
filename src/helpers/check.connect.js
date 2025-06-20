'use strict'

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const _SECONDS = 1000 * 60; 

// count connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
  return numConnection;
}

// check over load
const checkOverload = () => {
	setInterval(() => {
		const numConnection = mongoose.connections.length;
		const numCores = os.cpus().length;
		const memoryUsage = process.memoryUsage().rss;
		// Example maximum number of connections based on number os cores
		const maxConnections = numCores * 5;

		console.log(`Active connections: ${numConnection}`);
		console.log(`Memory usage: ${(memoryUsage / 1024 / 1024).toFixed(2)} MB`);

		if (numConnection > maxConnections) {
			console.warn(`Warning: High number of connections detected! Current: ${numConnection}, Max allowed: ${maxConnections}`);
			// notify.send(...)
		}

	}, _SECONDS); // Monitor every 5 seconds
}

module.exports = {
	countConnect,
	checkOverload
}
