// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});

getWinner('/getWinner')
.then(function(data){
  let url = data.url;
  let nickname = data.nickname;
  console.log("winner url: ", url);
  showWinningVideo(url, nickname);
})
.catch(function(error){
  console.error('Error:', error);
});

// always shows the same hard-coded video.  You'll need to get the server to 
// compute the winner, by sending a 
// GET request to /getWinner,
// and send the result back in the HTTP response.

function showWinningVideo(url, nickname) {
  
  let winningUrl = url;
  addVideo(winningUrl, divElmt);
  loadTheVideos();

  const subtitle = document.getElementById("subtitle");
  let msg = subtitle.textContent;
  msg = msg.replace("", nickname);
  subtitle.textContent = msg;

  
}

async function getWinner(url) {
  console.log("about to send get request");
  let response = await fetch(url, {
    method: 'GET',
    headers: {'Content-type': 'application/json'}
  });
  if (response.ok) {
    let data = await response.json();
    return data;
  } else {
    throw Error(response.status);
  }
}   