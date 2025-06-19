'use strict'

const cloudinary = require('../configs/config.cloudinary');
const { s3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('../configs/config.aws.s3');
const crypto = require('crypto');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// AWS S3
// Upload file using S3Client
// Upload from local
const uploadImageFromLocalS3 = async ({ file }) => {
	try {

		const randomImageName = () => crypto.randomBytes(16).toString('hex');
		const imageName = randomImageName() || 'unknown';

		const command = new PutObjectCommand({
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: imageName,
			Body: file.buffer, // Buffer cua file	
			ContentType: 'image/jpeg',
		})

		// public url
		const result = await s3.send(command);
		console.log(result);

		const signedUrl = new GetObjectCommand({
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: imageName,
		});
		const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 }); // 1 hour

		return url; 

	} catch (error) {
		console.error('Error uploading image from local using S3Client:', error);
	}
}




// Cloudinary
// Upload from url
const uploadImageFromUrl = async ({ url }) => {
	try {

		const urlImage = `https://down-vn.img.susercontent.com/file/d4e14f20fbcb6e42c2adc631536ca1c9`;
		const folderName = 'product/shopId', newFileName = 'testdemo'; // thay shopId bằng id của shop

		const result = await cloudinary.uploader.upload(urlImage, {
			public_id: newFileName, // name of the file
			folder: folderName,
		})

		return result;
	} catch (error) {
		console.error('Error uploading image from URL:', error);
	}
}

// Upload from local
const uploadImageFromLocal = async ({ path, folderName = `product/shopId` }) => {
	try {

		const result = await cloudinary.uploader.upload(path, {
			public_id: 'thumb',
			folder: folderName,
		});

		return {
			shopId: `shopId`,
			image_url: result.secure_url,
			thumb_url: await cloudinary.url(result.public_id, {
				height: 100,
				width: 100,
				format: 'jpg',
			})
		};

	} catch (error) {
		console.error('Error uploading image from local:', error);
	}
}

// Upload multiple file from local
const uploadImageFromLocalFiles = async ({ files, folderName = `product/shopId` }) => {
	try {

		if (!files.length) return

		const uploadedUrls = [];

		for (const file of files) {
			const result = await cloudinary.uploader.upload(file.path, {
				folder: folderName,
			});

			uploadedUrls.push({
				shopId: `shopId`,
				image_url: result.secure_url,
				thumb_url: await cloudinary.url(result.public_id, {
					height: 100,
					width: 100,
					format: 'jpg',
				})
			})
		}

		return uploadedUrls;

	} catch (error) {
		console.error('Error uploading images from local:', error);
	}
}

module.exports = {
	uploadImageFromUrl,
	uploadImageFromLocal,
	uploadImageFromLocalFiles,
	uploadImageFromLocalS3
}