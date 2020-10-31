import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { database } from "./firebase";
import firebase from "firebase";

function Post({ imageUrl, username, user, caption, postId }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = database
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    database.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setComment("");
  };

  console.log(username);

  const deletePost = (event) => {
    event.preventDefault();

    if (
      (postId && username === user.displayName) ||
      (postId && user.displayName === "keenan9123")
    ) {
      database
        .collection("posts")
        .doc(`${postId}`)
        .delete()
        .then(() => console.log("delete"))
        .catch((err) => console.log(err));
    } else {
      alert("Cannot delete someone else's post!");
    }
  };

  return (
    <div className="post" id={imageUrl}>
      <div className="post__header">
        <Avatar className="post__avatar" src="" alt="Keenan" />
        <h3>{username}</h3>
      </div>

      <img alt="post" className="post__image" src={imageUrl} />
      <h4 className="post__text">
        <strong>{username}: </strong>
        {caption}
      </h4>
      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}:</strong> {comment.text}
          </p>
        ))}
      </div>
      {user ? (
        <form className="post__CommentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
          <button onClick={deletePost} className="post__delete">
            Delete
          </button>
        </form>
      ) : (
        <form className="post__CommentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Sign in to comment.."
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <button
            className="post__button"
            disabled
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
