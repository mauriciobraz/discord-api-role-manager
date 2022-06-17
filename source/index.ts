import 'reflect-metadata';

import G from 'glob';
import { Intents } from 'discord.js';
import { Client, ClientOptions } from 'discordx';

import { resolve } from 'path';
import { Env } from './utils/env';

export const DEBUG = Env.getBoolean('DEBUG');

async function main(): Promise<void> {
  await startClient();
}

const CLIENT_MODULES_GLOB = resolve(__dirname, 'modules', '**', '*.ts');

const CLIENT_INTENTS: number[] = [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MEMBERS,
];

async function startClient(): Promise<void> {
  const client = new Client({
    intents: CLIENT_INTENTS,
  });

  if (process.env.NODE_ENV === 'development' && !Env.getBoolean('DISABLE_GUILDED_COMMANDS')) {
    // Registers the commands as guilded commands, this is faster but doesn't use this in
    // production because it's only registers the commands when the bot is ready.
    (<ClientOptions>client.options).botGuilds = [
      async (client: Client) => {
        const guilds = await client.guilds.fetch();
        return guilds.map(guild => guild.id);
      },
    ];

    if (DEBUG) {
      console.log(
        '[index.startClient] The commands will be registered as guilded commands because the' +
          'process is in development mode.'
      );
    }
  }

  await recursiveImportPath(CLIENT_MODULES_GLOB);
  await client.login(Env.getString('DISCORDJS_TOKEN'));
}

async function recursiveImportPath(glob: string): Promise<void> {
  await Promise.all(G.sync(glob).map(async file => await import(file)));
}

if (require.main === module) {
  // Minimum versin that supports ES2021.
  // See: https://node.green/#ES2021
  const MIN_NODE_VERSION = [15, 44, 0];

  const currentVersion = process.version
    .replace(/^v/, '')
    .split('.')
    .map((v: string): number => parseInt(v, 10));

  if (currentVersion < MIN_NODE_VERSION) {
    console.error(`This project requires Node.js ${MIN_NODE_VERSION.join('.')} or higher.`);
    process.exit(1);
  }

  main();
}
