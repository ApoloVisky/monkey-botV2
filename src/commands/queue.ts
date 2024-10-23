// src/commands/CommandQueueMusic.ts
import { ButtonStyle, CommandInteraction } from 'discord.js';
import { useQueue } from 'discord-player';
import { ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ActionRowBuilder } from 'discord.js';
import Command from '../models/CommandModel'; // Verifique se o caminho está correto
// import CommandArgs from '../models/CommandArgs';
import DisTube from 'distube';

class CommandQueueMusic extends Command {
    category: string;
    options: { name: string; description: string; type: ApplicationCommandOptionType; required: boolean }[];

    constructor() {
        console.log('Comando queue criado com sucesso');
        super('queue', 'Mostra a fila de músicas');
        this.category = 'music';
        this.options = [
            {
                name: 'pagina',
                description: 'Número da página da fila',
                type: ApplicationCommandOptionType.Number,
                required: false,
            }
        ];
    }

    public async execute(args: { interaction: CommandInteraction, distube: DisTube }): Promise<void> {
        const { interaction } = args;
        if (!interaction.guildId) {
            await interaction.reply({
            content: 'Não foi possível obter o ID do servidor.',
            ephemeral: true,
            });
            return;
        }
        const queue = useQueue(interaction.guildId);

        if (!queue || queue.size === 0) {
            await interaction.reply({
                content: 'A fila não existe ou não há músicas tocando atualmente. Use /play para adicionar músicas à fila.',
                ephemeral: true,
            });
            return;
        }

        const multiple = 10;
        const maxPages = Math.ceil(queue.size / multiple);
        const pageNumber = interaction.options.get('pagina')?.value as number | null;
        const currentPage = Math.max(1, Math.min(pageNumber || 1, maxPages));
        const start = (currentPage - 1) * multiple;
        const end = start + multiple;

        const tracks = queue.tracks.toArray().slice(start, end);

        const prevButton = new ButtonBuilder()
            .setCustomId('down_arrow')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🔼')
            .setDisabled(currentPage === 1);

        const nextButton = new ButtonBuilder()
            .setCustomId('up_arrow')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🔽')
            .setDisabled(currentPage === maxPages);

        const skipMusic = new ButtonBuilder()
            .setCustomId('skip_music')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏭');

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(prevButton, nextButton, skipMusic);

            const embed = new EmbedBuilder()
            .setDescription(
                `${tracks
                    .map((track, i) =>
                        `${start + ++i} • [${track.title}](${track.url}) • [${track.requestedBy ? track.requestedBy.toString() : 'Unknown'}]`
                    )
                    .join("\n")}` || 'Nenhuma música na fila.'
            )
            .setFooter({
                text: `Página ${currentPage} de ${maxPages}`,
                iconURL: interaction.user.displayAvatarURL() //({ dynamic: true }) 
            })
            .setColor('Blue')
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true,
        });

        // Implementar logica para manusear os botões
    }
}

export default new CommandQueueMusic();
