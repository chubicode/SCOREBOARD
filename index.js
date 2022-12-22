let scorehomeEl= document.getElementById("scorehome-el")
let scoreguestEl= document.getElementById("scoreguest-el")

let score= 0
function plusone(){
  score=score + 1
  scorehomeEl.textContent=score
}

function plustwo(){
  score=score + 2
  scorehomeEl.textContent=score
}

function plusthree(){
  score=score + 3
  scorehomeEl.textContent=score
}

function guestplusone(){
  score=score + 1
  scoreguestEl.textContent=score
}

function guestplustwo(){
  score=score + 2
  scoreguestEl.textContent=score
}

function guestplusthree(){
  score=score + 3
  scoreguestEl.textContent=score
}