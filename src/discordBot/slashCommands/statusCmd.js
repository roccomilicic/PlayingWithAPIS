const { SlashCommandBuilder } = require('@discordjs/builders');
const getOrderStatus = require('../../doordash/getOrderStatus.js');

module.exports = {
    // Status command and the inputs
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Check the status of your DoorDash order!')
        .addStringOption(option =>
            option.setName('orderid')
                .setDescription('The ID of your order')
                .setRequired(true)
        ),
    run: async ({ interaction }) => {
        const orderId = interaction.options.getString('orderid'); // Get the order ID from the user's input

        // Get the order status
        try {
            const response = await getOrderStatus(orderId);
            console.log('Order status retrieved successfully:', response.delivery_status);
            await interaction.reply(`Order status: ${response.delivery_status}`);
        } catch (error) {
            console.error('Error retrieving order status:', error);
            await interaction.reply('There was an error retrieving your order status. Please try again later.');
        }
    }
};

