module.exports = async (client) => {

    // Bot response when a new ticket is opened
    client.on('channelCreate', (channel) => {
            if (channel.type === 0) { // 0 represents GUILD_TEXT in the discord.js v13 and later
                channel.send('A new ticket has been opened!');
            }
        });
};