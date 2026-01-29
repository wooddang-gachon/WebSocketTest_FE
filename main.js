function getIdPw() {
  let id = document.getElementById("ID").value;
  let pw = document.getElementById("PW").value;
  return { id: id, pw: pw };
}
const serverUrl = "http://localhost:3000";
const test = "/api/first-test/test";

document
  .getElementById("loginBtn")
  .addEventListener("click", async function () {
    const { id, pw } = getIdPw();

    const res = await fetch(serverUrl + test, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, pw: pw }),
    });
    const data = await res.json();
    console.log(data);
  });
