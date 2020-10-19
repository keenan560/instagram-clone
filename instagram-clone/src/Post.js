import React from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";

function Post({ imageUrl, username, caption }) {
  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" src="" alt="Keenan" />
        <h3>{username}</h3>
      </div>
      <img alt="post" className="post__image" src={imageUrl} />
      <h4 className="post__text">
        <strong>{username}: </strong>
        {caption}
      </h4>
    </div>
  );
}

export default Post;
