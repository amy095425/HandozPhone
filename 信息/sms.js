const smsList = document.querySelector('#messages-list-scroll');
function openSmsConversation(sms) {
  markPhoneSmsRead();
  document.querySelector('#messages-detail-page .messages-contact-name').textContent = sms.sender;
  document.querySelector('#messages-detail-page .messages-contact-number').textContent = '';
  const bubbles = document.querySelector('#messages-bubbles');
  const date = document.createElement('div');date.className = 'messages-date-divider';date.textContent = [sms.date, sms.time].filter(Boolean).join(' ');
  const bubble = document.createElement('div');bubble.className = 'message-bubble sms-received';bubble.textContent = sms.content;
  bubbles.replaceChildren(date, bubble);
  showMessagesPage('detail');
  document.querySelector('#conversation-scroll').scrollTop = 0;
  document.querySelector('#messages-back-to-list').focus({ preventScroll: true });
}
function renderSmsList() {
const smsRows = phoneNotificationState.smsMessages.map((sms) => {
  const row = document.createElement('button');row.type = 'button';row.className = 'message-conversation-row';row.dataset.smsId = sms.id;
  row.setAttribute('aria-label', `打开 ${sms.sender} 的短信`);
  const avatar = document.createElement('span');avatar.className = 'message-default-avatar sms-default-avatar';avatar.setAttribute('aria-hidden','true');
  avatar.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 21a8 8 0 0 1 16 0" fill="currentColor"/></svg>';
  const copy = document.createElement('span');copy.className = 'message-row-copy';
  const sender = document.createElement('span');sender.className = 'message-row-name';sender.textContent = sms.sender;
  const preview = document.createElement('span');preview.className = 'message-row-preview';preview.textContent = sms.content.split('\n')[0];
  copy.append(sender,preview);
  const meta = document.createElement('span');meta.className = 'message-row-meta';meta.textContent = sms.date;
  row.append(avatar,copy,meta);row.addEventListener('click', () => openSmsConversation(sms));return row;
});
smsList.replaceChildren(...smsRows);
}
document.addEventListener("phone:sms-updated", renderSmsList);
renderSmsList();
