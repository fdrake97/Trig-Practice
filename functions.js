const sinArray = [
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
var startTime = new Date().getTime() / 1000;
var totalAnswered = 0;
var totalCorrect = 0;
var currentStreak = 0;
var currentAnswer;
var lastQuestion;
var currentScore = 0;
var bestScore = 0;
var timeOfLastCorrect = startTime;
var root = document.querySelector(':root');
var lifetimeCorrect = 0;
var degVsRad;

function scanCookies() {
  if (getCookie('set') != 'true') {
    window.location.href = './options.html';
  }
  cookie = getCookie("backgroundColor")
  if (cookie != "") {
    console.log(cookie)
    document.body.style.backgroundColor = cookie;
    var all = document.getElementsByTagName("input")
    for (var i = 0, max = all.length; i < max; i++) {
      all[i].style.backgroundColor = cookie;
    }
  }
  cookie = getCookie("textColor")
  if (cookie != "") {
    console.log(cookie)
    var all = document.getElementsByTagName("*");

    for (var i = 0, max = all.length; i < max; i++) {
      all[i].style.color = cookie;
    }
  }
  cookie = getCookie("bestScore");
  if (cookie != "") { bestScore = cookie; }
  cookie = getCookie("lifetimeCorrect");
  if (cookie != "") { lifetimeCorrect = cookie; }
}

function setCookie(cname, cvalue) {
  const d = new Date();
  d.setTime(d.getTime() + (10 * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  let cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  console.log("Cookie set to: " + cookie)
  document.cookie = cookie;
}

function getCookie(cookieName) {
  let name = cookieName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookieArray = decodedCookie.split(';');
  console.log(cookieArray);
  for (let i = 0; i < cookieArray.length; i++) {
    let cookieElement = cookieArray[i];
    while (cookieElement.charAt(0) == ' ') {
      cookieElement = cookieElement.substring(1);
    }
    if (cookieElement.indexOf(name) == 0) {
      return cookieElement.substring(name.length);
    }
  }
  console.log("Failed to find cookie " + cookieName);
  return "";
}

function newQuestion() {
  //generate question
  let currentQuestion = getCookie('full_circle_toggle') == 'true' ? Math.floor(Math.random() * 17) : Math.floor(Math.random() * 9);
  let currentSinState = Math.floor(Math.random() * 2)
  //check if qestion is different from last (ignores rad/deg)
  if (currentQuestion + 17 * (currentSinState) == lastQuestion) {
    newQuestion();
    return;
  }
  //choose degree or radian
  degVsRad = getCookie('radian_toggle') == 'true' ? (getCookie('degree_toggle') == 'true' ? Math.floor(Math.random() * 2) : 1) : 0;
  //actually select question
  let question = currentSinState == 0 ? "sin(" + sinArray[currentQuestion][degVsRad] + ")" : "cos(" + sinArray[currentQuestion][degVsRad] + ")";
  //choose matching answer
  currentAnswer = sinArray[(currentQuestion + 4 * currentSinState + 16) % 16][2];
  console.log(currentAnswer);
  //update last question
  lastQuestion = currentQuestion + 17 * (currentSinState);
  //SET QUESTION//
  document.getElementById('question').innerText = question;
  //update image//
  loadImage();
}

function checkAnswer() {
  //collect answer
  var userAnswer = document.getElementById("answer").value.toLowerCase().trim();
  //check if answer is an option
  if (isAnswerOption(userAnswer)) {
    //increment total answers
    totalAnswered++;
    //check if answer is right
    if (userAnswer == currentAnswer) {
      //increase counts, update score
      timeOfLastCorrect = new Date().getTime() / 1000;
      currentStreak++;
      totalCorrect++;
      lifetimeCorrect++;
      setCookie('lifetimeCorrect', lifetimeCorrect);
      currentScore = Math.floor(totalCorrect ** 2 / (timeOfLastCorrect - startTime) * 1000);
      if (currentScore > bestScore) {
        bestScore = currentScore;
        setCookie("bestScore", bestScore)
      }
      document.getElementById("result").innerText = "Correct! Well done!";
      newQuestion();
    }
    else {
      currentStreak = 0;
      document.getElementById("result").innerText = "Incorrect. Please try again."
    }
  }
  else {
    document.getElementById("result").innerText = "Please enter a valid answer option.";
  }
  document.getElementById('score').innerHTML = scoreGen();
  document.getElementById("answer").value = "";
}

function isAnswerOption(answer) {
  for (x = 0; x < 16; x++) {
    if (sinArray[x][2] == answer) { return true; }
  }
  return false;
}

function scoreGen() {
  return '<p>Score: ' + currentScore + '<br>Streak: ' + currentStreak + '<br>Average time: ' + Math.floor((timeOfLastCorrect - startTime) / totalCorrect * 100) / 100 + ' seconds<br><br>Total correct: ' + lifetimeCorrect + '<br>Best score: ' + bestScore + '<p>';
}

function loadImage() {
  mask = 0b0000;
  if (getCookie('full_circle_toggle') == 'true') { mask = mask | 0b100; }
  mask = mask | degVsRad*2;
  if (getCookie('coordinate_toggle') == 'true') { mask = mask | 0b001; }
  console.log(mask);
  switch (mask) {
    case 0b100:
      document.getElementById('image').src = 'full_unit_circle_black_no_coords.svg';
      break;
    case 0b101:
      document.getElementById('image').src = 'full_unit_circle_black.svg';
      break;
    case 0b110:
      document.getElementById('image').src = 'full_unit_circle_rad_no_coords.svg';
      break;
    case 0b111:
      document.getElementById('image').src = 'full_unit_circle_rad.svg';
      break;
    case 0b000:
      document.getElementById('image').src = 'half_unit_circle_black_no_coords.svg';
      break;
    case 0b001:
      document.getElementById('image').src = 'half_unit_circle_black.svg';
      break;
    case 0b010:
      document.getElementById('image').src = 'half_unit_circle_rad_no_coords.svg';
      break;
    case 0b011:
      document.getElementById('image').src = 'half_unit_circle_rad.svg';
      break;
  }
}