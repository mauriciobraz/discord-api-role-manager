import { Client as ClientJS } from 'discord.js';
import { ArgsOf, Client, Discord, On, Once } from 'discordx';

import { DEBUG } from '..';
import { Env } from '../utils/env';
import { RoleManagerModule } from './role-manager';

type ReadyClient = Client & ClientJS<true>;

@Discord()
export class IndexModule {
  @Once('ready')
  async onceReady(_: ArgsOf<'ready'>, client: ReadyClient): Promise<void> {
    if (DEBUG)
      console.log(`[IndexModule.onceReady] Connected as ${client.user.tag} (${client.user.id}).`);

    await client.initApplicationCommands();

    RoleManagerModule.initialize(client, {
      endpoint: Env.getString('ROLE_MANAGER_ENDPOINT'),
      guildId: Env.getString('ROLE_MANAGER_GUILD_ID'),
      roleId: Env.getString('ROLE_MANAGER_ROLE_ID'),
      makeRequestEvery: 1_000,
    });
  }

  @On('interactionCreate')
  async onInteractionCreate(
    [interaction]: ArgsOf<'interactionCreate'>,
    client: ReadyClient
  ): Promise<void> {
    try {
      await client.executeInteraction(interaction);
    } catch (e) {
      if (DEBUG) console.error(e);
    }
  }
}
