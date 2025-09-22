import { GatewayIntentBits, Options, Partials } from "discord.js";
import { z } from "zod";
import { Config } from "#core/config";

export const MAX_ALLOWANCE = Number.parseInt(
	process.env.MAX_ALLOWANCE || "10000",
	10,
);
export const INITIAL_POINTS = Number.parseInt(
	process.env.INITIAL_POINTS || "10000",
	10,
);
export const POINTS_PER_MINUTE = Number.parseInt(
	process.env.POINTS_PER_MINUTE || "50",
	10,
);

export const config = new Config({
	ignoreBots: true,
	openSource: true,
	envSchema: z.object({}),
	permissions: ["Administrator"],
	client: {
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.GuildMessageTyping,
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.DirectMessageReactions,
			GatewayIntentBits.DirectMessageTyping,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildModeration,
			GatewayIntentBits.AutoModerationConfiguration,
			GatewayIntentBits.AutoModerationExecution,
			GatewayIntentBits.GuildBans,
			GatewayIntentBits.GuildIntegrations,
			GatewayIntentBits.GuildModeration,
		],
		partials: [Partials.Channel],
		makeCache: Options.cacheWithLimits({
			...Options.DefaultMakeCacheSettings,

			// don't cache reactions
			ReactionManager: 0,
		}),
		sweepers: {
			...Options.DefaultSweeperSettings,
			messages: {
				// every hour (in second)
				interval: 60 * 60,

				// 6 hours
				lifetime: 60 * 60 * 6,
			},
		},
	},
});

export default config.options;
