import React, { useEffect, useState } from 'react';
import './App.css';
import Amplify, { API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import {AmplifySignOut, withAuthenticator } from "@aws-amplify/ui-react";
import { listSongs } from './graphql/queries';
import { updateSong } from './graphql/mutations';
import { IconButton, Paper } from '@material-ui/core';
import { FavoriteOutlined, PlayArrow } from '@material-ui/icons';

Amplify.configure(awsconfig);

type getSongsQuery = {
  listSongs: {
    items: {[key: string]: any}[];
  }
};

type updateSongQuery = {
  updateSong: {[key: string]: any},
}

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

  };

  useEffect(() => {
    fetchSongs();
  }, []);
  
  const addLike = async (index: number) => {
    
    try {
      const song = songList[index];
      song.like = song.like+1;
      delete song.createdAt;
      delete song.updatedAt;
      const songData = await API.graphql(graphqlOperation(updateSong, {input: song})) as {
        data: updateSongQuery
      };
      const songsList = [...songList];
      songsList[index] = songData.data.updateSong;
      setSongList(songsList)

    } catch (error) {
      console.log("Error on adding like to song: ", error)
    }
  }

  return (
    <div className="App">
        <header className="App-header">
          <AmplifySignOut />
          <h2>My App Conent!</h2>
        </header>
        <div className="songList">
          {songList.map((song, index) => {
            return (
              <Paper variant="outlined" elevation={2} >
                <div className="songCard">
                  <IconButton aria-label="play">
                    <PlayArrow/>
                  </IconButton>
                  {/* <div> */}
                    <div className="songTitle">
                      {song.name}
                    </div>
                    <div className="songOwner">
                      {song.owner}
                    </div>
                    <div>
                      <IconButton onClick={() => addLike(index)} aria-label="like">
                        <FavoriteOutlined />
                        &nbsp; {song.like}
                      </IconButton>
                    </div>
                    <div>
                      <div className="songDescription">
                        {song.description} 
                      </div>
                    </div>
                  {/* </div> */}
                </div>
              </Paper>
            )
          })}
        </div>
    </div>
  );
}

export default App;
