import { Cron } from "#core/cron";
import userInformation from "#tables/userInformation";
import { Guild } from "discord.js";

/**
 * See the {@link https://ghom.gitbook.io/bot.ts/usage/create-a-cron cron guide} for more information.
 */
export default new Cron({
  name: "recovery",
  description: "recovers tokens for messaging",
  schedule: { type: "minute", duration: 1 } /* every 1 minute */,
  async run() {
    (await userInformation.query).forEach(async (user) => {
      console.log(`Recovering user ${user.user_id}`);
      const allowance = user.allowance + 100;
      if (user.allowance < 10000) {
        console.log(
          `Adding 100 tokens to ${user.user_id}. New allowance: ${allowance}`
        );
        await userInformation.query
          .update({ allowance: allowance })
          .where({ user_id: user.user_id });
      }

      if (allowance >= 0) {
        /// TODO: Remove the Muted role if it exists.
        const guild = await Guild.fetch(user.guild_id);
        const mutedRole = guild.roles.cache.find((r) => r.name === "Muted");
        if (mutedRole) {
          const member = await guild.members.fetch(user.user_id);
          if (member.roles.cache.has(mutedRole.id)) {
            console.log(`Removing Muted role from ${user.user_id}`);
            await member.roles.remove(mutedRole);
          }
        }
      }

      return Promise.resolve();
    });
  },
});
