const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const DoorDashClient = require('@doordash/sdk');
const accessKey = require('../../doordash/accesskey.js');

module.exports = {
    run: async ({ interaction }) => {
        const modal = new ModalBuilder({
            customId: `status-${interaction.user.id}`,
            title: 'Check your order status!',
        });

        // Order ID input
        const orderIdInput = new TextInputBuilder()
            .setCustomId('orderId')
            .setLabel('Order ID')
            .setStyle(TextInputStyle.Short);

        // Add input fields to the modal (form)
        const firstActionRow = new ActionRowBuilder().addComponents(orderIdInput);
        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);

        const filter = (i) => i.customId === `status-${interaction.user.id}`;

        try {
            const modalInteraction = await interaction.awaitModalSubmit({ filter, time: 30_000 });
            const orderIdText = modalInteraction.fields.getTextInputValue('orderId');

            try {
                const response = await getOrderStatus(orderIdText);
                console.log('Order status retrieved successfully:', response.delivery_status);
                await modalInteraction.reply(`Order status: ${response.delivery_status}`);
            } catch (error) {
                console.error('Error retrieving order status:', error);
                await modalInteraction.reply('There was an error retrieving your order status. Please try again later.');
            }
        } catch (err) {
            console.error('Error awaiting modal submit:', err);
        }
    },
    data: {
        name: 'status',
        description: 'Check the status of your doordash order!',
    },
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
