const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const createQuote = require('../../doordash/createQuote.js');
const createWebToken = require('../../doordash/createWebToken.js');

function createTextInput(customId, label, style = TextInputStyle.Short) {
  return new TextInputBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(style);
}

module.exports = {
  run: async ({ interaction }) => {
    const modal = new ModalBuilder({
      customId: `quote-${interaction.user.id}`,
      title: 'Create a quote!',
    });

    // Define input fields
    const inputs = [
      { customId: 'phoneNumber', label: 'Phone Number' },
      { customId: 'address', label: 'Address' },
      { customId: 'suburb', label: 'Suburb' },
      { customId: 'postcode', label: 'Postcode' },
      { customId: 'city', label: 'City' },
    ];

    // Create ActionRows
    const actionRows = inputs.map(input => 
      new ActionRowBuilder().addComponents(createTextInput(input.customId, input.label))
    );

    // Add ActionRows to the modal
    modal.addComponents(...actionRows);

    await interaction.showModal(modal);

    const token = createWebToken();
    const filter = (i) => i.customId === `quote-${interaction.user.id}`;

    try {
      const modalInteraction = await interaction.awaitModalSubmit({ filter, time: 30_000 });
      
      // Collect values from the inputs
      const phoneNumber = modalInteraction.fields.getTextInputValue('phoneNumber');
      const address = modalInteraction.fields.getTextInputValue('address');
      const suburb = modalInteraction.fields.getTextInputValue('suburb');
      const postcode = modalInteraction.fields.getTextInputValue('postcode');
      const city = modalInteraction.fields.getTextInputValue('city');

      // Process the collected data
      try {
        const response = await createQuote(token, {
          externalDeliveryId: phoneNumber,
          pickupAddress: '329 Albany Highway, Rosedale, Auckland, 0632, NZ',
          //pickupPhoneNumber: phoneNumber,
          dropoffAddress: `80 Laurel Oak Drive, Schnapper Rock, Auckland, 0632, NZ`,
          dropoffPhoneNumber: phoneNumber,        
        });
        await modalInteraction.reply(`Quote created successfully with ID ${response.external_delivery_id}!`);
      } catch (error) {
        console.error('Error creating quote:', error);
        await modalInteraction.reply('There was an error creating the quote. Please try again later.');
      }
    } catch (err) {
      console.error('Error awaiting modal submit:', err);
    }
  },
  data: {
    name: 'quote',
    description: 'Create a quote!',
  },
};
