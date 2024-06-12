const jwt = require('jsonwebtoken');

/* Create a JSON web token for DoorDash's API. */
function createWebToken() {

    // Access key for DoorDash's API.
    const accessKey = {
        "developer_id": "9be2d9b4-493a-46fe-9b17-9e2c6004632f",
        "key_id": "ae6e6f2d-8ce5-4eac-95b6-cd48342c1e98",
        "signing_secret": "wNMZ0vA6mkOXIxKSIlSOMdTKlwKplBzuDso_CmzpcIU"
    };
    
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
