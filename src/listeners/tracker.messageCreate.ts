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
    console.log(`Channel Info Found: ${channelInfo.cost}`);
    const cost = message.content.length * channelInfo.cost;

    let isNewUser = false;
    let userInfo = await userInformation.query
      .where({
        user_id: message.author.id,
      })
      .first();
    if (!userInfo) {
      isNewUser = true;
      userInfo = {
        user_id: message.author.id,
        allowance: 10000,
      };
    }
    userInfo.allowance -= cost;

    console.log(`User Allowance: ${userInfo.allowance}, Cost: ${cost}`);
    // If it dropped below user, apply the Muted role.
    if (userInfo.allowance < 0) {
      message.member?.roles.add(
        message.guild?.roles.cache.find((r) => r.name === "Muted")!
      );
    }

    // Update or Insert the user information.
    if (isNewUser) {
      await userInformation.query.insert(userInfo);
    } else {
      await userInformation.query.update(userInfo);
    }
    console.log("Finished.");
  },
});
