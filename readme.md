![Bot avatar](https://cdn.discordapp.com/embed/avatars/4.png&fit=cover&mask=circle)

# chat-monitor

> Made with [bot.ts](https://ghom.gitbook.io/bot-ts/) by **__fallenreaper**  
> CLI version: `9.0.14`  
> Bot.ts version: `v9.0.0-Nirbose`  
> Licence: `ISC`

## Description

throttles ability for users to post  
This bot is private and cannot be invited in other servers.

## Docker

if you want to leverage container management, and have docker.
`docker compose build` will conduct a build when the correct data is supplied to it.  You can then say `docker compose up` and it will serve everything.

## Specifications

You can find the documentation of bot.ts [here](https://ghom.gitbook.io/bot-ts/).  
Below you will find the specifications for **chat-monitor**.

## Configuration file

```ts
import { Options, Partials } from "discord.js"
import { z } from "zod"
import { Config } from "#core/config"

export const MAX_ALLOWANCE = Number.parseInt(
	process.env.MAX_ALLOWANCE || "10000",
	10,
)
export const INITIAL_POINTS = Number.parseInt(
	process.env.INITIAL_POINTS || "10000",
	10,
)
export const POINTS_PER_MINUTE = Number.parseInt(
	process.env.POINTS_PER_MINUTE || "50",
	10,
)

export const config = new Config({
	ignoreBots: true,
	openSource: true,
	envSchema: z.object({}),
	permissions: ["Administrator"],
	client: {
		intents: [
			"Guilds",
			"GuildMessages",
			"GuildMessageReactions",
			"GuildMessageTyping",
			"DirectMessages",
			"DirectMessageReactions",
			"DirectMessageTyping",
			"MessageContent",
			"GuildMembers",
			"GuildModeration",
			"AutoModerationConfiguration",
			"AutoModerationExecution",
			"GuildBans",
			"GuildIntegrations",
			"GuildModeration",
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
})

export default config.options

```

## Cron jobs

- [recovery](src/cron/recovery.ts) - recovers tokens for messaging

## Commands

### Slash commands

- [/channel-cost](src/slash/channelCost.ts) - gets the current channel cost  
- [/channel-init](src/slash/channelInit.ts) - initializes a channel to marketing  
- [/help](src/slash/help.native.ts) - Show slash command details or list all slash commands  
- [/tokens](src/slash/tokens.ts) - get your current token count

### Textual commands

- [help](src/commands/help.native.ts) - Help menu  
- [info](src/commands/info.native.ts) - Get information about bot  
- [turn](src/commands/turn.native.ts) - Turn on/off command handling

## Buttons

- [pagination](src/buttons/pagination.native.ts) - The pagination button

## Listeners

### Button  

- [interactionCreate](src/listeners/button.interactionCreate.native.ts) - Handle the interactions for buttons  

### Command  

- [messageCreate](src/listeners/command.messageCreate.native.ts) - Handle the messages for commands  

### Cron  

- [ready](src/listeners/cron.ready.native.ts) - Launch all cron jobs  

### Log  

- [afterReady](src/listeners/log.afterReady.native.ts) - Just log that bot is ready  

### Pagination  

- [messageDelete](src/listeners/pagination.messageDelete.native.ts) - Remove existing deleted paginator  
- [messageReactionAdd](src/listeners/pagination.messageReactionAdd.native.ts) - Handle the reactions for pagination  

### Slash  

- [guildCreate](src/listeners/slash.guildCreate.native.ts) - Deploy the slash commands to the new guild  
- [interactionCreate](src/listeners/slash.interactionCreate.native.ts) - Handle the interactions for slash commands  
- [ready](src/listeners/slash.ready.native.ts) - Deploy the slash commands  

### Tracker  

- [messageCreate](src/listeners/tracker.messageCreate.ts) - listens for users and sets mute status as needed

## Database

Using **sqlite3@latest** as database.  
Below you will find a list of all the tables used by **chat-monitor**.

- [channelLimits](src/tables/channelLimits.ts) - costs incurred for specific channels  
- [userInformation](src/tables/userInformation.ts) - user metadata for character allowance

## Information

This readme.md is dynamic, it will update itself with the latest information.  
If you see a mistake, please report it and an update will be made as soon as possible.

- Used by: **1** Discord guild
- Last update date: **8/22/2025**
