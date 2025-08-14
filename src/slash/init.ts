import { SlashCommand } from "#core/slash"

/**
 * See the {@link https://ghom.gitbook.io/bot.ts/usage/create-a-command command guide} for more information.
 */
export default new SlashCommand({
  name: "init",
  description: "initializes a channel to markings",
  build: (builder) => {
    // builder.addSubcommand, builder.addStringOption, etc.
  },
  run(interaction) {
    // todo: code of command or sub-commands here
    return interaction.reply({
      content: "init command is not yet implemented.",
      ephemeral: true,
    })
  },
})
