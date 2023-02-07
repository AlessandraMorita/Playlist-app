import React from "react";
import './PlayList.css';
import {TrackList} from '../TrackList/TrackList.js';
import ls from 'local-storage';

export class PlayList extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
    } 

    handleNameChange(event) {
        this.props.onNameChange(event.target.value);
    }

    handleOnClick() {
        this.props.onSave(this.props.playlistName, this.props.playlistTracks);
    }

   async componentDidMount() {
        let isPlaylistName = await ls.get('localFilePlaylistName');
        let isSavePlaylist = await ls.get('localFileSave');
        if(isPlaylistName && !isSavePlaylist) {
            document.getElementById('playListName').defaultValue = isPlaylistName;
        };
    }

    render() {
        return (
            <div className="Playlist">
                <p id='addUserFeedback'></p>
                <input id='playListName' placeholder="New Playlist Name" onChange={this.handleNameChange} />
                <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true}/>
                <button className="Playlist-save" onClick={this.handleOnClick}>SAVE TO SPOTIFY</button>
            </div>
        );
    }
}