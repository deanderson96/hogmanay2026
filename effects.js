(() => {
"use strict";
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
if(!reduce.matches&&"IntersectionObserver" in window){
document.body.classList.add("reveal-ready");
const items=document.querySelectorAll(".section-head,.detail-card,.info-card,.timeline,.game-layout");
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target)}})},{threshold:.1,rootMargin:"0px 0px -25px 0px"});
items.forEach(el=>obs.observe(el));
}
const canvas=document.getElementById("fireworks");
if(!canvas||reduce.matches)return;
const ctx=canvas.getContext("2d");let w=0,h=0,particles=[],next=0,frame=0,running=true;
const colors=["#dfbe80","#f5e0ba","#adc8d9","#e6b59e"];
function resize(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(w*d));canvas.height=Math.max(1,Math.round(h*d));ctx.setTransform(d,0,0,d,0,0)}
function burst(){const x=w*(.54+Math.random()*.42),y=h*(.09+Math.random()*.53),n=24+Math.round(Math.random()*17),color=colors[Math.floor(Math.random()*colors.length)];for(let i=0;i<n;i++){const angle=i/n*2*Math.PI,velocity=.6+Math.random()*1.55;particles.push({x,y,vx:Math.cos(angle)*velocity,vy:Math.sin(angle)*velocity,age:0,life:55+Math.random()*45,color})}}
function render(){if(!running)return;frame++;ctx.clearRect(0,0,w,h);if(frame>=next){burst();next=frame+110+Math.random()*130}particles=particles.filter(p=>p.age<p.life);for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.007;p.vx*=.989;p.vy*=.989;p.age++;const opacity=Math.sin(Math.PI*p.age/p.life)*.55;ctx.globalAlpha=Math.max(0,opacity);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,1.3,0,2*Math.PI);ctx.fill()}ctx.globalAlpha=1;requestAnimationFrame(render)}
window.addEventListener("resize",resize,{passive:true});document.addEventListener("visibilitychange",()=>{running=!document.hidden;if(running)requestAnimationFrame(render)});resize();requestAnimationFrame(render);
})();