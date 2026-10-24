const calendarState = { year: 2026, month: 9, selected: null };
const calendarMinMonth = 2026 * 12 + 6;
const calendarMaxMonth = 2027 * 12 + 2;
const calendarWeekdays = ['日','一','二','三','四','五','六'];
const calendarDateKey = (date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
function calendarMonthCells(year, month) {
  const start = new Date(year, month, 1, 12);
  const days = new Date(year, month+1, 0, 12).getDate();
  const count = Math.ceil((start.getDay()+days)/7)*7;
  return Array.from({length: count}, (_,index) => new Date(year,month,index-start.getDay()+1,12));
}
function selectCalendarDate(date) {
  const monthIndex = date.getFullYear()*12+date.getMonth();
  if (monthIndex < calendarMinMonth || monthIndex > calendarMaxMonth) return;
  calendarState.selected = date;calendarState.year = date.getFullYear();calendarState.month = date.getMonth();renderCalendar();
}
function renderCalendarAgenda() {
  const date = calendarState.selected;
  document.querySelector('#calendar-selected-date').textContent = `${date.getMonth()+1}月${date.getDate()}日 星期${calendarWeekdays[date.getDay()]}`;
  const list = document.querySelector('#calendar-agenda-list');
  const events = calendarEvents[calendarDateKey(date)] || [];
  const displayEvents = events.length > 0 ? events : [{ time: '全天', title: '练习', location: '' }];
  list.replaceChildren(...displayEvents.map((event) => {
    const row = document.createElement('div');row.className = 'calendar-event';
    const time = document.createElement('time');time.textContent = event.time || '';
    const details = document.createElement('div');details.className = 'calendar-event-details';
    const title = document.createElement('span');title.textContent = event.title;details.append(title);
    if (event.location) {
      const location = document.createElement('small');location.className = 'calendar-event-location';location.textContent = event.location;details.append(location);
    }
    row.append(time,details);return row;
  }));
}
function renderCalendar() {
  const {year,month,selected} = calendarState;
  const index = year*12+month;
  document.querySelector('#calendar-month-title').textContent = `${year}年${month+1}月`;
  document.querySelector('#calendar-previous').disabled = index === calendarMinMonth;
  document.querySelector('#calendar-next').disabled = index === calendarMaxMonth;
  const todayKey = calendarDateKey(new Date());
  document.querySelector('#calendar-grid').replaceChildren(...calendarMonthCells(year,month).map((date) => {
    const button = document.createElement('button');button.type = 'button';button.className = 'calendar-day';
    const formattedDate = calendarDateKey(date);
    button.textContent = date.getDate();button.dataset.date = formattedDate;
    const realEvents = calendarEvents[formattedDate];
    if (Array.isArray(realEvents) && realEvents.length > 0) {
      const dot = document.createElement('span');dot.className = 'calendar-event-dot';dot.setAttribute('aria-hidden','true');button.append(dot);
    }
    button.classList.toggle('is-other-month',date.getMonth()!==month);
    button.classList.toggle('is-selected',calendarDateKey(date)===calendarDateKey(selected));
    button.classList.toggle('is-today',calendarDateKey(date)===todayKey);
    button.setAttribute('aria-pressed',String(calendarDateKey(date)===calendarDateKey(selected)));
    button.setAttribute('aria-label',`${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日 星期${calendarWeekdays[date.getDay()]}`);
    const dateIndex = date.getFullYear()*12+date.getMonth();button.disabled = dateIndex < calendarMinMonth || dateIndex > calendarMaxMonth;
    button.addEventListener('click', () => { selectCalendarDate(date);document.querySelector(`#calendar-grid [data-date="${calendarDateKey(date)}"]`)?.focus({preventScroll:true}); });return button;
  }));
  renderCalendarAgenda();
}
function moveCalendarMonth(delta) {
  const index = calendarState.year*12+calendarState.month+delta;
  if (index < calendarMinMonth || index > calendarMaxMonth) return;
  const year = Math.floor(index/12), month = index%12;
  const today = new Date();
  selectCalendarDate(new Date(year,month,today.getFullYear()===year && today.getMonth()===month ? today.getDate() : 1,12));
}
function openCalendarApp() {
  const today = new Date();
  selectCalendarDate(new Date(2026,9,today.getFullYear()===2026 && today.getMonth()===9 ? today.getDate() : 1,12));
  document.querySelector('#calendar-scroll').scrollTop = 0;
}
document.querySelector('#calendar-previous').addEventListener('click',()=>moveCalendarMonth(-1));
document.querySelector('#calendar-next').addEventListener('click',()=>moveCalendarMonth(1));
openCalendarApp();
