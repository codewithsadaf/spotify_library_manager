const express = require('express');
const axios = require('axios');
const {ClientCredentials, ResourceOwnerPassword, AuthorizationCode} = require('simple-oauth2');

var CLIENT_ID = 'ff4ce56cef1c4c8aaad752b36e6a6af0'
var CLIENT_SECRET = 'a48b61222b214b1788512d9885dbc39a'
var REDIRECT_URI = 'http://localhost:3000/callback/'
var SCOPE = 'user-library-read'

//Construct config object
const config = {
    client:{
        id: CLIENT_ID,
        secret: CLIENT_SECRET
    },
    auth:{
        tokenHost: 'https://accounts.spotify.com',
        tokenPath: '/api/token',
        authorizePath: '/authorize'
    }
}

//Create client instance of 'Authorization Code' grant type with config info
const client = new AuthorizationCode(config)

//Create instance of express app
var app = express()

//"login" page
app.get('/login', function(req, res){

    //Client requests authorization code, directs response to redirect_URI
    const authorizationUri = client.authorizeURL({
        redirect_uri: REDIRECT_URI,
        scope: SCOPE
    })

    res.redirect(authorizationUri)
});

//Redirect_uri page
app.get('/callback', async function(req, res){

    //Retrieve Authorization code
    const {code} = req.query;
    
    //Create options object (aka params) to request access token
    const options = {
        code, 
        redirect_uri: REDIRECT_URI
    };

    //Request access Token
    try {
        const result = await client.getToken(options);
        accessToken = result.token.access_token 
    } catch (error) {
        console.error(error.message);
        res.send('Access Token Error')
    }

    //Make API request
    axiosGetOptions = {
        headers: {
            'Authorization' : 'Bearer ' + accessToken
        }
    }
    axios.get('https://api.spotify.com/v1/me/tracks', axiosGetOptions).then(response => {
        names = [];
        for (let i = 0;  i < response.data.items.length; i++){
            names.push(response.data.items[i].track.name)
        }
        res.send(names);
    }).catch(error => {
        console.error(error)
    })
})


app.get('/my_tracks', async function(req, res){
})    

app.get('/', function(req, res) {
    res.send(config)
})

app.listen(3000)
