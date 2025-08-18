import { MAX_ALLOWANCE } from "#config";
import { SlashCommand } from "#core/slash";
import channelLimits from "#tables/channelLimits";
import { ChannelType } from "discord.js";

const setupChannelCost = async (
  guildId: string | null,
  channelId: string,
  cost: number | null
) => {
  const limit = await channelLimits.query
    .where({
      guild_id: guildId!,
      channel_id: channelId,
    })
    .first();
  if (!limit) {
    return await channelLimits.query.insert({
      guild_id: guildId!,
      channel_id: channelId,
      cost: cost!,
    });
  }
  return await channelLimits.query
    .update({
      cost: cost || 0,
    })
    .where({
      guild_id: guildId!,
      channel_id: channelId,
    });
};

/**
 * See the {@link https://ghom.gitbook.io/bot.ts/usage/create-a-command command guide} for more information.
 */
export default new SlashCommand({
  name: "channel-init",
  description: "initializes a channel to marketing",
  build: (builder) => {
    builder.addNumberOption((option) => {
      option
        .setName("cost")
        .setDescription("The cost per character in the channel")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(MAX_ALLOWANCE);
      return option;
    });
  },
  async run(interaction) {
    // Conducts the Channel Setup
    await setupChannelCost(
      interaction.guildId,
      interaction.channelId,
      interaction.options.getNumber("cost")
    );

    // Creates Muted Role if it doesn't exist.
    let role = await interaction.guild?.roles.cache.find(
      (r) => r.name === "Muted"
    );
    if (!role) {
      role = await interaction.guild?.roles.create({
        name: "Muted",
        color: "Grey",
      });
    }

    // Sets Channel Specific Permissions for the `Muted` Role.
    interaction.channel.type === ChannelType.GuildText &&
      interaction.channel?.permissionOverwrites.create(role!, {
        SendMessages: false, // Disallow sending messages for this role
      });

    return interaction.reply({
      content: `Channel initialized successfully! Cost per Character set to: ${interaction.options.getNumber(
        "cost"
      )}`,
      ephemeral: true,
    });
  },
});
