const { Client, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, Events, REST, Routes } = require('discord.js');
const { token } = require('./config.json'); // Store your bot token in config.json

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    const { user, guild } = interaction;
    const channelName = `ticket-${user.username}`;


    const existingChannel = guild.channels.cache.find(channel => channel.name === channelName);

    if (existingChannel) {
        await interaction.reply({ content: 'A ticket already exists for you!', ephemeral: true });
    } else {
        try {
            const channel = await guild.channels.create({
                name: channelName,
                type: 'GUILD_TEXT',
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                    },
                ],
            });

            await interaction.reply({ content: `Your ticket has been created: ${channel}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error creating your ticket. Please try again later.', ephemeral: true });
        }
    }
});

client.on(Events.MessageCreate, async message => {
    if (message.content === '!create-ticket-button') {
        const button = new ButtonBuilder()
            .setCustomId('create-ticket')
            .setLabel('Create Ticket')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        await message.channel.send({
            content: 'Click the button to create a ticket:',
            components: [row],
        });
    }
});

client.login(token);
