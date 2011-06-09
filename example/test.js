var express = require('express'),
    connect = require('connect'),
    app = express.createServer(connect.bodyParser(),
                               connect.cookieParser(),
                               connect.session({secret: 'session'}));
var fs = require('fs');
var yammerClient = require('../')('yourConsumerKey', 'yourConsumerSecret');

var token;
app.get('/', function (req, res) {
    res.writeHead(200, {'content-type':'text/html'});
    res.write('<html><a target="_blank" href="/auth">auth here</a><br>');
    res.write('<form action="/done">When done, enter your authorization code here:');
    res.write('<input name="oauth_verifier"></form></html>');
    res.end();
});

app.get('/auth', function(req, res) {
    yammerClient.getRequestToken(req, res, function (error) {
        if(err) {
            res.writeHead(500);
            res.end('oh noes');
        }
    });
});

app.get('/done', function(req, res) {
    yammerClient.getAccessToken(req, res, function(err, newToken) {
        if(newToken) {
            token = newToken;
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end('<html>Now <a href="/getStuff">get stuff</a></html>');
        }
    });
});

app.get('/getStuff', function (req, res) {
    yammerClient.apiCall('GET', '/messages.json',
        {token: {oauth_token_secret: token.oauth_token_secret, oauth_token: token.oauth_token}},
        function(err, resp) {
            res.writeHead(200, 'application/json');
            res.end(JSON.stringify(resp));
    });
    
});

app.listen(8553);
console.log('listening at http://localhost:8553/');