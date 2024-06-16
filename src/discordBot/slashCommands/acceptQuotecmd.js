const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
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
            customId: `accquote-${interaction.user.id}`,
            title: 'Accept a quote!',
        });

        // Define input fields
        const inputs = [
            { customId: 'externalDeliveryId', label: 'externalDeliveryId' },
        ];

        // Create ActionRows
        const actionRows = inputs.map(input =>
            new ActionRowBuilder().addComponents(createTextInput(input.customId, input.label))
        );

        // Add ActionRows to the modal
        modal.addComponents(...actionRows);

        await interaction.showModal(modal);

        const token = createWebToken();
        const filter = (i) => i.customId === `accquote-${interaction.user.id}`;

        try {
            console.log("Accepting quote...");
            const modalInteraction = await interaction.awaitModalSubmit({ filter, time: 30_000 });

            // Collect values from the inputs
            const externalDeliveryId = modalInteraction.fields.getTextInputValue('externalDeliveryId');

            console.log("externalDeliveryId: ", externalDeliveryId);
            // Process the collected data//
            try {
                const response = await acceptQuote(token, {
                    externalDeliveryId: "1e859246-a108-443c-aa87-e6c3267bbc7e",
                });
                console.log("Response for acceptQuote:\n", response.data);
                await modalInteraction.reply(`Quote accepted successfully with ID ${response.external_delivery_id}!`);
            } catch (error) {
                console.error('!Error acceptinng quote:', error);
                await modalInteraction.reply('There was an error creating the quote. Please try again later.');
            }
        } catch (err) {
            console.error('Error awaiting modal submit:', err);
        }
    },
    data: {//
        name: 'accept',
        description: 'Accept a quote!',
    },
};
