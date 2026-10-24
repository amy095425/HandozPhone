const gsIcons = {
  back: '<path d="m15 5-7 7 7 7"/>', bag: '<path d="M4 8h16l-2 13H6L4 8Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',
  delivery: '<circle cx="6" cy="18" r="3"/><circle cx="19" cy="18" r="3"/><path d="M6 18h7l3-10h-4M15 11h5l2 7M3 7h7v7H3Z"/>',
  pin: '<path d="M19 10c0 6-7 12-7 12S5 16 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
  home: '<path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z"/>',
  orders: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  user: '<circle cx="12" cy="7" r="4"/><path d="M3 22v-2a9 9 0 0 1 18 0v2"/>',
  qr: '<path d="M3 3h6v6H3ZM15 3h6v6h-6ZM3 15h6v6H3ZM15 15h3v3h3v3h-6Z"/>',
  fridge: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M5 9h14M8 5v1M8 13v3"/>',
  bell: '<path d="M5 17h14l-2-4V8a5 5 0 0 0-10 0v5l-2 4ZM10 21h4"/>'
};
const gsSvg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${gsIcons[name]}</svg>`;
let gsToastTimer;
function showGsHome() {
  if (typeof resetGsShopView === "function") resetGsShopView();
  document.querySelector('#gs-home').hidden = false;
  document.querySelector('#gs-products').hidden = true;
}
function openGsApp() {
  showGsHome();
  document.querySelector('#gs-home-scroll').scrollTop = 0;
  document.querySelector('#gs-toast').hidden = true;
}
document.querySelectorAll('[data-gs-icon]').forEach((node) => { node.innerHTML = gsSvg(node.dataset.gsIcon); });
document.querySelector('#gs-delivery').addEventListener('click', () => {
  document.querySelector('#gs-home').hidden = true;
  document.querySelector('#gs-products').hidden = false;
  document.querySelector('#gs-back').focus({ preventScroll: true });
});
document.querySelector('#gs-back').addEventListener('click', () => {
  showGsHome();document.querySelector('#gs-delivery').focus({ preventScroll: true });
});
document.querySelectorAll('[data-gs-placeholder]').forEach((button) => button.addEventListener('click', () => {
  const toast = document.querySelector('#gs-toast');toast.textContent = '暂未开放';toast.hidden = false;
  clearTimeout(gsToastTimer);gsToastTimer = setTimeout(() => { toast.hidden = true; }, 1800);
}));
