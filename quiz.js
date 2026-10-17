(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  if (!$("quiz-app")) return;
  const bank = [
    {cat:"newyear",q:"In which country is New Year's Eve traditionally called Hogmanay?",a:["Ireland","Scotland","Wales","Norway"],c:1,why:"Hogmanay is the Scottish name for New Year's Eve."},
    {cat:"newyear",q:"Which poet is closely associated with the lyrics of Auld Lang Syne?",a:["William Wordsworth","John Keats","Robert Burns","Lord Byron"],c:2,why:"Robert Burns recorded and adapted the words to Auld Lang Syne."},
    {cat:"newyear",q:"What is 'first-footing' in Hogmanay tradition?",a:["The first visitor after midnight","The first dance of the year","Taking a New Year's walk","The first meal of January"],c:0,why:"First-footing is the tradition of being the first person to enter a home after midnight."},
    {cat:"newyear",q:"In which US city does the famous Times Square ball drop happen?",a:["Chicago","Las Vegas","Los Angeles","New York City"],c:3,why:"The New Year's Eve ball drop takes place at Times Square in New York City."},
    {cat:"newyear",q:"Which date is New Year's Day in the Gregorian calendar?",a:["31 December","1 January","2 January","6 January"],c:1,why:"In the Gregorian calendar, the new year begins on 1 January."},
    {cat:"newyear",q:"Which Scottish city hosts major Hogmanay street celebrations?",a:["Dundee","Aberdeen","Edinburgh","Perth"],c:2,why:"Edinburgh is well known for its large Hogmanay celebrations."},
    {cat:"newyear",q:"Which of these was traditionally brought by a first-footer as a symbol of warmth?",a:["Coal","A candle","A bell","A ribbon"],c:0,why:"Coal was a traditional first-footing gift, symbolising warmth for the home."},
    {cat:"newyear",q:"What do people traditionally count down to on New Year's Eve?",a:["Sunrise","The first snowfall","Midnight","The evening meal"],c:2,why:"The New Year's Eve countdown marks the arrival of midnight."},
    {cat:"newyear",q:"Which month immediately follows December?",a:["February","March","January","November"],c:2,why:"January follows December and starts the new calendar year."},
    {cat:"general",q:"What is the largest ocean on Earth?",a:["Atlantic","Indian","Pacific","Arctic"],c:2,why:"The Pacific Ocean is Earth's largest ocean."},
    {cat:"general",q:"How many sides does a hexagon have?",a:["Five","Six","Seven","Eight"],c:1,why:"A hexagon is a polygon with six sides."},
    {cat:"general",q:"What is the chemical symbol for gold?",a:["Ag","Fe","Au","Cu"],c:2,why:"Au is the symbol for gold, from the Latin word aurum."},
    {cat:"general",q:"Which planet is commonly called the Red Planet?",a:["Mars","Venus","Saturn","Mercury"],c:0,why:"Mars appears reddish because of iron oxide on its surface."},
    {cat:"general",q:"What is 2 multiplied by itself five times (2⁵)?",a:["10","16","25","32"],c:3,why:"2 × 2 × 2 × 2 × 2 = 32."},
    {cat:"general",q:"What is the capital city of Canada?",a:["Toronto","Vancouver","Ottawa","Montreal"],c:2,why:"Ottawa is Canada's capital city."},
    {cat:"general",q:"At standard atmospheric pressure, water freezes at what Celsius temperature?",a:["0°C","5°C","10°C","−10°C"],c:0,why:"Pure water freezes at 0°C under standard atmospheric pressure."},
    {cat:"general",q:"What is the largest living animal?",a:["African elephant","Blue whale","Giraffe","Orca"],c:1,why:"The blue whale is the largest known animal alive today."},
    {cat:"general",q:"How many minutes are there in three hours?",a:["120","150","180","210"],c:2,why:"Three hours at 60 minutes per hour makes 180 minutes."},
    {cat:"pop",q:"What is the name of the cowboy toy in Toy Story?",a:["Buzz","Rex","Woody","Slinky"],c:2,why:"Woody is the cowboy toy and one of the central characters in Toy Story."},
    {cat:"pop",q:"What is the name of Mario's green-clad brother?",a:["Wario","Luigi","Yoshi","Toad"],c:1,why:"Luigi is Mario's brother in the Nintendo games."},
    {cat:"pop",q:"In Harry Potter, what is the name of the school of witchcraft and wizardry?",a:["Hogwarts","Durmstrang","Beauxbatons","Ilvermorny"],c:0,why:"Harry Potter attends Hogwarts School of Witchcraft and Wizardry."},
    {cat:"pop",q:"Which band recorded Bohemian Rhapsody?",a:["ABBA","The Beatles","Queen","Fleetwood Mac"],c:2,why:"Queen released Bohemian Rhapsody in 1975."},
    {cat:"pop",q:"Which country did the pop group ABBA come from?",a:["Denmark","Norway","Finland","Sweden"],c:3,why:"ABBA formed in Sweden."},
    {cat:"pop",q:"What is the name of the young lion in The Lion King?",a:["Mufasa","Simba","Scar","Timon"],c:1,why:"Simba is the young lion who grows up to become king."},
    {cat:"pop",q:"What is the snowman's name in Frozen?",a:["Kristoff","Sven","Olaf","Hans"],c:2,why:"Olaf is the friendly snowman in Disney's Frozen."},
    {cat:"pop",q:"What kind of animal is Shrek's sidekick Donkey?",a:["Horse","Donkey","Mule","Goat"],c:1,why:"Shrek's talkative sidekick is a donkey named Donkey."},
    {cat:"pop",q:"In the Pokémon series, which Pokémon is Ash's famous yellow companion?",a:["Charmander","Eevee","Pikachu","Bulbasaur"],c:2,why:"Pikachu is Ash's iconic partner in Pokémon."}
  ];
  const setup=$("quiz-setup"),play=$("quiz-playing"),finish=$("quiz-complete"),clock=$("quiz-clock");
  const leaderboard=$("quiz-leaderboard"),storeKey="hogmanay-family-quiz-board-v1";
  const selection={category:"mixed",timed:false};
  let questions=[],position=0,points=0,streak=0,bestStreak=0,answered=false,timer=null,seconds=15,player="Guest";
  function readBoard(){try{const a=JSON.parse(localStorage.getItem(storeKey)||"[]");return Array.isArray(a)?a.filter(x=>x&&typeof x.name==="string"&&Number.isFinite(x.score)).slice(0,10):[]}catch{return []}}
  function saveBoard(entry){const a=[...readBoard(),entry].sort((x,y)=>y.score-x.score||y.correct-x.correct).slice(0,7);try{localStorage.setItem(storeKey,JSON.stringify(a))}catch{};renderBoard()}
  function renderBoard(){leaderboard.replaceChildren();const entries=readBoard();if(!entries.length){const li=document.createElement("li");li.textContent="Your name could be here!";leaderboard.append(li);return}entries.forEach(x=>{const li=document.createElement("li");const name=document.createElement("strong");name.textContent=x.name;const number=document.createElement("span");number.textContent=x.score+" PTS";li.append(name,number);leaderboard.append(li)})}
  function shuffle(source){const a=[...source];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function clearClock(){if(timer!==null){clearInterval(timer);timer=null}}
  function switchScreen(which){setup.classList.toggle("hidden",which!=="setup");play.classList.toggle("hidden",which!=="play");finish.classList.toggle("hidden",which!=="finish")}
  function categoryClick(e){const button=e.target.closest("[data-category]");if(!button)return;selection.category=button.dataset.category;document.querySelectorAll(".category-chip").forEach(b=>{const active=b===button;b.classList.toggle("selected",active);b.setAttribute("aria-pressed",String(active))})}
  $("quiz-categories").addEventListener("click",categoryClick);
  function begin(){
    clearClock();selection.timed=$("quiz-timed").checked;player=$("quiz-player").value.trim().slice(0,22)||"Mystery Guest";
    const pool=selection.category==="mixed"?bank:bank.filter(q=>q.cat===selection.category);
    questions=shuffle(pool).slice(0,selection.category==="mixed"?10:8);
    position=0;points=0;streak=0;bestStreak=0;
    switchScreen("play");showQuestion();
  }
  function showQuestion(){
    clearClock();answered=false;
    const q=questions[position];
    $("quiz-progress-text").textContent="QUESTION "+(position+1)+" / "+questions.length;
    $("quiz-live-score").textContent="SCORE "+points;
    $("quiz-progress-bar").style.width=((position+1)/questions.length*100)+"%";
    $("quiz-question").textContent=q.q;
    $("quiz-feedback").textContent="";
    $("quiz-next").classList.add("hidden");
    const options=$("quiz-answers");options.replaceChildren();
    q.a.forEach((label,i)=>{const b=document.createElement("button");b.type="button";b.className="quiz-answer";b.dataset.index=String(i);const letter=document.createElement("span");letter.textContent="ABCD"[i];const t=document.createElement("strong");t.textContent=label;b.append(letter,t);b.addEventListener("click",()=>answer(i));options.append(b)});
    if(selection.timed){seconds=15;clock.textContent="⏱ "+seconds+"s";timer=setInterval(()=>{seconds--;clock.textContent="⏱ "+Math.max(0,seconds)+"s";if(seconds<=0)answer(-1)},1000)}
    else clock.textContent="CHILL MODE";
  }
  function answer(i){
    if(answered)return;answered=true;clearClock();
    const q=questions[position];const right=i===q.c;
    if(right){streak++;bestStreak=Math.max(bestStreak,streak);points+=100+(streak>1?25:0)+(selection.timed?Math.max(0,seconds)*2:0)}
    else streak=0;
    [...$("quiz-answers").children].forEach((b,j)=>{b.disabled=true;if(j===q.c)b.classList.add("correct");if(j===i&&!right)b.classList.add("wrong")});
    $("quiz-live-score").textContent="SCORE "+points;
    $("quiz-feedback").textContent=(right?"✓ NAILED IT! ":"✕ "+(i===-1?"TIME'S UP! ":"NOT QUITE! "))+q.why;
    $("quiz-next").classList.remove("hidden");
    $("quiz-next").firstChild.textContent=position===questions.length-1?"SEE MY RESULTS ":"NEXT QUESTION ";
  }
  function next(){
    if(!answered)return;
    position++;if(position<questions.length){showQuestion()}else end();
  }
  function end(){
    clearClock();switchScreen("finish");
    const correctCount=questions.reduce((n,q,i)=>n,0); // individual correct answers are tracked separately below
    const hits=hitsThisRound;
    $("quiz-final-score").textContent=hits+" / "+questions.length;
    $("quiz-result-heading").textContent=hits===questions.length?"QUIZ LEGEND.":hits>=Math.ceil(questions.length*.7)?"VERY IMPRESSIVE.":hits>=Math.ceil(questions.length*.4)?"NOT TOO SHABBY.":"ROOM TO IMPROVE!";
    $("quiz-result-message").textContent=player+", you scored "+points+" points with "+hits+" correct answers. Best streak: "+bestStreak+".";
    saveBoard({name:player,score:points,correct:hits});
  }
  let hitsThisRound=0;
  const oldBegin=begin;
  $("quiz-start").addEventListener("click",()=>{hitsThisRound=0;oldBegin()});
  const originalAnswer=answer;
  // Count a correct response as soon as it is selected without counting repeat taps.
  // The answer callback itself is wrapped through the button handlers below.
  $("quiz-answers").addEventListener("click",e=>{
    const b=e.target.closest("button[data-index]");
    if(!b)return;
    // Child button click runs the per-question handler first. Count via its marked state.
    if(b.classList.contains("correct")&&Number(b.dataset.index)===questions[position].c&&!b.dataset.counted){hitsThisRound++;b.dataset.counted="1"}
  });
  $("quiz-next").addEventListener("click",next);
  $("quiz-again").addEventListener("click",()=>{clearClock();switchScreen("setup");$("quiz-player").focus()});
  renderBoard();
})();