import { INITIAL_POINTS } from "#config"
import { Listener } from "#core/listener"
import channelLimits from "#tables/channelLimits"
import userInformation from "#tables/userInformation"
import { extractUrlsFromString } from "../utilities/util"

/**
 * See the {@link https://ghom.gitbook.io/bot.ts/usage/create-a-listener listener guide} for more information.
 */
export default new Listener({
	event: "messageCreate",
	description: "listens for users and sets mute status as needed",
	async run(message) {
		if (message.author.bot) return

		const channelInfo = await channelLimits.query
			.where({
				channel_id: message.channel.id,
				guild_id: message.guild?.id!,
			})
			.first()

		// No Channel Limits are Set.
		if (!channelInfo) {
			return
		}
		// Sets the Cost for business.
		let cost = message.content.length * channelInfo.cost

		let isNewUser = false
		let userInfo = await userInformation.query
			.where({
				user_id: message.author.id,
			})
			.first()
		if (!userInfo) {
			isNewUser = true
			userInfo = {
				user_id: message.author.id,
				guild_id: message.guild?.id!,
				allowance: INITIAL_POINTS,
			}
		}

		// Account for Embeds
		cost += channelInfo.cost * message.embeds.length

		// Account for Files
		cost += channelInfo.cost * 1000 * message.attachments.size 

		// Account for URLS
		let numberOfUrls = 0;
		if (message.content.length > 0) {
			numberOfUrls += extractUrlsFromString(message.content).length;
		}
		if (message.embeds.length > 0) {
			numberOfUrls += extractUrlsFromString(message.embeds.map( e => e.toJSON()).join(" ")).length
		}
		cost += channelInfo.cost * 1000 * numberOfUrls;

		// Makes adjustments to the user's allowance
		userInfo.allowance -= cost;

		console.log(
			`${isNewUser} User ${message.author.id} has a cost of ${cost}, new allowance is ${userInfo.allowance}`,
		)
		// If it dropped below user, apply the Muted role.
		if (userInfo.allowance < 0) {
			message.member?.roles.add(
				message.guild?.roles.cache.find((r) => r.name === "Muted")!,
			)
		}

		// Update or Insert the user information.
		if (isNewUser) {
			await userInformation.query.insert(userInfo)
		} else {
			await userInformation.query.update(userInfo).where({
				user_id: message.author.id,
			})
		}
	},
})
