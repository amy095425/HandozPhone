const gsOrdersStorageKey = 'phone-found-website:gs-orders:v1';
function loadGsOrders() {
  try {
    const orders = JSON.parse(window.localStorage.getItem(gsOrdersStorageKey) || '[]');
    if (!Array.isArray(orders)) return [];
    return orders.filter((order) => order && typeof order.orderId === 'string' && typeof order.date === 'string' && typeof order.paymentMethod === 'string' && Number.isFinite(order.totalPrice) && order.totalPrice >= 0 && Array.isArray(order.items) && order.items.every((item) => item && typeof item.name === 'string' && Number.isInteger(item.quantity) && item.quantity > 0 && Number.isFinite(item.price) && item.price >= 0));
  } catch (error) { return []; }
}
function mergeGsOrders(savedOrders) {
  const orders = new Map();
  initialOrders.forEach((order) => orders.set(order.orderId, { ...order, items: order.items.map((item) => ({ ...item })) }));
  savedOrders.forEach((order) => {
    if (!orders.has(order.orderId)) orders.set(order.orderId, order);
  });
  return [...orders.values()];
}
function gsOrderTimestamp(order) {
  const parts = order.date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日 (\d{1,2}):(\d{2})$/);
  if (parts) return new Date(Number(parts[1]), Number(parts[2])-1, Number(parts[3]), Number(parts[4]), Number(parts[5])).getTime();
  return Number(order.createdAt) || 0;
}
const gsShopState = { quantities: {}, payment: 'debit', modal: null, modalFocus: null, ordersHistory: mergeGsOrders(loadGsOrders()) };
const gsPaymentOptions = { debit: { name: 'KB国民银行借记卡（金道勋）', password: '050130' }, credit: { name: '韩亚银行TravelLog信用卡（韩振）', password: '060105' } };
const gsShopRoot = document.querySelector('#gs-view');
const gsShopModal = document.querySelector('#gs-shop-modal');
const gsMoney = (value) => `${value.toLocaleString('en-US')}韩元`;
const gsCartItems = () => gsProducts.filter((p) => (gsShopState.quantities[p.id] || 0) > 0);
const gsCartTotal = () => gsCartItems().reduce((sum,p) => sum + p.price * gsShopState.quantities[p.id], 0);
const gsCartCount = () => Object.values(gsShopState.quantities).reduce((sum,count) => sum + count, 0);
function gsQuantityControls(product) {
  const box = document.createElement('div');box.className = 'gs-quantity';
  [-1,1].forEach((delta) => {
    if (delta === 1) { const count = document.createElement('span');count.dataset.gsQty = product.id;count.textContent = gsShopState.quantities[product.id] || 0;box.append(count); }
    const button = document.createElement('button');button.type = 'button';button.dataset.gsProduct = product.id;button.dataset.gsDelta = delta;button.textContent = delta > 0 ? '+' : '−';button.setAttribute('aria-label', `${delta > 0 ? '增加' : '减少'}${product.name}`);button.disabled = delta < 0 && !gsShopState.quantities[product.id];box.append(button);
  });return box;
}
function gsProductRow(product, cart = false) {
  const row = document.createElement('div');row.className = 'gs-product-row';row.dataset.gsRow = product.id;
  const copy = document.createElement('div');copy.className = 'gs-product-copy';
  const name = document.createElement('strong');name.textContent = product.name;
  const price = document.createElement('span');price.textContent = gsMoney(product.price);copy.append(name, price);
  if (cart) { const subtotal = document.createElement('small');subtotal.dataset.gsSubtotal = product.id;subtotal.textContent = `小计：${gsMoney(product.price * gsShopState.quantities[product.id])}`;copy.append(subtotal); }
  row.append(copy, gsQuantityControls(product));return row;
}
function updateGsShop() {
  document.querySelectorAll('[data-gs-qty]').forEach((node) => { node.textContent = gsShopState.quantities[node.dataset.gsQty] || 0; });
  gsShopRoot.querySelectorAll('[data-gs-delta="-1"]').forEach((button) => { button.disabled = !gsShopState.quantities[button.dataset.gsProduct]; });
  document.querySelectorAll('[data-gs-total]').forEach((node) => { node.textContent = `总价：${gsMoney(gsCartTotal())}`; });
  document.querySelector('#gs-cart-count').textContent = gsCartCount();
  document.querySelector('#gs-cart-open').setAttribute('aria-label', `购物车，${gsCartCount()}件商品`);
  document.querySelector('#gs-checkout-open').disabled = !gsCartCount();
  document.querySelector('#gs-pay-open').disabled = !gsCartCount();
  document.querySelector('#gs-payment-open').textContent = `${gsPaymentOptions[gsShopState.payment].name}　›`;
  if (gsShopState.modal === 'cart') renderGsCart();
}
function closeGsShopModal(restoreFocus = true) {
  gsShopModal.hidden = true;gsShopState.modal = null;
  document.body.classList.remove('gs-shop-modal-open');
  gsShopRoot.querySelectorAll('.gs-page').forEach((page) => { page.inert = false; });
  document.querySelector('#gs-sheet-body').replaceChildren();
  if (restoreFocus && gsShopState.modalFocus?.isConnected) gsShopState.modalFocus.focus({ preventScroll: true });
  gsShopState.modalFocus = null;
}
function openGsShopModal(mode, title) {
  gsShopState.modalFocus = document.activeElement;gsShopState.modal = mode;
  document.querySelector('#gs-sheet-title').textContent = title;
  document.querySelector('#gs-sheet-body').replaceChildren();
  gsShopModal.hidden = false;document.body.classList.add('gs-shop-modal-open');
  gsShopRoot.querySelectorAll('.gs-page').forEach((page) => { page.inert = true; });
  gsShopModal.querySelector('.gs-shop-sheet').focus({ preventScroll: true });
}
function renderGsCart() {
  const body = document.querySelector('#gs-sheet-body');
  const focused = document.activeElement;
  const productId = focused?.dataset.gsProduct, delta = focused?.dataset.gsDelta;
  const items = gsCartItems();
  body.replaceChildren(...items.map((product) => gsProductRow(product, true)));
  const total = document.createElement('p');total.className = 'gs-cart-summary';total.textContent = items.length ? `共${gsCartCount()}件，总价：${gsMoney(gsCartTotal())}` : '购物车为空';body.append(total);
  if (productId) {
    const button = body.querySelector(`[data-gs-product="${productId}"][data-gs-delta="${delta}"]`);
    (button && !button.disabled ? button : gsShopModal.querySelector('[data-gs-modal-close][type="button"]')).focus({ preventScroll: true });
  }
}
function resetGsShopView() {
  closeGsShopModal(false);
  document.querySelector('#gs-checkout').hidden = true;
  document.querySelector('#gs-success').hidden = true;
  document.querySelector('#gs-orders').hidden = true;
}
function renderGsOrder() {
  document.querySelector('#gs-order-items').replaceChildren(...gsCartItems().map((product) => {
    const line = document.createElement('p');line.className = 'gs-order-line';line.textContent = `${product.name} × ${gsShopState.quantities[product.id]}　${gsMoney(product.price * gsShopState.quantities[product.id])}`;return line;
  }));updateGsShop();
}
gsShopRoot.addEventListener('click', (event) => {
  const button = event.target.closest('[data-gs-product]');if (!button) return;
  const id = Number(button.dataset.gsProduct), delta = Number(button.dataset.gsDelta);
  if (!gsProducts.some((product) => product.id === id)) return;
  gsShopState.quantities[id] = Math.max(0, (gsShopState.quantities[id] || 0) + delta);updateGsShop();
});
document.querySelector('#gs-product-list').replaceChildren(...gsProducts.map((product) => gsProductRow(product)));
document.querySelector('#gs-cart-open').addEventListener('click', () => { openGsShopModal('cart', '购物车');renderGsCart(); });
document.querySelector('#gs-checkout-open').addEventListener('click', () => {
  if (!gsCartCount()) return;
  document.querySelector('#gs-products').hidden = true;document.querySelector('#gs-checkout').hidden = false;renderGsOrder();document.querySelector('#gs-checkout-back').focus({ preventScroll: true });
});
document.querySelector('#gs-checkout-back').addEventListener('click', () => {
  document.querySelector('#gs-checkout').hidden = true;document.querySelector('#gs-products').hidden = false;document.querySelector('#gs-checkout-open').focus({ preventScroll: true });
});
document.querySelector('#gs-payment-open').addEventListener('click', () => {
  openGsShopModal('payment', '选择支付方式');
  Object.entries(gsPaymentOptions).forEach(([key,option]) => {
    const button = document.createElement('button');button.type = 'button';button.className = 'gs-payment-option';button.textContent = `${option.name}${key === gsShopState.payment ? ' ✓' : ''}`;button.setAttribute('aria-pressed', String(key === gsShopState.payment));
    button.addEventListener('click', () => { gsShopState.payment = key;updateGsShop();closeGsShopModal(); });document.querySelector('#gs-sheet-body').append(button);
  });
});
document.querySelector('#gs-pay-open').addEventListener('click', () => {
  if (!gsCartCount()) return;
  openGsShopModal('password', '模拟支付验证');
  const form = document.createElement('form');form.className = 'gs-password-form';
  const summary = document.createElement('p');summary.textContent = `${gsPaymentOptions[gsShopState.payment].name} · ${gsMoney(gsCartTotal())}`;
  const label = document.createElement('label');label.textContent = '请输入6位模拟支付密码';label.htmlFor = 'gs-payment-password';
  const input = document.createElement('input');input.id = 'gs-payment-password';input.type = 'password';input.inputMode = 'numeric';input.maxLength = 6;input.autocomplete = 'off';input.required = true;input.pattern = '[0-9]{6}';
  const error = document.createElement('p');error.className = 'gs-password-error';error.setAttribute('role','alert');
  const submit = document.createElement('button');submit.type = 'submit';submit.className = 'gs-primary';submit.textContent = '确认支付';
  form.append(summary,label,input,error,submit);document.querySelector('#gs-sheet-body').append(form);input.focus({ preventScroll: true });
  input.addEventListener('input', () => { input.value = input.value.replace(/\D/g,'').slice(0,6);error.textContent = ''; });
  form.addEventListener('submit', (event) => {
    event.preventDefault();if (gsShopState.modal !== 'password' || !gsCartCount()) return;
    if (input.value !== gsPaymentOptions[gsShopState.payment].password) { error.textContent = '支付失败，密码错误';input.value = '';input.focus();return; }
    const paidOrder = { paymentMethod: gsShopState.payment, totalPrice: gsCartTotal() };
    submit.disabled = true;input.value = '';saveGsCompletedOrder();gsShopState.quantities = {};gsShopState.payment = 'debit';closeGsShopModal(false);updateGsShop();
    document.querySelector('#gs-checkout').hidden = true;document.querySelector('#gs-success').hidden = false;document.querySelector('#gs-success-home').focus({ preventScroll: true });
    receiveGsPaymentSms(paidOrder);
  });
});
document.querySelector('#gs-success-home').addEventListener('click', () => { showGsHome();document.querySelector('#gs-delivery').focus({ preventScroll: true }); });
gsShopModal.addEventListener('click', (event) => { if (event.target.closest('[data-gs-modal-close]')) closeGsShopModal(); });
document.addEventListener('keydown', (event) => {
  if (gsShopModal.hidden) return;
  if (event.key === 'Escape') { event.preventDefault();event.stopImmediatePropagation();closeGsShopModal(); }
  if (event.key === 'Tab') {
    const items = [...gsShopModal.querySelectorAll('button:not(:disabled), input:not(:disabled)')];
    const first = items[0], last = items[items.length-1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === gsShopModal.querySelector('.gs-shop-sheet'))) { event.preventDefault();last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault();first?.focus(); }
  }
},true);
updateGsShop();

function saveGsCompletedOrder() {
  const now = new Date();
  let timestamp = now.getTime();
  while (gsShopState.ordersHistory.some((order) => order.orderId === `GS${timestamp}`)) timestamp++;
  const pad = (value) => String(value).padStart(2, '0');
  const order = {
    orderId: `GS${timestamp}`,
    createdAt: timestamp,
    date: `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${pad(now.getHours())}:${pad(now.getMinutes())}`,
    items: gsCartItems().map((product) => ({ name: product.name, quantity: gsShopState.quantities[product.id], price: product.price })),
    totalPrice: gsCartTotal(),
    paymentMethod: gsPaymentOptions[gsShopState.payment].name
  };
  gsShopState.ordersHistory.push(order);
  const status = document.querySelector('#gs-order-save-status');
  try {
    window.localStorage.setItem(gsOrdersStorageKey, JSON.stringify(gsShopState.ordersHistory));
    status.textContent = '';
  } catch (error) { status.textContent = '订单已保留在本次页面中；浏览器存储不可用，刷新后可能丢失。'; }
}
function renderGsOrders() {
  const list = document.querySelector('#gs-orders-list');
  if (!gsShopState.ordersHistory.length) {
    const empty = document.createElement('div');empty.className = 'gs-orders-empty';empty.innerHTML = gsSvg('bag');
    const text = document.createElement('p');text.textContent = '暂无历史订单';empty.append(text);list.replaceChildren(empty);return;
  }
  // 按日期降序；同一分钟的新订单用创建时间确定先后。
  const cards = [...gsShopState.ordersHistory].sort((a,b) => gsOrderTimestamp(b)-gsOrderTimestamp(a) || (Number(b.createdAt)||0)-(Number(a.createdAt)||0)).map((order) => {
    const card = document.createElement('article');card.className = 'gs-history-card';
    const header = document.createElement('header');
    const time = document.createElement('span');time.textContent = order.date;
    const state = document.createElement('span');state.className = 'gs-history-state';state.textContent = '已完成';header.append(time,state);
    const number = document.createElement('small');number.textContent = `订单号：${order.orderId}`;
    const items = document.createElement('p');items.className = 'gs-history-items';items.textContent = order.items.map((item) => `${item.name} ×${item.quantity}`).join('、');items.title = items.textContent;
    const footer = document.createElement('footer');
    const payment = document.createElement('span');payment.textContent = order.paymentMethod;
    const total = document.createElement('strong');total.textContent = `实付：${gsMoney(order.totalPrice)}`;footer.append(payment,total);
    card.append(header,number,items,footer);return card;
  });list.replaceChildren(...cards);
}
function openGsOrders() {
  closeGsShopModal(false);
  gsShopRoot.querySelectorAll('.gs-page').forEach((page) => { page.hidden = page.id !== 'gs-orders'; });
  renderGsOrders();document.querySelector('#gs-orders-list').scrollTop = 0;
  document.querySelector('#gs-orders-back').focus({ preventScroll: true });
}
document.querySelector('#gs-orders-open').addEventListener('click', openGsOrders);
document.querySelector('#gs-success-orders').addEventListener('click', openGsOrders);
document.querySelector('#gs-orders-back').addEventListener('click', () => { showGsHome();document.querySelector('#gs-orders-open').focus({ preventScroll: true }); });
