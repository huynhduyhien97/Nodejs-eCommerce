'use strict'

const { StatusCodes, ReasonPhrases } = require('../helpers/httpStatusCode')

class ErrorResponse extends Error {
	constructor(message, status) {
		super()
		this.status = status
	}
}

class ConflictRequestError extends ErrorResponse {
	constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.FORBIDDEN) {
		super(message, statusCode)
	}
}

class BadRequestError extends ErrorResponse {
	constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
		super(message, statusCode)
	}
}

module.exports = { 
	ConflictRequestError,
	BadRequestError,
}