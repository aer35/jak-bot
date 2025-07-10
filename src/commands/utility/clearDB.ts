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
    const TableSize: any = await runPromisifyDB(
      db,
      `SELECT COUNT(*)
             FROM posts`,
    );
    if (TableSize > 0) {
      console.error(
        "Failed to clear the database. There are still entries in the posts table.",
      );
      await interaction.reply({
        contend:
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
