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
var viewSettings_ = false;
var viewLeaderboard_ = false;
let questionNum_;
let questionType_;

function cookieDialog() {
  if (getCookie("acceptCookies") != "true") {
    alert("This game requires cookies. Click ok to accept.");
    setCookie("acceptCookies", "true");
  }
}

function toggleSettings() {
  var x = document.getElementById("settings");
  viewSettings_ = !viewSettings_;
  if (viewSettings_) {
    x.style.transform = "translate3d(0,0,0)";
  } else {
    x.style.transform = "translate3d(350px,0,0)";
  }
};

function toggleLeaderboard() {
  var x = document.getElementById("leaderboard");
  viewLeaderboard_ = !viewLeaderboard_;
  if (viewLeaderboard_) {
    x.style.transform = "translate3d(0,0,0)";
  } else {
    x.style.transform = "translate3d(-500px,0,0)";
  }
};

function refreshLeaderboard() {
  if (!viewLeaderboard_) {
    document.getElementById("leaderboard").innerHTML = '<iframe style="width: 450px; height: 470px;"src="https://docs.google.com/spreadsheets/d/e/2PACX-1vRGaBPGLDT_jlGHDBRO7ijJ73KAwVwzQ2W38gxpBb4oKwvpUyw-nXN2K1EMM847G8ioyZ2jHirQgffQ/pubhtml?gid=2147011939&amp;single=true&amp;widget=true&amp;headers=false"></iframe>';
  }
}

function pause() {
  document.getElementById("app").style.display = "none";
  document.getElementById("pause").style.display = "block";
  pauseTime = time();
};

function unpause() {
  document.getElementById("app").style.display = "block";
  document.getElementById("pause").style.display = "none";
  startTime_ += ((time() - pauseTime_) - penalty_);
  questionTime_ += ((time() - pauseTime_) - penalty_);
};

//usp=pp_url&entry.221510820=Name&entry.533647486=Format&entry.951457233=Result

function submitScore() {
  if (getCookie("submitted") != "True") {
    let id = "1FAIpQLSe5enqs4AS0p_S3E4bpqSIa1d5FH4WKwk3VBMYWlv9m7XTLXQ";

    $.ajax({
      url: "https://docs.google.com/forms/d/e/" + id + "/formResponse",
      data: {
        "entry.221510820": getCookie("name"),
        "entry.533647486": (getCookie("radDeg") + " " + (getCookie("image") == "0" ? "noimage" : (getCookie("coords") == "0" ? "blank" : "coords"))),
        "entry.951457233": getCookie("bestGame")
      },
      type: "POST",
      dataType: "json",
      //xhrFields: { withCredentials: true },
      statusCode: {
        0: function () { console.log("OK") },
        200: function () { console.log("error") },
      }
    });
    setCookie("submitted", "True");
  }
  confetti({
    angle: 90,
    spread: 360,
    particleCount: 1000,
    startVelocity: 10,
    origin: { x: (window.event.clientX / screen.width), y: (window.event.clientY / screen.height) },
  });
}

function checkAnswer() {
  answer_ = (document.getElementById("answer").value.toLowerCase().trim());
  if (!isAnswerOption(answer_)) { notAnAnswerOption(); return; }
  answered_++;
  passedTime_ = time() - questionTime_;
  if (answer_ == correctAnswer_) { isCorrectAnswer(); }
  else { incorrectAnswer(); }

  console.log("User answer:    " + answer_);
  console.log("Correct answer: " + correctAnswer_);
  document.getElementById("answer").value = "";
  newQuestion();
};

function setupName() {
  if (getCookie("name") == "") {
    setCookie("name", "Guest");
  }
  document.getElementById("nameplate").innerHTML = "Your name: " + getCookie("name");
}

function submitName() {
  setCookie("name", document.getElementById("name").value.trim());
  document.getElementById("nameplate").innerHTML = "Your name: " + getCookie("name");
}

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
  if (streak_ < 4) { document.getElementById("result").innerText = "Correct! Well done!"; }
  else { document.getElementById("result").innerText = "Current streak multiplier: " + (1 + streak_ / 10) + "x"; }
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
  var questionNum_ = random(getCookie("fullCircle") == "1" ? 17 : 9);
  questionType_ = getCookie('radDeg') == 'deg' ? 0 : getCookie('radDeg') != 'rad' ? random(2) : 1;
  var trigVar_ = random(2);
  question_ = (trigVar_ == 0 ? "sin" : "cos") + "(" + sinArray_[questionNum_][questionType_] + ")";
  correctAnswer_ = sinArray_[(questionNum_ + trigVar_ * 4) % 16][2];
  clearImage();
  if (getCookie("image") != "0") {
    addImage(
      (getCookie("fullCircle") == "1" ? 1 : 0) * 0b100 +
      questionType_ * 0b010 +
      (getCookie("coords") == "0" ? 0 : 1) * 0b001);
  }
  questionTime_ = time();
};

function addImage(mask_) {
  var maskStr_ = "";
  for (i = 0; i < 3; i++) {
    maskStr_ = ((mask_ % 2 == 0) ? "0" : "1") + maskStr_;
    mask_ = mask_ >> 1;
  }
  document.getElementById("0b" + maskStr_).style.display = "block";
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
  document.getElementById("avgTime").innerText = Math.trunc(((time() - startTime_) / 1000) / answered_);
  document.getElementById("highscore1").innerText = Math.trunc(parseInt(getCookie("highscore")));
  document.getElementById("score1").innerText = Math.trunc(score_);
  document.getElementById("avgTime1").innerText = Math.trunc(((time() - startTime_) / 1000) / answered_);
  console.log((time() - startTime_) / 1000);
}

function random(number_) {
  return Math.floor(Math.random() * number_);
};

function logTime(input_) {
  times_ += (input_ + " ");
  if (score_ > parseInt(getCookie("highscore"))) {
    setCookie("highscore", score_);
    setCookie("bestGame", times_);
    setCookie("submitted", "False");
    console.log("logged " + times_);
  }
};

function time() {
  return new Date().getTime();
};

function setCookie(cookieName_, cookieValue_) {
  const d = new Date();
  d.setTime(d.getTime() + (10000 * 24 * 60 * 60 * 1000));
  let expires_ = "expires=" + d.toUTCString();
  let cookie_ = cookieName_ + "=" + cookieValue_ + ";" + expires_ + ";path=/";
  console.log("Cookie set to: " + cookie_);
  document.cookie = cookie_;
};

function getCookie(cookieName_) {
  let name_ = cookieName_ + "=";
  let decodedCookie_ = decodeURIComponent(document.cookie);
  let cookieArray_ = decodedCookie_.split(';');
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

function updateSettings() {
  startTime_ = time() - penalty_;
  questionTime_ = startTime_;
  setCookie('fullCircle', document.getElementById("full_circle_toggle").checked ? "1" : "0");
  setCookie('radDeg', document.getElementById("degree_toggle").checked ? document.getElementById("radian_toggle").checked ? "degRad" : "deg" : "rad");
  setCookie('image', document.getElementById("circle_toggle").checked ? "0" : "1");
  setCookie('coords', document.getElementById("coordinate_toggle").checked ? "0" : "1");
  newQuestion();
}
