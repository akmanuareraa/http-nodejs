const quizTask = require("../models/quizTask");

exports.getTasks = (req, res) => {
  quizTask.find().exec((err, tasks) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
      return;
    }

    res.status(200).send({
      status: 200,
      data: tasks,
    });
  });
};
