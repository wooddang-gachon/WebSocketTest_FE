import { SERVER_URL } from "./config.js";

// 로그인
export async function signIn(id, pw) {
  const res = await fetch(`${SERVER_URL}/api/auth/signIn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, pw }),
  });
  return res.json();
}

// 회원가입
export async function signUp(id, pw) {
  const res = await fetch(`${SERVER_URL}/api/auth/signUp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, pw }),
  });
  return res.json();
}

// 채팅방 목록 가져오기
export async function getRoomList(userNum) {
  const res = await fetch(`${SERVER_URL}/api/chatroom/showChatroom`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userNum }),
  });
  return res.json();
}

// 채팅방 생성하기
export async function createChatroom(roomName, userNum, memberName) {
  const res = await fetch(`${SERVER_URL}/api/chatroom/createChatroom`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chatroom_name: roomName,
      user_num: userNum,
      member_name: memberName,
    }),
  });
  return res.json();
}
