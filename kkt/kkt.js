const kakaotalkFriends = [
 { id: 2, name: '🐺道勋哥', statusMsg: '', avatar: 'default-gray', messages: [] },
 { id: 3, name: '申惟哥', statusMsg: '', avatar: 'default-gray', messages: [] },
 { id: 4, name: '英宰哥', statusMsg: '', avatar: 'default-gray', messages: [] },
 { id: 5, name: '水母志薰', statusMsg: '', avatar: 'default-gray', messages: [] },
 { id: 6, name: '炅潣', statusMsg: '', avatar: 'default-gray', messages: [] },
 { id: 7, name: 'Manager', statusMsg: '', avatar: 'default-gray', messages: [] },
 { id: 8, name: 'Staff', statusMsg: '', avatar: 'default-gray', messages: [] },
 { id: 9, name: '魅力爆表六人组', statusMsg: '', avatar: 'default-group', isGroup: true,
   members: ['申惟哥', '英宰哥', '水母志薰', '🐺道勋哥', '炅潣', '韩振'], messages: [] }
];
const kktState = { tab: 'chats', friendId: null, unreadCount: Object.fromEntries(Object.keys(kktChatData).map(name=>[name,0])) };
function syncKktUnreadBadge(){
 badgeCounts.kakaotalk=Object.values(kktState.unreadCount).reduce((sum,count)=>sum+count,0);
 persistBadgeCounts();updateAppBadges();
}
function updateKktIncomingUnread(name,isRead){
 kktState.unreadCount[name]=isRead?0:(kktState.unreadCount[name]||0)+1;
 syncKktUnreadBadge();renderKktList();
}
const kktIcons = {
 group:'<circle cx="9" cy="7" r="3.5"/><path d="M2 21v-2a7 7 0 0 1 14 0v2M16 4a3.5 3.5 0 0 1 0 7m3 10v-2a7 7 0 0 0-3-5"/>',
 back:'<path d="m15 5-7 7 7 7"/>',user:'<circle cx="12" cy="7" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/>',chat:'<path d="M21 11a9 8 0 0 1-11 8l-6 3 1-6a8 8 0 1 1 16-5Z"/>',search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',add:'<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a7 7 0 0 1 14 0M19 6v8m-4-4h8"/>',settings:'<circle cx="12" cy="12" r="4"/><path d="m9 3 6 0 1 4 4 1 1 6-4 2-1 4-6 1-2-4-4-1-1-6 4-2Z"/>',more:'<circle cx="4" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="20" cy="12" r="1"/>',plus:'<path d="M12 4v16M4 12h16"/>',send:'<path d="m4 4 17 8-17 8 3-8-3-8ZM7 12h14"/>'
};
const kktSvg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${kktIcons[name]}</svg>`;
document.querySelectorAll('[data-kkt-icon]').forEach(node=>{node.innerHTML=kktSvg(node.dataset.kktIcon)});
function kktDefaultAvatar(isGroup=false){const avatar=document.createElement('span');avatar.className='kkt-avatar';avatar.innerHTML=kktSvg(isGroup?'group':'user');return avatar;}
function renderKktList(){
 const list=document.querySelector('#kkt-friends');
 list.replaceChildren(...Object.entries(kktChatData).map(([name,groups])=>{
  const friend=kakaotalkFriends.find(item=>item.name===name)||{id:name,name,isGroup:false,messages:[]};
  const lastGroup=[...groups].reverse().find(group=>group.items.length);
  const latest=lastGroup?.items[lastGroup.items.length-1];
  const row=document.createElement('button');row.type='button';row.className='kkt-friend';row.dataset.kktChat=name;
  const copy=document.createElement('span');copy.className='kkt-friend-copy';
  const title=document.createElement('strong');title.textContent=name;
  if(friend.isGroup){const count=document.createElement('span');count.className='kkt-group-count';count.textContent=` ${friend.members.length}`;title.append(count);}
  const preview=document.createElement('small');preview.className='kkt-chat-preview';preview.textContent=latest?`${latest.isMe?'我: ':''}${latest.text}`:'';
  copy.append(title,preview);
  const meta=document.createElement('span');meta.className='kkt-chat-meta';
  const date=document.createElement('small');date.textContent=lastGroup?lastGroup.date.replace(/^\d{4}年/,''):'';meta.append(date);
  const unread=kktState.unreadCount[name]||0;
  if(unread>0){const badge=document.createElement('span');badge.className='kkt-unread-count';badge.textContent=unread>99?'99+':unread;meta.append(badge);}
  row.setAttribute('aria-label',`${name}${unread?`，${unread}条未读`:''}`);
  row.append(kktDefaultAvatar(friend.isGroup),copy,meta);row.addEventListener('click',()=>openKktChat(friend));return row;
 }));
}
function showKktList(){
 kktState.tab='chats';kktState.friendId=null;
 document.querySelector('#kkt-list-page').hidden=false;document.querySelector('#kkt-chat-page').hidden=true;
 document.querySelector('#kkt-title').textContent='聊天';
 document.querySelector('#kkt-self').hidden=true;
 document.querySelector('#kkt-list-label').textContent=`聊天 ${Object.keys(kktChatData).length}`;
 document.querySelectorAll('[data-kkt-tab]').forEach(button=>{button.classList.add('is-selected');button.setAttribute('aria-current','page')});
 renderKktList();syncKktUnreadBadge();
}
function openKakaoTalkApp(){showKktList();document.querySelector('#kkt-list-scroll').scrollTop=0;}
function openKktChat(friend){
 kktState.friendId=friend.id;
 kktState.unreadCount[friend.name]=0;syncKktUnreadBadge();
 document.querySelector('#kkt-list-page').hidden=true;document.querySelector('#kkt-chat-page').hidden=false;
 document.querySelector('#kkt-chat-name').textContent=friend.name;
 const messages=document.querySelector('#kkt-messages');
 const groups = kktChatData[friend.name] || (friend.messages.length ? [{ date: '', items: friend.messages }] : []);
 const fragment = document.createDocumentFragment();
 groups.forEach(group=>{
  if(group.date){const date=document.createElement('div');date.className='kkt-date-divider';date.textContent=group.date;fragment.append(date);}
  group.items.forEach((message,index)=>{
   const previous=group.items[index-1];
   const row=document.createElement('div');row.className=`kkt-message${message.isMe?' is-me':''}${previous&&previous.isMe===message.isMe&&previous.sender===message.sender?' is-consecutive':''}`;
   row.setAttribute('aria-label',message.sender);
   const bubble=document.createElement('div');bubble.className='kkt-bubble';bubble.textContent=message.text;
   if(friend.isGroup&&!message.isMe){
    const body=document.createElement('div');body.className='kkt-group-message-body';
    const sender=document.createElement('small');sender.className='kkt-group-sender';sender.textContent=message.sender;
    body.append(sender,bubble);row.append(body);
   }else row.append(bubble);
   if(message.time){const time=document.createElement('small');time.textContent=message.time;row.append(time);}
   fragment.append(row);
  });
 });
 messages.replaceChildren(fragment);
 requestAnimationFrame(()=>{if(kktState.friendId===friend.id&&!document.querySelector('#kkt-chat-page').hidden)messages.scrollTop=messages.scrollHeight;});
 document.querySelector('#kkt-chat-back').focus({preventScroll:true});
 startKktIncoming(friend);
}
document.querySelector('#kkt-chat-back').addEventListener('click',()=>{showKktList(kktState.tab);document.querySelector('#kkt-list-page [data-close-app]').focus({preventScroll:true})});
document.querySelectorAll('[data-kkt-tab]').forEach(button=>button.addEventListener('click',()=>showKktList(button.dataset.kktTab)));
renderKktList();

syncKktUnreadBadge();
