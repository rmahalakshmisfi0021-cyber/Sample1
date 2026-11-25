const PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', cat: 'Electronics', price: 79.99, rating: 4.5, icon: '🎧' },
  { id: 2, name: 'Smart Watch', cat: 'Electronics', price: 129.0, rating: 4.2, icon: '⌚' },
  { id: 3, name: 'Laptop Backpack', cat: 'Fashion', price: 44.5, rating: 4.7, icon: '🎒' },
  { id: 4, name: 'Running Shoes', cat: 'Fashion', price: 89.0, rating: 4.4, icon: '👟' },
  { id: 5, name: 'Sunglasses', cat: 'Fashion', price: 24.99, rating: 3.9, icon: '🕶️' },
  { id: 6, name: 'Coffee Maker', cat: 'Home', price: 59.99, rating: 4.6, icon: '☕' },
  { id: 7, name: 'Desk Lamp', cat: 'Home', price: 19.99, rating: 4.1, icon: '💡' },
  { id: 8, name: 'Bluetooth Speaker', cat: 'Electronics', price: 34.99, rating: 4.3, icon: '🔊' },
  { id: 9, name: 'Yoga Mat', cat: 'Sports', price: 22.0, rating: 4.5, icon: '🧘' },
  { id: 10, name: 'Water Bottle', cat: 'Sports', price: 14.99, rating: 4.8, icon: '🍶' },
  { id: 11, name: 'Football', cat: 'Sports', price: 27.5, rating: 4.0, icon: '⚽' },
  { id: 12, name: 'Houseplant', cat: 'Home', price: 16.0, rating: 4.6, icon: '🪴' },
];

const $ = id => document.getElementById(id);
const money = n => '$' + n.toFixed(2);
let category = 'All';
let cart = [];
try {
  const saved = JSON.parse(localStorage.getItem('cart') || '[]');
  cart = saved.filter(i => PRODUCTS.some(p => p.id === i.id) && Number.isInteger(i.qty) && i.qty > 0);
} catch { cart = []; }

const save = () => localStorage.setItem('cart', JSON.stringify(cart));

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function renderCategories() {
  const box = $('categories');
  box.replaceChildren();
  ['All', ...new Set(PRODUCTS.map(p => p.cat))].forEach(c => {
    const b = el('button', c === category ? 'active' : '', c);
    b.onclick = () => { category = c; renderCategories(); renderProducts(); };
    box.append(b);
  });
}

function renderProducts() {
  const q = $('search').value.trim().toLowerCase();
  let list = PRODUCTS.filter(p => (category === 'All' || p.cat === category) && p.name.toLowerCase().includes(q));
  const s = $('sort').value;
  if (s === 'asc') list.sort((a, b) => a.price - b.price);
  if (s === 'desc') list.sort((a, b) => b.price - a.price);
  if (s === 'rating') list.sort((a, b) => b.rating - a.rating);
  const grid = $('grid');
  grid.replaceChildren();
  $('empty').hidden = list.length > 0;
  list.forEach(p => {
    const card = el('article', 'card');
    const body = el('div', 'body');
    const btn = el('button', '', 'Add to Cart');
    btn.onclick = () => addToCart(p.id);
    body.append(el('span', 'cat', p.cat), el('h3', '', p.name),
      el('span', 'rating', '★ ' + p.rating.toFixed(1)), el('span', 'price', money(p.price)), btn);
    card.append(el('div', 'img', p.icon), body);
    grid.append(card);
  });
}

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  item ? item.qty++ : cart.push({ id, qty: 1 });
  renderCart();
  toast('Added to cart');
}

function changeQty(id, d) {
  const item = cart.find(i => i.id === id);
  item.qty += d;
  if (item.qty < 1) cart = cart.filter(i => i.id !== id);
  renderCart();
}

function renderCart() {
  save();
  const box = $('cartItems');
  box.replaceChildren();
  let sub = 0, count = 0;
  if (!cart.length) box.append(el('p', 'empty', 'Your cart is empty.'));
  cart.forEach(i => {
    const p = PRODUCTS.find(x => x.id === i.id);
    sub += p.price * i.qty; count += i.qty;
    const row = el('div', 'item');
    const info = el('div');
    const qty = el('div', 'qty');
    const minus = el('button', '', '−'), plus = el('button', '', '+');
    minus.setAttribute('aria-label', 'Decrease quantity');
    plus.setAttribute('aria-label', 'Increase quantity');
    minus.onclick = () => changeQty(p.id, -1);
    plus.onclick = () => changeQty(p.id, 1);
    qty.append(minus, el('span', '', String(i.qty)), plus);
    info.append(el('strong', '', p.name), el('div', '', money(p.price)), qty);
    const right = el('div');
    const rm = el('button', 'rm', 'Remove');
    rm.onclick = () => { cart = cart.filter(x => x.id !== p.id); renderCart(); };
    right.append(el('div', '', money(p.price * i.qty)), rm);
    row.append(el('div', 'ico', p.icon), info, right);
    box.append(row);
  });
  const ship = sub === 0 || sub >= 50 ? 0 : 5.99;
  $('subtotal').textContent = money(sub);
  $('shipping').textContent = ship ? money(ship) : 'Free';
  $('total').textContent = money(sub + ship);
  $('cartCount').textContent = count;
}

function toggleCart(open) {
  $('cart').classList.toggle('open', open);
  $('cart').setAttribute('aria-hidden', String(!open));
  $('overlay').hidden = !open;
}

let timer;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(timer);
  timer = setTimeout(() => t.classList.remove('show'), 1500);
}

$('search').oninput = renderProducts;
$('sort').onchange = renderProducts;
$('cartBtn').onclick = () => toggleCart(true);
$('closeCart').onclick = $('overlay').onclick = () => toggleCart(false);
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleCart(false); });
$('checkout').onclick = () => {
  if (!cart.length) return toast('Your cart is empty');
  cart = [];
  renderCart();
  toggleCart(false);
  toast('Order placed! (demo)');
};

renderCategories();
renderProducts();
renderCart();
