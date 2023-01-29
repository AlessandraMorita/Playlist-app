import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar.js';
import {SearchResults} from '../SearchResults/SearchResults.js';
import {PlayList} from '../Playlist/PlayList.js';
import {Spotify} from '../../util/Spotify.js';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      searchResults: [],
      playlistName: 'First Playlist',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let hasSameId = this.state.playlistTracks.find(savedTrack => {
      return savedTrack.id === track.id;
    });
    if (!hasSameId) {
      let newPlaylistTracks = this.state.playlistTracks;
      newPlaylistTracks.push(track);
      this.setState({ playlistTracks: newPlaylistTracks });
    }
  }

  removeTrack(track) {
    let trackIndex = this.state.playlistTracks.findIndex(savedTrack => {
      return savedTrack.id === track.id;
    });
    let newPlaylistTracks = this.state.playlistTracks;
    newPlaylistTracks.splice(trackIndex, 1);
    this.setState({ playlistTracks: newPlaylistTracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  async savePlaylist() {
    let trackURIs = [];
    for (const track of this.state.playlistTracks) {
      trackURIs.push(track.uri);
    }
    let playListSaved = await Spotify.savePlaylist(this.state.playlistName, trackURIs);
    if (playListSaved) {
      this.setState({ playlistName: '' });
      this.setState({ playlistTracks: [] });
    }
    return playListSaved;
  }

  async search(term) {
    let searchResults = await Spotify.search(term);
    this.setState({ searchResults: searchResults});
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
}
