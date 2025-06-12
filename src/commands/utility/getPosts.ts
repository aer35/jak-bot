import { SlashCommandBuilder } from "discord.js";
import { SUBREDDIT_NAME } from "../../config";
import { dbSetup, fetchAll, runPromisifyDB } from "../../dbSetup";

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
    const allPostIDs: any = await fetchAll(db, "SELECT ID FROM posts");
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
        console.log(`Inserting post: ${post.data.name}`);
        console.log("Name type: " + typeof post.data.name);
        console.log("url type: " + typeof post.data.url);
        console.log("author type: " + typeof post.data.author);
        console.log("title type: " + typeof post.data.title);
        console.log("score type: " + typeof post.data.score);
        return runPromisifyDB(
          db,
          `INSERT INTO posts (ID, link, user, title, score)
                     VALUES (?, ?, ?, ?, ?)`,
          [
            post.data.name as string,
            post.data.url as string,
            post.data.author as string,
            post.data.title as string,
            post.data.score as number,
          ],
        );
      }),
    );
    console.log(
      "Finished inserting new posts into the database. Generating reply...",
    );

    const replyContent = filterNew
      .map(
        (post) =>
          `**Title:** ${post.data.title}\n**Author:** ${post.data.author}\n**Score:** ${post.data.score}\n**Link:** [Link](${post.data.url})\n`,
      )
      .join("\n");
    console.log("Sending discord message...");

    // Currently bot sends one message with all the posts.
    // TODO break out into multiple messages. One per post.
    await interaction.reply(replyContent);
  },
};
