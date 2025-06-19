'use strict'

const cloudinary = require('../configs/config.cloudinary');

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
}