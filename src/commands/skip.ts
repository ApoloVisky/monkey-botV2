import { GuildMember } from 'discord.js';
import { useQueue, useMainPlayer } from 'discord-player';
import { embedNotification } from '../utils/embeds';
import CommandModel from "../models/CommandModel";
import CommandArgs from '../models/CommandArgs'; 

class CommandSkip extends CommandModel {
    constructor() {
        super('skip', 'Pula a música atual.');
        console.log("Comando skip criado com sucesso");
    }

    async execute(args: CommandArgs): Promise<void> {
        const { interaction } = args;

       
        useMainPlayer();

        if (!interaction.guildId) {
            await interaction.reply('Não foi possível obter o ID do servidor.');
            return;
        }

        const queue = useQueue(interaction.guildId);
        const member = interaction.member as GuildMember;
        const channel = member.voice.channel;

        if (!channel) {
            await interaction.reply('Você não está em nenhum canal de voz! Entre em um para ouvir as músicas 😏');
            return;
        }

        if (!queue || !queue.currentTrack) {
            await interaction.reply('Não há música tocando no momento!');
            return;
        }

        const currentTrack = queue.currentTrack;
        
        queue.node.skip();

        const embedSkip = embedNotification(
            interaction,
            `A música [${currentTrack.title}] estava com pressa - PRÓXIMA!`,
            'Use /resume caso tenha skipado a música pausada',
            'https://i.ibb.co/nD1b3fd/next.png',
            'Blue'
        );

        // Responde com o embed gerado
        await interaction.reply({ embeds: [embedSkip] });
    }
}

export default new CommandSkip();
