const jwt = require('jsonwebtoken');
const accessKey = require('./accesskey.js');

/* Create a JSON web token for DoorDash's API. */
function createWebToken() {
    // Data for the JSON web token.
    const data = {
        aud: 'doordash',
        iss: accessKey.developer_id,
        kid: accessKey.key_id,
        exp: Math.floor(Date.now() / 1000 + 300),
        iat: Math.floor(Date.now() / 1000),
    };

    const headers = { algorithm: 'HS256', header: { 'dd-ver': 'DD-JWT-V1' } }; // Header for the JSON web token.

    // Create the JSON web token.
    const token = jwt.sign(
        data,
        Buffer.from(accessKey.signing_secret, 'base64'),
        headers,
    );

    return token;
}

module.exports = createWebToken;
