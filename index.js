let scorehomeEl= document.getElementById("scorehome-el")
let scoreguestEl= document.getElementById("scoreguest-el")

let score= 0
let score2= 0

// for the home

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

// for the guest

function guestplusone(){
  score2=score2 + 1
  scoreguestEl.textContent=score2
}

function guestplustwo(){
  score2=score2 + 2
  scoreguestEl.textContent=score2
}

function guestplusthree(){
  score2=score2 + 3
  scoreguestEl.textContent=score2
}

// resetting home and guest counter

function resethome(){
score=0
score2=0
scorehomeEl.textContent=score
scoreguestEl.textContent=score2
}

