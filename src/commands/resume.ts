import { CommandInteraction, GuildMember } from 'discord.js';
import { useTimeline } from 'discord-player';
import { embedNotification } from '../utils/embeds';
import CommandModel from "../models/CommandModel";

class CommandResume extends CommandModel {
    constructor() {
        super('resume', 'Retomar a música pausada');
        console.log('Comando resume criado com sucesso.');
        this.data.setName('resume');
        this.data.setDescription('Retomar a música pausada');
    }

    async execute({ interaction }: { interaction: CommandInteraction }): Promise<void> {

        if (!interaction.guildId) {
            await interaction.reply('Não foi possível identificar o servidor!');
            return;
        }
        const timeline = useTimeline(interaction.guildId);
        const channel = (interaction.member as GuildMember)?.voice.channel;

        if (!channel) {
            await interaction.reply('Não te encontrei em nenhum canal de voz! Entre em um para ouvir o que tenho pra tocar 😏\n(Lá ele)');
            return;
        }

        if (!interaction.guild || channel.id !== interaction.guild.members.me?.voice.channelId) {
            await interaction.reply('Você precisa estar no mesmo canal de voz que eu para retomar a música!');
            return;
        }

        if (!timeline?.track) {
            await interaction.reply('Nenhuma track está tocando no momento!');
            return;
        }

        if (!timeline.paused) {
            await interaction.reply('A track atual já está TOCANDO!\nUse /pause para PAUSAR');
            return;
        }

        try {
            timeline.resume();

            await interaction.reply({
                embeds: [
                    embedNotification(
                        interaction,
                        `[${timeline.track.description}] - RETOMADO!`,
                        '/queue para ver a fila',
                        'https://i.ibb.co/ygpQWXn/update.png',
                        'Blue'
                    )
                ]
            });
        } catch (error) {
            console.error('Erro ao retomar a música:', error);
            await interaction.followUp('Houve um erro ao tentar retomar a música. Tente novamente mais tarde.');
        }
    }
}

export default new CommandResume();

