import React, { useEffect, useState } from 'react';
import './App.css';
import Amplify, { API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import {AmplifySignOut, withAuthenticator } from "@aws-amplify/ui-react";
import { listSongs } from './graphql/queries';
import { IconButton, Paper } from '@material-ui/core';
import { FavoriteOutlined, PlayArrow } from '@material-ui/icons';

Amplify.configure(awsconfig);

type getSongsQuery = {
  listSongs: {
    items: {[key: string]: any}[];
  }
};

function App() { 

  const [songList, setSongList] = useState< {[key: string]: any}[]>([]);
  console.log(songList)
  const fetchSongs = async () => {
    try {
      const songData = (await API.graphql(graphqlOperation(listSongs))) as {
        data: getSongsQuery
      }
      const totalSongList = songData.data.listSongs.items
      setSongList(totalSongList);
    } catch (error) {
      console.log("Error pulling data: ", error)
    }

  }

  useEffect(() => {
    fetchSongs();
  }, [])

  return (
    <div className="App">
        <header className="App-header">
          <AmplifySignOut />
          <h2>My App Conent!</h2>
        </header>
        <div className="songList">
          {songList.map(song => {
            return (
              <Paper variant="outlined" elevation={2} >
                <div className="songCard">
                  <IconButton aria-label="play">
                    <PlayArrow/>
                  </IconButton>
                </div>
              <div>
                <div className="songTitle">
                  {song.name}
                </div>
                <div className="songOwner">
                  {song.owner}
                </div>
                <div>
                  <IconButton aria-label="like">
                    <FavoriteOutlined />
                    &nbsp; {song.like}
                  </IconButton>
                </div>
                <div>
                  <div className="songDescription">
                    {song.description} 
                  </div>
                </div>
              </div>
              </Paper>
            )
          })}
        </div>
    </div>
  );
}

export default App;
