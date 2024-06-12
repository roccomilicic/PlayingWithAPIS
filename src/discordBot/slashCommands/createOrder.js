const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    run: async ({ interaction }) => {
        const modal = new ModalBuilder({
            customId: `order-${interaction.user.id}`, // Corrected custom ID format
            title: 'Create your order!',
        });

        // Restaurant input
        const RestaurantInput = new TextInputBuilder()
            .setCustomId('RestaurantInput')
            .setLabel('Restaurant Name')
            .setStyle(TextInputStyle.Short);

        // Add input fields to the modal (form)
        const firstActionRow = new ActionRowBuilder().addComponents(RestaurantInput);
        modal.addComponents(firstActionRow);
        await interaction.showModal(modal);

        // Filter for the modal submit event
        const filter = (interaction) => interaction.customId === `order-${interaction.user.id}`;

        interaction
            .awaitModalSubmit({ filter, time: 10_000 })
            .then((modalInteraction) => {
                const restaurantName = modalInteraction.fields.getTextInputValue('RestaurantInput');
                modalInteraction.reply(`You have selected ${restaurantName} as your restaurant!`);
            })
            .catch((err) => {
                console.log('Error: ', err);
            });
    },
    data: { // This is the command data
        name: 'order',
        description: 'Create your doordash order!',
    },
};
