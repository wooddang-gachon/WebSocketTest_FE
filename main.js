function getIdPw() {
  let id = document.getElementById("ID").value;
  let pw = document.getElementById("PW").value;
  return { id, pw };
}
const serverUrl = "http://localhost:3000";
const test = "/api/auth/signIn";

document
  .getElementById("logInBtn")
  .addEventListener("click", async function () {
    console.log("data sent");
    const { id, pw } = getIdPw();
    console.log(`id: ${id} pw: ${pw}`);
    const res = await fetch(serverUrl + test, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, pw }),
    });
    const data = await res.json();
    console.log(data);
  });


document
  .getElementById("logUpBtn")
  .addEventListener("click", async function () {
    console.log("data sent");
    const { id, pw } = getIdPw();
    console.log(`id: ${id} pw: ${pw}`);
    const res = await fetch(serverUrl + "/api/auth/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, pw }),
    });
    const data = await res.json();
    console.log(data);
  });
