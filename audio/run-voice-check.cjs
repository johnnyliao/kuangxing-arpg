const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path');
require('./check-game-voices.cjs');
const browsers=[
 'C:/Users/1704032/AppData/Local/ms-playwright/chromium_headless_shell-1161/chrome-win/headless_shell.exe',
 'C:/Program Files/Google/Chrome/Application/chrome.exe',
 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
];
const browser=browsers.find(p=>fs.existsSync(p));
if(!browser)throw new Error('No supported local browser');
const url=new URL('file:///'+path.resolve('voice-check.html').replaceAll('\\','/')).href;
const result=cp.spawnSync(browser,['--headless','--no-sandbox','--disable-gpu','--allow-file-access-from-files','--autoplay-policy=no-user-gesture-required','--virtual-time-budget=12000','--window-size=1200,820','--screenshot=audio/gameplay-with-voices.png','--dump-dom',url],{encoding:'utf8',timeout:60000,maxBuffer:5*1024*1024});
fs.writeFileSync('audio/voice-check-result.html',result.stdout||'');
const match=(result.stdout||'').match(/<pre id="voice-qa"[^>]*>([\s\S]*?)<\/pre>/);
console.log(match?.[1]||result.error||'FAIL: No completed browser report');
const error=(result.stdout||'').match(/<body[^>]*data-error="([^"]*)/);
if(error)console.log('Browser error:',error[1]);
if(!match?.[1].startsWith('PASS')||error)process.exitCode=1;
