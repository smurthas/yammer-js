/*
 * yammer-js
 *
 * Copyright (c) 2011 Simon Murtha-Smith <simon@murtha-smith.com>
 */

var url = require("url"),
    http = require('http'),
    OAuth = require('oauth').OAuth,
    querystring = require("querystring");

var baseURI = 'https://www.yammer.com/api/v1';

module.exports = function (api_key, api_secret, callbackURI) {
    var client = {version: '0.0.0'};
    
    var oAuth = new OAuth('https://www.yammer.com/oauth/request_token',
                          'https://www.yammer.com/oauth/access_token',
                          api_key, api_secret, '1.0', callbackURI,
                          'HMAC-SHA1', null,
        {'Accept': '*/*', 'Connection': 'close', 'User-Agent': 'yammer-js ' + client.version});
    
        
    function requestCallback(callback) {
        return function (err, data, response) {
            if (err) {
                callback(err, data);
            } else {
                try {
                    callback(null, JSON.parse(data));
                } catch (exc) {
                    callback(exc, data);
                }
            }
        };
    }
    
    function get(path, params, token, callback) {
        oAuth.get(baseURI + path + '?' + querystring.stringify(params),
                token.oauth_token, token.oauth_token_secret, requestCallback(callback));
    }
    
    function post(path, params, token, callback) {
        oAuth.post(baseURI + path, token.oauth_token, token.oauth_token_secret, params, null, requestCallback(callback));
    }
    
    // PUBLIC
    client.apiCall = function (method, path, params, callback) {
        var token = params.token;
        delete params.token;
        if (method === 'GET')
            get(path, params, token, callback);
        else if (method === 'POST')
            post(path, params, token, callback);
    }
    
    client.getRequestToken = function (req, res, callback) {
        var parsedUrl = url.parse(req.url, true),
            callbackUrl = (req.socket.encrypted ? 'https' : 'http') + '://' + req.headers.host + parsedUrl.pathname;
        
        oAuth.getOAuthRequestToken({oauth_callback: callbackUrl},
            function (error, oauth_token, oauth_token_secret, oauth_authorize_url, additionalParameters) {
            if(!error) {
                req.session.yammer_redirect_url = req.url;
                req.session.auth = req.session.auth || {};
                req.session.auth.yammer_oauth_token_secret = oauth_token_secret;
                req.session.auth.yammer_oauth_token = oauth_token;
                res.redirect("https://www.yammer.com/oauth/authorize?oauth_token=" + oauth_token);
            } else {
                callback(error, null);
            }
        });
    }
    
    client.getAccessToken = function (req, res, callback) {
        var parsedUrl = url.parse(req.url, true);
        if(req.session.auth && req.session.auth.yammer_oauth_token &&  
                               req.session.auth.yammer_oauth_token_secret) {
            oAuth.getOAuthAccessToken(req.session.auth.yammer_oauth_token,
                                      req.session.auth.yammer_oauth_token_secret,
                                      parsedUrl.query.oauth_verifier,
            function (error, oauth_token, oauth_token_secret, additionalParameters) {
                if (error)
                    callback(error, null);
                else
                    callback(null, {oauth_token: oauth_token, oauth_token_secret: oauth_token_secret});
            });
        } else {
        }
    };

    return client;
};
