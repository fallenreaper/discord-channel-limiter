import { SlashCommand } from "#core/slash";
import channelLimits from "#tables/channelLimits";
import { ChannelType } from "discord.js";

const setupChannelCost = async (
  guildId: string | null,
  channelId: string,
  cost: number | null
) => {
  await channelLimits.query.insert({
    guild_id: guildId!,
    channel_id: channelId,
    cost: cost!,
  });
};

/**
 * See the {@link https://ghom.gitbook.io/bot.ts/usage/create-a-command command guide} for more information.
 */
export default new SlashCommand({
  name: "init",
  description: "initializes a channel to markings",
  build: (builder) => {
    builder.addNumberOption((option) => {
      option
        .setName("cost")
        .setDescription("The cost per character in the channel")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(10000);
      return option;
    });
    // builder.addSubcommand, builder.addStringOption, etc.
  },
  async run(interaction) {
    await setupChannelCost(
      interaction.guildId,
      interaction.channelId,
      interaction.options.getNumber("cost")
    );

    // Creates Muted Role if it doesn't exist.
    let role = await interaction.guild?.roles.fetch("Muted");
    if (!role) {
      role = await interaction.guild?.roles.create({
        name: "Muted",
        color: "Grey",
      });
    }

    interaction.channel.type === ChannelType.GuildText &&
      interaction.channel?.permissionOverwrites.create(role!, {
        SendMessages: false, // Disallow sending messages for this role
      });

    // todo: code of command or sub-commands here
    return interaction.reply({
      content: `Channel initialized successfully! Cost per Character set to: ${interaction.options.getNumber(
        "cost"
      )}`,
      ephemeral: true,
    });
  },
});
