import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar.js';
import {SearchResults} from '../SearchResults/SearchResults.js';
import {PlayList} from '../Playlist/PlayList.js';
import {Spotify} from '../../util/Spotify.js';
import ls from 'local-storage';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      searchResults: [],
      playlistName: '',
      playlistTracks: [],
      localFileSearchTerm: '',
      localFileSearchResults: [],
      localFilePlaylistName: '',
      localFilePlaylistTracks: [],
      localFileSave: false
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  async search(term) {
    // Set localFileSearchTerm
    if(this.state.localFileSearchTerm !== term) {
      this.setState({
        localFileSearchTerm: term,
      });
      ls.set('localFileSearchTerm', term);
    };

    // Search
    let searchResults = await Spotify.search(term);
    
    // Set localFileSearchResults
    this.setState({ 
      searchResults: searchResults,
      localFileSearchResults: searchResults
    });
    ls.set('localFileSearchResults', searchResults);
  }

  addTrack(track) {
    let isTrackNew = this.state.playlistTracks.every(addedTrack => {
      return addedTrack.id !== track.id;
    });
    if(isTrackNew) {
      let newPlaylistTracks = this.state.playlistTracks;
      newPlaylistTracks.push(track);
      this.setState({ 
        playlistTracks: newPlaylistTracks,
        localFilePlaylistTracks: newPlaylistTracks
      });
      ls.set('localFilePlaylistTracks', newPlaylistTracks);
    };

    let updateSearchResults = this.state.searchResults.filter((elem) => {
      return elem.id !== track.id;
    });
    this.setState({ 
      searchResults: updateSearchResults,
      localFileSearchResults: updateSearchResults
    });
    ls.set('localFileSearchResults', updateSearchResults);

  }

  removeTrack(track) {
    let trackIndex = this.state.playlistTracks.findIndex(addedTrack => {
      return addedTrack.id === track.id;
    });
    let newPlaylistTracks = this.state.playlistTracks;
    newPlaylistTracks.splice(trackIndex, 1);
    this.setState({ 
      playlistTracks: newPlaylistTracks,
      localFilePlaylistTracks: newPlaylistTracks
    });
    ls.set('localFilePlaylistTracks', newPlaylistTracks);

    let isTrackNew = this.state.searchResults.every(searchTrack => {
      return searchTrack.id !== track.id;
    });
    if(isTrackNew) {
      let updateSearchResults = this.state.searchResults;
      updateSearchResults.push(track);
      this.setState({ 
        searchResults: updateSearchResults,
        localFileSearchResults: updateSearchResults
       });
      ls.set('localFileSearchResults', updateSearchResults);
    };    
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });

    // Set localFilePlaylistName
    this.setState({
      localFilePlaylistName: name,
    });
    ls.set('localFilePlaylistName', name);
  }

  async savePlaylist(playlistName, playlistTracks) {
    // Set localFileSave
    this.setState({
      localFileSave: true
    });
    ls.set('localFileSave', true);

    let trackURIs = [];
    for (const track of playlistTracks) {
      trackURIs.push(track.uri);
    }

    // Save Playlist
    let isplayListSaved = await Spotify.savePlaylist(playlistName, trackURIs);

    if(isplayListSaved) {
      // Reset Data
      this.setState({ 
        searchResults: [],
        playlistName: '',
        playlistTracks: [],
        localFileSearchTerm: '',
        localFileSearchResults: [],
        localFilePlaylistName: '',
        localFilePlaylistTracks: [],
        localFileSave: false
      });
      ls.set('localFileSearchTerm', '');
      ls.set('localFileSearchResults', []);
      ls.set('localFilePlaylistName', '');
      ls.set('localFilePlaylistTracks', []);
      ls.set('localFileSave', false);

      // User message
      document.getElementById('addUserFeedback').innerHTML = 'Saved successfully!';
      document.getElementById('addUserFeedback').style.color = 'green';
      document.getElementById('playListName').value = '';
      window.setTimeout(() =>  document.getElementById('addUserFeedback').innerHTML = '', 3000);
    } else {
        document.getElementById('addUserFeedback').innerHTML = 'Failed to add your Play List :(';
        document.getElementById('addUserFeedback').style.color = 'red';
        document.getElementById('playListName').style.border = '1px solid red';
        window.setTimeout(() =>  {
            document.getElementById('addUserFeedback').innerHTML = '';
            document.getElementById('playListName').style.border = '';
        }, 3000);
    }
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <PlayList playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }

  async componentDidMount() {
    // Restore Playlist Data
    let isPlaylistName = await ls.get('localFilePlaylistName');
    if(!this.state.playlistName && isPlaylistName) {
      this.setState({ playlistName: isPlaylistName });
    };

    let isPlaylistTracks = await ls.get('localFilePlaylistTracks');
    if(!this.state.playlistTracks.length && isPlaylistTracks?.length) {
      this.setState({ playlistTracks: isPlaylistTracks });
    };

    // Restore Search
    let isSearch = await ls.get('localFileSearchTerm');
    if(isSearch) {
      this.search(isSearch);
    };

    
    // Restore SavePlaylist
    let isSavePlaylist = await ls.get('localFileSave');
    if(isSavePlaylist) {
      this.savePlaylist(isPlaylistName, isPlaylistTracks);
    };
  }
}
