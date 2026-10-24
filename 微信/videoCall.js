// 仅“勋❤️”会话使用；消息保存在既有 wechatChatData 中，刷新后恢复原始数据。
const wechatVideoCallConfig = {
  videoUrl: './微信/video-call.MP4',
  newMessages: ['路过汉江了', '哇塞，漂亮得简直不像话', '看到樱花就想起你的脸了', '我好像只是单纯的在想你'],
  afterCallMessages: [
    '怎么不开摄像头也不说话？',
    '在忙吗？是不是打扰你了？',
    '想和你见面了',
    '我现在回公司找你吧，然后我们再一起来汉江',
    '实在是太想见到你了'
  ]
};
const wechatCallState = {
  chatId: null, hasTriggeredCall: false, ready: false, stage: 'idle', replay: false,
  timers: [], lastTop: 0, touchY: null, resumeMusic: false, musicTrack: null
};
// 首次通话后剧情只触发一次，重播不重复发送。
const wechatCallStoryState = { started: false };
const wechatCallPhoneSvg = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 19c6-7 18-7 24 0l-2 5-7-2v-4h-6v4l-7 2Z"/></svg>';
const wechatCallVideoSvg = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="8" width="17" height="17" rx="3"/><path d="m20 13 9-5v17l-9-5Z"/></svg>';
const wechatCallHost = document.createElement('div');
wechatCallHost.innerHTML = `
  <section class="wechat-call-incoming" id="wechat-call-incoming" role="dialog" aria-modal="true" aria-label="勋❤️的视频通话邀请" hidden>
    <div class="wechat-call-person"><img src="./微信/金道勋头像.png" alt="勋头像"><div><strong>勋❤️</strong><p>邀请你进行视频通话...</p></div></div>
    <div class="wechat-call-actions">
      <button class="wechat-call-control" id="wechat-call-decline" type="button"><span>${wechatCallPhoneSvg}</span>挂断</button>
      <button class="wechat-call-control is-answer" id="wechat-call-answer" type="button"><span>${wechatCallVideoSvg}</span>接听</button>
    </div>
  </section>
  <section class="wechat-call-layer" id="wechat-call-player" role="dialog" aria-modal="true" aria-label="与勋❤️的视频通话" hidden>
    <video class="wechat-call-video" id="wechat-call-video" playsinline preload="none"></video>
    <div class="wechat-call-video-title">勋❤️</div>
    <p class="wechat-call-play-error" id="wechat-call-play-error" hidden></p>
    <button class="wechat-call-control wechat-call-hangup" id="wechat-call-hangup" type="button"><span>${wechatCallPhoneSvg}</span>挂断</button>
  </section>`;
document.body.append(wechatCallHost);
const wechatCallIncoming = document.querySelector('#wechat-call-incoming');
const wechatCallPlayer = document.querySelector('#wechat-call-player');
const wechatCallVideo = document.querySelector('#wechat-call-video');
const wechatCallError = document.querySelector('#wechat-call-play-error');
wechatCallVideo.controls = false;
wechatCallVideo.src = wechatVideoCallConfig.videoUrl;

const isWechatXunChatActive = () => document.body.dataset.activeApp === 'wechat'
  && wechatCallState.chatId === 'xun'
  && document.querySelector('#wechat-chat-page').classList.contains('is-current');
const scheduleWechatCall = (callback, delay) => {
  const timer = window.setTimeout(() => { if (isWechatXunChatActive()) callback(); }, delay);
  wechatCallState.timers.push(timer);
};
const scrollWechatCallToLatest = (smooth = false) => window.requestAnimationFrame(() => {
  if (!isWechatXunChatActive()) return;
  wechatMessageScroll.scrollTo({ top: wechatMessageScroll.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
});
const appendWechatXunMessage = (text, isVideoCallRecord = false, isMe = false, smooth = false) => {
  const now = new Date();
  const date = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
  const groups = wechatChatData.xun.messages;
  let group = groups[groups.length - 1];
  if (!group || group.date !== date) {
    group = { date, items: [] };
    groups.push(group);
  }
  const message = { sender: isMe ? wechatChatData.xun.myName : '勋❤️', text, isMe };
  if (isVideoCallRecord) message.isVideoCallRecord = true;
  group.items.push(message);
  if (isWechatXunChatActive()) {
    const previousTop = wechatMessageScroll.scrollTop;
    renderWechatChat('xun');
    wechatMessageScroll.scrollTop = previousTop;
    const rows = wechatMessageScroll.querySelectorAll('.wechat-message-row');
    rows[rows.length - 1]?.classList.add('is-new');
    scrollWechatCallToLatest(smooth);
  }
  document.querySelector('[data-wechat-chat="xun"] .wechat-chat-preview').textContent = text;
  if (!isMe && !isVideoCallRecord) {
    showNotification({appName:'微信',appIcon:'./微信/微信图标.png',sender:'勋❤️',message:text,targetApp:'wechat',chatId:'xun'});
  }

};
const beginWechatCallStory = () => {
  if (wechatCallStoryState.started) return;
  wechatCallStoryState.started = true;
  // 消息写入原会话；若切到其他聊天，不会插入其他聊天的页面。
  wechatVideoCallConfig.afterCallMessages.forEach((text, index) => {
    window.setTimeout(() => {
      appendWechatXunMessage(text, false, false, true);
    }, (index + 1) * 1000);
  });
};
const restoreWechatCallMusic = () => {
  const shouldResume = wechatCallState.resumeMusic && activeMusicTrack === wechatCallState.musicTrack;
  wechatCallState.resumeMusic = false;
  if (shouldResume && !musicIsPlaying) playMusic();
};
const cancelWechatCallFlow = () => {
  wechatCallState.timers.forEach(window.clearTimeout);
  wechatCallState.timers = [];
  wechatCallState.stage = 'idle';
  wechatCallState.ready = false;
  wechatCallState.chatId = null;
  wechatCallIncoming.hidden = true;
  wechatCallPlayer.hidden = true;
  wechatCallVideo.autoplay = false;
  wechatCallVideo.pause();
  document.body.classList.remove('wechat-video-active');
  restoreWechatCallMusic();
};
const finishWechatVideoCall = () => {
  if (!['incoming', 'video'].includes(wechatCallState.stage)) return;
  const shouldAppend = !wechatCallState.replay;
  wechatCallState.stage = 'idle';
  wechatCallIncoming.hidden = true;
  wechatCallPlayer.hidden = true;
  wechatCallVideo.autoplay = false;
  wechatCallVideo.pause();
  document.body.classList.remove('wechat-video-active');
  if (shouldAppend) {
    appendWechatXunMessage('通话结束 00:14', true);
    beginWechatCallStory();
  }
  restoreWechatCallMusic();
  if (isWechatXunChatActive()) wechatMessageScroll.focus({ preventScroll: true });
};
const playWechatCallVideo = () => {
  wechatCallError.hidden = true;
  const attempt = wechatCallVideo.play();
  if (attempt) attempt.catch(() => {
    if (wechatCallState.stage !== 'video') return;
    wechatCallError.textContent = '视频未能播放，轻点画面重试';
    wechatCallError.hidden = false;
  });
};
const startWechatVideoCall = (replay = false) => {
  if (!isWechatXunChatActive() || (replay && wechatCallState.stage !== 'idle')) return;
  wechatCallState.replay = replay;
  wechatCallState.stage = 'video';
  wechatCallIncoming.hidden = true;
  wechatCallState.resumeMusic = musicIsPlaying;
  wechatCallState.musicTrack = activeMusicTrack;
  if (musicIsPlaying) pauseMusic();
  document.body.classList.add('wechat-video-active');
  wechatCallPlayer.hidden = false;
  wechatCallVideo.autoplay = true;
  wechatCallVideo.currentTime = 0;
  playWechatCallVideo();
  document.querySelector('#wechat-call-hangup').focus({ preventScroll: true });
};
const triggerWechatCallFlow = () => {
  if (!isWechatXunChatActive() || !wechatCallState.ready || wechatCallState.hasTriggeredCall) return;
  wechatCallState.hasTriggeredCall = true;
  wechatCallState.stage = 'messages';
  wechatCallState.replay = false;
  wechatVideoCallConfig.newMessages.forEach((text, index) => {
    scheduleWechatCall(() => {
      appendWechatXunMessage(text);
    }, 2000 + index * 1000);
  });
  // 触顶后等待 2 秒；四条消息在第 2、3、4、5 秒出现，再停留 2.2 秒来电。
  scheduleWechatCall(() => {
    wechatCallState.stage = 'incoming';
    wechatCallIncoming.hidden = false;
    document.querySelector('#wechat-call-answer').focus({ preventScroll: true });
  }, 7200);
};
const enterWechatCallChat = (chatId) => {
  cancelWechatCallFlow();
  wechatCallState.chatId = chatId;
  wechatCallState.hasTriggeredCall = false;
  window.requestAnimationFrame(() => {
    wechatCallState.lastTop = wechatMessageScroll.scrollTop;
    wechatCallState.ready = true;
  });
};
wechatMessageScroll.addEventListener('scroll', () => {
  const top = wechatMessageScroll.scrollTop;
  if (top <= 1 && wechatCallState.lastTop > 1) triggerWechatCallFlow();
  wechatCallState.lastTop = top;
}, { passive: true });
wechatMessageScroll.addEventListener('wheel', event => {
  if (event.deltaY < 0 && wechatMessageScroll.scrollTop <= 1) triggerWechatCallFlow();
}, { passive: true });
wechatMessageScroll.addEventListener('touchstart', event => {
  wechatCallState.touchY = event.touches[0]?.clientY;
}, { passive: true });
wechatMessageScroll.addEventListener('touchmove', event => {
  if (wechatCallState.touchY != null && event.touches[0]?.clientY - wechatCallState.touchY > 20 && wechatMessageScroll.scrollTop <= 1) triggerWechatCallFlow();
}, { passive: true });
wechatCallVideo.addEventListener('ended', finishWechatVideoCall);
wechatCallVideo.addEventListener('click', () => { if (wechatCallVideo.paused) playWechatCallVideo(); });
wechatCallVideo.addEventListener('error', () => {
  wechatCallError.textContent = '视频无法播放，请确认 video-call.MP4 已下载到本机，且视频格式受当前浏览器支持';
  wechatCallError.hidden = false;
});
document.querySelector('#wechat-call-answer').addEventListener('click', () => {
  if (wechatCallState.stage === 'incoming') startWechatVideoCall(false);
});
document.querySelector('#wechat-call-decline').addEventListener('click', finishWechatVideoCall);
document.querySelector('#wechat-call-hangup').addEventListener('click', finishWechatVideoCall);
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !['incoming', 'video'].includes(wechatCallState.stage)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  finishWechatVideoCall();
}, true);
