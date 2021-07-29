
socket.on("newDicesSL", (msg)=>{
  console.log("newDices event from server", msg.newDices);
  const nrDices = updateDices(msg.newDices, $("#dicesResultSL"));
  $("#diceNrSLTitle").text("Anzahl der Würfel: " + nrDices);
  showToast("toastSL", msg.user);
})

socket.on("newDicesPlayer", (msg)=>{
  showToast("toastPlayer", msg.user);
  updateDices(msg.newDices, $("#dicesResultPlayer"));  
})

socket.on("updateNrDicesSL", (msg)=>{
  $("#diceNrSLTitle").text("Anzahl der Würfel: " + msg.nrDices);
  $("#diceNrSLTitle").addClass("dice-sl-red");
  setTimeout(function () { 
    $("#diceNrSLTitle").removeClass("dice-sl-red");
}, 2000);
});

let btnDicesPlayer = document.querySelector("#dicesRollPlayer");
if (btnDicesPlayer){
  btnDicesPlayer.addEventListener("click", (dicesRollEvent)=>{
    console.log("dices rolled");
    let nrDices = $("#diceNrPlayer").val();
    let dices = createRandomDices(nrDices);        
    socket.emit("dicesPlayer", {newDices: dices, user:username});
  });
}