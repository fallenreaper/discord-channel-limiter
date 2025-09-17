import { Listener } from "#core/listener"
import { processNewAndEditedMessages } from "../utilities/util.ts"

/**
 * See the {@link https://ghom.gitbook.io/bot.ts/usage/create-a-listener listener guide} for more information.
 */
export default new Listener({
	event: "messageUpdate",
	description: "listens for edited messages in a guild",
	async run(_, newMessage) {
		processNewAndEditedMessages(newMessage)
	},
})
