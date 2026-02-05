// [설정] 서버 주소
const serverUrl = "http://localhost:3000";

// [상태 관리]
let currentUser = null;
let currentUserNum = null;
let currentSocket = null;

let chatroom_num = null;

// [유틸] 아이디/비번 가져오기 (작성하신 코드)
function getIdPw() {
  let id = document.getElementById("ID").value;
  let pw = document.getElementById("PW").value;
  return { id, pw };
}

// [UI] 화면 전환 함수
function showView(viewId) {
  document
    .querySelectorAll(".view")
    .forEach((el) => el.classList.remove("active"));
  document.getElementById(viewId).classList.add("active");

  // 헤더 처리
  const header = document.getElementById("main-header");
  if (viewId === "view-login") header.style.display = "none";
  else header.style.display = "flex";
}

// ---------------------------------------------------------
// 1. 이벤트 리스너 등록 (Auth)
// ---------------------------------------------------------

// 로그인 버튼
document
  .getElementById("logInBtn")
  .addEventListener("click", async function () {
    console.log("login data sent");
    const { id, pw } = getIdPw();

    // 유효성 검사
    if (!id || !pw) {
      document.getElementById("checkLogin").innerText =
        "아이디와 비밀번호를 입력하세요.";
      return;
    }

    try {
      const data = await fetch(serverUrl + "/api/auth/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pw }),
      }).then((res) => res.json());

      console.log("서버 응답:", data);

      // TODO: [중요] 서버 응답에 따라 로그인 성공 여부 판단
      // 예: if (data.code === 200) 혹은 if (data.success) 등
      if (data.id != null) {
        // 성공 시 처리
        currentUser = data.id;
        currentUserNum = data.num;
        document.getElementById("checkLogin").innerText = "";
        document.getElementById("welcome-msg").innerText =
          `${currentUser}님 안녕하세요`;

        // 화면 전환 및 채팅방 목록 로드
        loadRoomList({ num: data.num });
        showView("view-room-list");
      } else {
        // 실패 시 처리
        document.getElementById("checkLogin").innerText =
          "로그인 실패 (콘솔 확인)";
      }
    } catch (err) {
      console.error(err);
      document.getElementById("checkLogin").innerText = "서버 연결 오류";
    }
  });

// 회원가입 버튼
document
  .getElementById("signUpBtn")
  .addEventListener("click", async function () {
    console.log("signup data sent");
    const { id, pw } = getIdPw();

    if (!id || !pw) return alert("정보를 입력하세요");

    try {
      const res = await fetch(serverUrl + "/api/auth/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pw }),
      });
      const data = await res.json();
      console.log("회원가입 응답:", data);
      alert("회원가입 요청 완료 (콘솔 확인)");
    } catch (err) {
      console.error(err);
      alert("회원가입 에러");
    }
  });

// 로그아웃 버튼
document.getElementById("logoutBtn").addEventListener("click", function () {
  currentUser = null;
  document.getElementById("ID").value = "";
  document.getElementById("PW").value = "";
  if (currentSocket) currentSocket.close(); // 소켓 종료
  showView("view-login");
});

// ---------------------------------------------------------
// 2. 채팅방 로직
// ---------------------------------------------------------

async function loadRoomList({ num }) {
  const listContainer = document.getElementById("room-list-container");
  listContainer.innerHTML = "";

  // TODO: 백엔드에서 채팅방 목록 fetch 구현
  // const res = await fetch(serverUrl + "/api/rooms"); ...

  const rooms = await fetch(serverUrl + "/api/chatroom/showChatroom", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userNum: num }),
  }).then((res) => res.json());

  // const rooms = await res.json();

  rooms.forEach((room) => {
    const div = document.createElement("div");
    div.className = "room-item";
    div.innerHTML = `<span>${room.chatroom_name}</span> <span>입장 ></span>`;

    // 클릭 시 방 입장
    div.addEventListener("click", () =>
      enterRoom(room.user_num, room.chatroom_name),
    );
    listContainer.appendChild(div);
  });
}

function enterRoom(roomId, roomName) {
  document.getElementById("current-room-name").innerText = roomName;
  document.getElementById("chat-messages").innerHTML = "";
  showView("view-chat");

  // TODO: 웹소켓 연결 (socket.io 또는 ws)
  console.log(`방 입장: ${roomId}`);
  // currentSocket = new WebSocket(...)
}

// ---------------------------------------------------------
// 3. 채팅 메시지 전송 로직
// ---------------------------------------------------------

// 뒤로가기 버튼
document.getElementById("backBtn").addEventListener("click", function () {
  showView("view-room-list");
  // 소켓 끊기 로직이 필요하다면 여기에 추가
});

// 전송 버튼
document.getElementById("sendBtn").addEventListener("click", sendMessage);

// 엔터키 전송
document.getElementById("msg-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const input = document.getElementById("msg-input");
  const text = input.value;
  if (!text.trim()) return;

  // 1. 내 화면에 표시
  appendMessage("me", text);

  // 2. TODO: 서버로 전송
  // fetch or socket.send(...)
  console.log("메시지 전송:", text);

  input.value = "";
}

function appendMessage(sender, text) {
  const msgBox = document.getElementById("chat-messages");
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender === "me" ? "my" : "other"}`;
  msgDiv.innerText = text;
  msgBox.appendChild(msgDiv);
  msgBox.scrollTop = msgBox.scrollHeight;
}

// 채팅방 생성 버튼 이벤트
document
  .getElementById("createRoomBtn")
  .addEventListener("click", async function () {
    // 1. 로그인 여부 체크
    if (!currentUserNum) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 2. 방 이름 입력 받기 (브라우저 알림창)
    const roomName = prompt("생성할 채팅방의 이름을 입력해주세요.");
    const memberNum = prompt("초대할 친구의 이름을 입력해주세요.");

    // 취소를 누르거나 빈 값을 입력했을 경우 방지
    if (roomName === null || memberNum === null) return;
    if (!roomName.trim() || !memberNum.trim()) {
      alert("방과 친구의 이름을 입력해야 합니다.");
      return;
    }

    try {
      // 3. 서버에 방 생성 요청
      const res = await fetch(`${serverUrl}/api/chatroom/createChatroom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatroom_name: roomName,
          user_num: currentUserNum,
          member_name: memberNum,
        }),
      }).then((res) => res.json());

      const data = await res.json();

      if (res.ok && data.success) {
        alert(`'${data.roomName}' 방이 성공적으로 생성되었습니다!`);

        // 4. 방 목록 새로고침 (기존에 만든 함수 호출)
        if (typeof loadRoomList === "function") {
          loadRoomList({ num: currentUserNum });
        }
      } else {
        alert("방 생성에 실패했습니다: " + (data.message || "서버 오류"));
      }
    } catch (err) {
      console.error("방 생성 중 에러 발생:", err);
      alert("서버와 연결할 수 없습니다.");
    }
  });
