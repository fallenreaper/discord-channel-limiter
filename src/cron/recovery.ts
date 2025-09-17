import type { Role } from "discord.js";
import { MAX_ALLOWANCE, POINTS_PER_MINUTE } from "#config";
import client from "#core/client";
import { Cron } from "#core/cron";
import userInformation from "#tables/userInformation";

/**
 * See the {@link https://ghom.gitbook.io/bot.ts/usage/create-a-cron cron guide} for more information.
 */
export default new Cron({
	name: "recovery",
	description: "recovers tokens for messaging",
	schedule: { type: "minute", duration: 1 } /* every 1 minute */,
	runOnStart: true,
	async run() {
		// Loops throughh all users in the userInformation Table.
		(await userInformation.query).forEach(async (user) => {
			const allowance = user.allowance + POINTS_PER_MINUTE;
			if (user.allowance < MAX_ALLOWANCE) {
				await userInformation.query
					.update({ allowance: allowance })
					.where({ user_id: user.user_id });
			}

			// If the allowance is above 0, remove the Muted role
			if (allowance >= 0) {
				// If there is an invalid guild, return
				const guild = await client.guilds.cache.find(
					(g) => g.id === user.guild_id,
				);
				if (!guild) return;

				// If there is an invalid user, return
				const _user = await guild.members.cache.find(
					(u) => u.user.id === user.user_id,
				);
				if (!_user) return;

				// Find the correct role, and remove it.
				const roleToRemove = guild.roles.cache.find(
					(r: Role) => r.name === "Muted",
				)!;
				_user.roles.remove(roleToRemove);
			}

			return Promise.resolve();
		});
	},
});
