// bot.js
const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

client.once('ready', () => {
  console.log(`Bot is online as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (!message.guild || message.author.bot) return;

  const args = message.content.split(' ');
  const command = args.shift().toLowerCase();

  if (command === '!kick') {
    const member = message.mentions.members.first();
    if (member && message.member.permissions.has('KickMembers')) {
      await member.kick();
      message.channel.send(`${member.user.tag} has been kicked.`);
    }
  }

  if (command === '!ban') {
    const member = message.mentions.members.first();
    if (member && message.member.permissions.has('BanMembers')) {
      await member.ban();
      message.channel.send(`${member.user.tag} has been banned.`);
    }
  }
});

client.login(process.env.BOT_TOKEN);
const settings = require('./settings.js');

// inside message handler:
if (command === '!kick' && settings.kick) { /* kick logic */ }
if (command === '!ban' && settings.ban) { /* ban logic */ }
if (command === '!warn' && settings.warn) { /* warn logic */ }