
socket.on("newDicesPlayer", (msg)=>{
    console.log("newDices event from server", msg.newDices);
    const nrDices = updateDices(msg.newDices, $("#dicesResultPlayer"));
    $("#diceNrPlayerTitle").text("Anzahl der Würfel: " + nrDices);
    showToast("toastPlayer", msg.user);    
  })

socket.on("newDicesSL", (msg)=>{
    showToast("toastSL", msg.user);
    updateDices(msg.newDices, $("#dicesResultSL"));    
})

socket.on("readyForVideo", (msg)=>{
    console.log(msg.user + " is ready for video");
});

let btnPlayPauseVideo = document.querySelector("#videoStart");
if(btnPlayPauseVideo){
    btnPlayPauseVideo.addEventListener("click", (videoStartEvent)=>{
        console.log("emit playPauseToServer")
        socket.emit("playPauseToServer");
    });
}

let btnInitPlayground = document.querySelector("#initPlayground");
if (btnInitPlayground){
    btnInitPlayground.addEventListener("click", (initPlaygroundEvent)=>{
    console.log("emit init Playground")
    socket.emit("initPlaygroundToServer");
});
}

let showDiceToPlayer = document.getElementById("showDicesToPlayer");
let inputDiceSL = document.getElementById("diceNrSL");
if(showDiceToPlayer && inputDiceSL) {
    showDiceToPlayer.addEventListener("click", (clickEvent) => {
        socket.emit("updateNrDicesSL", {nrDices: inputDiceSL.value});
    });
}


  // DICES
  let btnDicesSL = document.querySelector("#dicesRollSL");
  if (btnDicesSL){
    btnDicesSL.addEventListener("click", (dicesRollEvent)=>{
        console.log("dices rolled");
        let nrDices = $("#diceNrSL").val();
        let dices = createRandomDices(nrDices);        
        socket.emit("dicesSL", {newDices: dices, user:username});
    });
  }

