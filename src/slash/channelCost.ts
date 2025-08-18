import { SlashCommand } from "#core/slash";
import channelLimits from "#tables/channelLimits";

/**
 * See the {@link https://ghom.gitbook.io/bot.ts/usage/create-a-command command guide} for more information.
 */
export default new SlashCommand({
  name: "channel-cost",
  description: "gets the current channel cost",
  async run(interaction) {
    const channel = await channelLimits.query
      .where({
        guild_id: interaction.guildId!,
        channel_id: interaction.channelId!,
      })
      .first();

    return interaction.reply({
      content: `The current cost for this channel is ${
        channel?.cost ?? "not set"
      }.`,
    });
  },
});
