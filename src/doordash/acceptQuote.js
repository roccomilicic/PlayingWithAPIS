const DoorDashClient = require('@doordash/sdk');
const accessKey = require('./accesskey.js');

async function acceptQuote(externalDeliveryId) {
    const client = new DoorDashClient.DoorDashClient(accessKey);
    
    try {
        const response = await client.deliveryQuoteAccept(
            externalDeliveryId
        );
        console.log("ACCEPT: Response for acceptQuote:\n", response.data);
        return response.data;
    } catch (error) {
        throw new Error('\nExternal delivery ID: ' + externalDeliveryId + '\nError accepting delivery: ' + error.message);
    }
}

module.exports = acceptQuote;
