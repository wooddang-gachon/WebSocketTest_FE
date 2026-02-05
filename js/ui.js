export function showView(viewId) {
  document
    .querySelectorAll(".view")
    .forEach((el) => el.classList.remove("active"));
  document.getElementById(viewId).classList.add("active");

  const header = document.getElementById("main-header");
  header.style.display = viewId === "view-login" ? "none" : "flex";
}

export function appendMessage(sender, text) {
  const msgBox = document.getElementById("chat-messages");
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender === "me" ? "my" : "other"}`;
  msgDiv.innerText = text;
  msgBox.appendChild(msgDiv);
  msgBox.scrollTop = msgBox.scrollHeight;
}

export function updateWelcomeMsg(userId) {
  document.getElementById("welcome-msg").innerText = userId
    ? `${userId}님 안녕하세요`
    : "";
}

export function setLoginError(message) {
  document.getElementById("checkLogin").innerText = message;
}
