import { ColorResolvable, EmbedBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';

const embedWarning = (interaction: CommandInteraction, titleText: string, color: ColorResolvable = '#B8860B') => {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(titleText)
        .setFooter({ text: `Solicitado por: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();
};

const embedConfirmation = (interaction: CommandInteraction, titleText: string, desc: string, thumbnail: string | null = null, color: ColorResolvable = 'Green') => {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({ name: 'Apolo' })
        .setTitle(titleText)
        .setDescription(desc);

    if (thumbnail) {
        embed.setThumbnail(thumbnail); 
    }

    embed.setFooter({ text: `Solicitado por: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
         .setTimestamp();

    return embed;
};

const embedError = (interaction: CommandInteraction, title: string, desc: string, img: string | null = null, thumb: string | null = null, color: ColorResolvable = 'Red') => {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setAuthor({ name: 'Apolo' })
        .setDescription(desc);

    if (img) {
        embed.setImage(img); 
    }

    if (thumb) {
        embed.setThumbnail(thumb); 
    }

    embed.setFooter({ text: `Solicitado por: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
         .setTimestamp();

    return embed;
};

const embedNotification = (interaction: CommandInteraction, title: string, desc: string, img: string | null = null, color: ColorResolvable = 'Blue') => {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(desc);

    if (img) {
        embed.setImage(img); // Define a imagem apenas se ela for válida
    }

    embed.setFooter({ text: `Solicitado por: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
         .setTimestamp();

    return embed;
};

export {
    embedWarning,
    embedConfirmation,
    embedError,
    embedNotification
};
