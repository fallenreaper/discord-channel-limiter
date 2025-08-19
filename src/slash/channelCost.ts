import { SlashCommand } from "#core/slash";
import channelLimits from "#tables/channelLimits";

/**
 * See the {@link https://ghom.gitbook.io/bot.ts/usage/create-a-command command guide} for more information.
 */
export default new SlashCommand({
  name: "channel-cost",
  description: "gets the current channel cost",
  async run(interaction) {
    //Get the channel Information
    const channel = await channelLimits.query
      .where({
        guild_id: interaction.guild?.id!,
        channel_id: interaction.channel.id!,
      })
      .first();

    return interaction.reply({
      content: `The current cost for this channel is ${
        channel?.cost ?? "not set"
      }.`,
    });
  },
});
