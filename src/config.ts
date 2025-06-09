import dotenv from "dotenv";

dotenv.config();

const {DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID} = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !DISCORD_GUILD_ID) {
    throw new Error("Missing environment variables");
}

export {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
    DISCORD_GUILD_ID,
};