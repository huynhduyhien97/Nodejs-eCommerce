const mysql = require('mysql2');

// Create a connection to pool server
const pool = mysql.createPool({
	host: 'localhost',
	port: '3366',
	user: 'hienhd',
	password: 'admin',
	database: 'shopDEV',
});

const batchSize = 100000;  // Adjust as needed
const totalSize = 10_000_000; // ::::::::: Insert Time :::::::::: 46.025s

let currentId = 1;

console.time('::::::::: Insert Time :::::::::');
const insertBatch = async () => {
	const values = [];
	for (let i = 0; i < batchSize && currentId <= totalSize; i++)
	{
		const name    = `Name ${currentId}`;
		const age     = Math.floor(currentId % 100);
		const address = `Address ${currentId}`;
		
		values.push([currentId, name, age, address]);
		currentId++;
	}

	if(!values.length){
		console.timeEnd('::::::::: Insert Time :::::::::');
		pool.end((err) => {
			if (err) {
				console.error('Error closing pool:', err);
				return;
			}
			console.log('Pool closed successfully.');
		});
		return;
	}

	const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`;
	pool.query(sql, [values], async (err, results) => {
		if (err) {
			console.error('Error executing query:', err);
			return;
		}
		console.log(`Inserted ${results.affectedRows} rows`);
		
		// Continue with the next batch
		await insertBatch();
	});
}

insertBatch().catch(err => {
	console.error('Error in insertBatch:', err);
});

// perform a simple operation
// pool.query(`SELECT * FROM users`, (err, results) => {
// 	if (err) throw err;	
// 	console.log('Connection successful, result:', results);
	
// 	// Close the pool
// 	pool.end((err) => {
// 		if (err) throw err;
// 		console.log('Pool closed successfully.');
// 	});
// });
