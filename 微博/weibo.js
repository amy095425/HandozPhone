const weiboProfile = { name: '不是真真', userId: 'bushizhenzhen', following: 42, followers: 0, bio: '暂无简介' };
const weiboIcons = {
  lock: '<rect x="6" y="10" width="12" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  repost: '<path d="M5 8h14l-4-4M19 16H5l4 4M19 8v5M5 16v-5"/>',
  comment: '<path d="M4 4h16v13H10l-6 4Z"/>',
  like: '<path d="M9 21H4V10h5m0 11h9l3-10h-7l1-7-3-1-3 7v11Z"/>'
};
const weiboSvg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${weiboIcons[name]}</svg>`;
function renderWeiboFeed() {
  const feed = document.querySelector('#weibo-feed');
  document.querySelector('.weibo-feed-heading').textContent = `全部微博（${weiboPosts.length}）`;
  if (!weiboPosts.length) {
    const empty = document.createElement('p');empty.className = 'weibo-empty';empty.textContent = '暂无微博';feed.replaceChildren(empty);
    return;
  }
  const cards = weiboPosts.map((post) => {
    const article = document.createElement('article');article.className = 'weibo-post';
    const header = document.createElement('header');header.className = 'weibo-post-header';
    const avatar = document.createElement('img');avatar.className = 'weibo-post-avatar';avatar.src = './微博/微博头像.png';avatar.alt = '';avatar.loading = 'lazy';avatar.decoding = 'async';
    const info = document.createElement('div');info.className = 'weibo-post-info';
    const author = document.createElement('strong');author.textContent = weiboProfile.name;
    const meta = document.createElement('span');meta.className = 'weibo-post-meta';meta.textContent = `${post.date} · 发布于 ${post.ip}`;
    info.append(author, meta);header.append(avatar, info);
    const privacy = document.createElement('div');privacy.className = 'weibo-post-privacy';privacy.innerHTML = weiboSvg('lock');
    const privacyText = document.createElement('span');privacyText.textContent = '仅自己可见';privacy.append(privacyText);
    const content = document.createElement('p');content.className = 'weibo-post-content';content.textContent = post.content;
    const actions = document.createElement('div');actions.className = 'weibo-post-actions';
    [['repost','转发'],['comment','评论'],['like','点赞']].forEach(([icon, label]) => {
      const item = document.createElement('span');item.innerHTML = weiboSvg(icon);
      const text = document.createElement('span');text.textContent = `${label} 0`;item.append(text);actions.append(item);
    });
    article.append(header, privacy, content, actions);return article;
  });
  const fragment = document.createDocumentFragment();cards.forEach((card) => fragment.append(card));feed.replaceChildren(fragment);
}
function openWeiboApp() {
  document.querySelector('#weibo-scroll').scrollTop = 0;
}
document.querySelector('#weibo-name').textContent = weiboProfile.name;
document.querySelector('#weibo-user-id').textContent = `微博 ID：${weiboProfile.userId}`;
document.querySelector('#weibo-bio').textContent = weiboProfile.bio;
document.querySelector('#weibo-stats').textContent = `${weiboProfile.followers} 粉丝　 ${weiboProfile.following} 关注`;
renderWeiboFeed();
