const express = require("express");
const post = express.Router();
const helper = require("../data/db.js");

post.post("/", (req, res) => {
  const content = req.body;
  if (!content.title || !content.contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }

  helper
    .insert(content)
    .then((r) => {
      if (r) {
        return res.status(201).json({ ...r, ...content });
      }
    })
    .catch(() => {
      return res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    });
});

post.post("/:id/comments", (req, res) => {
  const content = req.body;
  const id = content.post_id;

  if (!content.text) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }
  helper
    .findById(id)
    .then((r) => {
      console.log(r);
      if (!r.length) {
        return res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
      res.status(201).json({ ...content });
    })
    .catch(() => {
      return res.status(500).json({
        error: "There was an error while saving the comment to the database",
      });
    });
});

module.exports = post;
