const express = require("express");
const router = express.Router();
const Posts = require("../data/db");

router.post("/", (req, res) => {
  Posts.insert(req.body)
    .then((response) => {
      if (!req.body.title || !req.body.contents) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post."
        });
      } else if (req.body.title && req.body.contents) {
        res.status(201).json({ ...response, ...req.body });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      });
    });
});

router.post("/:id/comments", (req, res) => {
  Posts.insertComment(req.body)
    .then(() => {
      if (!req.body.post_id) {
        res.status(404).json({
          errorMessage: "Please provide title and contents for the post."
        });
      } else if (!req.body.text) {
        res
          .status(400)
          .json({ errorMessage: "Please provide text for the comment." });
      } else if (req.body.text && req.body.post_id) {
        res.status(201).json(req.body);
      }
    })
    .catch(() => {
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      });
    });
});

router.get("/", (req, res) => {
  Posts.find()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((response) => {
      if (response.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (response) {
        res.status(200).json(response);
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  Posts.findPostComments(req.params.id)
    .then((response) => {
      if (response.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (response) {
        res.status(200).json(response);
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});
router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id)
    .then((response) => {
      if (response === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (response >= 1) {
        res.status(200).json({ message: "Post was deleted." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  console.log(req.params.id);
  Posts.update(req.params.id, req.body)
    .then((response) => {
      if (response === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (!req.body.title || !req.body.contents) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post."
        });
      } else if (req.body.title && req.body.contents) {
        res.status(200).json({ ...req.body, id: req.params.id });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

module.exports = router;
