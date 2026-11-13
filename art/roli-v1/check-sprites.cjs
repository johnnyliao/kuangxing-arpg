// Builds an isolated browser smoke-test page; no changes to production state.
const fs=require('node:fs');
const source=fs.readFileSync('index.html','utf8');
const harness=`
addEventListener('load',()=>{try{
  muted=true;
  const checks=[];
  const assert=(ok,msg)=>{if(!ok)throw new Error(msg);checks.push(msg);};
  assert(heroSheet.naturalWidth===860&&heroSheet.naturalHeight===1828,'hero atlas loaded');
  assert(fxSheet.naturalWidth===1254,'effects atlas loaded');
  startStage();spawnWave(['grunt','shooter']);
  for(const state of ['idle','walk','dash','blast','charge','ult','hurt']){
    P.state=state;P.t=state==='dash'?.09:state==='blast'?.1:state==='hurt'?.15:.5;
    P.walk=3;P.face=-1;P.fired=false;render();
    assert(heroFrame(P).row>=0,'render '+state);
  }
  for(let combo=0;combo<3;combo++){
    P.combo=combo;P.state='atk';P.atkd=ATK.light[combo];P.t=P.atkd.hitAt;
    assert(heroFrame(P).row===3+combo&&heroFrame(P).col===2,'combo '+combo+' contact');render();
  }
  P.atkd=ATK.heavy;P.t=.3;render();assert(heroFrame(P).row===6,'heavy');
  P.state='idle';P.hp=10;P.inv=0;hurtPlayer(1,0);assert(P.berserk&&spriteFx.length>0,'rage burst');
  for(let row=0;row<6;row++)for(let col=0;col<6;col++)energy(row,col,480,270,100,100);
  G.mode='dead';G.modeT=.9;render();assert(heroFrame(P).row===12&&heroFrame(P).col===5,'death final frame');
  G.mode='title';render();G.mode='story';G.line=0;render();
  startStage();spawnWave(['grunt','shooter']);P.x=300;P.state='charge';P.face=1;
  for(let i=0;i<1500;i++){keys.charge=i%300<80;pressed.light=i%20===0;pressed.blast=i%100===0;P.inv=1;step(1/60);if(i%60===0)render();for(const k in pressed)delete pressed[k];}
  assert(G.mode==='play','25 seconds gameplay simulation');
  P.state='charge';P.x=300;P.y=430;P.face=1;
  proj.push({owner:'p',x:600,y:420,z:78,vx:680,vy:0,r:13,dmg:11,life:1,col:'#aaff22'});
  burst(4,760,340,210);render();
  const out=document.createElement('pre');out.id='qa-result';out.textContent='PASS '+checks.join(' | ');document.body.append(out);
}catch(error){const out=document.createElement('pre');out.id='qa-result';out.textContent='FAIL '+error.stack;document.body.append(out);}});
`;
const test=source.replace(/<link[^>]*>/g,'').replace('<script>','<script>window.onerror=(m,s,l)=>{document.body.dataset.error=m+" line "+l;};').replaceAll('requestAnimationFrame(frame);','').replace(/cv\.focus\(\);\s*\}\)\(\);/,'cv.focus();\n'+harness+'\n})();');
fs.writeFileSync('sprite-check.html',test);
