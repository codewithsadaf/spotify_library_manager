const express = require('express');
const path = require('path')
const axios = require('axios');
const Spotify = require('spotify-web-api-node');
const {ClientCredentials, ResourceOwnerPassword, AuthorizationCode} = require('simple-oauth2');

var CLIENT_ID = 'ff4ce56cef1c4c8aaad752b36e6a6af0'
var CLIENT_SECRET = 'a48b61222b214b1788512d9885dbc39a'
var REDIRECT_URI = 'http://localhost:3000/callback/'
var SCOPE = 'user-library-read'
var tracks = [];

//Create instance of api wrapper
var spotifyAPI = new Spotify()

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
app.get('/callback', async function(req, res) {

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
        spotifyAPI.setAccessToken(accessToken) 
    } catch (error) {
        console.error(error.message);
        res.send('Access Token Error')
    }

    //use wrapper to retrieve user saved tracks
    
    limit = 50 //Max # of tracks allowed by Spotify for each call
    offset = 0 //Start with first track
    async function retrieveTracks() {
        try {
            
            let response = await spotifyAPI.getMySavedTracks({
                limit: limit,
                offset: offset
            })
            if (response.body.items.length) {
                for (let i = 0; i < response.body.items.length; i++) {
                    tracks.push(response.body.items[i].track.name)
                }
                offset += 50; //Next chunk of 50 tracks
                await retrieveTracks();
            } else {
                return(tracks)
            }
            
        } catch(error) {
            console.error(error)
        }
    }
    await retrieveTracks();
    res.sendFile(path.join(__dirname + '/login.html'));
    console.log("retrieved " + tracks.length + " saved tracks");
    // res.write("retrieved " + tracks.length + " saved tracks");
})

app.get('/duplicates',  function(req, res) {

    //Find duplicates
    var duplicates = []; //Feels clunky, should be able to simply use return
    n = 0;
    function checkDuplicates(arr) {
        for (let i = n + 1; i < arr.length; i++) {
            if (arr[i] == arr[n]) {
                duplicates.push(arr[i]);
            }
        }
        if (n < arr.length - 1){
            n++;
            checkDuplicates(arr);
        } else {
            //Why can't I simply access duplicates array from return? it gives me undefined
            return duplicates
        }
    }
    checkDuplicates(tracks);
    res.send(duplicates);
    console.log(duplicates.length);
})

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(3000)