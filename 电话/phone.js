const phoneTabIcons = {
 favorites:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
 recents:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 3"/>',
 contacts:'<circle cx="12" cy="7" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/>',
 keypad:'<circle cx="5" cy="5" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="19" cy="5" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="19" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="19" cy="19" r="1"/>',
 voicemail:'<circle cx="6" cy="12" r="4"/><circle cx="18" cy="12" r="4"/><path d="M6 16h12"/>'
};
document.querySelectorAll('[data-phone-icon]').forEach(node=>{node.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${phoneTabIcons[node.dataset.phoneIcon]}</svg>`});
document.querySelector('#phone-history').replaceChildren(...callHistory.map(call=>{
 const row=document.createElement('div');row.className=`phone-call-row${call.type==='missed'?' is-missed':''}`;
 const avatar=document.createElement('span');avatar.className='phone-call-avatar';avatar.textContent='金';avatar.setAttribute('aria-hidden','true');
 const copy=document.createElement('div');copy.className='phone-call-copy';
 const name=document.createElement('strong');name.textContent=call.name;
 const label=document.createElement('small');label.textContent=`${call.label} · 韩国`;copy.append(name,label);
 const meta=document.createElement('div');meta.className='phone-call-meta';
 const date=document.createElement('span');date.textContent=call.date;
 const time=document.createElement('time');time.textContent=call.time;meta.append(date,time);
 const info=document.createElement('span');info.className='phone-call-info';info.setAttribute('aria-label',`${call.phone}，${call.label}`);info.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v.1"/></svg>';
 row.append(avatar,copy,meta,info);return row;
}));
function openPhoneApp(){showPhoneTab('recents');}

const phoneVoicemailState = { activeId: null, timer: null, elapsed: {}, rows: new Map() };
const phoneVoicemailIcon = (playing) => `<svg viewBox="0 0 24 24" aria-hidden="true">${playing?'<path d="M7 5h4v14H7zm7 0h4v14h-4Z"/>':'<path d="m8 4 12 8-12 8Z"/>'}</svg>`;
const phoneVoicemailSeconds = (item) => { const [m,s]=item.duration.split(':').map(Number);return m*60+s; };
function syncPhoneVoicemail(){
 voicemailData.forEach(item=>{
  const nodes=phoneVoicemailState.rows.get(item.id);if(!nodes)return;
  const playing=phoneVoicemailState.activeId===item.id;
  nodes.button.innerHTML=phoneVoicemailIcon(playing);nodes.button.setAttribute('aria-label',`${playing?'暂停':'模拟播放'}${item.sender}的留言`);
  nodes.button.setAttribute('aria-pressed',String(playing));nodes.dot.hidden=!item.isUnread;
  nodes.progress.value=phoneVoicemailState.elapsed[item.id]||0;
  nodes.row.classList.toggle('is-playing',playing);
 });
}
function stopPhoneVoicemail(){clearInterval(phoneVoicemailState.timer);phoneVoicemailState.timer=null;phoneVoicemailState.activeId=null;syncPhoneVoicemail();}
function togglePhoneVoicemail(item){
 if(phoneVoicemailState.activeId===item.id){stopPhoneVoicemail();return;}
 stopPhoneVoicemail();item.isUnread=false;
 if((phoneVoicemailState.elapsed[item.id]||0)>=phoneVoicemailSeconds(item))phoneVoicemailState.elapsed[item.id]=0;
 phoneVoicemailState.activeId=item.id;syncPhoneVoicemail();
 let last=Date.now();
 phoneVoicemailState.timer=setInterval(()=>{
  const now=Date.now();phoneVoicemailState.elapsed[item.id]=Math.min(phoneVoicemailSeconds(item),(phoneVoicemailState.elapsed[item.id]||0)+(now-last)/1000);last=now;
  if(phoneVoicemailState.elapsed[item.id]>=phoneVoicemailSeconds(item))stopPhoneVoicemail();else syncPhoneVoicemail();
 },200);
}
[...voicemailData].sort((a,b)=>Number(b.isUnread)-Number(a.isUnread)).forEach(item=>{
 const row=document.createElement('article');row.className='phone-voicemail-row';
 const header=document.createElement('div');header.className='phone-voicemail-header';
 const avatar=document.createElement('span');avatar.className='phone-call-avatar';avatar.textContent='金';
 const copy=document.createElement('div');copy.className='phone-voicemail-copy';
 const name=document.createElement('strong');name.textContent=item.sender;
 const dot=document.createElement('span');dot.className='phone-voicemail-dot';dot.setAttribute('aria-label','未读');name.append(dot);
 const date=document.createElement('small');date.textContent=`${item.date} ${item.time}`;copy.append(name,date);
 const button=document.createElement('button');button.type='button';button.className='phone-voicemail-play';button.addEventListener('click',()=>togglePhoneVoicemail(item));
 header.append(avatar,copy,button);
 const text=document.createElement('p');text.className='phone-voicemail-text';text.textContent=item.text;
 const controls=document.createElement('div');controls.className='phone-voicemail-progress';
 const progress=document.createElement('progress');progress.max=phoneVoicemailSeconds(item);progress.value=0;progress.setAttribute('aria-label','模拟播放进度');
 const duration=document.createElement('small');duration.textContent=item.duration;controls.append(progress,duration);
 row.append(header,text,controls);document.querySelector('#phone-voicemail-list').append(row);
 phoneVoicemailState.rows.set(item.id,{row,button,dot,progress});
});
function showPhoneTab(tab){
 stopPhoneVoicemail();document.querySelector('#phone-history').hidden=tab!=='recents';document.querySelector('#phone-voicemail').hidden=tab!=='voicemail';
 document.querySelector('#phone-page-title').textContent=tab==='recents'?'最近通话':'语音留言';
 document.querySelectorAll('[data-phone-tab]').forEach(button=>{if(button.dataset.phoneTab===tab)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
 document.querySelector('#phone-scroll').scrollTop=0;
}
document.querySelectorAll('[data-phone-tab]').forEach(button=>button.addEventListener('click',()=>showPhoneTab(button.dataset.phoneTab)));
window.addEventListener('pagehide',stopPhoneVoicemail);
syncPhoneVoicemail();
