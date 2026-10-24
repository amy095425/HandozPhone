// 页面根节点的唯一通知系统，各 App 通过 showNotification 发布消息。
const globalNotificationState = { globalBanner: { isVisible:false,appName:'',appIcon:'',sender:'',message:'',targetApp:'' }, pendingTarget:null };
const globalBannerElement=document.createElement('button');globalBannerElement.type='button';globalBannerElement.className='phone-notification';globalBannerElement.hidden=true;
globalBannerElement.innerHTML='<span class="phone-notification-icon"></span><span class="phone-notification-copy"><strong></strong><span class="phone-notification-preview"></span></span><span class="phone-notification-time">现在</span>';
document.body.append(globalBannerElement);
const globalBannerLive=document.createElement('div');globalBannerLive.className='phone-notification-announcement';globalBannerLive.setAttribute('role','status');document.body.append(globalBannerLive);
let globalBannerTimer,globalBannerHideTimer,globalBannerPointerY=null,globalBannerSuppressClick=false;
function dismissNotification(){
 clearTimeout(globalBannerTimer);clearTimeout(globalBannerHideTimer);
 globalNotificationState.globalBanner.isVisible=false;globalBannerElement.classList.remove('is-shown');
 globalBannerHideTimer=setTimeout(()=>{if(!globalNotificationState.globalBanner.isVisible)globalBannerElement.hidden=true;},260);
}
function showNotification(notification){
 clearTimeout(globalBannerTimer);clearTimeout(globalBannerHideTimer);
 const data={appName:'',appIcon:'',sender:'',message:'',targetApp:'',...notification,isVisible:true};
 globalNotificationState.globalBanner=data;
 const icon=globalBannerElement.querySelector('.phone-notification-icon');icon.replaceChildren();
 if(data.appIcon){const image=document.createElement('img');image.src=data.appIcon;image.alt='';icon.append(image);}
 else icon.innerHTML='<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 6C10 6 4 12 4 19c0 4 2 8 6 10l-2 6 9-3h3c10 0 16-6 16-13S30 6 20 6Z" fill="white"/></svg>';
 globalBannerElement.querySelector('strong').textContent=data.appName;
 globalBannerElement.querySelector('.phone-notification-preview').textContent=`${data.sender}：${data.message}`;
 globalBannerElement.querySelector('.phone-notification-time').textContent=data.time||'现在';
 globalBannerElement.setAttribute('aria-label',`打开${data.appName}，${data.sender}：${data.message}`);
 globalBannerElement.hidden=false;void globalBannerElement.offsetWidth;globalBannerElement.classList.add('is-shown');
 globalBannerLive.textContent=`${data.appName}，${data.sender}：${data.message}`;
 globalBannerTimer=setTimeout(dismissNotification,4000);
}
function navigateNotification(data){
 const entry=[...document.querySelectorAll('.home-screen [data-open-app]')].find(button=>button.dataset.openApp===data.targetApp);
 if(!entry)return;
 entry.click();
 if(data.targetApp==='imessage' && data.smsMessage)openSmsConversation(data.smsMessage);
 if(data.targetApp==='kakaotalk'){
  const friend=kakaotalkFriends.find(item=>item.id===data.chatId||item.name===data.sender);if(friend)openKktChat(friend);
 }
 if(data.targetApp==='wechat'){
  const chat=[...document.querySelectorAll('[data-wechat-chat]')].find(row=>row.dataset.wechatChat===data.chatId);chat?.click();
 }
}
globalBannerElement.addEventListener('click',()=>{
 if(globalBannerSuppressClick){globalBannerSuppressClick=false;return;}
 const data={...globalNotificationState.globalBanner};if(!data.isVisible)return;
 dismissNotification();
 if(!document.body.classList.contains('is-unlocked')){globalNotificationState.pendingTarget=data;openPasscode();return;}
 navigateNotification(data);
});
document.addEventListener('iphone:unlock',()=>{
 const target=globalNotificationState.pendingTarget;globalNotificationState.pendingTarget=null;
 if(target)requestAnimationFrame(()=>navigateNotification(target));
});
globalBannerElement.addEventListener('pointerdown',event=>{globalBannerPointerY=event.clientY;globalBannerSuppressClick=false;globalBannerElement.setPointerCapture?.(event.pointerId);});
globalBannerElement.addEventListener('pointerup',event=>{if(globalBannerPointerY!==null&&globalBannerPointerY-event.clientY>25){globalBannerSuppressClick=true;dismissNotification();}globalBannerPointerY=null;});
globalBannerElement.addEventListener('pointercancel',()=>{globalBannerPointerY=null;});
window.showNotification=showNotification;
