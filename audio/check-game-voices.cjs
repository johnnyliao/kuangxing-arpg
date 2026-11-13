const fs=require('node:fs');
const harness=`
addEventListener('load',async()=>{
 const checks=[];
 const assert=(ok,msg)=>{if(!ok)throw new Error(msg);checks.push(msg);};
 try{
  assert(Object.keys(voicePool).length===14,'14 production voice assets');
  await Promise.all(Object.values(voicePool).map(sound=>new Promise((resolve,reject)=>{
   if(sound.readyState>=2)return resolve();
   sound.addEventListener('loadeddata',resolve,{once:true});sound.addEventListener('error',()=>reject(new Error(sound.src)),{once:true});
   setTimeout(()=>reject(new Error('audio load timeout '+sound.src)),8000);
  })));
  for(const [id,sound] of Object.entries(voicePool)){
   assert(Number.isFinite(sound.duration)&&sound.duration>0,'decoded '+id);
   sound.volume=.01;await sound.play();sound.pause();sound.currentTime=0;
  }
  muted=false;voiceVolume=.7;resetVoices();
  assert(playVoice('light'),'light starts');
  assert(!playVoice('light'),'repeat cooldown');
  assert(playVoice('hurt'),'hurt preempts light');
  assert(!playVoice('heavy'),'lower priority cannot overlap');
  assert(playVoice('death'),'death preempts hurt');
  assert(!playVoice('rage'),'death has highest priority');
  muteBtn.click();assert(muted&&!voiceActive,'mute stops recorded voice');
  assert(!playVoice('ult'),'mute blocks playback');muteBtn.click();
  voiceSlider.value=0;voiceSlider.dispatchEvent(new Event('input'));
  assert(!playVoice('intro',true),'zero volume blocks playback');
  voiceSlider.value=65;voiceSlider.dispatchEvent(new Event('input'));
  assert(voiceValue.textContent==='65%','volume slider updates');
  startStage();assert(voiceActive?.event==='intro','stage intro hook');
  resetVoices();startAttack('light');assert(voiceActive?.event==='light','attack hook');
  resetVoices();P=newPlayer();keys.charge=true;updatePlayer(.016);
  assert(voiceActive?.event==='charge'&&VOICE_PACK.charge.source==='gckMhuWZRq8'&&VOICE_PACK.charge.file.endsWith('charge-kakarot-last-line-v1.mp3')&&VOICE_PACK.charge.duration===2.2,'charge uses only final Kakarot line');
  const chargeStarted=voiceLast.charge;stopVoice('charge');
  for(let i=0;i<400;i++)updatePlayer(.016);
  assert(!voiceActive&&voiceLast.charge===chargeStarted,'held charge never repeats voice');
  keys.charge=false;updatePlayer(.016);
  assert(P.state==='idle','charge release returns to idle');
  resetVoices();P=newPlayer();voiceSlider.focus();
  voiceSlider.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyI',bubbles:true}));updatePlayer(.016);
  assert(voiceActive?.event==='charge','I works while volume slider focused');
  voiceSlider.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyI',bubbles:true}));updatePlayer(.016);
  assert(P.state==='idle'&&voiceActive?.event==='charge','released I allows shout to finish');
  cv.focus();resetVoices();playVoice('victory',true);P=newPlayer();keys.charge=true;updatePlayer(.016);
  assert(voiceActive?.event==='charge','charge overrides other recorded voice');keys.charge=false;
  resetVoices();P=newPlayer();pressed.blast=true;updatePlayer(.016);delete pressed.blast;
  assert(P.state==='blast'&&voiceActive?.event==='blast','ki shot hook');
  resetVoices();P=newPlayer();P.rage=100;pressed.ult=true;updatePlayer(.016);delete pressed.ult;
  assert(P.state==='ult'&&voiceActive?.event==='ult'&&['victory','victory-alt'].includes(voiceActive.id),'ultimate uses laughter');
  resetVoices();P=newPlayer();hurtPlayer(1,0);assert(voiceActive?.event==='hurt','hurt hook');
  resetVoices();P=newPlayer();P.hp=P.maxhp*.35;hurtPlayer(1,0);assert(voiceActive?.event==='rage','berserk hook');
  resetVoices();P=newPlayer();hurtPlayer(999,0);assert(G.mode==='dead'&&voiceActive?.event==='death','death hook');
  startStage();resetVoices();G.bossDone=true;G.doneT=2.7;playStep(.016);
  assert(G.mode==='clear'&&voiceActive?.event==='victory','victory hook');
  enterStory();assert(!voiceActive,'story transition stops voice');
  startStage();resetVoices();G.sub=null;P.state='idle';P.inv=0;spawnEnemy('grunt',1);
  chatterT=0;updateChatter(.016);assert(voiceActive?.event==='ambient','occasional ambient voice');
  assert(chatterT>=16&&chatterT<=28,'ambient randomized interval');
  assert(playVoice('light'),'combat interrupts ambient voice');
  resetVoices();G.sub=null;P.state='charge';chatterT=0;updateChatter(30);
  assert(!voiceActive,'ambient avoids charging');
  P.state='ult';updateChatter(30);assert(!voiceActive,'ambient avoids ultimate');
  P.state='idle';G.mode='story';updateChatter(30);assert(!voiceActive,'ambient avoids story');
  G.mode='play';muted=true;updateChatter(30);assert(!voiceActive,'ambient respects mute');
  muted=true;startStage();spawnWave(['grunt','shooter']);
  for(let i=0;i<1500;i++){keys.charge=i%300<80;pressed.light=i%20===0;P.inv=1;step(1/60);if(i%60===0)render();for(const k in pressed)delete pressed[k];}
  assert(G.mode==='play','25 seconds gameplay with voice hooks');
  keys.charge=false;P.state='charge';P.x=300;P.y=430;P.face=1;render();
  voiceSlider.value=70;voiceSlider.dispatchEvent(new Event('input'));muted=false;
  muteBtn.textContent='聲音：開';muteBtn.setAttribute('aria-pressed','false');
  const el=document.createElement('pre');el.id='voice-qa';el.style.display='none';el.textContent='PASS '+checks.join(' | ');document.body.append(el);
 }catch(error){stopVoice();const el=document.createElement('pre');el.id='voice-qa';el.textContent='FAIL '+error.stack;document.body.append(el);}
});
`;
const source=fs.readFileSync('index.html','utf8');
const page=source.replace('<script>','<script>window.onerror=(m,s,l)=>{document.body.dataset.error=m+" line "+l;};')
 .replaceAll('requestAnimationFrame(frame);','')
 .replace(/cv\.focus\(\);\s*\}\)\(\);/,'cv.focus();\n'+harness+'\n})();');
fs.writeFileSync('voice-check.html',page);
