import { useQueue } from 'discord-player';
import { ApplicationCommandOptionType, EmbedBuilder, CommandInteraction, CommandInteractionOptionResolver, Client, GuildMember, GuildTextBasedChannel } from 'discord.js';
import Command from '../models/CommandModel';
import ytdl from 'ytdl-core';
import DisTube from 'distube';

interface ExtendedClient extends Client {
    player: DisTube; 
}

class CommandPlay extends Command {
    category: string;
    options: { name: string; description: string; type: ApplicationCommandOptionType; required: boolean }[];

    constructor() {
        super('play', 'Adiciona uma música à fila e a toca.');
        this.category = 'music';
        this.options = [
            {
                name: 'url',
                description: 'URL ou nome da música para adicionar à fila.',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ];
    }

    async execute(args: { interaction: CommandInteraction, distube: DisTube }): Promise<void> {

        const { client, interaction } = args as unknown as { client: ExtendedClient, interaction: CommandInteraction };
        const guildId = interaction.guildId;

        if (!guildId) {
            await interaction.reply({ content: 'Não foi possível encontrar a fila. Certifique-se de que o bot está conectado a um canal de voz.', ephemeral: true });
            return;
        }

        const queue = useQueue(guildId);
        if (!queue) {
            await interaction.reply({ content: 'Não foi possível encontrar a fila. Certifique-se de que o bot está conectado a um canal de voz.', ephemeral: true });
            return;
        }

        const url = (interaction.options as CommandInteractionOptionResolver).getString('url', true);

        try {
            // Obtém informações do vídeo
            const videoInfo = await ytdl.getInfo(url);
            const title = videoInfo.videoDetails.title;

            if (!interaction.member || !(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
                await interaction.reply({ content: 'Você precisa estar em um canal de voz para adicionar uma música à fila.', ephemeral: true });
                return;
            }

            await client.player.play(interaction.member.voice.channel, url, {
                member: interaction.member,
                textChannel: interaction.channel as GuildTextBasedChannel,
            });

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setDescription(`🎶 **${title}** foi adicionada à fila!`);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Ocorreu um erro ao adicionar a música à fila. Verifique a URL e tente novamente.', ephemeral: true });
        }
    }
}

export default new CommandPlay();
