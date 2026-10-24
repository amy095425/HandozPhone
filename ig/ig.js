const igProfile = { username: 'fakezhenzhen', name: '不是珍珍', posts: 42, followers: 22, following: 89, isPrivate: true };
const igIcons = {
 back:'<path d="m15 5-7 7 7 7"/>',home:'<path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z"/>',search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',plus:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 7v10M7 12h10"/>',reels:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M3 9h18M7 3l4 6m4-6 4 6m-9 3 6 3-6 3Z"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/>',grid:'<path d="M3 3h18v18H3ZM9 3v18m6-18v18M3 9h18M3 15h18"/>'
};
document.querySelectorAll('[data-ig-icon]').forEach(node=>{node.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${igIcons[node.dataset.igIcon]}</svg>`});
document.querySelectorAll('[data-ig-username]').forEach(node=>node.textContent=igProfile.username);
document.querySelector('#ig-name').textContent=igProfile.name;
if (igProfile.isPrivate) {
  const lock = document.createElement('span');lock.className = 'ig-private-lock';lock.setAttribute('aria-label','私密账号');
  lock.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="10" width="12" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>';
  document.querySelector('.ig-nav strong').prepend(lock);
  const label = document.createElement('p');label.className = 'ig-private-label';label.textContent = '私密账号';
  document.querySelector('.ig-profile-actions').before(label);
}

document.querySelector('#ig-stats').replaceChildren(...[['posts','帖子'],['followers','粉丝'],['following','关注']].map(([key,label])=>{
 const item=document.createElement('div');const value=document.createElement('strong');value.textContent=igProfile[key];const text=document.createElement('span');text.textContent=label;item.append(value,text);return item;
}));
const igAvatarImage = document.createElement('img');igAvatarImage.src='./ig/ig头像.png';igAvatarImage.alt='不是珍珍的头像';
document.querySelector('.ig-avatar').replaceChildren(igAvatarImage);
const igGridImages = [
 './ig/ig1.png', './ig/ig2.png', './ig/ig3.png', './ig/ig4.png',
 './ig/ig5.png', './ig/ig6.png', './ig/ig7.jpeg', './ig/ig8.jpg',
 './ig/ig9.jpeg', './ig/ig10.png', './ig/ig11.png', './ig/ig12.jpg'
].map((src,index)=>({id:`ig-photo-${index+1}`,src}));
document.querySelector('#ig-grid').replaceChildren(...igGridImages.map((photo,i)=>{
 const img=document.createElement('img');img.src=photo.src;img.alt=`帖子图片 ${i+1}`;img.loading='lazy';return img;
}));
const igStoryAudio = new Audio();igStoryAudio.preload='none';
const igStoryState = { images: [], index: 0, opener: null, token: 0 };
const igStoryOverlay = document.querySelector('#ig-story');
// 挂载在根节点，覆盖 App Tab 栏与全局悬浮层。
document.body.append(igStoryOverlay);
const igStorySteps = document.createElement('div');igStorySteps.className='ig-story-steps';
document.querySelector('.ig-story-card').prepend(igStorySteps);
const igStoryText = document.createElement('p');igStoryText.className='ig-story-text';igStoryText.hidden=true;document.querySelector('.ig-story-card').append(igStoryText);
const igStoryAvatar = document.createElement('span');igStoryAvatar.className='ig-story-header-avatar';
igStoryAvatar.innerHTML=document.querySelector('.ig-avatar').innerHTML;
document.querySelector('.ig-story-header').prepend(igStoryAvatar);
const igStoryStage = document.createElement('button');igStoryStage.type='button';igStoryStage.className='ig-story-stage';igStoryStage.setAttribute('aria-label','点击左侧返回上一张，右侧查看下一张');
const igStoryImage=document.querySelector('.ig-story-image');igStoryImage.replaceWith(igStoryStage);igStoryStage.append(igStoryImage);
const igStoryVideo = document.createElement('video');igStoryVideo.className='ig-story-video';igStoryVideo.muted=true;igStoryVideo.playsInline=true;igStoryVideo.loop=true;igStoryVideo.controls=false;igStoryVideo.hidden=true;igStoryStage.append(igStoryVideo);

let igResumeMusic=false;
let igStoryAudioInitialized=false;
function playIgStoryAudio(token) {
 if(token!==igStoryState.token || igStoryOverlay.hidden)return;
 igStoryAudio.play().then(()=>{
  if(token===igStoryState.token)document.querySelector('#ig-audio-status').textContent='';
 }).catch(error=>{
  if(token!==igStoryState.token)return;
  console.info('Story音乐未能自动播放，可点击播放按钮重试。',error.name);
  document.querySelector('#ig-audio-status').textContent='点击播放音乐';
 });
}
function prepareIgStoryAudio(config,token) {
 igStoryAudio.pause();
 igStoryAudio.onloadedmetadata=null;igStoryAudio.oncanplay=null;igStoryAudio.onerror=null;
 igStoryAudioInitialized=false;
 const requested=Number(config.startTime)||0;
 const initialize=()=>{
  if(token!==igStoryState.token || igStoryOverlay.hidden || igStoryAudioInitialized)return;
  if(!Number.isFinite(igStoryAudio.duration) || igStoryAudio.duration<=0)return;
  const offset=requested>=0 && requested<igStoryAudio.duration ? requested : 0;
  try { igStoryAudio.currentTime=offset; } catch(error) { console.info('Story音频定位暂不可用，等待加载。',error.name);return; }
  igStoryAudioInitialized=true;
  playIgStoryAudio(token);
 };
 igStoryAudio.onloadedmetadata=initialize;
 igStoryAudio.oncanplay=initialize;
 igStoryAudio.onerror=()=>{
  if(token!==igStoryState.token || igStoryOverlay.hidden)return;
  console.info('Story音乐文件加载失败。');
  document.querySelector('#ig-audio-status').textContent='音乐加载失败，请检查音频文件';
 };
 igStoryAudio.src=config.audio;igStoryAudio.loop=true;igStoryAudio.load();
}

function closeIgStory() {
 if(igStoryOverlay.hidden)return;
 igStoryState.token++;
 igStoryAudio.onloadedmetadata=null;igStoryAudio.oncanplay=null;igStoryAudio.onerror=null;igStoryAudioInitialized=false;
 igStoryAudio.pause();igStoryAudio.currentTime=0;igStoryVideo.pause();igStoryVideo.removeAttribute('src');igStoryVideo.load();igStoryOverlay.hidden=true;
 document.querySelector('#ig-main').inert=false;document.body.classList.remove('ig-story-open');
 if(igResumeMusic && typeof playMusic==='function')playMusic();igResumeMusic=false;
 if(document.body.dataset.activeApp==='ig')igStoryState.opener?.focus({preventScroll:true});
}
function openIgApp(){document.querySelector('#ig-scroll').scrollTop=0;}
function renderIgStoryImage() {
 const source=igStoryState.images[igStoryState.index];
 const isVideo=/\.(mp4|mov|webm)$/i.test(source);
 igStoryVideo.pause();igStoryVideo.hidden=!isVideo;igStoryImage.hidden=isVideo;
 if(isVideo){igStoryVideo.src=source;igStoryVideo.currentTime=0;igStoryVideo.play().catch(()=>{});}
 else {igStoryVideo.removeAttribute('src');igStoryVideo.load();igStoryImage.src=source;igStoryImage.alt=`Story图片 ${igStoryState.index+1}`;}

 igStorySteps.replaceChildren(...igStoryState.images.map((_,index)=>{
  const step=document.createElement('span');step.className=index===igStoryState.index?'is-current':'';step.setAttribute('aria-label',`第${index+1}张${index===igStoryState.index?'，当前':''}`);return step;
 }));
}
function moveIgStory(delta) {
 const next=igStoryState.index+delta;
 if(next>=igStoryState.images.length){closeIgStory();return;}
 igStoryState.index=Math.max(0,next);renderIgStoryImage();
}
function openIgStory(config,opener) {
 igStoryState.images=config.images;igStoryState.index=0;igStoryState.opener=opener;
 igStoryText.textContent=config.text || '';igStoryText.hidden=!config.text;
 const token=++igStoryState.token;
 if(igStoryOverlay.hidden)igResumeMusic=typeof musicIsPlaying!=='undefined'&&musicIsPlaying;
 if(typeof pauseMusic==='function')pauseMusic();
 igStoryOverlay.hidden=false;document.querySelector('#ig-main').inert=true;document.body.classList.add('ig-story-open');
 document.querySelector('#ig-story-close').focus({preventScroll:true});
 renderIgStoryImage();
 document.querySelector('.ig-story-music strong').textContent=config.title;
 document.querySelector('.ig-story-music small').textContent='背景音乐';
 document.querySelector('#ig-audio-status').textContent='';
 prepareIgStoryAudio(config,token);
}
document.querySelector('#ig-story-open').addEventListener('click',event=>openIgStory({images:['./其他/手机壁纸.png'],audio:'./音乐/music1.mp3',title:'우주를 줄게 · 脸红的思春期'},event.currentTarget));
const igToggle=document.querySelector('#ig-story-play');
function syncIgStory(){igToggle.textContent=igStoryAudio.paused?'播放':'暂停';document.querySelector('#ig-story-progress').value=Number.isFinite(igStoryAudio.duration)?igStoryAudio.currentTime/igStoryAudio.duration*100:0;}
['play','pause','timeupdate','ended'].forEach(event=>igStoryAudio.addEventListener(event,syncIgStory));
igToggle.addEventListener('click',()=>{if(!igStoryAudioInitialized){document.querySelector('#ig-audio-status').textContent='音乐加载中，请稍候';return;}if(igStoryAudio.paused)playIgStoryAudio(igStoryState.token);else igStoryAudio.pause()});
document.querySelector('#ig-story-close').addEventListener('click',closeIgStory);
igStoryOverlay.addEventListener('click',event=>{if(event.target===igStoryOverlay)closeIgStory()});
igStoryStage.addEventListener('click',event=>{
 const bounds=igStoryStage.getBoundingClientRect();moveIgStory(event.clientX-bounds.left<bounds.width/3?-1:1);
});
document.addEventListener('keydown',event=>{
 if(igStoryOverlay.hidden)return;
 if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeIgStory()}
 if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();event.stopImmediatePropagation();moveIgStory(event.key==='ArrowLeft'?-1:1)}
 if(event.key==='Tab'){
  const buttons=[...igStoryOverlay.querySelectorAll('button')],first=buttons[0],last=buttons[buttons.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 }
},true);

// 替换 cover 与 title 即可配置真实精选集。
const igHighlights = [
  { id: 1, title: 'LuvHurt', cover: './ig/story图片1.png', images: ['./ig/story图片1.png', './ig/story图片2.jpg', './ig/story图片3.png', './ig/story图片4.JPG'], audio: './ig/story音乐1.mp3', startTime: 44, text: '我从来没想过我会这样做 从来没爱过 所以爱错' },
  { id: 2, title: 'LightNight', cover: './ig/story图片5.jpeg', images: [
    './ig/story图片5.jpeg', './ig/story图片6.JPG', './ig/story图片7.jpeg',
    './ig/story图片8.jpeg', './ig/story图片9.JPG', './ig/story图片10.JPG',
    './ig/story图片11.jpeg', './ig/story图片12.JPG', './ig/story图片13.jpeg', './ig/story图片14.JPG'
  ], audio: './ig/story音乐2.mp3', startTime: 160, text: '🤭 2026.7.17 📌Grand Hyatt' },
  { id: 3, title: '和你', cover: './ig/story图片15.jpeg', images: [
    './ig/story图片15.jpeg', './ig/story图片16.jpeg', './ig/story图片17.MP4',
    './ig/story图片18.JPG', './ig/story图片19.jpg', './ig/story图片20.jpg'
  ], audio: './ig/story音乐3.mp3', startTime: 62, text: `我想和你赏最美的风景
看最长的电影 听动人的旋律
是因为你和我
会陪你到下个世纪
那是多么的幸运` }
];
const igHighlightItems = igHighlights;
document.querySelector('#ig-highlights').replaceChildren(...igHighlightItems.map((highlight) => {
  const button = document.createElement('button');button.type = 'button';button.className = 'ig-highlight';button.dataset.highlightId = highlight.id;
  button.setAttribute('aria-label', highlight.cover ? `精选集：${highlight.title}` : '新建精选集（占位）');
  const circle = document.createElement('span');circle.className = 'ig-highlight-circle';
  if (highlight.cover) {
    const image = document.createElement('img');image.src = highlight.cover;image.alt = '';image.draggable = false;circle.append(image);
  } else {
    circle.classList.add('ig-highlight-new');
    circle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  }
  const label = document.createElement('span');label.className = 'ig-highlight-label';label.textContent = highlight.title;
  if (highlight.images) button.addEventListener('click', () => openIgStory(highlight,button));
  button.append(circle,label);return button;
}));
