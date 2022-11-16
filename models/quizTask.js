var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

/**
 * Quiz Task Schema
 */

var quizTaskSchema = new Schema(
  {
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
      answers: [
        {
          "type": {
            type: String,
            enum: ["text", "image", "audio", "video"],
            required: [true, "Type of the answer not provided"],
          },
          "data": {
            type: String,
            required: [true, "Text is not provided for the answer"],
          },
          "isCorrect": {
            type: Boolean,
          },
        },
      ],
    },
  },
  {
    collection: "quiz-task",
  }
);

module.exports = mongoose.model("quizTask", quizTaskSchema);
