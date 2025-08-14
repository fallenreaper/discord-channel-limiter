import { Cron } from "#core/cron"

/**
 * See the {@link https://ghom.gitbook.io/bot.ts/usage/create-a-cron cron guide} for more information.
 */
export default new Cron({
  name: "recovery",
  description: "recovers tokens for messaging",
  schedule: { type: "hour", duration: 2 } /* every 2 hours */,
  async run() {
    // todo: code here
  },
})
