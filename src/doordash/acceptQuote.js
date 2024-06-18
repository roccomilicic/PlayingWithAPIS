const DoorDashClient = require('@doordash/sdk');
const accessKey = require('./accesskey.js');

async function acceptQuote(externalDeliveryId) {
    const client = new DoorDashClient.DoorDashClient(accessKey);
    
    try {
        console.log("Accepting quote222...");
        console.log("externalDeliveryId: ", externalDeliveryId);
        const response = await client.deliveryQuoteAccept(
            externalDeliveryId
        );
        console.log("ACCEPT: Response for acceptQuote:\n", response.data);
        return response.data;
    } catch (error) {
        throw new Error('\n!!!External delivert ID: ' + externalDeliveryId + '\nError accepting delivery: ' + error.message);
    }
}

module.exports = acceptQuote;
