import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { readdirSync } from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';
import CommandModel from './models/CommandModel'; 

dotenv.config();

const commands: CommandModel[] = [];

const commandFiles = readdirSync(path.resolve(__dirname, '..', 'src', 'commands')).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of commandFiles) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const command = require(path.resolve(__dirname, '..', 'src', 'commands', file)).default;

  if (!commands.some(cmd => cmd.data.name === command.data.name)) {
    commands.push(command);
  } else {
    console.warn(`Comando duplicado encontrado: ${command.data.name}. Removido da lista.`);
  }
}

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN as string);

export const deployComando = async  () => {
  try {
    console.log('Começando a registrar comandos de aplicação globalmente...');

    await rest.put(Routes.applicationCommands(process.env.APP_ID as string), {
      body: commands.map(command => command.data.toJSON()),
    });

    console.log('Comandos registrados com sucesso globalmente!');
  } catch (error) {
    console.error('Erro ao registrar comandos:', error);
  }
};
