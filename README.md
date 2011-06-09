# yammer-js

Simple Yammer API client for express + connect.

    npm install yammer-js

## Usage

yammer-js has three methods:

* getRquestToken(_req_, _res_, _callback_): Uses oAuth module to get the request token
* getAccessToken(_req_, _res_, _callback_): Uses oAuth module to get the access token
* apiCall(_http_method_, _path_, _params_, _callback_): Does a call to the Yammer API.

Params must contain the token.

## Test

Enter your consumer key and secret in example/test.js

    cd test
    node test.js

open http://localhost:8553