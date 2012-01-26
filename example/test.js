var yammerClient = require('../');

var token = process.argv[2];

console.error("DEBUG: token", token);

yammerClient.apiCall('GET', '/messages.json', {access_token: token}, function(err, resp, body) {
    console.error(JSON.stringify(body, null, 4));
});