(() => {
  "use strict";
  const board=document.getElementById("darts-board");
  if(!board)return;
  const $=id=>document.getElementById(id);
  const NS="http://www.w3.org/2000/svg", SIZE=600, MID=300, MAX_DARTS=9;
  const numbers=[20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];
  const motionOK=!window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let score=0,throws=0,best=0,last="—",busy=false,aim={x:300,y:180},marks,aimMark,flight=null;
  try{best=Number(localStorage.getItem("hogmanay-darts-best-v1"))||0}catch(e){}
  function svg(tag,attrs={},parent=board){
    const el=document.createElementNS(NS,tag);
    for(const [key,value] of Object.entries(attrs))el.setAttribute(key,String(value));
    parent.appendChild(el);return el;
  }
  const polar=(r,deg)=>({x:MID+Math.cos((deg-90)*Math.PI/180)*r,y:MID+Math.sin((deg-90)*Math.PI/180)*r});
  function annulus(start,end,inner,outer){
    const a=polar(outer,start),b=polar(outer,end),c=polar(inner,end),d=polar(inner,start);
    return "M "+a.x+" "+a.y+" A "+outer+" "+outer+" 0 0 1 "+b.x+" "+b.y+
      " L "+c.x+" "+c.y+" A "+inner+" "+inner+" 0 0 0 "+d.x+" "+d.y+" Z";
  }
  function drawBoard(){
    board.replaceChildren();
    const defs=svg("defs");
    const metal=svg("radialGradient",{id:"darts-metal",cx:"34%",cy:"28%",r:"80%"},defs);
    svg("stop",{offset:"0%", "stop-color":"#f5dd9b"},metal);
    svg("stop",{offset:"52%","stop-color":"#bb8e3e"},metal);
    svg("stop",{offset:"100%","stop-color":"#3a2916"},metal);
    svg("circle",{cx:MID,cy:MID,r:297,fill:"#0b0b0a"});
    svg("circle",{cx:MID,cy:MID,r:287,fill:"url(#darts-metal)"});
    svg("circle",{cx:MID,cy:MID,r:273,fill:"#141310"});
    svg("circle",{cx:MID,cy:MID,r:256,fill:"#3d3121",stroke:"#f5daa0","stroke-width":3});
    numbers.forEach((num,i)=>{
      const start=i*18-9,end=i*18+9,light=i%2!==0;
      const base=light?"#e8dec5":"#1b1b18",band=light?"#b48738":"#e6bf69";
      for(const [ri,ro,fill] of [[28,133,base],[133,148,band],[148,219,base],[219,245,band]]){
        svg("path",{d:annulus(start,end,ri,ro),fill,stroke:"#7d725e","stroke-width":.75});
      }
      const p=polar(265,i*18);
      const label=svg("text",{x:p.x,y:p.y,"text-anchor":"middle","dominant-baseline":"central",fill:"#f2d49a","font-size":num===20?24:19,"font-family":"system-ui, sans-serif","font-weight":"800","pointer-events":"none"});
      label.textContent=String(num);
    });
    svg("circle",{cx:MID,cy:MID,r:28,fill:"#bf9b55",stroke:"#171410","stroke-width":2});
    svg("circle",{cx:MID,cy:MID,r:12,fill:"#f6e6ac",stroke:"#171410","stroke-width":2});
    svg("circle",{cx:MID,cy:MID,r:247,fill:"none",stroke:"#eee2bd","stroke-width":3});
    marks=svg("g",{"aria-hidden":"true"});
    aimMark=svg("g",{"aria-hidden":"true"});
    svg("circle",{cx:0,cy:0,r:12,fill:"none",stroke:"#fff5c5","stroke-width":2,opacity:.9},aimMark);
    svg("path",{d:"M -19 0 H -7 M 7 0 H 19 M 0 -19 V -7 M 0 7 V 19",stroke:"#fff5c5","stroke-width":2,opacity:.9},aimMark);
    moveAim(aim.x,aim.y);
  }
  function moveAim(x,y){aim.x=Math.max(20,Math.min(580,x));aim.y=Math.max(20,Math.min(580,y));aimMark.setAttribute("transform","translate("+aim.x+" "+aim.y+")")}
  function grade(x,y){
    const dx=x-MID,dy=y-MID,r=Math.hypot(dx,dy);
    if(r>245)return{points:0,label:"MISS"};
    if(r<=12)return{points:50,label:"BULLSEYE"};
    if(r<=28)return{points:25,label:"OUTER BULL"};
    const angle=(Math.atan2(dy,dx)*180/Math.PI+90+360)%360;
    const number=numbers[Math.round(angle/18)%20];
    if(r>=219)return{points:number*2,label:"DOUBLE "+number};
    if(r>=133&&r<=148)return{points:number*3,label:"TRIPLE "+number};
    return{points:number,label:"SINGLE "+number};
  }
  function update(){
    $("darts-score").textContent=String(score);
    $("darts-throws").textContent=throws+" / "+MAX_DARTS;
    $("darts-best").textContent=best?String(best):"—";
    $("darts-last").textContent=last;
    $("darts-throw").disabled=busy||throws===MAX_DARTS;
  }
  function markDart(x,y){
    const group=svg("g",{transform:"translate("+x+" "+y+") rotate(-34)"},marks);
    svg("circle",{cx:0,cy:0,r:3.5,fill:"#11100d",stroke:"#f5d78d","stroke-width":2},group);
    svg("line",{x1:0,y1:0,x2:25,y2:22,stroke:"#e9d293","stroke-width":3,"stroke-linecap":"round"},group);
    svg("path",{d:"M 23 18 L 39 19 L 34 35 L 22 29 Z",fill:"#f5d78d",stroke:"#1a140b","stroke-width":1},group);
  }
  function land(x,y){
    const hit=grade(x,y);
    throws++;score+=hit.points;last=hit.label+" · +"+hit.points;
    markDart(x,y);
    let message=hit.points?hit.label+"! +"+hit.points+" points.":"Outside the board — no points this throw.";
    if(throws===MAX_DARTS){
      if(score>best){best=score;try{localStorage.setItem("hogmanay-darts-best-v1",String(best))}catch(e){};message+=" New personal best!"}
      message+=" Round finished: "+score+" points in 9 darts. Hit NEW DARTS ROUND to play again.";
    }else message+=" "+(MAX_DARTS-throws)+" darts remaining.";
    busy=false;
    $("darts-status").textContent=message;update();
  }
  function throwAt(x,y){
    if(busy||throws>=MAX_DARTS)return;
    busy=true;x=Math.max(5,Math.min(595,x));y=Math.max(5,Math.min(595,y));moveAim(x,y);
    $("darts-status").textContent="Dart flying…";update();
    if(!motionOK){land(x,y);return}
    const dart=svg("g",{"aria-hidden":"true"});
    svg("line",{x1:0,y1:0,x2:52,y2:70,stroke:"#fff1c7","stroke-width":3,"stroke-linecap":"round"},dart);
    svg("path",{d:"M 45 63 L 65 66 L 57 84 L 44 78 Z",fill:"#dcb15e"},dart);
    const start=performance.now(),duration=450;
    function animate(now){
      const t=Math.max(0,Math.min(1,(now-start)/duration)),ease=1-Math.pow(1-t,3);
      const px=x+140*(1-ease),py=y+180*(1-ease),size=1.85-.85*ease;
      dart.setAttribute("transform","translate("+px+" "+py+") scale("+size+")");
      if(t<1){flight=requestAnimationFrame(animate)}
      else{dart.remove();flight=null;land(x,y)}
    }
    flight=requestAnimationFrame(animate);
  }
  function localPoint(e){
    const r=board.getBoundingClientRect();
    return{x:(e.clientX-r.left)*SIZE/r.width,y:(e.clientY-r.top)*SIZE/r.height};
  }
  board.addEventListener("click",e=>{if(busy||throws===MAX_DARTS)return;const p=localPoint(e);throwAt(p.x,p.y)});
  board.addEventListener("pointermove",e=>{
    if(e.pointerType==="mouse"&&e.buttons===0&&!busy){const p=localPoint(e);moveAim(p.x,p.y)}
  });
  board.addEventListener("keydown",e=>{
    const step=e.shiftKey?30:12;
    switch(e.key){
      case "ArrowUp":moveAim(aim.x,aim.y-step);break;
      case "ArrowDown":moveAim(aim.x,aim.y+step);break;
      case "ArrowLeft":moveAim(aim.x-step,aim.y);break;
      case "ArrowRight":moveAim(aim.x+step,aim.y);break;
      case "Enter":case " ":throwAt(aim.x,aim.y);break;
      default:return;
    }
    e.preventDefault();
  });
  function reset(){
    if(flight!==null){cancelAnimationFrame(flight);flight=null}
    busy=false;throws=0;score=0;last="—";aim={x:300,y:180};
    drawBoard();
    $("darts-status").textContent="Ready! Tap the board or press AIM FOR 20. You have 9 darts.";
    update();
  }
  $("darts-throw").addEventListener("click",()=>throwAt(300,180));
  $("darts-reset").addEventListener("click",reset);
  reset();
})();