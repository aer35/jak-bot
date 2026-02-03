# Discord Bot Project

This project is a Discord bot built using **TypeScript** and the **discord.js** library.

## Features

- Reddit API integration
  - Configurable to check any subreddit
  - Configurable minimum post karma

## Commands

All commands require Manage Messages and Manage Server (ManageGuild) permissions. (Planned to be configurable in the
future)

- `/getposts`
  - Pulls all posts from the chosen subreddit with at least X karma
    - The subreddit is configurable via the `.env` file
    - X is configurable via the `.env` file
  - Only sends new posts from the last week
  - Keeps track of what posts have already been sent to avoid duplicates
- `/cleardb`
  - Removes all posts stored in the database
  - Intended to be used with `/clearChannel`
  - May result in duplicate posts if channel is not cleared
- `/clearchannel`
  - For clearing a channel of posts and other messages (if any)
  - Removes messages from a channel. Maximum 100 and no greater than 2 weeks old.
  - Will remove user messages as well as bot messages and threads.

## Planned features

- Better permission controls.
  - Currently, all commands require Manage Messages and Manage Server (ManageGuild) permissions.
  - May allow for more configurable permission setting in the future.

- Additional Commands
  - _Reserved_

- Scheduled run
  - The ability to set the bot to automatically check the configured subreddit on a schedule
  - Will have configurable scheduling
  - To avoid hitting Reddit and Discord API limits, limit the schedule
    - Remember that the bot only displays new posts over a karma limit. Running it too often will likely result in
      hitting API limits with no new posts.

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
- The minimum post karma you want posts to have

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
   MINIMUM_POST_KARMA=SOME_NUMBER //The minimum amount of upvotes a post must have to be sent in the server. E.g. 100
   ```
5. Install dependencies by running the following command:
   ```bash
   npm install
   ```
6. Invite the bot to your server

## Usage

1. Open a terminal and navigate to the project directory.
2. Deploy commands to the server with (you will need to open a second terminal window in the bot directory):

   ```bash
   npm run deploy-commands
   ```

   The commands will persist through restarts. You will only need to do this step again if new commands are added.

3. Run the bot using the following command:
   ```bash
   npm run start
   ```
   OR
   Run the bot in development mode using the following command:
   ```bash
   npm run dev
   ```
4. The bot should now be running and ready to use in your Discord server.

## Notes

- When running in dev mode you must redeploy commands each time you make changes to the command files in order to test
  the changes, both for new functions and regression. The bot
  uses the transpiled Javascript files in the `/dist` folder,
  not the Typescript files.
- You need to run `deploy-commands` at least once before running the bot to generate the JS files or `start` will
  fail.
- Reddit blocks VPNs. Fetching will fail if you are running the server from behind a VPN.
- Follow all Reddit and Discord TOS. We bear no responsibility for any actions taken by the bot or its users.

## Issues

- If you encounter any issues or have suggestions for improvements, please open an issue on the GitHub repository.
