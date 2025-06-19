'use strict'

const { uploadImageFromUrl } = require('../services/upload.service');
const { SuccessResponse } = require('../core/success.response');

class UploadController {
	uploadFile = async (req, res, next) => {
		new SuccessResponse({
			message: 'Upload file successfully',
			metadata: await uploadImageFromUrl()
		}).send(res);
	}
}

module.exports = new UploadController()
