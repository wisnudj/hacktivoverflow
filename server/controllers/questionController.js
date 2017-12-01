const Question = require('../models/question')
const Answer = require('../models/answer');

class QuestionController {


  static create(req, res) {

    Question
            .create({
              title: req.body.title,
              content: req.body.content,
              author: req.header.decoded._id,
            })
            .then((question) => {
              res.status(201).send(question)
            })
            .catch((err) => {
              res.status(400).send(err)
            })

  }

  static read(req, res) {

    Question
            .find()
            .then((question) => {
              res.status(201).send(question)
            })
            .catch((err) => {
              res.status(400).send(err)
            })

  }

  static delete(req, res) {

    Question
            .findOne({_id: req.params.id})
            .then((hasilquestion) => {
              if(!hasilquestion) {
                res.status(404).send({})
              }
              else {
                Question
                        .deleteOne({_id: req.params.id})
                        .then((response) => {

                          Answer
                                .remove({question: hasilquestion._id})
                                .then((answerresponse) => {
                                  res.status(200).send(hasilquestion)
                                })
                                .catch((err) => {
                                  res.status(200).send(err)
                                })
                        })
                        .catch((err) => {
                          console.log(err);
                        })
              }
            })
            .catch((err) => {
              res.status(400).send(err)
            })

  }

  static update(req, res) {

    Question
            .findOne({_id: req.params.id})
            .then((hasilquestion) => {
              if(!hasilquestion) {
                res.status(404).send({})
              }
              else {
                Question
                        .updateOne({
                          _id: req.params.id
                        }, {
                          title: req.body.title,
                          content: req.body.content
                        })
                        .then((response) => {
                          res.status(200).send(response)
                        })
                        .catch((err) => {
                          res.status(400).send(err)
                        })
              }
            })
            .catch((err) => {
              res.status(400).send(err)
            })

  }

  static vote(req, res) {

    Question
            .findOne({_id: req.params.id})
            .then((hasilquestion) => {
              if(!hasilquestion) {
                res.status(404).send({})
              }
              else {

                if(hasilquestion.voters.indexOf(req.header.decoded._id) == -1) {
                  hasilquestion.voters.push(req.header.decoded._id)
                  hasilquestion.save(function(err) {
                    if(err) {
                      res.status(400).send(err)
                    }
                    else {
                      res.status(200).send(hasilquestion)
                    }
                  })
                }
                else {
                  res.status(400).send({
                    error: "User has vote this question"
                  })
                }
              }
            })
            .catch((err) => {
              res.status(404).send(err)
            })

  }

  static unvote(req, res) {

    Question
            .findOne({_id: req.params.id})
            .then((hasilquestion) => {
              if(!hasilquestion) {
                res.status(404).send({})
              }
              else {

                console.log(hasilquestion);

                if(hasilquestion.voters.indexOf(req.header.decoded._id) != -1) {
                  Question
                  .updateOne({_id: req.params.id}, {$pull: {voters: req.header.decoded._id}})
                  .then((response) => {
                    res.status(200).send(hasilquestion)
                  })
                  .catch((err) => {
                    res.status(404).send(err)
                  })
                }
                else {
                  res.status(400).send({
                    error: "This user never vote on this question"
                  })
                }

              }
            })
            .catch((err) => {
              res.status(404).send(err)
            })
  }

  static readOne(req, res) {

    Question.findOne({_id: req.params.id}).populate('author').exec((err, user) => {
      delete user.password
      res.send(user)
    })

  }

}

module.exports = QuestionController;
