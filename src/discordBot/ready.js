const { Client, IntentsBitField } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

client.on('ready', (c) => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('channelCreate', (channel) => {
    console.log(`Channel created: ${channel.name}`);
});

client.login(token);