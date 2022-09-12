"use strict";

let continueButton = document.getElementById("continueButton");
continueButton.addEventListener("click", buttonAction);

let myvideosButton = document.getElementById("myvideosButton");
myvideosButton.addEventListener("click", myvideosbuttonAction);

function myvideosbuttonAction() {
  window.location.href = 'myvideos.html';
}

function buttonAction() {
  let textArea1 = document.getElementById("username_input").value;
  let textArea2 = document.getElementById("url_input").value;
  let textArea3 = document.getElementById("nickname_input").value;
  let b = {"userid": textArea1,
          "url": textArea2,
          "nickname": textArea3};
  let bJSON = JSON.stringify(b);
  console.log("starting up")
  sendPostRequest('/videoData', bJSON)
    .then(function (data) {
      if (data === "1") {
        window.location.href='acknowledge.html';
        console.log("Video Inserted");
      }
      if (data === "0") {
        alert("Database Full");
      }
      
      
    })
    .catch(function(error) {
      console.error('Error:', error);
    });

}


async function sendPostRequest(url, data) {
  console.log("about to send post request");
  let response = await fetch(url, {
    method: 'POST',
    headers: {'Content-type': 'application/json'},
    body: data});
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}
