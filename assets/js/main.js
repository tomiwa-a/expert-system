$(document).ready(() => {
  let name = localStorage.getItem("name");
  let id = localStorage.getItem("id");

  sendMessageUtil(`Hello my name is ${name}`, `${name}${id}`, name);

  // endDiagnosis("typhoid");
});

function diagnoseFromMessage(message) {
  // Regular expression to match the pattern "you have been diagnosed with [diagnosis]"
  const regex = /you have been diagnosed with (\w+)/i;

  // Search the message for the pattern
  const match = message.match(regex);

  // If a match is found, return the diagnosis
  if (match && match[1]) {
    return match[1];
  }

  // If no match is found, return null
  return null;
}

function endDiagnosis(diagnosis, status = False) {
  $("#message_box").css("display", "none");
  diagnosis = diagnosis.toLowerCase();
  pushBtuttons(diagnosis, status);
}

function pushBtuttons(sickness, status) {
  let buttonText = status
    ? `<a href="diagnosis.html?sickness=${sickness}" class="btn btn-warning btn-sm">Check diagnosis!</a> <br > <br >`
    : "";

  let content = `<div class="tyn-reply-item incoming">
        <div class="tyn-reply-group">
            <div class="tyn-reply-bubble">
                <div class="tyn-reply-text">
                    ${buttonText}
                    
                    <a href="index.html" class="btn btn-info btn-sm ">Restart diagnosis</a>
                </div>
            </div>
        </div>
    </div>`;
  $("#tynReply").prepend(content);
}

function sendBtnClick() {
  let message = $("#tynBotInput").text();
  sendMessage(message);

  let name = localStorage.getItem("name");
  let id = localStorage.getItem("id");

  sendMessageUtil(message, `${name}${id}`, name);
}

function toggleTyping(status = False) {
  if (status) {
    let content = `<div class="tyn-reply-item incoming typing">
    <div class="tyn-reply-group">
        <div class="tyn-reply-bubble">
            <div class="tyn-reply-text">
                Typing...
            </div>
        </div>
    </div>
</div>`;
    $("#tynReply").prepend(content);
  } else {
    $(".typing").css("display", "none");
  }
}

function sendMessageUtil(message, session_id, name) {
  toggleTyping(true);
  var settings = {
    url: "http://127.0.0.1:8000/generate-content/",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      prompt: message,
      session_id: session_id,
      name: name,
    }),
  };

  $.ajax(settings).done(function (response) {
    toggleTyping(false);
    let responseMessage = response["generated_content"];

    reciveMessage(responseMessage);

    if (responseMessage.includes("You are healthy")) {
      endDiagnosis("", false);
      return;
    }

    let diagnosis = diagnoseFromMessage(responseMessage);
    if (diagnosis != null) {
      endDiagnosis(diagnosis, true);
    }
  });
}

function sendMessage(message) {
  let content = `<div class="tyn-reply-item outgoing">
    <div class="tyn-reply-group">
        <div class="tyn-reply-bubble">
            <div class="tyn-reply-text">
                ${message}
            </div>
        </div>
    </div>
</div>`;
  $("#tynReply").prepend(content);
}

function reciveMessage(message) {
  let content = `<div class="tyn-reply-item incoming">
    <div class="tyn-reply-group">
        <div class="tyn-reply-bubble">
            <div class="tyn-reply-text">
                ${message}
            </div>
        </div>
    </div>
</div>`;
  $("#tynReply").prepend(content);
}
