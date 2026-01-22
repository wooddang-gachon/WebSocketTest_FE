const loginBtn = document.getElementById("loginBtn");
const checkLogin = document.getElementById("checkLogin");

loginBtn.addEventListener("click", function () {
  checkLogin.innerText = "버튼이 눌렸고, 값이 변경되었습니다!"; // p 태그에 값 넣기
  fetch("http://localhost:3000/contacts")
    .then((response) => response.json()) // 1. 응답을 JSON으로 변환
    .then((data) => {
      // 2. 변환된 데이터를 화면에 뿌리기
      console.log(data.date); // 브라우저 콘솔 확인용
      document.getElementById("checkLogin").innerText = data.message;
    })
    .catch((error) => {
      alert("에러가 났어요! 서버가 켜져 있나요?");
    });
});

// function changeByJS() {
//   let x = document.getElementsByClassName("quiz-text")[0];
//   x.innerText = "Javascript";
//   x.style.color = "red";
// }
