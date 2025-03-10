const DoorDashClient = require('@doordash/sdk');
const accessKey = require('./accesskey.js');
const { v4: uuidv4 } = require('uuid');
const acceptQuote = require('./acceptQuote.js');

async function createQuote(token, { pickupAddress, pickupPhoneNumber, dropoffAddress, dropoffPhoneNumber, orderValue }) {
    const client = new DoorDashClient.DoorDashClient(accessKey);

    try {
        const response = await client.deliveryQuote({
            external_delivery_id: uuidv4(),
            pickup_address: pickupAddress,
            dropoff_address: dropoffAddress,
            dropoff_phone_number: '+642885131748',
            "items": [
                {
                    "name": "Korean Chicken Bites",
                    "quantity": 2,
                }
            ]
        });

        console.log("CREATE: Response for createQuote:", response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error response data:', error.response.data);
            throw new Error('Error creating delivery: ' + JSON.stringify(error.response.data));
        } else {
            throw new Error('Error creating delivery: ' + error.message);
        }
    }
}

module.exports = createQuote;
