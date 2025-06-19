'use strict'

const { uploadImageFromUrl, uploadImageFromLocal, uploadImageFromLocalFiles, uploadImageFromLocalS3 } = require('../services/upload.service');
const { SuccessResponse } = require('../core/success.response');
const {BadRequestError} = require( '../core/error.response' );

class UploadController {
	uploadFile = async (req, res, next) => {
		new SuccessResponse({
			message: 'Upload file successfully',
			metadata: await uploadImageFromUrl()
		}).send(res);
	}

	uploadImageFromLocal = async (req, res, next) => {
		const { file } = req;
		if (!file) {
			throw new BadRequestError('No file uploaded');
		}
		new SuccessResponse({
			message: 'Upload file successfully',
			metadata: await uploadImageFromLocal({ path: file.path })
		}).send(res);
	}

	uploadImageFromLocalFiles = async (req, res, next) => {
		const { files } = req;
		if (!files.length) {
			throw new BadRequestError('No files uploaded');
		}
		new SuccessResponse({
			message: 'Upload file successfully',
			metadata: await uploadImageFromLocalFiles({ files })
		}).send(res);	
	}
	
	// Using s3 to upload image from local
	uploadImageFromLocalS3 = async (req, res, next) => {
		const { file } = req;
		if (!file) {
			throw new BadRequestError('No file uploaded');
		}
		new SuccessResponse({
			message: 'Upload file successfully',
			metadata: await uploadImageFromLocalS3({ file })
		}).send(res);
	}
}

module.exports = new UploadController()
