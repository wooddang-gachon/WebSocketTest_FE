import * as api from "./api.js";
import * as ui from "./ui.js";

let currentUser = null;
let currentUserNum = null;
let currentSocket = null;

// [유틸] 입력값 가져오기
function getIdPw() {
  const id = document.getElementById("ID").value;
  const pw = document.getElementById("PW").value;
  return { id, pw };
}

// 1. 로그인
document.getElementById("logInBtn").addEventListener("click", async () => {
  const { id, pw } = getIdPw();
  if (!id || !pw) return ui.setLoginError("아이디와 비밀번호를 입력하세요.");

  try {
    const data = await api.signIn(id, pw);
    if (data.id != null) {
      currentUser = data.id;
      currentUserNum = data.num;
      ui.setLoginError("");
      ui.updateWelcomeMsg(currentUser);
      loadRoomList(currentUserNum);
      ui.showView("view-room-list");
    } else {
      ui.setLoginError("로그인 실패 (콘솔 확인)");
    }
  } catch (err) {
    ui.setLoginError("서버 연결 오류");
  }
});

// 2. 회원가입
document.getElementById("signUpBtn").addEventListener("click", async () => {
  const { id, pw } = getIdPw();
  if (!id || !pw) return alert("정보를 입력하세요");
  try {
    const data = await api.signUp(id, pw);
    alert("회원가입 요청 완료 (콘솔 확인)");
  } catch (err) {
    alert("회원가입 에러");
  }
});

// 3. 로그아웃
document.getElementById("logoutBtn").addEventListener("click", () => {
  currentUser = null;
  currentUserNum = null;
  document.getElementById("ID").value = "";
  document.getElementById("PW").value = "";
  if (currentSocket) currentSocket.close();
  ui.showView("view-login");
});

// 4. 채팅방 목록 로드
async function loadRoomList(num) {
  const listContainer = document.getElementById("room-list-container");
  listContainer.innerHTML = "";
  try {
    const rooms = await api.getRoomList(num);
    rooms.forEach((room) => {
      const div = document.createElement("div");
      div.className = "room-item";
      div.innerHTML = `<span>${room.chatroom_name}</span> <span>입장 ></span>`;
      div.addEventListener("click", () =>
        enterRoom(room.user_num, room.chatroom_name),
      );
      listContainer.appendChild(div);
    });
  } catch (err) {
    console.error("목록 로드 실패", err);
  }
}

// 5. 방 입장
function enterRoom(roomId, roomName) {
  document.getElementById("current-room-name").innerText = roomName;
  document.getElementById("chat-messages").innerHTML = "";
  ui.showView("view-chat");
  console.log(`방 입장: ${roomId}`);
  // currentSocket = new WebSocket(...) 추가 가능
}

// 6. 방 생성
document.getElementById("createRoomBtn").addEventListener("click", async () => {
  if (!currentUserNum) return alert("로그인이 필요합니다.");
  const roomName = prompt("생성할 채팅방의 이름을 입력해주세요.");
  const memberNum = prompt("초대할 친구의 이름을 입력해주세요.");

  if (!roomName?.trim() || !memberNum?.trim())
    return alert("정보를 입력하세요.");

  try {
    const data = await api.createChatroom(roomName, currentUserNum, memberNum);
    // 서버 응답 구조(success 여부 등)에 맞춰 조건 수정 필요
    alert(`방 생성 요청 완료`);
    loadRoomList(currentUserNum);
  } catch (err) {
    alert("서버와 연결할 수 없습니다.");
  }
});

// 7. 메시지 전송
function sendMessage() {
  const input = document.getElementById("msg-input");
  const text = input.value;
  if (!text.trim()) return;
  ui.appendMessage("me", text);
  console.log("메시지 전송:", text);
  input.value = "";
}

document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("msg-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
document
  .getElementById("backBtn")
  .addEventListener("click", () => ui.showView("view-room-list"));
