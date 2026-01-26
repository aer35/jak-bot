import {
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { dbSetup, runPromisifyDB } from "../../dbSetup";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cleardb")
    .setDescription("Clears the database.")
    // Limits command to Manage Server and Manage Messages permissions
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageMessages | PermissionFlagsBits.ManageGuild,
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    console.log("Clearing the database...");

    const db = await dbSetup();
    await runPromisifyDB(
      db,
      `DELETE
       FROM posts`,
    );

    // We await the promise immediately so the type is never Promise, however since the runPromisifyDB function can return either the count (as a number) or an error we have to type it as unknown.
    const tableSize: unknown = await runPromisifyDB(
      db,
      `SELECT COUNT(*)
       FROM posts`,
    );
    console.log(`Current table size: ${tableSize}`);

    // Adjusting this logic to account for tableSize possibly not being a number.
    if (tableSize != 0) {
      // This reply gets sent in the console.
      console.error(
        `Failed to clear the database. Expected 'tableSize == 0', received: ${tableSize}. Please try again. If the issue persists, please let us know.`,
      );
      // This is the reply that the bot sends in Discord.
      await interaction.reply({
        content:
          "Failed to clear the database. There are possibly still entries present in the database. Please try again and check the console for more details.",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      console.log("Database cleared successfully.");
      await interaction.reply({
        content: "Database cleared successfully.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
