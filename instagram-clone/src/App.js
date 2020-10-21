import { Button, Input, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./App.css";
import { database } from "./firebase";
import Post from "./Post";
import Modal from "@material-ui/core/Modal";
import { auth } from "./firebase";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";

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
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // if user is logged in
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          // don't update username
        } else {
          // if we just created one
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        // user has logged out
        setUser(null);
      }
    });

    return () => {
      // peform some clean up fucntions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    database
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapShot) => {
        setPosts(
          snapShot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo.png"
                alt="logo"
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo.png"
                alt="logo"
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo.png"
          alt="logo"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/zlFNCHiZ5v/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
