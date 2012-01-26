# yammer-js

Simple Yammer API client for express + connect.

    npm install yammer

## Usage

yammer has only one method:

* apiCall(_http_method_, _path_, _params_, _callback_): Does a call to the Yammer API.

Params must contain the token (in the access_token field).

## Test

```
    node example/test.js <access_token>
```