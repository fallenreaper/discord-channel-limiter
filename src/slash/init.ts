import { SlashCommand } from "#core/slash";

const setupChannelCost = async (
  guildId: string | null,
  channelId: string,
  cost: number | null
) => {};

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
  run(interaction) {
    console.log("Information: ", interaction.options.data);

    setupChannelCost(
      interaction.guildId,
      interaction.channelId,
      interaction.options.getNumber("cost")
    );

    // todo: code of command or sub-commands here
    return interaction.reply({
      content: "init command is not yet implemented.",
      ephemeral: true,
    });
  },
});
