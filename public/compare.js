
let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");

for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
  heartButtons[i].classList.add("unloved");
} // for loop

// hard-code videos for now
// You will need to get pairs of videos from the server to play the game.
//const urls = ["https://www.tiktok.com/@berdievgabinii/video/7040757252332047662",
//"https://www.tiktok.com/@catcatbiubiubiu/video/6990180291545468166"];


getTwoVideos('/getTwoVideos')
  .then(function(data) {
    let url1 = data[0].url;
    let url2 = data[1].url;
    console.log("url1:", url1);
    console.log("url2:", url2);
    let rowid1 = data[0].rowIdNum;
    let rowid2 = data[1].rowIdNum;
    addVideo(url1, videoElmts[0]);
    addVideo(url2, videoElmts[1]);
    loadTheVideos();

    let pref = -1;
    
    let heart1 = heartButtons[0];
    let heart2 = heartButtons[1];
    
    let nickname1 = data[0].nickname;
    let nickname2 = data[1].nickname;

    const subtitle1 = document.getElementById("subtitle1");
    let msg = subtitle1.textContent;
    msg = msg.replace("", nickname1);
    subtitle1.textContent = msg;

    const subtitle2 = document.getElementById("subtitle2");
    let msg2 = subtitle2.textContent;
    msg2 = msg2.replace("", nickname2);
    subtitle2.textContent = msg2;
    
    heart1.addEventListener("click", function() {
      setPref(1);
      heart1.classList.remove("unloved");
      heart2.classList.remove("loved");
      heart1.classList.add("loved");
      heart2.classList.add("unloved");

      
      document.getElementById("icon1").style.display = "none";
      document.getElementById("icon2").style.display = "inline";
      document.getElementById("icon3").style.display = "inline";
      document.getElementById("icon4").style.display = "none";
    });
    heart2.addEventListener("click", function() {
      setPref(2);
      heart2.classList.remove("unloved");
      heart1.classList.remove("loved");
      heart2.classList.add("loved");
      heart1.classList.add("unloved");

      document.getElementById("icon1").style.display = "inline";
      document.getElementById("icon2").style.display = "none";
      document.getElementById("icon3").style.display = "none";
      document.getElementById("icon4").style.display = "inline";
    });

    function setPref(p){
      pref = p;
    }

    let nextButton = document.getElementsByClassName("enabledButton")[0];
    nextButton.addEventListener("click", function() {
      if (pref == 1) {
        let p = {"better": rowid1,
                "worse": rowid2};
        
        let pJSON = JSON.stringify(p);
        sendPostPref('/insertPref', pJSON)
        .then(function(data) {
          if (data === "0") {
            window.location.href = 'winner.html';
          }
          if (data === "1") {
            window.location.reload();
          }
        }) 
        .catch(function(error) {
          console.error('Error:', error);
        });
      }
      if (pref == 2) {
        let p = {"better": rowid2,
                "worse": rowid1};
        let pJSON = JSON.stringify(p);
        sendPostPref('/insertPref', pJSON)
        .then(function(data) {
          if (data === "0") {
            window.location.href = 'winner.html';
          }
          if (data === "1") {
            
            window.location.reload();
            
          }
        })
        .catch (function(error) {
          console.error('Error:', error);
        });
      }
      
    })
  })
  .catch (function(error) {
    console.error('Error:', error);
  })


async function getTwoVideos(url) {
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

async function sendPostPref(url, data) {
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
