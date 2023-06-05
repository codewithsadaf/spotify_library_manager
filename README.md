# spotify_library_manager
A simple app that removes duplicate songs from a Spotify user's saved tracks. Built with node.js and uses express framework and pug view engine.  The motivation for this project was largely educational, improving my knowledge and competency surrounding:
1. APIs
2. HTTP requests
3. OAuth2.0
4. Javascript
5. Web development in general 

The goal was to focus more on back-end functionality, so the user-interface is very bare-bones.  User must register an app on Spotify for Developers website to obtain unique credentials and manually populate .env file before accessing or modifying their Spotify tracks through this app.

## Requirements
This app requires Node.js and npm to be installed locally.  The following packages are also required:
- express
- spotify-web-api-node
- simple-oauth2
- pug

All required packages can be installed with the terminal command
``` bash
npm install
```

Alternatively, packages can be installed individually by running 
```bash
npm install <package name>
```

## Setup
1. Login to [Spotify for Developers](https://developer.spotify.com/) with Spotify account and navigate to Dashboard
2. Click "Create App" and complete the required fields
3. Navigate to Settings in the app you just registered
4. Copy and paste Client ID and Client Secret into .env_sample file and rename file to ".env" (remove "\_sample")

## Usage
1. Launch app with the terminal commmand ```node liked_tracks_manager.js```
2. Navigate to localhost:3000 in browser
3. Follow links to retrieve tracks, and find and delete duplicates.  NOTE: track retrieval can take as long as 30 sec


