import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { SUBREDDIT_NAME } from "../../config";
import { dbSetup, fetchAll, runPromisifyDB } from "../../dbSetup";
import { generateMessageContent } from "../../generateMessageContent";
import { generateIndividualMessage } from "../../generateIndividualMessage";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getposts")
    .setDescription("Fetches posts from a specified subreddit.")
    .setDefaultMemberPermissions(0), // Limits command to ADMINISTRATOR role

  // If you ever want to use the option setting in the / command menu. But this will be hardcoded in the ENV file for this bot's purposes.
  // .addStringOption(option =>
  //     option.setName('subreddit')
  //         .setDescription('The subreddit to fetch posts from')
  //         .setRequired(true)),
  async execute(interaction) {
    console.log("Fetching posts from subreddit...");
    // Hits the reddit JSON api and fetches top posts from the last week. Limited to 100 posts.
    const res = await fetch(
      `https://www.reddit.com/r/${SUBREDDIT_NAME}/top/.json?t=week&limit=100`,
    );

    const body = await res.json();

    // Catch failure to fetch posts
    if (!body) {
      console.log("Failed to fetch posts from subreddit.");
      await interaction.reply("Failed to fetch posts from the subreddit.");
      return;
    } else {
      console.log(
        "Received response from Reddit API. Number of posts: " +
          body.data.children.length,
      );
    }

    // Catch if the subreddit has no posts
    const posts = body.data.children;
    if (posts.length === 0) {
      console.log("No posts found in subreddit. Exiting command.");
      await interaction.reply("No posts found.");
      return;
    }

    // Filter down the number of posts to only those that we want.
    const filterScore = posts.filter((post) => post.data.score > 100);

    console.log("Executing DB lookup for existing posts...");
    const db = await dbSetup();
    const allDBEntryIDs: any = await fetchAll(db, "SELECT ID FROM posts");
    const allDBEntrySet = new Set(allDBEntryIDs.map((post) => post.ID));
    console.log("DB accessed, retrieved all post IDs." + allDBEntrySet.size);

    // This array only has NEW posts that are not in the database.
    const filterNew = filterScore.filter(
      (post) => !allDBEntrySet.has(post.data.name),
    );

    // TODO run this as a batch insert
    console.log("Inserting new posts into the database...");
    console.log("New posts to insert: " + filterNew.length);
    await Promise.all(
      filterNew.map((post) => {
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

    if (filterNew.length === 1) {
      console.log("Sending discord message...");

      await interaction.reply(generateMessageContent(filterNew[0].data));
    } else {
      console.log(
        "More than one new post to be sent. Breaking into multiple messages.",
      );
      await Promise.all(
        filterNew.map((post) =>
          generateIndividualMessage(post.data, interaction.channel),
        ),
      );
      await interaction.reply({
        content: "Successfully got new posts.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
