import { SlashCommandBuilder } from "discord.js";
import { SUBREDDIT_NAME } from "../../config";
import { db } from "../../db_setup";
import * as util from "util";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getposts")
    .setDescription("Fetches posts from a specified subreddit."),
  // If you ever want to use the option setting. But this will be hardcoded in the ENV file for this bot's purposes.
  // .addStringOption(option =>
  //     option.setName('subreddit')
  //         .setDescription('The subreddit to fetch posts from')
  //         .setRequired(true)),
  async execute(interaction) {
    console.log("Fetching posts from subreddit...");
    const res = await fetch(
      `https://www.reddit.com/r/${SUBREDDIT_NAME}/top/.json?t=week&limit=100`,
    );

    const body = await res.json();
    console.log(
      "Received response from Reddit API: " + body.data.children.length,
    );

    // Catch failure to fetch posts
    if (!body) {
      console.log("Failed to fetch posts from subreddit.");
      await interaction.reply("Failed to fetch posts from the subreddit.");
      return;
    }

    // Catch if the subreddit has no posts
    const posts = body.data.children;
    if (posts.length === 0) {
      console.log("No posts found in subreddit.");
      await interaction.reply("No posts found.");
      return;
    }

    // Filter down the number of posts to only those that we want.
    const filterScore = posts.filter((post) => post.data.score > 100);

    // Turn the DB function into a promise-based function
    const runPromisifyDB = util.promisify(db.run);
    const allPostIDs: any = await runPromisifyDB("SELECT ID FROM posts");
    const allPostIDSet = new Set(allPostIDs.map((post) => post.data.ID));
    console.log("DB accessed, retrieved all post IDs." + allPostIDSet.size);

    // This array only has NEW posts that are not in the database.
    const filterNew = filterScore.filter(
      (post) => !allPostIDSet.has(post.data.name),
    );

    // TODO run this as a batch insert
    console.log("Inserting new posts into the database...");
    console.log("New posts to insert: " + filterNew.length);
    await Promise.all(
      filterNew.map((post) => {
        return runPromisifyDB(
          ("INSERT INTO posts (ID, link, user, title, score) VALUES (?,?,?,?,?)" +
            post.data.name,
          post.data.url,
          post.data.author,
          post.data.title,
          post.data.score),
        );
      }),
    );
    console.log("New posts inserted into the database.");

    const replyContent = filterNew
      .map(
        (post) =>
          `**Title:** ${post.data.title}\n**Author:** ${post.data.author}\n**Score:** ${post.data.score}\n**Link:** [Link](${post.data.url})\n`,
      )
      .join("\n");
    console.log("Sending discord message...");

    // Bot sends one message with all the posts.
    // TODO break out into multiple messages. One per post.
    await interaction.reply(replyContent);
  },
};
