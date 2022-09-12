

/*
console.log("got back the following string");
console.log(nickname)
let msg = acknowledge.textContent;
msg = msg.replace("videoNickname", nickname);
acknowledge.textContent = msg;
*/

getMostRecent('/getMostRecent')
  .then(function (data) {
      console.log("got back the following json");
      console.log(JSON.stringify(data));
      let url = data.url;
      let nickname = data.nickname;
      console.log(url);

      let reloadButton = document.getElementById("reload");
      let divElmt = document.getElementById("tiktokDiv");
      reloadButton.addEventListener("click", function () {
        reloadVideo(url, divElmt)
      });

      addVideo(url, divElmt);

      loadTheVideos();

      const subtitle = document.getElementById("subtitle");
      let msg = subtitle.textContent;
      msg = msg.replace("", nickname);
      subtitle.textContent = msg;
      
    })
    .catch(function(error) {
      console.error('Error:', error);
    });



async function addVideo(tiktokurl, divElmt) {
  let videoNumber = tiktokurl.split("video/")[1];

  let block = document.createElement('blockquote');

  block.className = "tiktok-embed";
  block.cite = tiktokurl;

  block.setAttribute("data-video-id", videoNumber);
  block.style = "width: 325px; height: 563px;"

  let section = document.createElement('section');
  block.appendChild(section);

  divElmt.appendChild(block);
}

function loadTheVideos() {
  body = document.body;
  script = newTikTokScript();
  body.appendChild(script);
}

function newTikTokScript() {
  let script = document.createElement("script");

  script.src = "https://www.tiktok.com/embed.js"
  script.id = "tiktokScript"
  return script;
}

function reloadVideo (url, divElmt) {
  
  // get the two blockquotes
  let blockquotes 
 = document.getElementsByClassName("tiktok-embed");

  // and remove the indicated one
    block = blockquotes[0];
    console.log("block",block);
    let parent = block.parentNode;
    parent.removeChild(block);

  // remove both the script we put in and the
  // one tiktok adds in
  let script1 = document.getElementById("tiktokScript");
  let script2 = script.nextElementSibling;

  let body = document.body; 
  body.removeChild(script1);
  body.removeChild(script2);

  addVideo(url,divElmt);
  loadTheVideos();
}


async function getMostRecent(url) {
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