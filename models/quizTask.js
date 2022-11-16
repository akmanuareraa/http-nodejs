var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

/**
 * Quiz Task Schema
 */

var answerSchema = new Schema({
  type: {
    type: String,
    enum: ["text", "image", "audio", "video"],
    required: [true, "Type of the answer not provided"],
  },
  data: {
    type: String,
    required: [true, "Text is not provided for the answer"],
  },
  isCorrect: {
    type: Boolean,
    required: [true, "Please specify if the answer is correct or not"],
  },
});

var questionSchema = new Schema({
  question: {
    type: {
      type: String,
      enum: ["image", "audio", "video"],
      required: [true, "Type of the question not provided"],
    },
    data: {
      type: String,
      required: [true, "Data Source not provided"],
    },
    text: {
      type: String,
      required: [true, "Question text not provided"],
    },
    choices: {
      type: String,
      enum: ["checkbox", "radio"],
      required: [true, "Choices type not provided"],
    },
  },
  answers: {
    type: [answerSchema],
    default: undefined,
    required: [true, "Answer type not provided"],
  },
});

var quizTaskSchema = new Schema(
  {
    doc_id: { type: Number, required: [true, "Document ID not provided"] },
    questions: {
      type: [questionSchema],
      default: undefined,
      required: [true, "Please specify the questions"],
    },
  },
  {
    collection: "quiz-task",
  }
);

module.exports = mongoose.model("quizTask", quizTaskSchema);
