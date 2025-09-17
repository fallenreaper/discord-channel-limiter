import { Listener } from "#core/listener";
import { processNewAndEditedMessages } from "../utilities/util";

/**
 * See the {@link https://ghom.gitbook.io/bot.ts/usage/create-a-listener listener guide} for more information.
 */
export default new Listener({
	event: "messageCreate",
	description: "listens for users and sets mute status as needed",
	async run(message) {
		processNewAndEditedMessages(message);
	},
});
