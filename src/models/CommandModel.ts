// models/CommandModel.ts
import { SlashCommandBuilder } from 'discord.js';
import CommandArgs from './CommandArgs'; 

class Command {
    data: SlashCommandBuilder;

    constructor(name: string, description: string) {
        this.data = new SlashCommandBuilder()
            .setName(name)
            .setDescription(description);
    }

    async execute(args: CommandArgs): Promise<void> {
        
        console.log(args);
    }
}

export default Command;
