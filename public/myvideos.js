
getList('/getList')
  .then(function (data) {
      console.log("got back the following json");
      console.log(JSON.stringify(data));
      console.log("Data Length ", data.length);
      //let url = data.url;
      //let nickname = data.nickname;
      //console.log(url);
      //console.log("3: ", data[3].nickname);

      for (let i = 0; i < 8; i++) {
        div1 = document.createElement("div");
        div2 = document.createElement("div");
        p = document.createElement("p");
        xButton = document.createElement("button");
        main = document.getElementsByClassName("container")[0];

        if (i >= data.length) {
          div1.classList.add("dataElement");
          div2.classList.add("videoLineEmpty");
          p.classList.add("videoName");
          
        } else {
          div1.classList.add("dataElement");
          div2.classList.add("videoLine");
          p.classList.add("video"+i);
          let msg = p.textContent;
          msg = msg.replace("", data[i].nickname);
          p.textContent = msg;
          xButton.addEventListener("click", function () {
            xButtonAction(data[i].rowIdNum);
          });

        }
        xButton.classList.add("xButton");
        xButton.textContent = "X";
        
        div1.appendChild(div2);
        div1.appendChild(xButton);
        div2.appendChild(p);
        main.appendChild(div1);
      }

      button = document.createElement("button");
      playButton = document.createElement("button");

      nav = document.getElementsByClassName("nav")[0];
      footer = document.getElementsByClassName("footer")[0];
    
      if (data.length >= 8) {
        button.classList.add("inactiveButton");
        playButton.classList.add("activeButton");
        playButton.addEventListener("click", playButtonAction);
      } else {
        button.classList.add("activeButton");
        button.addEventListener("click", buttonAction);
        playButton.classList.add("inactiveButton");
        
      }
      button.textContent = "Add New";
      playButton.textContent = "Play Game";

      nav.appendChild(button);
      footer.appendChild(playButton);

    })
    .catch(function(error) {
      console.error('Error:', error);
    });

function xButtonAction(rowIdNum) {
  console.log("button received ", rowIdNum);
  sendPostDelete('/deleteVideo', rowIdNum)
  .then (function(data) {
    console.log(data);
    window.location.reload();
  })
  .catch(function(error) {
    console.error('Error:', error);
  })
}

function playButtonAction() {
  window.location.href='compare.html';
}
function buttonAction() {
  window.location.href='tiktokpets.html';

}

async function getList(url) {
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

async function sendPostDelete(url, data) {
  console.log("about to send post request");
  let response = await fetch(url, {
    method: 'POST',
    headers: {'Content-type': 'text/plain'},
    body: data});
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}