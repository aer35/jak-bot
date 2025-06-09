# Discord Bot Project

This project is a Discord bot built using **TypeScript** and the **discord.js** library.

## Features

-TBD

## Requirements

- Node.js (v16 or higher)
- npm (v7 or higher)
- Discord application Token
- Discord client ID
- Discord guild ID (Server ID)

## Installation

1. Clone the repository
2. Create a new application in the Discord portal
3. Create a `.env` file in the root folder
4. Add the following environment variables to the `.env` file:
   ```
   DISCORD_TOKEN= YOUR DISCORD TOKEN (From Discord Developer Portal > Bot > GENERATE NEW TOKEN. You will not be able to see the token again after you leave the page. In case of issues you can always generate a new token.)
   DISCORD_CLIENT_ID= YOUR CLIENT ID (In Discord Developer Portal > Application Info > click "Copy" under Application ID)
   DISCORD_GUILD_ID= YOUR GUILD ID (Right click server name in Discord and click "Copy Server ID")
   ```
5. Install dependencies by running the following command:
    ```
    npm install
    ```
6. Invite the bot to your server

## Usage

1. Open a terminal and navigate to the project directory
2. Run the bot using the following command:
   ```
   npm run start
   ```
   OR
   Run the bot in development mode using the following command:
   ```
   npm run dev
   ```
3. Deploy commands to the server with:
   ```
   npm run deploy-commands
   ```
4. The bot should now be running and ready to use in your Discord server. If running in dev mode you will need to
   redeploy commands every time you make changes to the command files.