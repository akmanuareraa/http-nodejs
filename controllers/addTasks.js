var quizTask = require("../models/quizTask");

exports.addQuestion = async (req, res) => {
  const quiz = new quizTask(req.body);

  console.log("/addquestion API called")

  quizTask.findOneAndUpdate(
    { doc_id: req.body.doc_id },
    { questions: req.body.questions },
    (err, doc) => {
      if (err) {
        res.status(500).send({
          message: err,
        });
        console.log("Error occured while uploading: ", err);
        return;
      } else {
        console.log("Successfully uploaded the file")
        res.status(200).send({
          message: "Question Added successfully",
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
