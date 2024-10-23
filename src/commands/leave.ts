import { CommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';
import { embedConfirmation } from '../utils/embeds';

class CommandLeave {
    data: SlashCommandBuilder;

    constructor() {
        this.data = new SlashCommandBuilder()
            .setName('leave')
            .setDescription('Desconecta o bot do canal de voz.');
    }

    async execute(interaction: CommandInteraction): Promise<void> {
        const member = interaction.member as GuildMember;
        const channel = member.voice?.channel;

        if (!channel) {
            await interaction.reply('Você não está em um canal de voz! Entre em um para desconectar o bot. 😏');
            return;
        }

        const player = useMainPlayer();
        const queue = player.nodes.get(channel.guild.id);
        if (queue) {
            queue.delete();
        }

        const embed = embedConfirmation(interaction, 'Desconectado!', 'O bot foi desconectado do canal de voz.', null); // Passa null se não houver imagem
        await interaction.reply({ embeds: [embed] });
    }
}

export default new CommandLeave();
