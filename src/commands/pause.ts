import { useTimeline } from 'discord-player';
import { CommandInteraction, GuildMember, CacheType } from 'discord.js';
import { embedNotification } from '../utils/embeds';
import CommandModel from "../models/CommandModel";
import DisTube from 'distube';

class CommandPause extends CommandModel {
    constructor() {
        super("pause", "Pausar a música atual");
        console.log("Comando pause criado com sucesso");
        this.data.setName("pause");
        this.data.setDescription("Pausar a música atual");
        return;
    }

    async execute({ interaction, distube }: { interaction: CommandInteraction, distube: DisTube }): Promise<void> {
        if (!interaction.guildId) {
            await interaction.reply('Não foi possível obter o ID do servidor.');
            return;
        }
        const timeline = useTimeline(interaction.guildId);
        const channel = (interaction.member as GuildMember)?.voice?.channel;

        if (!channel) {
            await interaction.reply('Você não está em um canal de voz! Entre em um para tocar música. 😏');
        }
        if (channel && interaction.guild?.members.me?.voice?.channel && interaction.guild.members.me.voice.channel.id !== channel.id) {
        if (interaction.guild?.members.me?.voice?.channel && interaction.guild.members.me.voice.channel.id !== channel.id) {
            await interaction.reply('Você precisa estar no mesmo canal de voz que eu para pausar a música!');
        }

        if (!timeline || !timeline.track) {
            await interaction.reply('Nenhuma música está tocando no momento!');
        }

        if (timeline && timeline.paused) {
            await interaction.reply('A música já está pausada!\nUse /resume para despausar.');
        }

        if (timeline) {
            timeline.pause();
        }

        await interaction.reply({
            embeds: [
                embedNotification(interaction, `[${timeline?.track?.description ?? 'Descrição indisponível'}] - PAUSADA!`, '/resume para despausar')
            ]
        });
    }
    }
}

export default new CommandPause();
