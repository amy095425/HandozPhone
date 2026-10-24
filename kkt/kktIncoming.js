const kktIncomingQueue = [
 '在吗？我在和志薰买雪糕，你想吃吗？',
 '在忙吗？',
 '怎么不回消息？',
 '那我还是拿那几个口味了哦',
 '回头放冰柜第三格，饿了记得吃',
 '但是不能替饭😠'
];
const kktIncomingState = { timer: null, sent: 0, generation: 0, started: false };
function cancelKktIncoming() {
 kktIncomingState.generation++;
 clearTimeout(kktIncomingState.timer);
 kktIncomingState.timer=null;
}
function isKktIncomingChatActive() {
 return document.body.dataset.activeApp==='kakaotalk' && kktState.friendId===2 && !document.querySelector('#kkt-chat-page').hidden;
}
function showKktIncomingBanner(message) {
 showNotification({appName:'KakaoTalk',appIcon:'./kkt/图标.png',sender:message.sender,message:message.text,targetApp:'kakaotalk',chatId:2,time:message.time});
}
function appendKktIncomingMessage(text) {
 const now=new Date();const date=`${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日`;
 const message={ sender:'🐺道勋哥',text,isMe:false,time:`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}` };
 const groups=kktChatData['🐺道勋哥'];let group=groups[groups.length-1];
 const active=isKktIncomingChatActive();
 const list=document.querySelector('#kkt-messages');
 if(!group || group.date!==date){group={date,items:[]};groups.push(group);if(active){const divider=document.createElement('div');divider.className='kkt-date-divider';divider.textContent=date;list.append(divider);}}
 group.items.push(message);
 updateKktIncomingUnread(message.sender,active);
 if(active){
  const row=document.createElement('div');row.className='kkt-message kkt-message-arriving';row.setAttribute('aria-label',message.sender);
  const bubble=document.createElement('div');bubble.className='kkt-bubble';bubble.textContent=message.text;
  const time=document.createElement('small');time.textContent=message.time;row.append(bubble,time);list.append(row);
  list.scrollTo({top:list.scrollHeight,behavior:'smooth'});
 }
 showKktIncomingBanner(message);
}
function startKktIncoming(friend) {
 if(friend.id!==2 || kktIncomingState.started || kktIncomingState.sent>=kktIncomingQueue.length)return;
 kktIncomingState.started=true;
 const generation=kktIncomingState.generation;
 const deliver=()=>{
  if(generation!==kktIncomingState.generation)return;
  appendKktIncomingMessage(kktIncomingQueue[kktIncomingState.sent]);kktIncomingState.sent++;
  if(kktIncomingState.sent<kktIncomingQueue.length)kktIncomingState.timer=setTimeout(deliver,1500);
  else kktIncomingState.timer=null;
 };
 kktIncomingState.timer=setTimeout(deliver,180000);
}
window.addEventListener('pagehide',cancelKktIncoming);
