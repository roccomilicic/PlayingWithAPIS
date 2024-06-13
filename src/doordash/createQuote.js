const DoorDashClient = require('@doordash/sdk');
const accessKey = require('./accesskey.js');

async function createQuote(token, { externalDeliveryId, pickupAddress, pickupPhoneNumber, dropoffAddress, dropoffPhoneNumber, orderValue }) {
    const client = new DoorDashClient.DoorDashClient(accessKey);
    
    try {
        const response = await client.deliveryQuote({
            external_delivery_id: externalDeliveryId,
            pickup_address: pickupAddress,
            pickup_phone_number: pickupPhoneNumber,
            dropoff_address: dropoffAddress,
            dropoff_phone_number: dropoffPhoneNumber,
            order_value: orderValue,
        });
        return response.data;
    } catch (error) {
        throw new Error('Error creating quote: ' + error.message);
    }
}

module.exports = createQuote;
