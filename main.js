const loginBtn = document.getElementById("loginBtn");
const checkLogin = document.getElementById("checkLogin");

loginBtn.addEventListener("click", function () {
  checkLogin.innerText = "버튼이 눌렸고, 값이 변경되었습니다!"; // p 태그에 값 넣기
});

// function changeByJS() {
//   let x = document.getElementsByClassName("quiz-text")[0];
//   x.innerText = "Javascript";
//   x.style.color = "red";
// }
