import React from "react";
import './SearchBar.css';

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            term: '',
            searchBarTerm: ''
        };
        this.search =  this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    search() {
        this.setState({term: this.props.onSearch(this.state.searchBarTerm)});
    }
    
    handleTermChange(event) {
        this.setState({searchBarTerm: event.target.value});
    }

    handleKeyDown(event) {
        if(event.key === 'Enter') {
            this.search();
        };
    }

    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyDown={this.handleKeyDown} />
                <button className="SearchButton" onClick={this.search} >SEARCH</button>
            </div>
        );
    }
}