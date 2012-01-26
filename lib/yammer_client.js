/*
 * yammer-js
 *
 * Copyright (c) 2011 Simon Murtha-Smith <simon@murtha-smith.com>
 */

var request = require('request'),
    querystring = require("querystring");

var baseURI = 'https://www.yammer.com/api/v1';

exports.apiCall = function (method, path, params, callback) {
    if(path.indexOf('.json') !== path.length - 5) path += '.json';
    var url = baseURI + path;
    
    if (method === 'GET') return request.get({uri:url + '?' + querystring.stringify(params), json:true}, callback);
    
    var token = params.access_token;
    delete params.access_token;
    if (method === 'POST') request.post({uri:url + "?access_token=" + token, json:params}, callback);
}
