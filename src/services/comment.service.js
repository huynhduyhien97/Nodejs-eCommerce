'use strict'

const {comment} = require( "../models/comment.model" )
const {product} = require( "../models/product.model" )
const {findProduct} = require( "../models/repositories/product.repo" )
const {getSelectData} = require( "../utils" )

class CommentService {
	
	static async createComment({ productId, userId, content, parentCommentId = null }) {

		const new_comment = new comment({
			comment_productId: productId,
			comment_userId: userId,
			comment_content: content,
			comment_parentId: parentCommentId
		})

		let rightValue
		if (parentCommentId) {
			
			const parentComment = await comment.findById(parentCommentId)
			if (!parentComment) throw new Error('Comment not found')

			rightValue = parentComment.comment_right
			// updateMany comments

			await comment.updateMany({
				comment_productId: productId,
				comment_right: { $gte: rightValue }
			}, {
				$inc: { comment_right: 2 }
			}, {
				multi: true
			})

			await comment.updateMany({
				comment_productId: productId,
				comment_left: { $gt: rightValue }
			}, {
				$inc: { comment_left: 2 }
			}, {
				multi: true
			})

		} else {
			const maxRightValue = await comment.findOne({
				comment_productId: productId
			}, 'comment_right', { sort: { comment_right: -1 } })

			rightValue = maxRightValue ? maxRightValue.comment_right + 1 : 1
		}

		new_comment.comment_left = rightValue
		new_comment.comment_right = rightValue + 1

		await new_comment.save()

		return new_comment
	}

	static async getCommentsByParentId({ productId, parentCommentId = null, limit = 50, offset = 0 }) {

		if (parentCommentId) {
			const parent = await comment.findById(parentCommentId)
			if (!parent) throw new Error('Comment not found')

			const comments = await comment.find({
				comment_productId: productId,
				comment_left: { $gt: parent.comment_left },
				comment_right: { $lt: parent.comment_right },
			})
			.select(getSelectData(['comment_left', 'comment_right', 'comment_parentId', 'comment_content']))
			.sort({
				comment_left: 1
			})

			return comments
		}

		const comments = await comment.find({
			comment_productId: productId,
			comment_parentId: parentCommentId  ,
		})
		.select(getSelectData(['comment_left', 'comment_right', 'comment_parentId', 'comment_content']))
		.sort({
			comment_left: 1
		})

		return comments
	}

	static async deleteComment({ commentId, productId }) {
		// check product exists
		const foundProduct = await findProduct({ productId })
		if (!foundProduct) throw new Error('Product not found')

		const foundComment = await comment.findById(commentId)
		if (!foundComment) throw new Error('Comment not found')

		// 1 tim gia tri left - right
		const { comment_left, comment_right } = foundComment
	    // 2 tim width
		const width = comment_right - comment_left + 1
		// 3 xoa comment con
		await comment.deleteMany({
			comment_productId: productId,
			comment_left: { $gte: comment_left, $lte: comment_right },
		})
		// 4 cap nhat lai left - right
		await comment.updateMany({
			comment_productId: productId,
			comment_right: { $gt: comment_right }
		}, {
			$inc: { comment_right: -width }
		}, {
			multi: true
		})

		await comment.updateMany({
			comment_productId: productId,
			comment_left: { $gt: comment_right }
		}, {
			$inc: { comment_left: -width }
		}, {
			multi: true
		})

		return true;
	}
}

module.exports = CommentService