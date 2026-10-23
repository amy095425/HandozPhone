// 原始喜欢封面为 HEIC；网页引用同编号 JPEG 副本，原图保持不变。
const tiktokLikedCoverPaths = Array.from({ length: 15 }, (_, index) => `./tiktok/likes-covers/tt点赞${index + 1}.jpg`);
const tiktokData = {
  videos: Array.from({ length: 10 }, (_, index) => ({
    id: `tt-video-${index + 1}`,
    videoUrl: `./tiktok/tt视频${index + 1}.MP4`,
    author: 'TWS_PLEDIS', avatarUrl: './tiktok/tt头像.jpg',
    caption: '记录此刻。', liked: false
  })),
  likes: tiktokLikedCoverPaths.map((coverUrl, index) => ({ id: `tt-liked-${index + 1}`, coverUrl, videoUrl: '' })),
  works: []
};
const tiktokState = { active: false, tab: 'home', content: 'likes', videoIndex: 0, resumeMusic: false, musicTrack: null, isMuted: true, soundManuallyMuted: false };
const tiktokFeed = document.querySelector('#tiktok-video-feed');
const tiktokVideos = [];
const tiktokErrors = [];
const tiktokSoundButtons = [];
let tiktokPlaybackRequest = 0;
const isTikTokVideoVisible = () => tiktokState.active && tiktokState.tab === 'home' && !document.hidden;
const updateTikTokSoundButtons = () => tiktokSoundButtons.forEach(button => {
  const label = tiktokState.isMuted ? '开启声音' : '静音';
  button.setAttribute('aria-label', label);
  button.setAttribute('aria-pressed', String(!tiktokState.isMuted));
  button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4Z"/>${tiktokState.isMuted ? '<path d="m17 9 5 6m0-6-5 6"/>' : '<path d="M16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>'}</svg><span>${label}</span>`;
});
const setTikTokMuted = (muted, manual = false) => {
  tiktokState.isMuted = muted;
  if (manual) tiktokState.soundManuallyMuted = muted;
  tiktokVideos.forEach(video => { video.defaultMuted = muted; video.muted = muted; });
  updateTikTokSoundButtons();
};
const pauseTikTokVideos = () => {
  tiktokPlaybackRequest++;
  tiktokVideos.forEach(video => { video.autoplay = false; video.pause(); });
};
const playTikTokVideo = (index) => {
  if (!isTikTokVideoVisible() || !tiktokVideos[index]) return;
  const request = ++tiktokPlaybackRequest;
  if (musicIsPlaying) pauseMusic();
  tiktokState.videoIndex = index;
  tiktokVideos.forEach((video, otherIndex) => { if (index !== otherIndex) { video.autoplay = false; video.pause(); } });
  const video = tiktokVideos[index];
  video.muted = tiktokState.isMuted;
  video.defaultMuted = tiktokState.isMuted;
  video.volume = 1;
  video.autoplay = true;
  if (!video.getAttribute('src')) video.src = tiktokData.videos[index].videoUrl;
  const isCurrent = () => request === tiktokPlaybackRequest && isTikTokVideoVisible() && tiktokState.videoIndex === index;
  const played = () => {
    if (!isTikTokVideoVisible() || tiktokState.videoIndex !== index) video.pause();
    else if (isCurrent()) tiktokErrors[index].hidden = true;
  };
  const failed = () => {
    if (!isCurrent()) return;
    tiktokErrors[index].textContent = '轻点重试播放；请确认视频已下载到本机';
    tiktokErrors[index].hidden = false;
  };
  const result = video.play();
  if (result) result.then(played).catch(error => {
    if (!isCurrent()) return;
    if (error.name === 'NotAllowedError' && !video.muted) {
      // 有声自动播放被浏览器拦截时继续静音播放，用户可再点喇叭解锁。
      setTikTokMuted(true);
      const retry = video.play();
      if (retry) retry.then(played).catch(failed);
    } else failed();
  });
};
const unlockTikTokSoundFromGesture = () => {
  if (!isTikTokVideoVisible() || tiktokState.soundManuallyMuted || !tiktokState.isMuted) return;
  setTikTokMuted(false);
  playTikTokVideo(tiktokState.videoIndex);
};
tiktokFeed.replaceChildren(...tiktokData.videos.map((item, index) => {
  const card = document.createElement('article');
  card.className = 'tiktok-video-card';
  card.dataset.videoIndex = String(index);
  card.setAttribute('aria-label', `${item.author}，视频 ${index + 1}`);
  const video = document.createElement('video');
  video.className = 'tiktok-video';
  video.muted = tiktokState.isMuted;
  video.defaultMuted = tiktokState.isMuted;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.preload = 'none';
  video.controls = false;
  // 只在进入可视区域后挂载 src 并开启 autoplay，防止十段视频同时播放。
  const shade = document.createElement('div');
  shade.className = 'tiktok-video-shade';
  const caption = document.createElement('div');
  caption.className = 'tiktok-video-caption';
  const author = document.createElement('strong');
  author.textContent = item.author;
  const text = document.createElement('p');
  text.textContent = item.caption;
  caption.append(author, text);
  const actions = document.createElement('div');
  actions.className = 'tiktok-video-actions';
  const avatar = document.createElement('img');
  avatar.className = 'tiktok-publisher-avatar';
  avatar.src = item.avatarUrl;
  avatar.alt = `${item.author}头像`;
  avatar.draggable = false;
  const like = document.createElement('button');
  like.type = 'button';
  like.className = 'tiktok-like';
  like.setAttribute('aria-label', '点赞');
  like.setAttribute('aria-pressed', 'false');
  like.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 4.8a5.4 5.4 0 0 0-8.5 1 5.4 5.4 0 0 0-8.5 6.5L12 21l8.5-8.7a5.4 5.4 0 0 0 0-7.5Z"/></svg><span>喜欢</span>';
  like.addEventListener('click', () => {
    item.liked = !item.liked;
    like.classList.toggle('is-liked', item.liked);
    like.setAttribute('aria-pressed', String(item.liked));
    like.setAttribute('aria-label', item.liked ? '取消点赞' : '点赞');
  });
  const sound = document.createElement('button');
  sound.type = 'button';
  sound.className = 'tiktok-sound';
  sound.addEventListener('click', () => {
    setTikTokMuted(!tiktokState.isMuted, true);
    playTikTokVideo(index);
  });
  tiktokSoundButtons.push(sound);
  actions.append(avatar, like, sound);
  const error = document.createElement('button');
  error.type = 'button';
  error.className = 'tiktok-video-error';
  error.hidden = true;
  error.addEventListener('click', () => { video.load(); playTikTokVideo(index); });
  video.addEventListener('error', () => {
    error.textContent = '视频暂时无法播放，请确认本地文件已下载，轻点重试';
    error.hidden = false;
  });
  video.addEventListener('click', () => {
    if (video.muted) {
      setTikTokMuted(false, true);
      playTikTokVideo(index);
    } else if (video.paused) playTikTokVideo(index);
    else { tiktokPlaybackRequest++; video.pause(); }
  });
  card.append(video, shade, caption, actions, error);
  tiktokVideos.push(video);
  tiktokErrors.push(error);
  return card;
}));
updateTikTokSoundButtons();
let tiktokTouchStartY = null;
tiktokFeed.addEventListener('wheel', event => {
  if (event.deltaY) unlockTikTokSoundFromGesture();
}, { passive: true });
tiktokFeed.addEventListener('touchstart', event => { tiktokTouchStartY = event.touches[0]?.clientY; }, { passive: true });
tiktokFeed.addEventListener('touchend', event => {
  if (tiktokTouchStartY !== null && Math.abs((event.changedTouches[0]?.clientY ?? tiktokTouchStartY) - tiktokTouchStartY) > 24) unlockTikTokSoundFromGesture();
  tiktokTouchStartY = null;
}, { passive: true });
const renderTikTokProfileGrid = () => {
  const grid = document.querySelector('#tiktok-profile-grid');
  const entries = tiktokData[tiktokState.content];
  grid.setAttribute('aria-labelledby', `tiktok-${tiktokState.content}-tab`);
  grid.replaceChildren(...entries.map((item, index) => {
    const tile = document.createElement('div');
    tile.className = 'tiktok-grid-item';
    if (item.coverUrl) {
      const image = document.createElement('img');
      image.src = item.coverUrl;
      image.alt = `喜欢的视频封面 ${index + 1}`;
      image.loading = 'lazy';
      tile.append(image);
    } else {
      tile.setAttribute('aria-label', '视频封面待添加');
      tile.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8Z"/></svg>';
    }
    return tile;
  }));
  document.querySelector('#tiktok-profile-empty').hidden = entries.length > 0;
  document.querySelectorAll('[data-tiktok-content]').forEach(button => {
    const selected = button.dataset.tiktokContent === tiktokState.content;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-selected', String(selected));
  });
};
const showTikTokTab = (tab) => {
  tiktokState.tab = tab === 'profile' ? 'profile' : 'home';
  const home = tiktokState.tab === 'home';
  document.querySelector('.tiktok-shell').classList.toggle('is-profile-scrolled', !home && document.querySelector('#tiktok-profile-page').scrollTop > 0);
  document.querySelector('#tiktok-home-page').hidden = !home;
  document.querySelector('#tiktok-profile-page').hidden = home;
  document.querySelector('#tiktok-page-title').textContent = home ? '推荐' : 'Real JINJIN';
  document.querySelectorAll('[data-tiktok-tab]').forEach(button => {
    const selected = button.dataset.tiktokTab === tiktokState.tab;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  pauseTikTokVideos();
  if (home && tiktokState.active) window.requestAnimationFrame(() => playTikTokVideo(tiktokState.videoIndex));
};
const openTikTokApp = () => {
  if (!tiktokState.active) {
    tiktokState.resumeMusic = musicIsPlaying;
    tiktokState.musicTrack = activeMusicTrack;
  }
  tiktokState.active = true;
  if (musicIsPlaying) pauseMusic();
  tiktokState.content = 'likes';
  renderTikTokProfileGrid();
  showTikTokTab('home');
};
const exitTikTokApp = () => {
  if (!tiktokState.active) return;
  tiktokState.active = false;
  pauseTikTokVideos();
  const restore = tiktokState.resumeMusic && activeMusicTrack === tiktokState.musicTrack;
  tiktokState.resumeMusic = false;
  if (restore && !musicIsPlaying) playMusic();
};
document.querySelectorAll('[data-tiktok-tab]').forEach(button => button.addEventListener('click', () => showTikTokTab(button.dataset.tiktokTab)));
document.querySelector('#tiktok-profile-page').addEventListener('scroll', () => {
  document.querySelector('.tiktok-shell').classList.toggle('is-profile-scrolled', tiktokState.tab === 'profile' && document.querySelector('#tiktok-profile-page').scrollTop > 0);
}, { passive: true });
document.querySelectorAll('[data-tiktok-content]').forEach(button => button.addEventListener('click', () => {
  tiktokState.content = button.dataset.tiktokContent;
  renderTikTokProfileGrid();
}));
if ('IntersectionObserver' in window) {
  const ratios = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => ratios.set(Number(entry.target.dataset.videoIndex), entry.isIntersecting ? entry.intersectionRatio : 0));
    if (!isTikTokVideoVisible()) return pauseTikTokVideos();
    const visible = [...ratios].filter(([,ratio]) => ratio >= .6).sort((a,b) => b[1] - a[1]);
    if (visible.length) playTikTokVideo(visible[0][0]);
    else pauseTikTokVideos();
  }, { root: tiktokFeed, threshold: [0,.25,.6,.85,1] });
  [...tiktokFeed.children].forEach(card => observer.observe(card));
} else {
  tiktokFeed.addEventListener('scroll', () => {
    if (tiktokFeed.clientHeight) playTikTokVideo(Math.round(tiktokFeed.scrollTop / tiktokFeed.clientHeight));
  }, { passive: true });
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseTikTokVideos();
  else if (isTikTokVideoVisible()) playTikTokVideo(tiktokState.videoIndex);
});
renderTikTokProfileGrid();
