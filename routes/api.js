/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const Books = require("../models/Books");
const ObjectId = require("mongoose").Types.ObjectId;

//https://www.geeksforgeeks.org/how-to-check-if-a-string-is-valid-mongodb-objectid-in-node-js/
function isValidObjectId(id) {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
}

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await Books.find();
        res.json(books);
      } catch (err) {
        console.log(err.message);
        res.json("server error");
      }
    })

    .post(async function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) return res.json("missing required field title");

      try {
        const book = new Books({
          title,
        });
        await book.save();
        res.json(book);
      } catch (err) {
        console.log(err.message);
        res.json("server error");
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      try {
        Books.deleteMany({}, (err) => {
          if (err) console.log(err);
          res.json("complete delete successful");
        });
      } catch (err) {
        console.log(err.message);
        res.json("server error");
      }
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if (!bookid) return res.json("missing required field _id");
      try {
        const book = await Books.findById(bookid);
        if (!book) return res.json("no book exists");
        const { _id, title, comments } = book;
        res.json({ _id, title, comments });
      } catch (err) {
        console.log(err.message);
        res.json("server error");
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!bookid) return res.json("missing required field _id");
      if (!comment) return res.json("missing required field comment");
      //json res format same as .get
      if (!isValidObjectId(bookid)) return res.json("no book exists");
      try {
        const book = await Books.findByIdAndUpdate(
          bookid,
          {
            $push: { comments: comment },
          },
          { new: true }
        );
        if (!book) return res.json("no book exists");
        await book.save();
        const { _id, title, comments } = book;
        res.json({ _id, title, comments });
      } catch (err) {
        console.log(err.message);
        res.json("server error");
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        const book = await Books.findByIdAndDelete(bookid);
        if (!book) return res.json("no book exists");
        res.json("delete successful");
      } catch (err) {
        console.log(err.message);
        res.json("server error");
      }
    });
};
