const eventSource = new EventSource(
  "http://localhost:8080/sender/ssar/receiver/cos"
);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  initMessage(data);
};

function getSendMsgBox(msg, time) {
  return `<div class="sent_msg">
            <p>${msg}</p>
            <span class="time_date"> ${time} </span>
          </div>`;
}

function initMessage(data) {
  let chatBox = document.querySelector("#chat-box");
  let msgInput = document.querySelector("#chat-outgoing-msg");
  let chatOutGoingBox = document.createElement("div");
  chatOutGoingBox.className = "outgoing_msg";
  chatOutGoingBox.innerHTML = getSendMsgBox(data.msg, data.createdAt);
  chatBox.append(chatOutGoingBox);
  msgInput.value = "";
}

async function addMessage() {
  let chatBox = document.querySelector("#chat-box");
  let msgInput = document.querySelector("#chat-outgoing-msg");

  let chatOutGoingBox = document.createElement("div");
  chatOutGoingBox.className = "outgoing_msg";

  let date = new Date();
  let now =
    date.getHours() +
    ":" +
    date.getMinutes() +
    " | " +
    date.getMonth() +
    "/" +
    date.getDate();

  let chat = {
    sender: "ssar",
    receiver: "cos",
    msg: msgInput.value,
  };

  let response = await fetch("http://localhost:8080/chat", {
    method: "post",
    body: JSON.stringify(chat), //JS Object -> JSON
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  let parseResponse = await response.json();

  chatOutGoingBox.innerHTML = getSendMsgBox(msgInput.value, now);
  chatBox.append(chatOutGoingBox);
  msgInput.value = "";
}

document
  .querySelector("#chat-outgoing-button")
  .addEventListener("click", () => {
    addMessage();
  });

document
  .querySelector("#chat-outgoing-msg")
  .addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
      addMessage();
    }
  });
