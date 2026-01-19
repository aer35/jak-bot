# Discord Bot Project

This project is a Discord bot built using **TypeScript** and the **discord.js** library.

## Features

- Reddit API integration
  - Configurable to check any subreddit

## Commands

All commands are locked to ADMINISTRATORS only.

- `/getposts`
  - Checks the configured subreddit for posts with over 100 upvotes
  - Only uploads new posts from the last week
  - Keeps track of what posts have been stored
- `/cleardb`
  - Removes all posts stored in the database
  - Intended to be used with `/clearChannel`
  - May result in duplicate posts if channel is not cleared
- `/clearchannel`
  - For clearing a channel of posts
  - Removes messages from a channel. Maximum 100, younger than 2 weeks.

## Planned features

- Better permission controls.
  - Currently, all commands are locked to ADMINISTRATORS only.
  - May allow for more granular permissions in the future.

- Additional Commands
  - _Reserved_

- Scheduled run
  - The ability to set the bot to automatically check the configured subreddit on a schedule
  - Will have configurable scheduling
  - To avoid hitting Reddit and Discord API limits, limit the schedule

- Additional bot configuration
  - Current methods utilize the `.env` file for all configuration. May allow for the bot to intake certain parameters
    in the commands like subreddit name, etc...

- Generative AI API integration
  - Ability to generate posts in the style of the given subreddit based on a pre-written template via external APIs (
    ChatGPT, Deepseek, etc...)
  - Ability to generate posts in the style of the given subreddit based on a pre-written template via local API (
    Ollama, KoboldCPP, etc...)

## Requirements

- Discord application Token
- Discord client ID
- Discord guild ID (Server ID)
- The name of the subreddit you want to check

## Installation

1. Clone the repository
2. Create a new application in the Discord portal. Follow instructions on creating a new Discord application
   [here](https://discordjs.guide/legacy/preparations/app-setup).
3. Create a `.env` file in the root folder
4. Add the following environment variables to the `.env` file:
   ```
   DISCORD_TOKEN=YOUR_DISCORD_TOKEN //From Discord Developer Portal > Bot > GENERATE NEW TOKEN. You will not be able to see the token again after you leave the page. In case of issues you can always generate a new token.
   DISCORD_CLIENT_ID=YOUR_CLIENT_ID //In Discord Developer Portal > Application Info > click "Copy" under Application ID)
   DISCORD_GUILD_ID=YOUR_GUILD_ID //Right click server name in Discord and click "Copy Server ID"
   SUBREDDIT_NAME=SUBREDDIT_NAME //The name of the subreddit you want to check. Do not include the "r/". E.g. for r/programming use "programming".
   ```
5. Install dependencies by running the following command:
   ```bash
   npm install
   ```
6. Invite the bot to your server

## Usage

1. Open a terminal and navigate to the project directory
2. Run the bot using the following command:
   ```bash
   npm run start
   ```
   OR
   Run the bot in development mode using the following command:
   ```bash
   npm run dev
   ```
3. Deploy commands to the server with (you will need to open a second terminal window in the bot directory):

   ```bash
   npm run deploy-commands
   ```

   The commands will persist through restarts. You will only need to do this step again if new commands are added.

4. The bot should now be running and ready to use in your Discord server.

## Notes

- If running in dev mode you will need to
  redeploy commands every time you make changes to the command files since the bot uses the compiled Javascript files,
  not the Typescript files.
- Reddit blocks most VPNs. Fetching will fail if you are running the server locally and using a VPN.
- Follow all Reddit and Discord TOS. I bear no responsibility for any actions taken by the bot or its users.
