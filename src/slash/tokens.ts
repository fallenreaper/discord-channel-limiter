import { SlashCommand } from "#core/slash";
import userInformation from "#tables/userInformation";

/**
 * See the {@link https://ghom.gitbook.io/bot.ts/usage/create-a-command command guide} for more information.
 */
export default new SlashCommand({
  name: "tokens",
  description: "get your current token count",
  async run(interaction) {
    const userInfo = await userInformation.query
      .where({
        user_id: interaction.user.id,
      })
      .first();
    if (!userInfo) {
      return interaction.reply({
        content: "You do not have any tokens.",
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: `You have ${userInfo.allowance} tokens available. ${
        userInfo.allowance < 0 ? "You are muted." : ""
      }`,
      ephemeral: true,
    });
  },
});
