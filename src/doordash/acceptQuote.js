const DoorDashClient = require('@doordash/sdk');
const accessKey = require('./accesskey.js');

async function acceptQuote(externalDeliveryId) {
    const client = new DoorDashClient.DoorDashClient(accessKey);
    
    try {
        console.log("Accepting quote222...");
        const response = await client.deliveryQuoteAccept(
            "1e859246-a108-443c-aa87-e6c3267bbc7e"
        );
        console.log("Response for acceptQuote:\n", response.message);
        return response.data;
    } catch (error) {
        throw new Error('\n!!!External delivert ID: ' + externalDeliveryId + '\nError accepting delivery: ' + error.message);
    }
}

module.exports = acceptQuote;
