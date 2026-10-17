(() => {
"use strict";
const canvas=document.getElementById("pong-canvas");
if(!canvas)return;
const ctx=canvas.getContext("2d"), W=720,H=580;
const status=document.getElementById("pong-status");
const scoreEl=document.getElementById("pong-score"),shotsEl=document.getElementById("pong-shots"),bestEl=document.getElementById("pong-best");
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const origins=[{x:360,y:475}];
const cupPositions=[{x:300,y:185},{x:360,y:185},{x:420,y:185},{x:330,y:235},{x:390,y:235},{x:360,y:285}];
let cups=[], shots=0, best=Infinity, dragging=false, pointer=null, flight=null, aim={x:360,y:335}, ripples=[], confetti=[], last=performance.now(), active=true;
try{best=Number(localStorage.getItem("hogmanay-pong-best"))||Infinity}catch{}
function message(t){status.textContent=t}
function update(){scoreEl.textContent=cups.filter(c=>c.hit).length+" / 6";shotsEl.textContent=String(shots);bestEl.textContent=Number.isFinite(best)?String(best):"—"}
function reset(){cups=cupPositions.map(p=>({...p,hit:false}));shots=0;flight=null;aim={x:360,y:335};ripples=[];confetti=[];message("Drag back from the white ball to aim, then release.");update();draw()}
function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height}}
function clamp(v,a,b){return Math.min(b,Math.max(a,v))}
function start(e){if(flight||cups.every(c=>c.hit))return;const p=point(e);if(Math.hypot(p.x-360,p.y-475)<110){dragging=true;pointer=p;canvas.setPointerCapture(e.pointerId);e.preventDefault();draw()}}
function move(e){if(!dragging)return;pointer=point(e);e.preventDefault()}
function end(e){if(!dragging)return;const p=point(e);dragging=false;pointer=null;try{canvas.releasePointerCapture(e.pointerId)}catch{};const dx=clamp(360-p.x,-155,155),dy=clamp(475-p.y,20,220);if(Math.hypot(dx,dy)<25){draw();return}throwBall({x:360+dx*1.35,y:clamp(475-dy*1.35,140,360)})}
function throwBall(target){if(flight||cups.every(c=>c.hit))return;shots++;update();const targetX=clamp(target.x,130,590),targetY=clamp(target.y,135,340);flight={fromX:360,fromY:475,toX:targetX,toY:targetY,start:performance.now(),duration:720};message("Ball in the air…");requestAnimationFrame(draw)}
function keyboardThrow(){if(flight)return;throwBall(aim)}
function drawCup(c){const x=c.x,y=c.y;if(c.hit){ctx.fillStyle="#628b82";ctx.beginPath();ctx.ellipse(x,y+12,27,10,0,0,Math.PI*2);ctx.fill();return}ctx.fillStyle="#b9e0df22";ctx.beginPath();ctx.moveTo(x-26,y);ctx.lineTo(x-19,y+41);ctx.quadraticCurveTo(x,y+48,x+19,y+41);ctx.lineTo(x+26,y);ctx.closePath();ctx.fill();ctx.strokeStyle="#eab7a0";ctx.lineWidth=2;ctx.stroke();ctx.fillStyle="#df594f";ctx.beginPath();ctx.ellipse(x,y+3,26,12,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#ffc7bb";ctx.stroke();ctx.fillStyle="#8f2427";ctx.beginPath();ctx.ellipse(x,y+3,19,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#e98a79";ctx.beginPath();ctx.ellipse(x-5,y+1,8,3,0,0,Math.PI*2);ctx.fill()}
function ball(x,y,r=12){ctx.shadowColor="#fff9";ctx.shadowBlur=12;ctx.fillStyle="#fff5e4";ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle="#c4b8a0";ctx.lineWidth=1;ctx.stroke()}
function render(now){ctx.clearRect(0,0,W,H);const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,"#153946");grad.addColorStop(1,"#0b2433");ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);ctx.fillStyle="#d7b47b";ctx.globalAlpha=.12;for(let i=0;i<14;i++){ctx.fillRect(i*65,0,1,H)}ctx.globalAlpha=1;ctx.strokeStyle="#c5e5d638";ctx.lineWidth=3;ctx.strokeRect(75,47,570,481);ctx.beginPath();ctx.moveTo(75,370);ctx.lineTo(645,370);ctx.stroke();ctx.textAlign="center";ctx.font="700 13px sans-serif";ctx.letterSpacing="3px";ctx.fillStyle="#b8d5d6";ctx.fillText("AIM FOR THE CUPS",360,85);cups.forEach(drawCup);ctx.fillStyle="#ffffff18";ctx.beginPath();ctx.ellipse(360,495,41,14,0,0,Math.PI*2);ctx.fill();if(dragging&&pointer){const dx=clamp(360-pointer.x,-155,155),dy=clamp(475-pointer.y,20,220);const tx=clamp(360+dx*1.35,130,590),ty=clamp(475-dy*1.35,140,360);ctx.setLineDash([8,11]);ctx.strokeStyle="#edca84";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(360,475);ctx.quadraticCurveTo((360+tx)/2,(475+ty)/2-100,tx,ty);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle="#f5e5c9";ctx.beginPath();ctx.moveTo(360,475);ctx.lineTo(pointer.x,pointer.y);ctx.stroke();ball(360,475);ball(pointer.x,pointer.y,9)}else if(flight){const t=clamp((now-flight.start)/flight.duration,0,1);const ease=t;const x=flight.fromX+(flight.toX-flight.fromX)*ease;const y=flight.fromY+(flight.toY-flight.fromY)*ease-145*4*t*(1-t);ball(x,y,12-5*t);if(t>=1){const landed=cups.filter(c=>!c.hit).find(c=>Math.hypot(c.x-flight.toX,(c.y+4)-flight.toY)<27);flight=null;if(landed){landed.hit=true;ripples.push({x:landed.x,y:landed.y,start:now});message("Sunk it! Nice shot.");if(cups.every(c=>c.hit)){message("Perfect! All six cups cleared in "+shots+" throws. Start a new round!");if(shots<best){best=shots;try{localStorage.setItem("hogmanay-pong-best",String(best))}catch{}}for(let i=0;i<45;i++)confetti.push({x:Math.random()*W,y:-Math.random()*H,v:1+Math.random()*3,s:3+Math.random()*4,c:["#dfbe80","#f6e8d7","#c55f55"][i%3]})}}else{message("Missed! Try adjusting your aim.")}update()}}else{ball(360,475);ctx.fillStyle="#e4d1ad";ctx.font="12px sans-serif";ctx.letterSpacing="0px";ctx.fillText("DRAG THE BALL BACK TO SHOOT",360,546)}
ripples=ripples.filter(r=>now-r.start<620);ripples.forEach(r=>{const t=(now-r.start)/620;ctx.strokeStyle="rgba(255,214,136,"+(1-t)+")";ctx.lineWidth=3;ctx.beginPath();ctx.arc(r.x,r.y,20+55*t,0,2*Math.PI);ctx.stroke()});
if(confetti.length){confetti.forEach(p=>{p.y+=p.v;ctx.fillStyle=p.c;ctx.fillRect(p.x,p.y,p.s,p.s*1.8)});confetti=confetti.filter(p=>p.y<H+10)}
}
function draw(now=performance.now()){render(now)}
function loop(now){if(!active)return;if(flight||ripples.length||confetti.length||dragging)render(now);last=now;requestAnimationFrame(loop)}
canvas.addEventListener("pointerdown",start);canvas.addEventListener("pointermove",move);canvas.addEventListener("pointerup",end);canvas.addEventListener("pointercancel",()=>{dragging=false;pointer=null});
canvas.addEventListener("keydown",e=>{const delta=18;if(e.key==="ArrowLeft")aim.x-=delta;else if(e.key==="ArrowRight")aim.x+=delta;else if(e.key==="ArrowUp")aim.y-=delta;else if(e.key==="ArrowDown")aim.y+=delta;else if(e.key==="Enter"||e.key===" "){e.preventDefault();keyboardThrow();return}else return;e.preventDefault();aim.x=clamp(aim.x,130,590);aim.y=clamp(aim.y,135,340);message("Aim: "+Math.round(aim.x)+", "+Math.round(aim.y)+". Press Enter to throw.")});
document.getElementById("pong-reset").addEventListener("click",reset);
document.getElementById("pong-shoot").addEventListener("click",keyboardThrow);
document.addEventListener("visibilitychange",()=>{active=!document.hidden;if(active){last=performance.now();requestAnimationFrame(loop)}});
reset();requestAnimationFrame(loop);
})();