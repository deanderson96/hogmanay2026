(() => {
"use strict";
const canvas=document.getElementById("pong-canvas"); if(!canvas)return;
const ctx=canvas.getContext("2d");const W=720,H=580;
const score=document.getElementById("pong-score"),shotsLabel=document.getElementById("pong-shots"),bestLabel=document.getElementById("pong-best"),status=document.getElementById("pong-status");
const layout=[[360,164],[312,224],[408,224],[264,284],[360,284],[456,284]];
let cups=[],shots=0,best=Infinity,ball=null,selected=null,start=null,drag=false,animation=0,particles=[];
try{best=Number(localStorage.getItem("hogmanay-pong-best"))||Infinity}catch(e){}
const count=()=>cups.filter(c=>c.hit).length;
function text(s){status.textContent=s}
function update(){score.textContent=count()+" / 6";shotsLabel.textContent=shots;bestLabel.textContent=best===Infinity?"—":best}
function newRound(){cancelAnimationFrame(animation);cups=layout.map(([x,y])=>({x,y,hit:false}));shots=0;ball=null;selected=0;particles=[];text("Tap any red cup to throw. Or drag from the white ball to aim.");update();draw()}
function coord(e){let r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height}}
function draw(){ctx.clearRect(0,0,W,H);let g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#134c57");g.addColorStop(1,"#08232e");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.strokeStyle="#f3dfb733";ctx.lineWidth=3;ctx.strokeRect(55,35,610,510);ctx.beginPath();ctx.moveTo(55,365);ctx.lineTo(665,365);ctx.stroke();ctx.fillStyle="#e9d3a5";ctx.textAlign="center";ctx.font="bold 16px system-ui";ctx.fillText("TAP A CUP TO LAUNCH",360,83);
cups.forEach((c,i)=>{if(c.hit){ctx.fillStyle="#87d9ae45";ctx.beginPath();ctx.ellipse(c.x,c.y+18,26,8,0,0,Math.PI*2);ctx.fill();return}
ctx.fillStyle="#f07158";ctx.beginPath();ctx.moveTo(c.x-29,c.y);ctx.lineTo(c.x-22,c.y+44);ctx.quadraticCurveTo(c.x,c.y+51,c.x+22,c.y+44);ctx.lineTo(c.x+29,c.y);ctx.closePath();ctx.fill();ctx.strokeStyle="#ffd0b5";ctx.lineWidth=3;ctx.stroke();ctx.fillStyle="#792c32";ctx.beginPath();ctx.ellipse(c.x,c.y,29,13,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#ffb8a1";ctx.stroke();if(i===selected){ctx.strokeStyle="#fbe8a1";ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(c.x,c.y,35,19,0,0,Math.PI*2);ctx.stroke()}});
ctx.fillStyle="#ffffff35";ctx.beginPath();ctx.ellipse(360,490,42,13,0,0,Math.PI*2);ctx.fill();if(!ball){ctx.fillStyle="#fffae9";ctx.beginPath();ctx.arc(360,465,14,0,2*Math.PI);ctx.fill()}
if(ball){ctx.shadowBlur=15;ctx.shadowColor="#fff";ctx.fillStyle="#fff7e5";ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
particles.forEach(p=>{ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,5,8)});ctx.font="13px system-ui";ctx.fillStyle="#c5d9dd";ctx.fillText("Your throw line",360,530)}
function throwTo(x,y){if(ball||count()===6)return;shots++;update();text("Here goes…");const from=performance.now(),duration=740;ball={x:360,y:465,r:14};const closest=cups.filter(c=>!c.hit).find(c=>Math.hypot(c.x-x,c.y-y)<37);function tick(now){const t=Math.min(1,(now-from)/duration);ball.x=360+(x-360)*t;ball.y=465+(y-465)*t-125*4*t*(1-t);ball.r=14-5*t;draw();if(t<1){animation=requestAnimationFrame(tick)}else{ball=null;if(closest){closest.hit=true;text("SUNK! Pick your next cup.");if(count()===6){text("ALL SIX! You cleared the table in "+shots+" throws!");if(shots<best){best=shots;try{localStorage.setItem("hogmanay-pong-best",best)}catch(e){}}for(let i=0;i<38;i++)particles.push({x:Math.random()*W,y:Math.random()*240,color:["#f1bc72","#f6e8dd","#f07158"][i%3]})}}else{text("Just missed. Aim at a red cup and try again.")}selected=cups.findIndex(c=>!c.hit);update();draw()}}animation=requestAnimationFrame(tick)}
canvas.addEventListener("pointerdown",e=>{if(ball)return;const p=coord(e);start=p;drag=false;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener("pointermove",e=>{if(!start)return;const p=coord(e);if(Math.hypot(p.x-start.x,p.y-start.y)>12)drag=true});
canvas.addEventListener("pointerup",e=>{if(!start)return;const p=coord(e);if(drag&&Math.hypot(start.x-360,start.y-465)<95){const dx=360-p.x,dy=465-p.y;throwTo(Math.max(70,Math.min(650,360+dx*1.3)),Math.max(110,Math.min(345,465-dy*1.3)))}else{const c=cups.filter(c=>!c.hit).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];if(c){selected=cups.indexOf(c);throwTo(p.x,p.y)}}start=null;drag=false});
canvas.addEventListener("pointercancel",()=>{start=null;drag=false});
canvas.addEventListener("keydown",e=>{if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();let available=cups.map((c,i)=>c.hit?-1:i).filter(i=>i!==-1);let n=available.indexOf(selected);selected=available[(n+(e.key==="ArrowRight"?1:available.length-1))%available.length];draw()}if(e.key==="Enter"||e.key===" "){e.preventDefault();shoot()}});
function shoot(){let c=cups[selected];if(!c||c.hit)c=cups.find(c=>!c.hit);if(c)throwTo(c.x,c.y)}
document.getElementById("pong-shoot").addEventListener("click",shoot);
document.getElementById("pong-reset").addEventListener("click",newRound);
newRound();
})();