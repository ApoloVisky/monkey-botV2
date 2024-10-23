import { CommandInteraction, SlashCommandBuilder } from 'discord.js'; 
import CommandModel from '../models/CommandModel'; 
import DisTube from 'distube';

class PingCommand extends CommandModel {
    constructor() {
        super('ping', 'Responde com pong!');
        this.data = new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Responde com pong!');
    }

    async execute(args: { interaction: CommandInteraction, distube: DisTube }): Promise<void> {
        const { interaction } = args;

        await interaction.deferReply();
        await interaction.followUp('Pong!');
    }
}

export default new PingCommand(); 
