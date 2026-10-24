const clockCities = [
 {name:'首尔',zone:'Asia/Seoul'}, {name:'北京',zone:'Asia/Shanghai'},
 {name:'东京',zone:'Asia/Tokyo'}, {name:'巴黎',zone:'Europe/Paris'},
 {name:'新加坡',zone:'Asia/Singapore'}, {name:'泰国',zone:'Asia/Bangkok'},
 {name:'马来西亚',zone:'Asia/Kuala_Lumpur'}
];
const clockAlarms = [{id:'wake',period:'上午',time:'10:00',label:'起床',enabled:true},{id:'sleep',period:'晚上',time:'9:00',label:'睡觉',enabled:true}];
const clockState = { tab:'alarms',timer:null };
function clockCalendarDay(now,timeZone){
 const parts=new Intl.DateTimeFormat('en-US',{timeZone,year:'numeric',month:'numeric',day:'numeric'}).formatToParts(now);
 const value=type=>Number(parts.find(part=>part.type===type).value);
 return Date.UTC(value('year'),value('month')-1,value('day'))/86400000;
}
function clockCityTime(city,now){
 const time=new Intl.DateTimeFormat('zh-CN',{timeZone:city.zone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);
 const localZone=Intl.DateTimeFormat().resolvedOptions().timeZone;
 const difference=clockCalendarDay(now,city.zone)-clockCalendarDay(now,localZone);
 const day=difference===0?'今天':difference===1?'明天':difference===-1?'昨天':difference>0?`${difference}天后`:`${-difference}天前`;
 return {time,day};
}
const clockTimeNodes=clockCities.map(city=>{
 const row=document.createElement('div');row.className='clock-world-row';
 const copy=document.createElement('div');const name=document.createElement('strong');name.textContent=city.name;
 const day=document.createElement('small');copy.append(name,day);
 const time=document.createElement('time');row.append(copy,time);document.querySelector('#clock-world-list').append(row);
 return {city,time,day};
});
function updateClockCities(){const now=new Date();clockTimeNodes.forEach(({city,time,day})=>{const current=clockCityTime(city,now);time.textContent=current.time;day.textContent=current.day;});}
clockAlarms.forEach(alarm=>{
 const row=document.createElement('div');row.className='clock-alarm-row';
 const copy=document.createElement('div');copy.className='clock-alarm-copy';
 const time=document.createElement('div');time.className='clock-alarm-time';
 const period=document.createElement('span');period.textContent=alarm.period;
 const digits=document.createElement('strong');digits.textContent=alarm.time;time.append(period,digits);
 const label=document.createElement('small');label.textContent=alarm.label;copy.append(time,label);
 const toggle=document.createElement('button');toggle.type='button';toggle.className='clock-switch';toggle.setAttribute('role','switch');toggle.setAttribute('aria-label',`${alarm.period} ${alarm.time} ${alarm.label}`);toggle.setAttribute('aria-checked',String(alarm.enabled));
 const knob=document.createElement('span');toggle.append(knob);
 toggle.addEventListener('click',()=>{alarm.enabled=!alarm.enabled;toggle.setAttribute('aria-checked',String(alarm.enabled));row.classList.toggle('is-off',!alarm.enabled);});
 row.append(copy,toggle);document.querySelector('#clock-alarm-list').append(row);
});
function showClockTab(tab){
 clockState.tab=tab;
 document.querySelector('#clock-alarms').hidden=tab!=='alarms';document.querySelector('#clock-world').hidden=tab!=='world';
 document.querySelector('#clock-page-title').textContent=tab==='alarms'?'闹钟':'世界时钟';
 document.querySelectorAll('[data-clock-tab]').forEach(button=>{const selected=button.dataset.clockTab===tab;button.setAttribute('aria-selected',String(selected));});
 if(tab==='world')updateClockCities();
}
function closeClockApp(){clearInterval(clockState.timer);clockState.timer=null;}
function openClockApp(){closeClockApp();showClockTab('alarms');document.querySelector('#clock-scroll').scrollTop=0;updateClockCities();clockState.timer=setInterval(updateClockCities,1000);}
document.querySelectorAll('[data-clock-tab]').forEach(button=>button.addEventListener('click',()=>showClockTab(button.dataset.clockTab)));
window.addEventListener('pagehide',closeClockApp);
