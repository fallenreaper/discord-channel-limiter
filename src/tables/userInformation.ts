import { Table } from "@ghom/orm";

export interface UserInformation {
  user_id: string;
  guild_id: string;
  allowance: number;
}

/**
 * See the {@link https://ghom.gitbook.io/bot.ts/usage/use-database database guide} for more information.
 */
export default new Table<UserInformation>({
  name: "userInformation",
  description: "user metadata for character allowance",
  setup: (table) => {
    // setup table columns => https://knexjs.org/guide/schema-builder.html
    table.string("user_id").notNullable().unique();
    table.string("guild_id").notNullable();
    table.integer("allowance").notNullable().defaultTo(0);
  },
});
