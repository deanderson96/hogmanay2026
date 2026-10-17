(() => {
  "use strict";
  const $=id=>document.getElementById(id);
  const table=$("pong-table"),cupHolder=$("pong-cups"),homeBall=$("pong-ball");
  if(!table||!cupHolder||!homeBall)return;
  const spots=[[40,24],[50,24],[60,24],[45,39],[55,39],[50,54]];
  let cups=[],shots=0,best=Infinity,busy=false,anim=0,projectile=null,dragStart=null,moving=false;
  try{best=Number(localStorage.getItem("hogmanay-pong-best"))||Infinity}catch{}
  function say(msg){$("pong-status").textContent=msg}
  function scored(){return cups.filter(c=>c.hit).length}
  function refresh(){$("pong-score").textContent=scored()+" / 6";$("pong-shots").textContent=String(shots);$("pong-best").textContent=Number.isFinite(best)?String(best):"—"}
  function reset(){
    cancelAnimationFrame(anim);if(projectile){projectile.remove();projectile=null}
    busy=false;shots=0;dragStart=null;moving=false;homeBall.style.visibility="visible";
    cupHolder.replaceChildren();
    cups=spots.map(([x,y],i)=>{
      const node=document.createElement("button");node.type="button";node.className="pong-cup";
      node.style.left=x+"%";node.style.top=y+"%";node.setAttribute("aria-label","Throw into cup "+(i+1));
      cupHolder.append(node);const item={node,hit:false};node.addEventListener("click",()=>targetCup(item));return item
    });
    say("Tap a red cup to throw. Or drag the white ball onto one!");refresh()
  }
  function center(element){
    const a=element.getBoundingClientRect(),b=table.getBoundingClientRect();
    return {x:a.left+a.width/2-b.left,y:a.top+a.height/2-b.top}
  }
  function local(e){const b=table.getBoundingClientRect();return{x:e.clientX-b.left,y:e.clientY-b.top}}
  function targetCup(c){if(!c||c.hit||busy)return;const dest=center(c.node);throwBall(dest,c)}
  function autoAim(){targetCup(cups.find(c=>!c.hit))}
  function throwBall(dest,target){
    if(busy||scored()===6)return;
    busy=true;shots++;refresh();
    const from=center(homeBall);
    projectile=document.createElement("span");
    projectile.className="pong-projectile";
    projectile.setAttribute("aria-hidden","true");
    table.append(projectile);
    homeBall.style.visibility="hidden";
    say("Ball in the air…");
    const duration=680,started=performance.now();
    const startX=from.x,startY=from.y;
    function frame(now){
      if(!busy||!projectile)return;
      const t=Math.min(1,Math.max(0,(now-started)/duration));
      const x=startX+(dest.x-startX)*t,y=startY+(dest.y-startY)*t-Math.sin(t*Math.PI)*Math.min(115,table.clientHeight*.24);
      projectile.style.left=x+"px";projectile.style.top=y+"px";projectile.style.transform="translate(-50%,-50%) scale("+(1-t*.48)+")";
      if(t<1){anim=requestAnimationFrame(frame);return}
      projectile.remove();projectile=null;homeBall.style.visibility="visible";busy=false;
      if(target&&!target.hit){
        target.hit=true;target.node.classList.add("sunk");target.node.disabled=true;
        if(scored()===6){
          say("ALL SIX SUNK! You cleared the table in "+shots+" throws. ★");
          table.classList.add("pong-win");
          window.setTimeout(()=>table.classList.remove("pong-win"),900);
          if(shots<best){best=shots;try{localStorage.setItem("hogmanay-pong-best",String(best))}catch{}}
        }else say("SUNK IT! ★ Pick another cup!");
      }else say("So close! Give it another shot.");
      refresh();
    }
    anim=requestAnimationFrame(frame)
  }
  homeBall.addEventListener("pointerdown",e=>{if(busy||scored()===6)return;dragStart=local(e);moving=false;homeBall.setPointerCapture(e.pointerId);e.preventDefault()});
  homeBall.addEventListener("pointermove",e=>{
    if(!dragStart||busy)return;
    const p=local(e);moving=Math.hypot(p.x-dragStart.x,p.y-dragStart.y)>12;
    const line=$("pong-aimline"),from=center(homeBall),dx=p.x-from.x,dy=p.y-from.y;
    if(moving){line.style.opacity="1";line.style.left=from.x+"px";line.style.top=from.y+"px";line.style.width=Math.hypot(dx,dy)+"px";line.style.transform="rotate("+Math.atan2(dy,dx)+"rad)"}
  });
  homeBall.addEventListener("pointerup",e=>{
    if(!dragStart||busy)return;
    const p=local(e),dragged=moving;
    dragStart=null;moving=false;$("pong-aimline").style.opacity="0";
    if(!dragged){autoAim();return}
    let chosen=null,distance=Infinity;
    for(const c of cups){if(c.hit)continue;const q=center(c.node),d=Math.hypot(p.x-q.x,p.y-q.y);if(d<distance){distance=d;chosen=c}}
    if(distance<Math.max(28,Math.min(65,table.clientWidth*.12)))targetCup(chosen);
    else throwBall(p,null)
  });
  homeBall.addEventListener("pointercancel",()=>{dragStart=null;moving=false;$("pong-aimline").style.opacity="0"});
  homeBall.addEventListener("click",e=>{if(e.detail===0)autoAim()});
  $("pong-shoot").addEventListener("click",autoAim);
  $("pong-reset").addEventListener("click",reset);
  reset();
})();