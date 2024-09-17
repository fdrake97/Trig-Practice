const sinArray_ = [
  ['0°', '0', '0'],
  ['30°', 'π/6', '1/2'],
  ['45°', 'π/4', 'r2/2'],
  ['60°', 'π/3', 'r3/2'],
  ['90°', 'π/2', '1'],
  ['120°', '2π/3', 'r3/2'],
  ['135°', '3π/4', 'r2/2'],
  ['150°', '5π/6', '1/2'],
  ['180°', 'π', '0'],
  ['210°', '7π/6', '-1/2'],
  ['225°', '5π/4', '-r2/2'],
  ['240°', '4π/3', '-r3/2'],
  ['270°', '3π/2', '-1'],
  ['300°', '5π/3', '-r3/2'],
  ['315°', '7π/4', '-r2/2'],
  ['330°', '11π/6', '-1/2'],
  ['360°', '2π', 'NAN']
];
const penalty_ = 10000;
var startTime_ = time();
var questionTime_ = 0;
var pauseTime_ = 0;
var passedTime_ = 0;
var correctAnswer_;
var times_ = "";
var question_ = "An error has occurred";
var answer_ = 0;
var answered_ = 0;
var score_ = 0;
var streak_ = 0;
let questionNum_;
let questionType_;

function toggleSettings() {
  var x = document.getElementById("settings");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
};

function pause() {
  document.getElementById("app").style.display = "none";
  document.getElementById("pause").style.display = "block";
  pauseTime = time();
};

function unpause() {
  document.getElementById("app").style.display = "block";
  document.getElementById("pause").style.display = "none";
  startTime += ((time() - pauseTime_) - penalty_);
  questionTime += ((time() - pauseTime_) - penalty_);

};

function checkAnswer() {
  answer = (document.getElementById("answer").value.toLowerCase().trim());
  if (!isAnswerOption(answer_)) { notAnAnswerOption(); return; }
  answered_++;
  passedTime_ = time() - questionTime_;
  if (answer_ == correctAnswer_) { isCorrectAnswer(); }
  else { incorrectAnswer(); }

  console.log(answer_);
  console.log(correctAnswer_);
  newQuestion();
};

function isAnswerOption(answer_) {
  for (x = 0; x < 16; x++) {
    if (sinArray_[x][2] == answer_) { return true; }
  }
  return false;
}

function isCorrectAnswer() {
  streak_++;
  score_ = (score_ * 0.95 + 100000 / passedTime_ * (1 + (streak_ / 10)));
  logTime(passedTime_);
  document.getElementById("result").innerText = "Correct! Well done!";
};

function incorrectAnswer() {
  streak_ = 0;
  score_ = score_ * 0.95;
  logTime(-passedTime_);
  document.getElementById("result").innerText = "Incorrect. Please try again."
};

function notAnAnswerOption() {
  document.getElementById("result").innerText = "Please enter a valid answer option.";
};

function newQuestion() {
  generateQuestion();
  document.getElementById('question').innerText = question_;
  updateStats();
};

function generateQuestion() {
  var questionNum_ = random(getCookie("full_circle") == "0" ? 9 : 17);
  questionType_ = getCookie('type') == 'deg' ? 0 : getCookie('type') == 'rad' ? 1 : random(2);
  var trigVar_ = random(2);
  question_ = (trigVar_ == 0 ? "sin " : "cos ") + sinArray_[questionNum_][questionType_];
  correctAnswer_ = sinArray_[(questionNum_ + trigVar_ * 4) % 16][2];
  clearImage();
  if (getCookie("image") != "0") {
    addImage(
      (getCookie("fullCircle") == "1" ? 1 : 0) * 0b100 +
      questionType_ * 0b010 +
      (getCookie("coords") == "1" ? 1 : 0)) * 0b001;
  }
  questionTime_ = time();
};

function addImage(mask_) {
  var maskStr_ = "";
  for (i = 0; i < 3; i++) {
    maskStr_ += (mask_ % 2 == 0) ? "0" : "1";
    mask_ = mask_ >> 1;
  }
  console.log(maskStr_);
  document.getElementById("0b"+maskStr_).style.display = "block";
}

function clearImage() {
  document.getElementById("0b101").style.display = "none";
  document.getElementById("0b100").style.display = "none";
  document.getElementById("0b111").style.display = "none";
  document.getElementById("0b110").style.display = "none";
  document.getElementById("0b001").style.display = "none";
  document.getElementById("0b000").style.display = "none";
  document.getElementById("0b011").style.display = "none";
  document.getElementById("0b010").style.display = "none";
}

function updateStats() {
  if (getCookie("highscore") == "") { setCookie("highscore", "0"); }
  document.getElementById("highscore").innerText = Math.trunc(parseInt(getCookie("highscore")));
  document.getElementById("score").innerText = Math.trunc(score_);
  document.getElementById("avgTime").innerText = ((time() - startTime_) / 1000) / answered_;
  document.getElementById("highscore1").innerText = Math.trunc(parseInt(getCookie("highscore")));
  document.getElementById("score1").innerText = Math.trunc(score_);
  document.getElementById("avgTime1").innerText = ((time() - startTime_) / 1000) / answered_;
  console.log((time() - startTime_) / 1000);
}

function random(number_) {
  return Math.floor(Math.random() * number_);
};

function logTime(input_) {
  console.log("logging " + input_);
  times_ += (input_ + " ");
  console.log(parseInt(getCookie("highscore")));
  if (score_ > parseInt(getCookie("highscore"))) {
    setCookie("highscore", score_);
    setCookie("bestGame", times_);
    console.log("logged " + times_);
  }
};

function time() {
  return new Date().getTime();
};

function setCookie(cookieName_, cookieValue_) {
  const d = new Date();
  d.setTime(d.getTime() + (10 * 24 * 60 * 60 * 1000));
  let expires_ = "expires=" + d.toUTCString();
  let cookie_ = cookieName_ + "=" + cookieValue_ + ";" + expires_ + ";path=/";
  console.log("Cookie set to: " + cookie_)
  document.cookie = cookie_;
};

function getCookie(cookieName_) {
  let name_ = cookieName_ + "=";
  let decodedCookie_ = decodeURIComponent(document.cookie);
  let cookieArray_ = decodedCookie_.split(';');
  console.log(cookieArray_);
  for (let i = 0; i < cookieArray_.length; i++) {
    let cookieElement_ = cookieArray_[i];
    while (cookieElement_.charAt(0) == ' ') {
      cookieElement_ = cookieElement_.substring(1);
    }
    if (cookieElement_.indexOf(name_) == 0) {
      return cookieElement_.substring(name_.length);
    }
  }
  console.log("Failed to find cookie " + cookieName_);
  return "";
};