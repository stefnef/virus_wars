socket.on("connect", ()=>{
    console.log("client connects");
});

socket.on("playPause", ()=>{
    console.log("event playPause received");
    playPause();
})

socket.on("initPlayground", () => {
    console.log("initPlayground");
    $('#collapsePlayground').collapse("hide");
    $('#divVideo').collapse("hide");
    $("#divPlayground").collapse("show");
});

$("#btnCollapse").click(()=>{
    socket.emit("readyForVideo", {user:username});
});

function showToast(toast, user){
    console.log($('.toast-header').html(`${user} hat gewürfelt!`));
    $(`#${toast}`).toast("show");
}

function playPause() {
    console.log("play video on client side")
    var myVideo = document.getElementById("myVideo"); 
    if (myVideo.paused) 
      myVideo.play(); 
    else 
      myVideo.pause(); 
  }

function updateDices(newDices, diceList) {  
    let diceElements = "";
    let nrDices = 0;
    for(let i =0; i<newDices.length; i++){
        nrDices += newDices[i];
        if(newDices[i] > 0){          
            if(i < 6) {
                diceElements += `<li class="dice">${newDices[i]} x <img src="img/dice${i + 1}.png" class="dice-img"></li>`;
            } else {
                diceElements += `<li class="dice">${newDices[i]} x <img src="img/dice6.png" class="dice-img"><img src="img/dice${( i + 1) % 6}.png" class="dice-img"></li>`;
            }
        }
    }    
    diceList.html(diceElements);
    return nrDices;
}

function createRandomDices(nrDices) {
    let dices = [0,0,0,0,0,0,0,0,0,0];
    for(let i=0;i<nrDices;i++){
        let newDice = Math.floor(Math.random()*10 + 1);
        dices[newDice - 1]++;
    }
    return dices;
}