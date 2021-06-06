import React, { useEffect, useState } from 'react';
import './App.css';
import Amplify, { API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import {AmplifySignOut, withAuthenticator } from "@aws-amplify/ui-react";
import { listSongs } from './graphql/queries';

Amplify.configure(awsconfig);

type getSongsQuery = {
  listSongs: {
    items: {[key: string]: any}[];
  }
}

function App() { 

  const [songList, setSongList] = useState< {[key: string]: any}[]>([]);

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
        <header className="app-header">
          <AmplifySignOut />
          <h2>My App Conent!</h2>
        </header>
    </div>
  );
}

export default App;
