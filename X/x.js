const xAppData = {
  host: { name: '憨豆子万岁', handle: '@Handoz2499', avatarUrl: './X/主持人头像.jpeg', time: '20小时前' },
  room: { title: '一起来聊', count: '17/17' },
  users: [
    '干锅牛蛙', '喜欢憨豆子不是烦恼', '而我宝着一对狐兔', '严厉丈母娘',
    'plds第一仇人', '拿度撒浪嘿', '死给振恶勋！', '在狎鸥亭樱花盛开的季节',
    '一颗珍爱的勋', 'CountoLUV', '给你宇宙', '牵起你的手',
    '太阳一般our future', '勋勋振振请相爱', '牛蛙拿命来', '新乡遇上南朝鲜'
  ].map((name, index) => ({ id: `x-user-${index + 1}`, name, avatarColor: `hsl(${Math.floor(Math.random() * 360)} 58% 83%)`, initial: Array.from(name)[0].toLocaleUpperCase() })),
  comments: xVoiceRoomChatData
};
const xAppState = { active: false, page: 'feed', joined: false, sheetOpen: false };
const xElement = (tag, className, text) => {
  const element = document.createElement(tag);
  element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};
const xHostAvatar = () => {
  const avatar = xElement('img', 'xapp-author-avatar');
  avatar.src = xAppData.host.avatarUrl;
  avatar.alt = `${xAppData.host.name}头像`;
  avatar.draggable = false;
  return avatar;
};
const xJoinButton = xElement('button', 'xapp-join', '加入');
xJoinButton.type = 'button';
const xPostActionIcons = {
  comments: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4v13h5l4 4v-4h7Z"/></svg>',
  reposts: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 8 4-4 4 4M8 4v12h10m2 0-4 4-4-4m4 4V8H6"/></svg>',
  likes: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 4.8a5.4 5.4 0 0 0-8.5 1 5.4 5.4 0 0 0-8.5 6.5L12 21l8.5-8.7a5.4 5.4 0 0 0 0-7.5Z"/></svg>',
  heat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V12m7 9V3m7 18v-6"/></svg>'
};
const xPostActionLabels = { comments: '评论', reposts: '转发', likes: '点赞', heat: '热度' };
const renderXPostActions = post => {
  const actions = xElement('div', 'xapp-post-actions');
  ['comments', 'reposts', 'likes', 'heat'].forEach(key => {
    const interactive = key === 'likes';
    const action = xElement(interactive ? 'button' : 'span', `xapp-post-stat${interactive ? ' xapp-post-like' : ''}`);
    action.innerHTML = xPostActionIcons[key];
    const count = xElement('span', 'xapp-stat-count', String(interactive ? post.likes : post.stats[key]));
    action.append(count);
    if (interactive) {
      action.type = 'button';
      const syncLike = () => {
        action.classList.toggle('is-liked', post.isLiked);
        action.setAttribute('aria-pressed', String(post.isLiked));
        action.setAttribute('aria-label', `${post.isLiked ? '取消点赞' : '点赞'}，${post.likes}`);
        count.textContent = String(post.likes);
      };
      action.addEventListener('click', event => {
        event.stopPropagation();
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
        post.stats.likes = String(post.likes);
        syncLike();
      });
      syncLike();
    } else action.setAttribute('aria-label', `${xPostActionLabels[key]} ${post.stats[key]}`);
    actions.append(action);
  });
  return actions;
};
document.querySelector('#xapp-feed').replaceChildren(...xPostsData.map(post => {
  const article = xElement('article', 'xapp-post');
  article.dataset.postId = post.id;
  const author = xElement('div', 'xapp-author');
  let avatar;
  if (post.avatarUrl) {
    avatar = xElement('img', 'xapp-author-avatar');
    avatar.src = post.avatarUrl;
    avatar.alt = `${post.userName}头像`;
    avatar.draggable = false;
  } else {
    avatar = xElement('span', 'xapp-author-avatar xapp-post-default-avatar', post.avatarInitial);
    avatar.style.backgroundColor = post.avatarColor;
    avatar.setAttribute('aria-hidden', 'true');
  }
  const copy = xElement('div', 'xapp-author-copy');
  const name = xElement('div', 'xapp-author-name');
  name.append(xElement('strong', '', post.userName));
  if (post.type === 'space') name.append(xElement('span', 'xapp-host-tag', '主持人'));
  copy.append(name, xElement('div', 'xapp-author-meta', `@${post.userId} · ${post.time}`));
  author.append(avatar, copy);
  article.append(author, xElement('p', 'xapp-post-text', post.content));
  if (post.type === 'space') {
    const card = xElement('div', 'xapp-space-card');
    const kicker = xElement('div', 'xapp-space-kicker');
    kicker.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 13V7m5 9V4m5 11V5m4 8V7"/></svg><span>语音房</span>';
    card.append(kicker, xElement('h2', '', post.roomTitle), xElement('p', '', `${post.userName} 主持的空间`));
    const footer = xElement('div', 'xapp-space-footer');
    footer.append(xElement('span', '', '17 人正在收听'), xJoinButton);
    card.append(footer);
    article.append(card);
  }
  if (post.image) {
    const image = xElement('img', 'xapp-post-image');
    image.src = post.image;
    image.alt = `${post.userName}的帖子配图`;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.draggable = false;
    article.append(image);
  }
  article.append(renderXPostActions(post));
  return article;
}));
document.querySelector('#xapp-room-title').textContent = xAppData.room.title;
document.querySelector('#xapp-room-count').textContent = `${xAppData.room.count} 在线`;
const xRoomHostCopy = xElement('div', '');
xRoomHostCopy.append(xElement('strong', '', xAppData.host.name), xElement('span', '', '主持人'));
document.querySelector('#xapp-room-host').append(xHostAvatar(), xRoomHostCopy);
document.querySelector('#xapp-users').replaceChildren(...xAppData.users.map(user => {
  const tile = xElement('div', 'xapp-user');
  const avatar = xElement('span', 'xapp-user-avatar', user.initial);
  avatar.style.backgroundColor = user.avatarColor;
  avatar.setAttribute('aria-hidden', 'true');
  const name = xElement('p', 'xapp-user-name', user.name);
  tile.append(avatar, name, xElement('p', 'xapp-user-role', '听众'));
  return tile;
}));
const xRoomUsersByName = new Map(xAppData.users.map(user => [user.name, user]));
document.querySelector('#xapp-chat-messages').replaceChildren(...xAppData.comments.map((comment, index) => {
  const message = xElement('div', `xapp-chat-message${comment.isMe ? ' is-me' : ''}`);
  message.dataset.messageIndex = String(index);
  const body = xElement('div', 'xapp-chat-message-body');
  if (!comment.isMe) {
    const user = xRoomUsersByName.get(comment.sender);
    const avatar = xElement('span', 'xapp-chat-avatar', user ? user.initial : Array.from(comment.sender)[0]);
    avatar.style.backgroundColor = user ? user.avatarColor : '#d8d9e2';
    avatar.setAttribute('aria-hidden', 'true');
    message.append(avatar);
    body.append(xElement('strong', '', comment.sender));
  }
  body.append(xElement('p', '', comment.text));
  message.append(body);
  return message;
}));
document.querySelector('#xapp-chat-count').textContent = String(xAppData.comments.length);
const closeXChatSheet = (restoreFocus = true) => {
  xAppState.sheetOpen = false;
  document.querySelector('#xapp-chat-backdrop').classList.remove('is-open');
  document.querySelector('#xapp-chat-backdrop').setAttribute('aria-hidden', 'true');
  document.querySelector('#xapp-chat-open').setAttribute('aria-expanded', 'false');
  document.querySelector('#x-view .xapp-shell').inert = false;
  document.body.classList.remove('xapp-sheet-open');
  if (restoreFocus && xAppState.active && xAppState.page === 'room') document.querySelector('#xapp-chat-open').focus({ preventScroll: true });
};
const showXPage = page => {
  closeXChatSheet(false);
  xAppState.page = page === 'room' ? 'room' : 'feed';
  document.querySelector('#xapp-feed-page').hidden = xAppState.page !== 'feed';
  document.querySelector('#xapp-room-page').hidden = xAppState.page !== 'room';
};
const openXApp = () => { xAppState.active = true; showXPage('feed'); };
const closeXAppPanels = () => { closeXChatSheet(false); xAppState.active = false; };
xJoinButton.addEventListener('click', () => {
  xAppState.joined = true;
  xJoinButton.textContent = '已加入';
  showXPage('room');
  document.querySelector('#xapp-room-back').focus({ preventScroll: true });
});
['#xapp-room-back', '#xapp-room-leave', '#xapp-home-tab'].forEach(selector => document.querySelector(selector).addEventListener('click', () => {
  showXPage('feed');
  if (xAppState.active) xJoinButton.focus({ preventScroll: true });
}));
document.querySelector('#xapp-chat-open').addEventListener('click', () => {
  if (!xAppState.active || xAppState.page !== 'room') return;
  xAppState.sheetOpen = true;
  document.querySelector('#xapp-chat-backdrop').classList.add('is-open');
  document.querySelector('#xapp-chat-backdrop').setAttribute('aria-hidden', 'false');
  document.querySelector('#xapp-chat-open').setAttribute('aria-expanded', 'true');
  document.querySelector('#x-view .xapp-shell').inert = true;
  document.body.classList.add('xapp-sheet-open');
  document.querySelector('#xapp-chat-close').focus({ preventScroll: true });
  window.requestAnimationFrame(() => {
    if (!xAppState.sheetOpen) return;
    const messages = document.querySelector('#xapp-chat-messages');
    messages.scrollTop = messages.scrollHeight;
  });
});
document.querySelector('#xapp-chat-close').addEventListener('click', () => closeXChatSheet());
document.querySelector('#xapp-chat-backdrop').addEventListener('click', event => {
  if (event.target === event.currentTarget) closeXChatSheet();
});
document.addEventListener('keydown', event => {
  if (!xAppState.active || event.key !== 'Escape') return;
  if (xAppState.sheetOpen) closeXChatSheet();
  else if (xAppState.page === 'room') showXPage('feed');
  else return;
  event.preventDefault();
  event.stopImmediatePropagation();
}, true);
