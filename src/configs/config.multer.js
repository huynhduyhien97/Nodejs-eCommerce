'use strict'

const multer = require('multer');

const uploadMemory = multer({
	storage: multer.memoryStorage(),
})

// Ưu tiên lưu trữ trên disk
const uploadDisk = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, './src/upload/');
		},
		filename: (req, file, cb) => {
			cb(null, `${Date.now()}-${file.originalname}`);
		}
	}),
	// limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = {
	uploadMemory,
	uploadDisk
}