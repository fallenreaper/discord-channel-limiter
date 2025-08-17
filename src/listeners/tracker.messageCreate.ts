import { Listener } from "#core/listener";
import channelLimits from "#tables/channelLimits";
import userInformation from "#tables/userInformation";

/**
 * See the {@link https://ghom.gitbook.io/bot.ts/usage/create-a-listener listener guide} for more information.
 */
export default new Listener({
  event: "messageCreate",
  description: "listens for users and sets mute status as needed",
  async run(message) {
    // todo: code here

    if (message.author.bot) return;

    let channelInfo = await channelLimits.query
      .where({
        channel_id: message.channel.id,
        guild_id: message.guildId!,
      })
      .first();

    // No Channel Limits are Set.
    if (!channelInfo) {
      return;
    }

    const cost = message.content.length * channelInfo.cost;

    let userInfo = await userInformation.query
      .where({
        user_id: message.author.id,
      })
      .first();
    if (!userInfo) {
      userInfo = {
        user_id: message.author.id,
        allowance: 10000,
      };
    }
    userInfo.allowance -= cost;

    if (userInfo.allowance < 0) {
      message.guild?.roles.fetch("Muted").then((role) => {
        if (!role) {
          message.guild?.roles.create({ name: "Muted" });
        }
      });
      message.member?.roles.add("Muted");
    }

    await userInformation.query.upsert(userInfo);
  },
});
