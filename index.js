'use strict'
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");

// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner");


// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');


/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}


/* start of code run on start-up */
// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/myvideos.html");
});

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.text());

app.use(bodyParser.json());

app.use(express.json());


app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
  // change parameter to "true" to get it to computer real winner based on PrefTable 
  // with parameter="false", it uses fake preferences data and gets a random result.
  // winner should contain the rowId of the winning video.
  let winner = await win.computeWinner(8,false);

  // you'll need to send back a more meaningful response here.
  console.log("VidId: ", winner);

  let vid = await getVideoById(winner);
  res.json(vid);
  } catch(err) {
    res.status(500).send(err);
  }
});

app.get("/getMostRecent", async (request, response)=>{
  let vid = await getMostRecent();
  console.log("Most Recent");
  console.log(vid);
  response.json(vid);
})

app.get("/getList", async (request, response) => {
  let vids = await dumpTable();
  response.json(vids);
})

app.get("/getTwoVideos", async (request, response) => {
  let id1 = getRandomInt(8);
  let id2 = getRandomInt(8);
  while (id1 === id2) {
    id2 = getRandomInt(8);
  }
  console.log("id1:", id1);
  console.log("id2:", id2);
  let vids = await getVideosById(id1, id2);
  response.json(vids);
  
})

app.post('/insertPref', async function (req, res, next) {
  console.log("Server received a post request at", req.url);
  let prefObj = req.body;
  await insertPref(prefObj);
  const tableContents = await dumpPrefTable();
  console.log(tableContents);
  if (tableContents.length >= 15) {
    res.send("0");
  } else {
    res.send("1");
  }
  
})

app.post('/deleteVideo', async function(req, res, next) {
  console.log("Server received a post request at", req.url);
  let rowid = req.body;
  await deleteVideo(rowid);
  res.send("Video ", rowid, " deleted.");
}); 

app.post('/videoData', async function(req, res, next) {
  console.log("Server received a post request at", req.url);
  let vidObj = req.body;
  const tableContents = await dumpTable();
  handleRequest(vidObj);

  if (tableContents.length >= 8) {
    res.send("0");
  } else {
    res.send("1");
  }
  
  
});


// Page not found
app.use(function(req, res){
  res.status(404); 
  res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});



function handleRequest(obj) {
  let vidObj = obj

  async function insertAndUpdate(vidObj) {
    const tableContents = await dumpTable();
    console.log(tableContents.length);
    if (tableContents.length < 8) {
      await update();
      await insertVideo(vidObj);
    } 
    console.log(await dumpTable());
  }

  insertAndUpdate(vidObj)
    .catch (function(err) {console.log("DB error!", err)});
}
 

async function update() {
  const sql = 'UPDATE VideoTable SET flag=FALSE WHERE flag=TRUE';
  await db.run(sql);
}

async function insertVideo(v) {
  const sql = "insert into VideoTable (url,nickname,userid,flag) values (?,?,?,TRUE)";
  await db.run(sql,[v.url, v.nickname, v.userid]);
}

async function insertPref(p) {
  const sql = "insert into PrefTable (better,worse) values (?,?)";
  await db.run(sql, [p.better, p.worse]); 
}

async function getVideo(nickname) {
  const sql = 'select * from VideoTable where nickname = ?';
  let result = await db.get(sql, [nickname]);
  return result;
}

async function getVideosById(id1, id2) {
  
  let vids = await dumpTable();
  console.log(typeof vids);
  let vid1 = vids[id1];
  let vid2 = vids[id2];
  
  let arr = [];
  arr.push(vid1);
  arr.push(vid2);
  console.log(await dumpTable());
  console.log("Selected Array:");
  console.log(arr);
  return arr;
}

async function getVideoById(id) {
  let vids = await dumpTable();
  for (let i = 0; i < vids.length; i++) {
    console.log("IDS", vids[i].rowIdNum);
    if (vids[i].rowIdNum == id) {
      console.log("Winner ", vids[i]);
      return vids[i];
    }
  }
}

async function deleteVideo(rowid) {

  const sql = 'delete from VideoTable where rowidNum = ?';
  await db.run(sql, [rowid]);
}

async function getMostRecent() {
  const sql = 'select * from VideoTable where flag=TRUE';
  let result = await db.get(sql);
  return result;
}

async function dumpTable() {
  const sql = "select * from VideoTable"
  let result = await db.all(sql)
  return result;
}

async function dumpPrefTable() {
  const sql = "select * from PrefTable"
  let result = await db.all(sql)
  return result;
}
