import { Client as ClientJS } from 'discord.js';
import { ArgsOf, Client, Discord, On, Once, Slash } from 'discordx';
import { DEBUG } from '..';

type ReadyClient = Client & ClientJS<true>;

@Discord()
export class IndexModule {
  @Once('ready')
  async onceReady(_: ArgsOf<'ready'>, client: ReadyClient): Promise<void> {
    if (DEBUG)
      console.log(`[IndexModule.onceReady] Connected as ${client.user.tag} (${client.user.id}).`);

    await client.initApplicationCommands();
  }

  @On('interactionCreate')
  async onInteractionCreate(
    [interaction]: ArgsOf<'interactionCreate'>,
    client: ReadyClient
  ): Promise<void> {
    await client.executeInteraction(interaction);
  }
}
