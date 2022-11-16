var quizTask = require("../models/quizTask");

exports.addQuestion = (req, res) => {
  const quiz = new quizTask(req.body.data);

  quiz.save((err, user) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
      return;
    } else {
      res.status(200).send({
        message: "Question added successfully",
      });
    }
  });
};
