const axios = require('axios');

async function createDelivery(token, externalDeliveryId) {
    const body = JSON.stringify({
        external_delivery_id: 'D-12345123',  // Use the provided externalDeliveryId
        pickup_address: '901 Market Street 6th Floor San Francisco, CA 94103',
        pickup_business_name: 'Wells Fargo SF Downtown',
        pickup_phone_number: '+16505555555',
        pickup_instructions: 'Enter gate code 1234 on the callbox.',
        dropoff_address: '901 Market Street 6th Floor San Francisco, CA 94103',
        dropoff_business_name: 'Wells Fargo SF Downtown',
        dropoff_phone_number: '+16505555555',
        dropoff_instructions: 'Enter gate code 1234 on the callbox.',
        order_value: 1999,
    });

    try {
        const response = await axios.post('https://openapi.doordash.com/drive/v2/deliveries', body, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        throw new Error('Error creating delivery: ' + error.message);
    }
}

module.exports = createDelivery;
