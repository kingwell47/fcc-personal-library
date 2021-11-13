const mongoose = require("mongoose");

const opts = { toJSON: { virtuals: true } };

const booksSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    comments: [String],
  },
  opts
);

booksSchema.virtual("commentcount").get(function () {
  return this.comments.length;
});

module.exports = mongoose.model("Books", booksSchema);
