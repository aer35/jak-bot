import dotenv from "dotenv";

dotenv.config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN as string;
export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID as string;
export const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID as string;

export const SUBREDDIT_NAME = process.env.SUBREDDIT_NAME as string;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !DISCORD_GUILD_ID) {
  throw new Error("Missing required discord tokens");
}

if (!SUBREDDIT_NAME) {
  throw new Error("Missing sub reddit name");
}
