import {
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearchannel")
    .setDescription(
      "Clears messages in the channel. Maximum 100 & <2 weeks old. Requires 'Manage Messages' permission.",
    )
    // Limits command to Manage Server and Manage Messages permissions
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageMessages | PermissionFlagsBits.ManageGuild,
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    console.log("Checking bot permissions...");
    // Check if the bot has permission to manage messages
    if (!interaction.guild!.members.me!.permissions.has("ManageMessages")) {
      console.error("Bot does not have permission to manage messages.");
      await interaction.reply({
        content:
          "Bot does not have permission to delete messages in this channel. Give the bot 'Manage Messages' permission.",
        flags: MessageFlags.Ephemeral,
      });
    }

    console.log("Clearing messages in the channel...");
    const channel = interaction.channel!;
    const messages = channel.messages;

    const toBeDeleted = await messages.fetch({ limit: 100 });
    //@ts-ignore: Suppress missing property error
    await channel.bulkDelete(toBeDeleted, true);

    if (toBeDeleted.size === 0) {
      await interaction.reply({
        content: "No messages to delete.",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: `Cleared ${toBeDeleted.size} messages in the channel.`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
