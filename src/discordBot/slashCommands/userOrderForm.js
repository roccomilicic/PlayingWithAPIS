const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const createDelivery = require('../../doordash/createDelivery.js');
const createWebToken = require('../../doordash/createWebToken.js');

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
    const filter = (i) => i.customId === `order-${interaction.user.id}`;

    try {
      const modalInteraction = await interaction.awaitModalSubmit({ filter, time: 30_000 });
      const externalDeliveryIDText = modalInteraction.fields.getTextInputValue('externalDeliveryID');

      try {
        const response = await createDelivery(token, externalDeliveryIDText);
        console.log('Delivery created successfully:', response.data);
        await modalInteraction.reply(`Your order with external ID ${externalDeliveryIDText} has been placed!`);
      } catch (error) {
        console.error('Error creating delivery:', error);
        await modalInteraction.reply('There was an error placing your order. Please try again later.');
      }
    } catch (err) {
      console.error('Error awaiting modal submit:', err);
    }
  },
  data: {
    name: 'order',
    description: 'Create your doordash order!',
  },
};
