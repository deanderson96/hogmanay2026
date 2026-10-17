(() => {
  "use strict";
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  if(reduce.matches)return;

  if("IntersectionObserver" in window){
    const items=document.querySelectorAll(".section-heading,.plan-card,.schedule-block,.quiz-heading,.quiz-shell,.pong-layout,.party-card,.essentials-grid article,.faq-intro,.faq-content");
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add("shown");observer.unobserve(entry.target)}
      })
    },{threshold:.08,rootMargin:"0px 0px -24px 0px"});
    items.forEach(item=>{item.classList.add("reveal");observer.observe(item)});
    document.body.classList.add("reveal-active");
  }

  const canvas=document.getElementById("fireworks"),hero=document.querySelector(".hero");
  if(!canvas||!hero)return;
  const ctx=canvas.getContext("2d");if(!ctx)return;
  let w=1,h=1,frame=0,nextBurst=0,particles=[],running=false,raf=0;
  const palette=["#f5dd9c","#e9bd6a","#fff4d9","#d4a04a","#b68c42"];
  function resize(){
    const r=canvas.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);
    const scale=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(w*scale);canvas.height=Math.round(h*scale);
    ctx.setTransform(scale,0,0,scale,0,0);
  }
  function launch(){
    const x=w*(.52+Math.random()*.42),y=h*(.07+Math.random()*.55);
    const n=27+Math.floor(Math.random()*25),color=palette[Math.floor(Math.random()*palette.length)];
    for(let i=0;i<n;i++){
      const angle=(i/n)*Math.PI*2,velocity=.65+Math.random()*1.6;
      particles.push({x,y,px:x,py:y,vx:Math.cos(angle)*velocity,vy:Math.sin(angle)*velocity,age:0,life:50+Math.random()*45,color});
    }
  }
  function tick(){
    if(!running)return;
    frame++;ctx.clearRect(0,0,w,h);
    if(frame>nextBurst){launch();nextBurst=frame+95+Math.floor(Math.random()*125)}
    particles=particles.filter(p=>p.age<p.life);
    for(const p of particles){
      p.px=p.x;p.py=p.y;p.x+=p.vx;p.y+=p.vy;p.vy+=.007;p.vx*=.987;p.vy*=.987;p.age++;
      ctx.globalAlpha=Math.max(0,Math.sin(Math.PI*p.age/p.life)*.7);
      ctx.strokeStyle=p.color;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(p.px,p.py);ctx.lineTo(p.x,p.y);ctx.stroke();
      if(p.age%5===0){ctx.beginPath();ctx.arc(p.x,p.y,1.6,0,2*Math.PI);ctx.fillStyle=p.color;ctx.fill()}
    }
    ctx.globalAlpha=1;raf=requestAnimationFrame(tick);
  }
  function setRunning(value){
    if(running===value)return;
    running=value;
    if(running){resize();raf=requestAnimationFrame(tick)}else{cancelAnimationFrame(raf);ctx.clearRect(0,0,w,h)}
  }
  window.addEventListener("resize",resize,{passive:true});
  document.addEventListener("visibilitychange",()=>setRunning(!document.hidden && heroVisible));
  let heroVisible=true;
  if("IntersectionObserver" in window){
    const watch=new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;setRunning(heroVisible&&!document.hidden)},{threshold:0});
    watch.observe(hero);
  }else setRunning(true);
})();