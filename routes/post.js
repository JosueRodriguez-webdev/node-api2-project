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

post.get("/", (req, res) => {
  helper
    .find()
    .then((r) => res.status(200).json(r))
    .catch((e) =>
      res
        .status(500)
        .json({ message: "The post with the specified ID does not exist." })
    );
});

post.get("/:id", (req, res) => {
  const ID = req.params.id;

  helper
    .findById(ID)
    .then((r) => {
      if (r.length < 1) {
        return res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
      res.status(200).json(r);
    })
    .catch((e) =>
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." })
    );
});

post.get("/:id/comments", (req, res) => {
  const ID = req.params.id;

  helper
    .findCommentById(ID)
    .then((r) => {
      if (r.length < 1) {
        return res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
      res.status(200).json(r);
    })
    .catch((e) => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

post.delete("/:id", (req, res) => {
  const ID = req.params.id;

  helper
    .remove(ID)
    .then((r) => {
      if (!r) {
        return res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
      res.status(200).json(r);
    })
    .catch((e) => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

post.put("/:id", (req, res) => {
  const content = req.body;
  const ID = req.params.id;

  if (!content.title || !content.contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }

  helper
    .update(ID, content)
    .then((r) => {
      if (!r) {
        return res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
      res.status(200).json(r);
    })
    .catch((e) => {
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

module.exports = post;
