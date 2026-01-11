import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { dbSetup, runPromisifyDB } from "../../dbSetup";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cleardb")
    .setDescription("Clears the database.")
    .setDefaultMemberPermissions(0), // Limits command to ADMINISTRATOR role

  async execute(interaction) {
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

    // Adjusting this logic to account for tableSize possibly not being a number.
    if (tableSize != 0) {
      // This reply gets sent in the console.
      console.error(
        "Failed to clear the database. There are still entries in the posts table.",
      );
      // This is the reply that the bot sends in Discord.
      await interaction.reply({
        content:
          "Failed to clear the database. There are still entries in the posts table.",
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
