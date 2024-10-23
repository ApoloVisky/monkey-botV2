import { Client, GatewayIntentBits, Interaction } from "discord.js";
import CommandModel from "./models/CommandModel"; 
import { DisTube } from "distube";
import { YouTubePlugin } from "@distube/youtube";
import * as fs from "fs";
import * as path from "path";
import { HttpsProxyAgent } from "https-proxy-agent";
import axios from "axios";
import * as dotenv from "dotenv";
import { deployComando } from "./deploy-commands";

dotenv.config();



const proxyUrl = process.env.PROXY_URL;
if (proxyUrl) {
    const agent = new HttpsProxyAgent(proxyUrl);
    axios.defaults.httpsAgent = agent;
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const distube = new DisTube(client, {
    emitNewSongOnly: true,
    plugins: [new YouTubePlugin()],
});

const loadCommands = async (): Promise<Map<string, CommandModel>> => {
    const commands = new Map<string, CommandModel>();
    const commandsPath = path.resolve(__dirname, '..', 'src', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js')); 
    console.log('Carregando comandos...');

    for (const file of commandFiles) {
        const commandModule = await import(`${commandsPath}/${file}`);
        const command = commandModule.default;

        if (command.data?.name && typeof command.execute === "function") {
            commands.set(command.data.name, command);
            console.log(`Comando carregado: ${command.data.name}`);
        } else {
            console.warn(`O comando ${file} está faltando "name" ou "execute".`);
        }
    }

    return commands;
};

const initializeBot = async () => {
    const commands = await loadCommands();

    client.once("ready", () => {
        console.log(`Bot está online como ${client.user?.tag}`);
    });

    client.on("interactionCreate", async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        const command = commands.get(interaction.commandName);

        if (command) {
            try {
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.deferReply();
                    console.log(`Resposta adiada para o comando: ${interaction.commandName}`);
                }

                await command.execute({ client, interaction, distube });
                console.log(`Comando executado: ${interaction.commandName}`);

                if (!interaction.replied) {
                    await interaction.editReply("Comando executado com sucesso!");
                }
            } catch (error: unknown) {
                console.error("Erro ao executar o comando:", error);
                // @ts-ignore: error is unknown
                const errorMessage = error?.errorCode === 'CANNOT_RESOLVE_SONG'
                    ? "Desculpe, não consegui encontrar a música que você pediu."
                    : "Houve um erro ao executar esse comando.";

                if (!interaction.replied) {
                    await interaction.editReply({ content: errorMessage });
                } else {
                    await interaction.followUp({ content: errorMessage, ephemeral: true });
                }
            }
        } else {
            const notFoundMessage = "Comando não encontrado.";
            console.warn(notFoundMessage);
            if (!interaction.replied) {
                await interaction.followUp({ content: notFoundMessage, ephemeral: true });
            } else {
                await interaction.followUp({ content: notFoundMessage, ephemeral: true });
            }
        }
    });

    client.login(process.env.DISCORD_TOKEN);
};

deployComando().then(() =>
    
    initializeBot());

