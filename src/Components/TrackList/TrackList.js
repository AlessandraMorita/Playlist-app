import React from "react";
import './TrackList.css';
import {Track} from '../Track/Track.js';

export class TrackList extends React.Component {
    render() {
        return (
            <div className="TrackList">
                {
                    this.props.tracks.map(elem => {
                        return <Track track={elem} key={elem.id} onAdd={this.props.onAdd} isRemoval={this.props.isRemoval} onRemove={this.props.onRemove} />;
                    })
                }
            </div>
        );
    }
}