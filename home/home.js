// 原生滚动分页；App 按钮继续使用 index.html 中统一的导航和角标事件。
const homePager = document.querySelector('#home-pages');
const homePageDots = [...document.querySelectorAll('[data-home-page]')];
let homeCurrentPage = 0;
let homeScrollFrame = 0;
const updateHomePageDots = () => {
  if (!homePager.clientWidth) return;
  homeCurrentPage = Math.max(0, Math.min(homePageDots.length - 1, Math.round(homePager.scrollLeft / homePager.clientWidth)));
  homePageDots.forEach((button, index) => {
    const selected = index === homeCurrentPage;
    button.classList.toggle('is-current', selected);
    if (selected) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
};
const goToHomePage = (index, smooth = true) => {
  const target = Math.max(0, Math.min(homePageDots.length - 1, index));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  homePager.scrollTo({ left: target * homePager.clientWidth, behavior: smooth && !reducedMotion ? 'smooth' : 'auto' });
};
homePager.addEventListener('scroll', () => {
  if (homeScrollFrame) return;
  homeScrollFrame = window.requestAnimationFrame(() => {
    homeScrollFrame = 0;
    updateHomePageDots();
  });
}, { passive: true });
homePageDots.forEach((button, index) => button.addEventListener('click', () => goToHomePage(index)));
homePager.addEventListener('keydown', event => {
  if (event.target !== homePager || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  goToHomePage(homeCurrentPage + (event.key === 'ArrowRight' ? 1 : -1));
});
// 自然滑动后抑制误触，不拦截普通点击，也不干涉 App 内部手势。
let homeSwipeX = null;
let homeSuppressClickUntil = 0;
homePager.addEventListener('pointerdown', event => { homeSwipeX = event.clientX; }, { passive: true });
homePager.addEventListener('pointerup', event => {
  if (homeSwipeX !== null && Math.abs(event.clientX - homeSwipeX) > 24) homeSuppressClickUntil = Date.now() + 350;
  homeSwipeX = null;
}, { passive: true });
homePager.addEventListener('pointercancel', () => { homeSwipeX = null; }, { passive: true });
homePager.addEventListener('click', event => {
  if (Date.now() < homeSuppressClickUntil) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, true);
document.querySelector('.home-weather-widget').addEventListener('click', () => markAppRead('weather'));
if ('ResizeObserver' in window) {
  let previousWidth = homePager.clientWidth;
  const observer = new ResizeObserver(() => {
    if (homePager.clientWidth === previousWidth) return;
    previousWidth = homePager.clientWidth;
    goToHomePage(homeCurrentPage, false);
  });
  observer.observe(homePager);
} else {
  window.addEventListener('resize', () => goToHomePage(homeCurrentPage, false));
}
updateHomePageDots();
