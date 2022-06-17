import { Client as ClientJS, GuildMember, Role } from 'discord.js';

import { DEBUG } from '..';

enum Action {
  ADD = 'assign_role',
  REMOVE = 'remove_role',
}

interface GetApiTriggerData {
  discord_id: string;
  action: string;
}

interface RoleManagerOptions {
  endpoint: string;
  makeRequestEvery: number;
  guildId: string;
  roleId: string;
}

export class RoleManagerModule {
  static async initialize(client: ClientJS<true>, options: RoleManagerOptions): Promise<void> {
    await RoleManagerModule._createTimeout(client, options);
  }

  private static async _createTimeout(
    client: ClientJS<true>,
    options: RoleManagerOptions
  ): Promise<void> {
    // Create a timeout to make requests to the API every `makeRequestEvery` milliseconds.
    // If anymore actions is created, you should handle them in the `RoleManagerModule._handleAction` method.
    setTimeout(async () => {
      const response = await fetch(options.endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        data.forEach(async (data: Partial<GetApiTriggerData>) => {
          if (!data.discord_id || !data.action) {
            if (DEBUG) console.log('[RoleManagerModule] Invalid data received from API.', data);
            return;
          }

          const user = await client.users.fetch(data.discord_id);
          const guild = await client.guilds.fetch(options.guildId);

          const role = guild.roles.cache.find(r => r.id === options.roleId);
          if (!role) return;

          const member = guild.members.cache.find(m => m.id === user.id);
          if (!member) return;

          RoleManagerModule._handleAction(data.action as Action, member, role);
        });
      }
    }, options.makeRequestEvery);
  }

  private static async _handleAction(
    action: Action,
    member: GuildMember,
    role: Role
  ): Promise<void> {
    switch (action) {
      case Action.ADD:
        member.roles.add(role, 'Added automatically by API trigger.');
        break;

      case Action.REMOVE:
        member.roles.remove(role, 'Removed automatically by API trigger.');
        break;

      default:
        if (DEBUG) console.log('[RoleManagerModule] Unhandled action.', action);
        break;
    }
  }
}
