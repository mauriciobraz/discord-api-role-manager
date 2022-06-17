# Role manager bot.

This bot fetchs an endpoint every time and execute the action specified in the endpoint. The endpoint is a JSON object with the following fields:

- `action`: The action to execute. Either `assign_role` or `remove_role`.
- `discord_id`: The Discord ID of the user to assign or remove the role.

## Environment variables

Copy the `.env` file to the root of the project and set the following variables:

- `DISCORDJS_TOKEN`: The Discord bot token.
- `ROLE_MANAGER_ENDPOINT`: The endpoint to fetch.
- `ROLE_MANAGER_GUILD_ID`: The guild id to apply the action to.
- `ROLE_MANAGER_ROLE_ID`: The role that will be assigned or removed.

## Production running instructions

Dependencies:

- Node.js
- PNPM

First of all, configure the [environment variables](#environment-variables) with the correct values and `NODE_ENV` to `production` to not register the commands as guild commands.

```bash
pnpm install
npm run build
npm run start
```
