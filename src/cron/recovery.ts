import { Cron } from "#core/cron";
import userInformation from "#tables/userInformation";
import { Guild } from "discord.js";

/**
 * See the {@link https://ghom.gitbook.io/bot.ts/usage/create-a-cron cron guide} for more information.
 */
export default new Cron({
  name: "recovery",
  description: "recovers tokens for messaging",
  schedule: { type: "minute", duration: 1 } /* every 2 hours */,
  async run() {
    (await userInformation.query).forEach((user) => {
      /// TODO: Set this upper allowance limit to a config value
      if (user.allowance < 10000) {
        user.allowance += 100;
        return userInformation.query
          .update({ allowance: user.allowance })
          .where({ user_id: user.user_id });
      }

      return Promise.resolve();
    });
  },
});
