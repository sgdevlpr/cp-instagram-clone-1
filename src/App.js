import React, { useState, useEffect } from 'react';

import { Button, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'; 
import Modal from '@material-ui/core/Modal'; 
import firebase from 'firebase';
import { db, auth } from './firebase'
// import InstagramEmbed from 'react-instagram-embed';     The InstagramEmbed variable is not used in the code so this line can be removed

import Post from './Post';
import ImageUpload from './ImageUpload';
import './App.css';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);

      } else {
        setUser(null)        
      }
    })

    return () => {
      unsubscribe();
    }

  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id : doc.id,
        post: doc.data(),
      })))
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName : username
        })
      })
      .catch((error) => alert(error.message));

      setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));

    setOpenSignIn(false)
  }

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)} >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
          </center>
          <form className="app__signup">
            
            <Input 
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
              <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
          
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)} >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
          </center>
          <form className="app__signup">
            
            <Input 
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
              <Button type="submit" onClick={signIn}>Sign In </Button>
          </form>
          
        </div>
      </Modal>
        
        <div className="app__header">
          <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />

          {user ?
            <Button onClick={() => auth.signOut()}>Logout</Button> 
          : 
            <div className="app__loginContainer">
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            </div>
          }
        </div>

        <div className="app__posts">
        {
          posts.map(({id, post}) => (
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imgURL={post.imgURL} />
          ))
        }
        </div>

        {user?.displayName ? 
          (<ImageUpload username={user.displayName} />)
        :
          (<h3>Log in to upload.</h3>)  
        }
        
        

        

    </div>
  );
}

export default App;
