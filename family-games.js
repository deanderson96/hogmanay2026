(() => {
"use strict";
const $=id=>document.getElementById(id);
const pad=$("reaction-pad"),rMessage=$("reaction-message"),rResult=$("reaction-result");
let phase="idle",timer=null,started=0;
function reactionStart(){clearTimeout(timer);phase="waiting";pad.className="reaction-pad waiting";rMessage.textContent="WAIT FOR GREEN";rResult.textContent="Not yet...";timer=setTimeout(()=>{phase="go";started=performance.now();pad.className="reaction-pad go";rMessage.textContent="NOW!";rResult.textContent="TAP!"},1700+Math.random()*2800)}
function reactionTap(){if(phase==="idle"||phase==="done"){reactionStart();return}if(phase==="waiting"){clearTimeout(timer);phase="done";pad.className="reaction-pad false-start";rMessage.textContent="TOO SOON!";rResult.textContent="Jumped the gun!";return}if(phase==="go"){const ms=Math.round(performance.now()-started);phase="done";pad.className="reaction-pad done";rMessage.textContent="YOUR TIME";rResult.textContent=ms+" ms"}}
pad.addEventListener("click",reactionTap);
pad.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();reactionTap()}});
$("reaction-restart").addEventListener("click",reactionStart);
const prompts=[
["Have a personal theme song play every time you enter a room","Have confetti fall every time you leave a room"],
["Only speak in song lyrics for a day","Only communicate through charades for a day"],
["Be able to teleport anywhere once a week","Be able to pause time for ten seconds every day"],
["Eat dessert before every meal","Have breakfast for dinner every night"],
["Win every board game","Always know the answer to pub quiz questions"],
["Have your laugh sound like a trumpet","Have your sneezes sound like fireworks"],
["Spend New Year's Eve at a castle","Spend New Year's Eve on a tropical beach"],
["Have unlimited pizza forever","Have unlimited ice cream forever"]
];
let index=-1,votes=[0,0];
function next(){index=(index+1)%prompts.length;votes=[0,0];$("rather-question").textContent="WOULD YOU RATHER…";$("rather-a").textContent=prompts[index][0];$("rather-b").textContent=prompts[index][1];$("rather-results").textContent="Pass the phone round and vote!";$("rather-a").disabled=false;$("rather-b").disabled=false}
function vote(n){votes[n]++;$("rather-results").textContent="Votes — A: "+votes[0]+"  |  B: "+votes[1]+". Next player can vote too!"}
$("rather-next").addEventListener("click",next);$("rather-a").addEventListener("click",()=>vote(0));$("rather-b").addEventListener("click",()=>vote(1));next();
const dares=[
"Do your best impression of a family member (nicely!).",
"Speak like a sports commentator for the next minute.",
"Invent a five-second dance and teach everyone.",
"Tell the worst joke you know with a completely straight face.",
"Name five things you love about the past year.",
"Sing the chorus of any song without using its actual words.",
"Challenge someone to a dramatic rock-paper-scissors final.",
"Give an acceptance speech for winning 'best party guest'.",
"Try to say the alphabet backwards for ten seconds.",
"Pose for the most over-the-top group photo.",
"Make up an advert for an imaginary Hogmanay product.",
"Compliment three different people in the room."
];
let last=-1;
$("dare-next").addEventListener("click",()=>{let n=Math.floor(Math.random()*dares.length);if(n===last)n=(n+1)%dares.length;last=n;$("dare-result").textContent=dares[n]});
})();