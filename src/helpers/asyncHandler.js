'use strict'

// fn : function được truyền vào từ controller
// catch nếu bị lỗi
const asyncHandler = fn => {
	return (req, res, next) => {
		fn(req, res, next).catch(next)
	}
}	

module.exports = asyncHandler