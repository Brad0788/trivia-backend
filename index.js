const fetch = require("node-fetch");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

const port = process.env.PORT || 8080;

var all_questions = 0;

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

function decode(str) {
  let txt = new DOMParser().parseFromString(str, "text/html");

  return txt.documentElement.textContent;
}

var combinedAnswers = 0;

function joinAnswers() {
  all_questions.forEach((element) => {
    const merged = element.incorrect_answers.concat(element.correct_answer);
    const mergedSorted = shuffle(merged);
    element["all_answers"] = mergedSorted;
  });
}
fetch("https://opentdb.com/api.php?amount=5")
  .then((response) => response.json())
  .then((body) => {
    all_questions = body["results"];
    joinAnswers();
  });

app.get("/", (req, res) => {
  res.send("Hello from Space!");
});

app.get("/refresh-questions", (req, res) => {
  fetch("https://opentdb.com/api.php?amount=5")
    .then((response) => response.json())
    .then((body) => {
      all_questions = body["results"];
      joinAnswers();
    });
  res.json(all_questions);
});

app.get("/api-questions", (req, res) => {
  res.json(all_questions);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
