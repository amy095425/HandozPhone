// 原生 JavaScript 全局共享状态：短信和横幅不依赖某个 App 页面是否可见。
const phoneNotificationState = {
  smsMessages: [...smsData].sort((a,b) => {
    const value = (date) => { const [,m,d] = date.match(/^(\d+)月(\d+)日$/);return Number(m)*100+Number(d); };
    return value(b.date)-value(a.date);
  }),
  unreadMessages: 0
};
const phonePendingBannerTimers = new Set();
function markPhoneSmsRead() {
  phonePendingBannerTimers.forEach(clearTimeout);phonePendingBannerTimers.clear();
  phoneNotificationState.unreadMessages = 0;
  badgeCounts.imessage = 0;persistBadgeCounts();updateAppBadges();
}
function showPhoneSmsBanner(message) {
 showNotification({appName:'信息',sender:message.sender,message:message.content,targetApp:'imessage',smsMessage:message,time:message.time||'现在'});
}
function receiveGsPaymentSms({ paymentMethod, totalPrice }) {
  const now = new Date();
  const date = `${now.getMonth()+1}月${now.getDate()}日`;
  const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const bankName = paymentMethod === 'credit' ? '韩亚银行' : 'KB国民银行';
  const batchId = `${now.getTime()}-${phoneNotificationState.smsMessages.length}`;
  const bank = {
    id: `gs-bank-${batchId}`,sender: '+82 82901321',date, time,
    content: `【${bankName}】您的账户于${date} ${time}支出韩元${totalPrice.toLocaleString('en-US')}。收款方：GS Retail。`
  };
  const delivery = {
    id: `gs-delivery-${batchId}`,sender: '+82 19038231',date, time,
    content: '您好，这里是GS25。您的商品订购已完成，我们将立即为您安排配送，预计30分钟左右抵达目标地点，给您带来的不便还请理解。如有更多疑问，请联系19038231。谢谢。'
  };
  phoneNotificationState.smsMessages.unshift(bank, delivery);
  phoneNotificationState.unreadMessages += 2;
  badgeCounts.imessage = phoneNotificationState.unreadMessages;persistBadgeCounts();updateAppBadges();
  document.dispatchEvent(new CustomEvent('phone:sms-updated'));
  showPhoneSmsBanner(bank);
  const timer = setTimeout(() => {
    phonePendingBannerTimers.delete(timer);
    showPhoneSmsBanner(delivery);
  }, 1000);
  phonePendingBannerTimers.add(timer);
}
document.querySelectorAll('.home-screen [data-open-app="imessage"]').forEach((button) => button.addEventListener('click', markPhoneSmsRead));
