const { Client, IntentsBitField, InteractionResponse } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessages,
    ]
});

client.on('ready', (c) => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (msg) => {
    // If the message is "ping"
    if (msg.content === 'ping') {
        // Send "pong" to the same channel
        msg.channel.send('pong');
    }
});

client.on('channelCreate', (channel) => {
    // Check if the created channel is a text channel
    if (channel.type === 0) { // 0 represents GUILD_TEXT in the discord.js v13 and later
        // Send a message to the newly created channel
        channel.send('A new text channel has been created!');
    }
});

client.login(token);