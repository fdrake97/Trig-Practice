var answer = ""
function random(number_) {
  return Math.floor(Math.random() * number_);
};
function generateQuestion() {
  var question = random(9);
  document.getElementById("triangle0").style.display = "none";
  document.getElementById("triangle1").style.display = "none";
  if (question < 6) { document.getElementById("triangle0").style.display = "block"; }
  else { document.getElementById("triangle1").style.display = "block"; }
  var num = random(20);
  switch (question) {
    case 0:
      document.getElementById("triangle0").style.display = "block";
      document.getElementById("textbox0").innerText = (num*2);
      document.getElementById("textbox1").innerText = ("X");
      document.getElementById("textbox2").innerText = ("");
      answer = (num) + "";
      break;
    case 1:
      document.getElementById("triangle0").style.display = "block";
      document.getElementById("textbox0").innerText = (num*2);
      document.getElementById("textbox1").innerText = ("");
      document.getElementById("textbox2").innerText = ("X");
      answer = (num) + "r3";
      break;
    case 2:
      document.getElementById("triangle0").style.display = "block";
      document.getElementById("textbox0").innerText = ("X");
      document.getElementById("textbox1").innerText = (num);
      document.getElementById("textbox2").innerText = ("");
      answer = (2 * num) + "";
      break;
    case 3:
      document.getElementById("triangle0").style.display = "block";
      document.getElementById("textbox0").innerText = ("");
      document.getElementById("textbox1").innerText = (num);
      document.getElementById("textbox2").innerText = ("X");
      answer = (num) + "r3";
      break;
    case 4:
      document.getElementById("triangle0").style.display = "block";
      document.getElementById("textbox0").innerText = ("X");
      document.getElementById("textbox1").innerText = ("");
      document.getElementById("textbox2").innerText = (num * 3);
      answer = (num) + "r3";
      break;
    case 5:
      document.getElementById("triangle0").style.display = "block";
      document.getElementById("textbox0").innerText = ("");
      document.getElementById("textbox1").innerText = ("X");
      document.getElementById("textbox2").innerText = (num * 3);
      answer = (num) + "r3"
      break;
    case 6:
      document.getElementById("triangle1").style.display = "block";
      document.getElementById("textbox0").innerText = (num);
      document.getElementById("textbox1").innerText = ("X");
      document.getElementById("textbox2").innerText = ("");
      answer = (num) + ""
      break;
    case 7:
      document.getElementById("triangle1").style.display = "block";
      document.getElementById("textbox0").innerText = (num);
      document.getElementById("textbox1").innerText = ("");
      document.getElementById("textbox2").innerText = ("X");
      answer = (num) + "r2"
      break;
    case 8:
      document.getElementById("triangle1").style.display = "block";
      document.getElementById("textbox0").innerText = ("X");
      document.getElementById("textbox1").innerText = ("");
      document.getElementById("textbox2").innerText = (num * 2);
      answer = (num) + "r2"
      break;
  }
  console.log(answer);
}
