const express = require('express');
const axios = require('axios');
const Spotify = require('spotify-web-api-node')
const {ClientCredentials, ResourceOwnerPassword, AuthorizationCode} = require('simple-oauth2');
const { default: SpotifyWebApi } = require('spotify-web-api-js');

var CLIENT_ID = 'ff4ce56cef1c4c8aaad752b36e6a6af0'
var CLIENT_SECRET = 'a48b61222b214b1788512d9885dbc39a'
var REDIRECT_URI = 'http://localhost:3000/callback/'
var SCOPE = 'user-library-read'

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
        spotifyAPI.setAccessToken(accessToken) 
    } catch (error) {
        console.error(error.message);
        res.send('Access Token Error')
    }
    
    //use wrapper to retrieve user saved tracks
    spotifyAPI.getMySavedTracks({
        limit: 50,
        offset: 0
    }).then(data => {
        console.log(data.body.items.length)
        res.send(data.body)
    }).catch(error => {
        console.error(error)
    })

    // //Make API request
    // //build header that includes access token
    // axiosGetOptions = {
    //     headers: {
    //         'Authorization' : 'Bearer ' + accessToken
    //     }
    // }
    
    // //***NEEDS FIX-currently hardcoded to 1700 tracks***
    // //Generate endpoints
    // endpoints = [];
    // for (let n = 0; n < 34; n++){
    //     offset = n * 50;
    //     endpoints.push(`https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`)
    // }

    // //Perform get request on all endpoints, return promise, not response
    // const requests = endpoints.map(url => axios.get(url, axiosGetOptions))

    // //consolidate responses
    // axios.all(requests).then(responses => {
    //     let data = [];
    //     responses.forEach(resp => {
    //         for (let i = 0;  i < resp.data.items.length; i++){
    //             data.push(resp.data.items[i].track.name)
    //         }
    //     })
    //     res.send(data)
    // }).catch(error => {
    //     console.error(error)
    // })
    
    //Old code used for single get call, no .map()
    //Keeping just in case I cant generalize .map() way to any # of tracks

    // names = [];
    // let n = 0;
    // //while (n == 0){
    //     let start = 0;
    //     axios.get('https://api.spotify.com/v1/me/tracks?limit=50&offset=0', axiosGetOptions).then(response => {   
            
    //         chunk_length = response.data.items.length;
    //         console.log(chunk_length)
            
    //         for (let i = 0;  i < chunk_length; i++){
    //                 names.push(response.data.items[i].track.name)
    //             }
    //         n++;
            
    //     }).catch(error => {
    //         console.error(error)
    //     })
    // //}
    // res.send(names);
})


app.get('/my_tracks', async function(req, res){
})

app.get('/', function(req, res) {
    res.send(config)
})

app.listen(3000)
