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

/* Gets the ETA in the format HH:MM */
function getETA(s, start, end) {
  const startIndex = s.indexOf(start);
  const endIndex = s.indexOf(end, startIndex + 1);
  
  if (startIndex !== -1 && endIndex !== -1) {
    const timeString = s.substring(startIndex + 1, endIndex);
    const [hours, minutes] = timeString.split(':');
    let hoursInt = parseInt(hours, 10);
    
    if (hoursInt > 12) {
      hoursInt -= 12;
    } else if (hoursInt === 0) {
      hoursInt = 12;
    }
    
    return `${hoursInt}:${minutes}`;
  }
  
  return "";
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
        .setTitle('Creating Quote..')
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
        embed
          .setTitle('Quote Created...')
        await message.edit({ embeds: [embed] });

        const externalDeliveryId = responseCreate.external_delivery_id;

        try {
          // Accept the quote
          const responseAccept = await acceptQuote(externalDeliveryId);
          
          // Update the embed with the accepted quote information
          embed
            .setTitle('Quote Accepted!')
            .addFields([
              {
                name: 'Order ID',
                value: responseAccept.external_delivery_id,
              },
              {
                name: 'Track your order',
                value: responseAccept.tracking_url,
              },
              {
                name: 'ETA',
                value: getETA(responseAccept.dropoff_time_estimated, 'T', 'Z'),
              }
            ])
            //.setDescription(`Order ID: ${responseAccept.external_delivery_id}\nTrack you order: ${responseAccept.tracking_url}`);
          await message.edit({ embeds: [embed] });
        } catch (error) {
          console.error('Error accepting quote:', error);
          embed
            .setTitle('Error Accepting Quote')
            .setDescription('There was an error accepting the quote. Please try again later.');
          await message.edit({ embeds: [embed] });
        }
      } catch (error) {
        console.error('Error creating quote:', error);
        embed
          .setTitle('Error Creating Quote')
          .setDescription('There was an error creating the quote. Please try again later.');
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
