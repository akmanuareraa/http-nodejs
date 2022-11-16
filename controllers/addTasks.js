var quizTask = require("../models/quizTask");

exports.addQuestion = async (req, res) => {
  const quiz = new quizTask(req.body);

//   console.log("AQ: ", req.body, parseInt(req.body.doc_id) === 1);

  quizTask.findOneAndUpdate(
    { doc_id: req.body.doc_id },
    { questions: req.body.questions },
    (err, doc) => {
      if (err) {
        res.status(500).send({
          message: err,
        });
        return;
      } else {
        res.status(200).send({
          message: "Question Added successfully",
          det: doc,
        });
      }
    }
  );

  // quiz.save((err, user) => {
  //   if (err) {
  //     res.status(500).send({
  //       message: err,
  //     });
  //     return;
  //   } else {
  //     res.status(200).send({
  //       message: "Question added successfully",
  //     });
  //   }
  // });
};
