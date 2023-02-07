# Playlist App With the Spotify API

### Introduction

This is a React web application. It allows users to search the Spotify library, create a custom playlist, then save it to the Spotify account.


Contents
========

 * [Why?](#why)
 * [How To Use?](#how-to-use)
 * [Technologies](#technologies)
 * [Project upgrades](#project-upgrades)
 * [Project status](#project-status)

 
 ## Why?
 
 I wanted to practice my knowledge of React components, passing state, and requests with the Spotify API to build a website. I also want to create features that make easy to create playlists. All upgrades and challenges are a plus in the original project.
 
 ## How To Use?
 
 Click the link, and you’ll be directed to the deployed site:
  https://playlist-spotify-api.netlify.app/

## Technologies

* HTML
* CSS
* JavaScript
* React

## Project upgrades

* In the search results, only the songs that are not currently present in the playlist in the search results are displayed
* Songs removed from the playlist are returned to the search results list
* After user redirection on login, the search results, the playlist name and the playlist from before the redirection is restored
* Playlist and search informations don’t get cleared if a user has to refresh their access token or the page
* If the user needs refresh their access token on save, the playlist will be automatically saved after redirection on login

## Project status

The project is still being developed. Next challenges:

* Include more than one track per artist at a time


