const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const createQuote = require('../../doordash/createQuote.js');
const acceptQuote = require('../../doordash/acceptQuote.js');
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

      // Create an initial embedded message
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Creating Quote')
        .setDescription('Validating quote...')
        .setTimestamp();

      const message = await modalInteraction.reply({ embeds: [embed], fetchReply: true });

      try {
        // Create a quote
        const responseCreate = await createQuote(token, {
          pickupAddress: '329 Albany Highway, Rosedale, Auckland 0632, New Zealand',
          dropoffAddress: `${address}, ${suburb}, ${postcode}, ${city}`,
          dropoffPhoneNumber: phoneNumber,
        });

        // Update the embed with the created quote information
        embed.setDescription(`Quote created successfully with ID ${responseCreate.external_delivery_id}!\nValidating acceptance...`);
        await message.edit({ embeds: [embed] });

        const externalDeliveryId = responseCreate.external_delivery_id;

        try {
          // Accept the quote
          const responseAccept = await acceptQuote(externalDeliveryId);
          
          // Update the embed with the accepted quote information
          embed.setDescription(`Quote created successfully with ID ${responseCreate.external_delivery_id}!\nQuote accepted successfully with ID ${responseAccept.external_delivery_id}!`);
          await message.edit({ embeds: [embed] });
        } catch (error) {
          console.error('Error accepting quote:', error);
          embed.setDescription('There was an error accepting the quote. Please try again later.');
          await message.edit({ embeds: [embed] });
        }
      } catch (error) {
        console.error('Error creating quote:', error);
        embed.setDescription('There was an error creating the quote. Please try again later.');
        await message.edit({ embeds: [embed] });
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
M