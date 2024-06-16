const DoorDashClient = require('@doordash/sdk');
const accessKey = require('./accesskey.js');

async function acceptQuote(externalDeliveryId) {
    const client = new DoorDashClient.DoorDashClient(accessKey);
    
    try {
        console.log("Accepting quote222...");
        const response = await client.deliveryQuoteAccept(
            externalDeliveryId
        );
        console.log("Response for acceptQuote:\n", response.message);
        return response.data;
    } catch (error) {
        throw new Error('\nError accepting delivery: ' + error.message);
    }
}

module.exports = acceptQuote;
