import { Table } from "@ghom/orm"

export interface ChannelLimits {
	channel_id: string
	guild_id: string
	cost: number
}

/**
 * See the {@link https://ghom.gitbook.io/bot.ts/usage/use-database database guide} for more information.
 */
export default new Table<ChannelLimits>({
	name: "channelLimits",
	description: "costs incurred for specific channels",
	setup: (table) => {
		// setup table columns => https://knexjs.org/guide/schema-builder.html
		table.string("channel_id").notNullable()
		table.string("guild_id").notNullable()
		table.float("cost").notNullable()
	},
})
