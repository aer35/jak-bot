import {
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { MINIMUM_POST_KARMA, SUBREDDIT_NAME } from "../../config";
import { dbSetup, fetchAll, runPromisifyDB } from "../../dbSetup";
import { generateMessageContent } from "../../generateMessageContent";
import { generateIndividualMessage } from "../../generateIndividualMessage";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getposts")
    .setDescription("Fetches posts from a specified subreddit.")
    // Limits command to Manage Server and Manage Messages permissions
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageMessages | PermissionFlagsBits.ManageGuild,
    ),
  // If you ever want to use the option setting in the / command menu. But this will be hardcoded in the ENV file for this bot's purposes.
  // .addStringOption(option =>
  //     option.setName('subreddit')
  //         .setDescription('The subreddit to fetch posts from')
  //         .setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    console.log("Fetching posts from subreddit...");
    // Hits the reddit JSON api and fetches top posts from the last week. Limited to 100 posts.
    const res = await fetch(
      `https://www.reddit.com/r/${SUBREDDIT_NAME}/top/.json?t=week&limit=100`,
    );

    const body = await res.json();

    // Catch failure to fetch posts
    if (!body) {
      console.log("Failed to fetch posts from subreddit.");
      await interaction.followUp("Failed to fetch posts from the subreddit.");
      return;
    } else {
      // Maximum will be 100
      console.log(
        `Received response from Reddit API. Number of posts:
          ${body.data.children.length}`,
      );
    }

    // Catch if the subreddit has no posts
    // data has far too many nested levels (well over 30) to type properly here without defining a huge interface, so we use any.
    const posts: { data: any }[] = body.data.children;
    if (posts.length === 0) {
      console.log("No posts found in subreddit. Exiting command.");
      await interaction.reply("No posts found.");
      return;
    }

    // Filter down the number of posts to only those that we want.
    //@ts-ignore: Suppress argument number error
    const filterPostsByScore = posts.filter(
      (post) => post.data.score > Number(MINIMUM_POST_KARMA),
    );

    console.log("Executing DB lookup for existing posts...");
    const db = await dbSetup();
    //@ts-ignore: Suppress argument number error
    const allDBEntryIDs: { id: string }[] = (await fetchAll<{ id: string }>(
      db,
      `SELECT ID
       FROM posts`,
    )) as { id: string }[];

    const allDBEntrySet: Set<any> = new Set(
      allDBEntryIDs.map((post: { id: string }) => post.id),
    );
    console.log(`DB accessed, retrieved all post IDs: ${allDBEntrySet.size}`);

    // This array only has NEW posts that are not in the database.
    const filterPostsNewOnly = filterPostsByScore.filter(
      (post) => !allDBEntrySet.has(post.data.name),
    );

    // TODO run this as a batch insert
    console.log("Inserting new posts into the database...");
    console.log(`New posts to insert: ${filterPostsNewOnly.length}`);
    await Promise.all(
      filterPostsNewOnly.map((post) => {
        console.log(`Inserting post: ${post.data.name}`);
        return runPromisifyDB(
          db,
          `INSERT INTO posts(ID, link, user, title, score)
           VALUES (?, ?, ?, ?, ?)`,
          [
            post.data.name,
            post.data.permalink,
            post.data.author,
            post.data.title,
            post.data.score,
          ],
        );
      }),
    );
    console.log(
      "Finished inserting new posts into the database. Generating reply...",
    );

    if (filterPostsNewOnly.length === 1) {
      console.log("Sending discord message...");

      await interaction.followUp(
        generateMessageContent(filterPostsNewOnly[0].data),
      );
    } else {
      console.log(
        "More than one new post to be sent. Breaking into multiple messages.",
      );
      await Promise.all(
        filterPostsNewOnly.map((post) =>
          generateIndividualMessage(post.data, interaction.channel),
        ),
      );
      try {
        await interaction.followUp({
          content: "Successfully got new posts.",
          flags: MessageFlags.Ephemeral,
        });
      } catch (error) {
        console.error(`Error sending confirmation message: ${error}`);
      }
    }
  },
};
