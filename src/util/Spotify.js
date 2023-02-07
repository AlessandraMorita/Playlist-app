const clientId = '77cb974381b54455862c9dc7d5293809';
const redirectUri = 'http://localhost:3000/';
const scope = 'playlist-modify-public playlist-modify-private';
let accessToken;
let expiresIn;
let userID;
let playlistID;
let saved;

export const Spotify = {
    getAccessToken() {
        if(accessToken) {
            return accessToken;
        } else {
            let urlToCheck = window.location.href;
            let searchAccessToken = urlToCheck.match(/access_token=([^&]*)/);
            let searchExpiresData = urlToCheck.match(/expires_in=([^&]*)/);

            if(searchAccessToken) {
                accessToken = searchAccessToken[1];
            } else {
                let url = 'https://accounts.spotify.com/authorize';
                url += '?response_type=token';
                url += '&client_id=' + encodeURIComponent(clientId);
                url += '&scope=' + encodeURIComponent(scope);
                url += '&redirect_uri=' + encodeURIComponent(redirectUri);

                window.location.assign(url);
            }

            if(searchExpiresData) {
                expiresIn = searchExpiresData[1];
            }
            
            window.setTimeout(() => accessToken = '', expiresIn );
            window.history.pushState('Access Token', null, '/');

        }
    },

    async search(term) {
        Spotify.getAccessToken();
        let url = `https://api.spotify.com/v1/search?q=${term}&type=track,album,artist`;
          
        let searchTracksList = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error ('Search request failed!');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
            let searchTracks = jsonResponse.tracks.items.map(track => {
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                };
            });
            return searchTracks;
        });
        return searchTracksList; 
    },

    async savePlaylist(playlistName, uriList) {
        Spotify.getAccessToken();
        if(!playlistName || !uriList?.length) {
            saved = false;
            return;
        } else {

            // get user's ID
            await fetch('https://api.spotify.com/v1/me', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if(response.ok) {
                    return response.json();
                }
                throw new Error ('Request to get users ID failed!');
            }, networkError => console.log(networkError.message)).then(jsonResponse => {
                userID = jsonResponse.id;
            });
            
            // Request that creates a new playlist
            await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: playlistName,
                    description: "New playlist description",
                    public: false
                })
            }).then(response => {
                if(response.ok) {
                    return response.json();
                }
                throw new Error ('Request that creates a new playlist failed!');
            }, networkError => console.log(networkError.message)).then(jsonResponse => {
                playlistID = jsonResponse.id;
            });

            // Request that adds tracks to a playlist
            await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uris: uriList,
                    position: 0
                  })
            }).then(response => {
                if(response.ok) {
                    saved = true;
                    return;
                }
                throw new Error ('Request that adds tracks failed!');
            }, networkError => console.log(networkError.message));

            return saved;
        }
    }
}