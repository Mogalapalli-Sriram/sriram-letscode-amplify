import './App.css';
import React, {useEffect, useState} from 'react';
import Amplify , {API , graphqlOperation, Storage} from 'aws-amplify';
import awsconfig from './aws-exports';
import {AmplifySignOut, withAuthenticator} from '@aws-amplify/ui-react';
import {listSongs} from './graphql/queries';
import {updateSong, createSong} from './graphql/mutations';
import {Paper , IconButton, TextField} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import AddIcon from '@material-ui/icons/Add';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PublishIcon from '@material-ui/icons/Publish';
import ReactPlayer from 'react-player';
import { v4 as uuidv4 } from 'uuid';
Amplify.configure(awsconfig);

function App() {

  const [songs, setSongs] = useState([]);
  const [songPlaying, setSongPlaying] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [showAddSong, setShowAddSong] = useState(false);
  useEffect(() => {
    fetchsongs();
    console.log("Hi I am useEffect, which gets executed on loading the web page.")
  }, [])
  const fetchsongs = async () => {
    try {
      const songsData = await API.graphql(graphqlOperation(listSongs));
      console.log(songsData);
      const songsList = songsData.data.listSongs.items;
      console.log('songs list',songsList);
      setSongs(songsList);

    }catch(err) {
      console.log("Error fetching the songs", err);
    }
  }

  const addLike = async (index) => {
    try {
      const song = songs[index];
      song.likes = song.likes+ 1;
      delete song.createdAt;
      delete song.updatedAt;
      const songData = await API.graphql(graphqlOperation(updateSong, {input: song}));
      const songList = [...songs];
      songList[index] = songData.data.updateSong;
      setSongs(songList);
    } catch(err) {
      console.log("error which clicking the song like", err);
    }
  }

  const toggleIcon = async (index) => {

      if(songPlaying === index) {
        setSongPlaying("");
        return;
      }
      const songFilePath = songs[index].filePath;
      try {
       const fileAccessUrl = await Storage.get(songFilePath, {expires: 60});
       console.log("access the url", fileAccessUrl);
       setSongPlaying(index);
       setAudioUrl(fileAccessUrl);
       return;
      } catch(err) {
        console.log("error in getting the song from the path", err);
        setSongPlaying("");
        setAudioUrl("");
      }
     
  }

  return (
    <div className="App">
      <header className="App-header">
        <AmplifySignOut />
        <h1> Hello World Amplify</h1>
      </header>
      <div className="songList">
          {songs.map((song, idx) => {

            return(
              <Paper variant="outlined" elevation= {2} key={`song${idx}`} >
                <div className="songCard">
                <IconButton aria-label="play" onClick={() => toggleIcon(idx)}>
                   {songPlaying === idx ? <PauseIcon /> : <PlayArrowIcon /> }
                </IconButton>
                <div>
                <div className="songTitle">{song.name}</div>
                <div className="songOwner">{song.owner}</div>
                </div>
                <div>
                <IconButton aria-label="like" onClick={() => addLike(idx)}>
                  <FavoriteIcon />
                </IconButton>
                 {song.likes}
                 
                </div>
                <div className="songDescription">{song.description}</div>
                </div>
                {
                  songPlaying === idx ? (
                    <div>
                      <ReactPlayer 
                      url={audioUrl}
                      controls
                      playing
                      height = "50px"
                      onPause = {() => toggleIcon(idx)}
                      />
                    </div>
                  ) : null
                }
                
              </Paper>
            )})

          }
          {
            showAddSong ? (<AddSong 
               onUpload = {() => {
                setShowAddSong(false);
                fetchsongs();
               }} />
              ) : <IconButton onClick={() => setShowAddSong(true)}> <AddIcon /></IconButton>
          }
        </div>
    </div>
  );
}

export default withAuthenticator(App);



const AddSong = ({onUpload}) => {
  const [songData, setSongData] = useState({});
  const [audioMp3, setAudioMp3] = useState();
  const uploadSong = async () => {
    console.log(songData);
    const {name, description,owner} = songData
    const {key} = await Storage.put(`${uuidv4()}.mp3`, audioMp3, {contentType: 'audio/mp3'});
    const createASong = {
      id: uuidv4(),
      name,
      description,
      owner,
      filePath: key,
      likes: 0

    }
   await API.graphql(graphqlOperation(createSong, {input: createASong}));
    onUpload();
    
  }

  return(
    <div>
    <TextField  label = "Name" variant = "outlined" value = {songData.name} onChange = {(e) => setSongData({...songData, name: e.target.value})}/>
    <TextField  label = "Owner" variant = "outlined" value  = {songData.owner} onChange = {(e) => setSongData({...songData, owner: e.target.value})}/>
    <TextField  label = "Description" variant = "outlined" value = {songData.description} onChange = {(e) => setSongData({...songData, description: e.target.value})}/>
    <input type = "file" accept = "audio/mp3" onChange = {(e) => setAudioMp3(e.target.files[0])}/>
    <IconButton onClick={uploadSong}> <PublishIcon /></IconButton>
    </div>
    
  );
}