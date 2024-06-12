const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const createDelivery = require('../../createDelivery.js');
const createWebToken = require('../../createWebToken');


module.exports = {
  run: async ({ interaction }) => {
    const modal = new ModalBuilder({
      customId: `order-${interaction.user.id}`,
      title: 'Create your order!',
    });

    // External Delivery ID input
    const externalDeliveryID = new TextInputBuilder()
      .setCustomId('externalDeliveryID')
      .setLabel('External Delivery ID')
      .setStyle(TextInputStyle.Short);

    // Add input fields to the modal (form)
    const firstActionRow = new ActionRowBuilder().addComponents(externalDeliveryID);
    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);

    const token = createWebToken();
    const filter = (interaction) => interaction.customId === `order-${interaction.user.id}`;

    // Await the modal submit
    interaction
      .awaitModalSubmit({ filter, time: 30_000 })
      .then((modalInteraction) => {
        const externalDeliveryIDText = modalInteraction.fields.getTextInputValue('externalDeliveryID');

        // Validate externalDeliveryID (optional)

        // Call the createDelivery function
        createDelivery(token, externalDeliveryIDText)
          .then((response) => {
            console.log('Delivery created successfully:', response.data);
            interaction.reply(`Your order with external ID ${externalDeliveryIDText} has been placed!`);
          })
          .catch((error) => {
            console.error('Error creating delivery:', error);
          });
      })
      .catch((err) => {
        console.error('Error awaiting modal submit:', err);
        // Log the error for debugging, but don't attempt to reply here
      });
  },
  data: {
    name: 'order',
    description: 'Create your doordash order!',
  },
};
