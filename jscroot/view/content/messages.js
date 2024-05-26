import {disableInput} from 'https://cdn.jsdelivr.net/gh/jscroot/element@0.1.7/croot.js';


export async function main(){
  const btn = document.getElementById("sendbutton");
  const myId=getRandomColor();
  const sep='|||';
  const msg = document.getElementById("msg");
  chat(myId,sep,msg);
  msg.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        document.getElementById("sendbutton").click();
    }
  });
  btn.onclick = function () {
    if (!conn) {
      return false;
    }
    if (!msg.value) {
      return false;
    }
    conn.send(myId+sep+msg.value);
    msg.value = "";
    return false;
  };
}



function chat(myId,sep,msg) {
  if (window["WebSocket"]) {
  var conn = new WebSocket("wss://wss.do.my.id/ws");
  conn.onclose = function (evt) {
    var item = document.createElement("div");
    item.innerHTML = '<center><h3>Putus karena dicuekin</h3><img src="/reload.svg" onclick="location.reload()"></center>';
    appendLog(item);
    disableInput('msg');
    disableInput('sendbutton');
    msg.placeholder = "Refresh browser kakak...";
  };
  conn.onmessage = function (evt) {
    var ident = getFrom(myId,evt.data,sep)
    var messages = ident.txt.split('\n');
    for (var i = 0; i < messages.length; i++) {
      var item = document.createElement("div");
      item.classList.add('chat-message', ident.cls);//tambah kelas
      item.innerText = messages[i];
      item.style.backgroundColor=evt.data.split(sep)[0];
      appendLog(item);
    }
  };
  } else {
    var item = document.createElement("div");
    item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
    appendLog(item);
  }
}

function getFrom(myid,message,sep){
  var cls;
  var txt;
  if (message.includes(myid+sep)){
    cls='user'; 
    txt=message.replace(myid+sep,'');
  }else{
    cls='other'; 
    txt=message.split(sep)[1];
  }
  return {cls,txt};
}


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function appendLog(item) {
  const log = document.getElementById("log");
  var firstMessage =log.firstChild;
  log.insertBefore(item,firstMessage);
  log.scrollTop=0;
}