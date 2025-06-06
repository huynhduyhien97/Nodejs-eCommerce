'use strict'

const {notification} = require( "../models/notification.model" )

class NotificationService {

	static pushNotiToSysttem = async ({ type = 'SHOP-001', receiveId = 1, senderId = 1, options = {} }) => {

		let noti_content

		if (type === 'SHOP-001') {
			noti_content = '*** A new product added ***'
		} else if (type === 'PROMOTION-001') {
			noti_content = '*** A new promotion available ***'
		}

		const newNoti = await notification.create({
			noti_type: type,
			noti_senderId: senderId,
			noti_receiverId: receiveId,
			noti_content: noti_content,
			noti_options: options
		})

		return newNoti
	}

	static listNotiByUser = async ({ userId = 1, type = 'ALL', isRead = 0 }) => {

		const match = { noti_receiverId: userId }
		if (type !== 'ALL') {
			match.noti_type ??= type
		}

		return await notification.aggregate([
			{
				$match: match
			},
			{
				$project: {
					noti_type: 1,
					noti_senderId: 1,
					noti_receiverId: 1,
					noti_content: {
						$concat: [
							{
								$substr: ['$noti_options.shop_name', 0, -1]
							},
							' vừa mới thêm một sản phẩm mới: ',
							{
								$substr: ['$noti_options.product_name', 0, -1]
							}
						]
					},
					createdAt: 1,
				}
			}
		])
	}
}

module.exports = NotificationService