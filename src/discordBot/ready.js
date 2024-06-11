const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


client.login(token);

client.on('channelCreate', async channel => {
    // Check if the channel is a text channel and matches the name format "ticket-xxxx"
    if (channel.type === 'GUILD_TEXT' && /^ticket-\d+$/.test(channel.name)) {
        // Send a greeting message in the newly created channel
        await channel.send('Hello! How can I assist you?');
    }
});