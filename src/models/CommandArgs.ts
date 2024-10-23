import { Client, CommandInteraction } from 'discord.js';
import { DisTube } from 'distube';

class CommandArgs {
    client: Client;
    interaction: CommandInteraction;
    distube: DisTube;

    constructor(client: Client, interaction: CommandInteraction, distube: DisTube) {
        this.client = client;
        this.interaction = interaction;
        this.distube = distube;  
    }
}

export default CommandArgs;
