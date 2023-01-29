import React from "react";
import './PlayList.css';
import {TrackList} from '../TrackList/TrackList.js';

export class PlayList extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
    } 

    handleNameChange(event) {
        this.props.onNameChange(event.target.value);
    }

    async handleOnClick() {
        let playListSaved = await this.props.onSave();
        if(playListSaved) {
            document.getElementById('addUserFeedback').innerHTML = 'Saved successfully!';
            document.getElementById('addUserFeedback').style.color = 'green';
            document.getElementById('playListName').value = '';
            window.setTimeout(() =>  document.getElementById('addUserFeedback').innerHTML = '', 3000);
        } else {
            document.getElementById('addUserFeedback').innerHTML = 'Failed to add your Play List :(';
            document.getElementById('addUserFeedback').style.color = 'red';
            window.setTimeout(() =>  document.getElementById('addUserFeedback').innerHTML = '', 3000);
        }
    }

    render() {
        return (
            <div className="Playlist">
                <p id='addUserFeedback'></p>
                <input id='playListName' placeholder="New Playlist" onChange={this.handleNameChange} />
                <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true}/>
                <button className="Playlist-save" onClick={this.handleOnClick}>SAVE TO SPOTIFY</button>
            </div>
        );
    }
}