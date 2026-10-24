// 本地示例数据；每次进入天气都会恢复默认城市，不涉及全局音频实例。
const weatherData = {
  seoul: { name: '首尔', temperature: 18, condition: '多云', high: 21, low: 14, sunny: false, hourly: [18,18,17,16,15,14], days: [[21,14],[22,15],[20,14],[21,15],[22,16]] },
  xinxiang: { name: '新乡', temperature: 24, condition: '晴', high: 27, low: 19, sunny: true, hourly: [24,25,26,27,25,23], days: [[27,19],[28,20],[27,19],[26,18],[27,19]] }
};
const weatherState = { city: 'seoul', active: false };
const weatherRoot = document.querySelector('#weather-view');
const weatherModal = document.querySelector('#weather-modal');
const weatherCityButton = document.querySelector('#weather-cities-button');
const weatherIcon = (sunny) => `<svg viewBox="0 0 64 52" aria-hidden="true">${sunny ? '<g stroke="#ffdc87" stroke-width="3" stroke-linecap="round"><path d="M32 2v5m0 38v5M8 26H3m58 0h-5M12 7l4 4m32 30 4 4M12 45l4-4M48 11l4-4"/></g><circle cx="32" cy="26" r="13" fill="#ffdc87"/>' : '<circle cx="43" cy="17" r="12" fill="#ffdf96"/><path d="M15 44h34a11 11 0 0 0 0-22 16 16 0 0 0-30-2 12 12 0 0 0-4 24Z" fill="#eef3ff"/>'}</svg>`;
function renderWeather() {
  const data = weatherData[weatherState.city];
  document.querySelector('#weather-city').textContent = data.name;
  document.querySelector('#weather-temperature').textContent = `${data.temperature}°`;
  document.querySelector('#weather-condition').textContent = data.condition;
  document.querySelector('#weather-range').textContent = `最高 ${data.high}°　最低 ${data.low}°`;
  document.querySelector('#weather-symbol').innerHTML = weatherIcon(data.sunny);
  weatherRoot.classList.toggle('weather-sunny', data.sunny);
  document.querySelector('#weather-hourly').innerHTML = data.hourly.map((temperature, index) => `<div><span>${index ? `${index}小时后` : '现在'}</span>${weatherIcon(data.sunny)}<strong>${temperature}°</strong></div>`).join('');
  document.querySelector('#weather-days').innerHTML = data.days.map(([high, low], index) => `<div class="weather-day"><span>${index ? `${index}天后` : '今天'}</span>${weatherIcon(data.sunny)}<span class="weather-low">${low}°</span><span class="weather-range-bar"></span><span>${high}°</span></div>`).join('');
  document.querySelector('#weather-city-options').innerHTML = Object.entries(weatherData).map(([key, city]) => `<button type="button" class="weather-city-option" data-weather-city="${key}" aria-pressed="${key === weatherState.city}"><span><strong>${city.name}</strong><small>${city.condition} · 最高 ${city.high}° 最低 ${city.low}°</small></span><span class="weather-option-temperature">${city.temperature}°</span><span class="weather-selected">${key === weatherState.city ? '✓' : ''}</span></button>`).join('');
}
function setWeatherSheet(open, restoreFocus = true) {
  weatherModal.hidden = !open;
  document.querySelector('.weather-shell').inert = open;
  document.body.classList.toggle('weather-sheet-open', open);
  weatherCityButton.setAttribute('aria-expanded', String(open));
  if (open) weatherModal.querySelector('[data-weather-dismiss][type="button"]').focus({ preventScroll: true });
  else if (restoreFocus && weatherState.active) weatherCityButton.focus({ preventScroll: true });
}
function openWeatherApp() {
  weatherState.active = true;
  weatherState.city = 'seoul';
  setWeatherSheet(false, false);
  renderWeather();
  document.querySelector('#weather-scroll').scrollTop = 0;
}
function closeWeatherApp() {
  weatherState.active = false;
  weatherState.city = 'seoul';
  setWeatherSheet(false, false);
}
weatherCityButton.addEventListener('click', () => setWeatherSheet(true));
weatherModal.addEventListener('click', (event) => {
  const cityButton = event.target.closest('[data-weather-city]');
  if (cityButton) {
    weatherState.city = cityButton.dataset.weatherCity;
    renderWeather();
    setWeatherSheet(false);
    document.querySelector('#weather-scroll').scrollTop = 0;
  } else if (event.target.closest('[data-weather-dismiss]')) setWeatherSheet(false);
});
document.addEventListener('keydown', (event) => {
  if (weatherModal.hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault(); event.stopImmediatePropagation(); setWeatherSheet(false);
  } else if (event.key === 'Tab') {
    const buttons = [...weatherModal.querySelectorAll('button')];
    const first = buttons[0], last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
}, true);
renderWeather();
