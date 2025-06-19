'use strict'

const cloudinary = require('../configs/config.cloudinary');

// Upload from url
const uploadImageFromUrl = async (url) => {
	try {

		const urlImage = `https://down-vn.img.susercontent.com/file/d4e14f20fbcb6e42c2adc631536ca1c9`;
		const folderName = 'product/shopId', newFileName = 'testdemo'; // thay shopId bằng id của shop

		const result = await cloudinary.uploader.upload(urlImage, {
			public_id: newFileName, // name of the file
			folder: folderName,
		})

		console.log(result)
		return result;
	} catch (error) {
		console.error('Error uploading image from URL:', error);
	}
}

module.exports = {
	uploadImageFromUrl
}