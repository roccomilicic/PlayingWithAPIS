const { SlashCommandBuilder } = require('@discordjs/builders');
const DoorDashClient = require('@doordash/sdk');
const accessKey = require('../../doordash/accesskey.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Check the status of your DoorDash order!')
        .addStringOption(option =>
            option.setName('orderid')
                .setDescription('The ID of your order')
                .setRequired(true)
        ),
    run: async ({ interaction }) => {
        const orderId = interaction.options.getString('orderid');

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

async function getOrderStatus(orderId) {
    const client = new DoorDashClient.DoorDashClient(accessKey);

    try {
        const response = await client.getDelivery(orderId);
        console.log("RES", response.data);
        return response.data;
    } catch (error) {
        console.log("ERR", error);
        throw new Error('Error fetching order status: ' + error.message);
    }
}
