// ===== SIN PRODUCTOS BASE — todos se cargan desde el admin =====
const defaultProducts = [];

// ===== ESTADO =====
let cart = [];
let favorites = [];
let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'default';
let catalogExpanded = false;
const INITIAL_LIMIT = 8;

function getProducts() {
  const extra = JSON.parse(localStorage.getItem('cs_products') || '[]');
  return [...defaultProducts, ...extra];
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchProducts();
  });
});

// ===== RENDER PRODUCTS =====
function renderProducts() {
  let list = getProducts().filter(p => p.stock === undefined || p.stock > 0);

  if (currentCategory !== 'all') list = list.filter(p => p.category === currentCategory);
  if (currentSearch) {
    const q = currentSearch.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }
  // anclados primero
  list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  if (currentSort === 'price-asc')  list.sort((a,b) => a.price - b.price);
  if (currentSort === 'price-desc') list.sort((a,b) => b.price - a.price);
  if (currentSort === 'name')       list.sort((a,b) => a.name.localeCompare(b.name));
  if (currentSort === 'rating')     list.sort((a,b) => b.rating - a.rating);

  const grid      = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  const moreWrap  = document.getElementById('showMoreWrap');
  const moreBtn   = document.getElementById('showMoreBtn');
  const moreText  = document.getElementById('showMoreText');
  const moreCount = document.getElementById('showMoreCount');
  const moreArrow = document.getElementById('showMoreArrow');

  if (list.length === 0) {
    grid.innerHTML = '';
    noResults.classList.remove('hidden');
    moreWrap.style.display = 'none';
  } else {
    noResults.classList.add('hidden');
    const isFiltered = currentCategory !== 'all' || currentSearch;
    const visible = (isFiltered || catalogExpanded) ? list : list.slice(0, INITIAL_LIMIT);
    grid.innerHTML = visible.map(p => productCard(p)).join('');

    if (!isFiltered && list.length > INITIAL_LIMIT) {
      moreWrap.style.display = 'flex';
      const hidden = list.length - INITIAL_LIMIT;
      if (catalogExpanded) {
        moreText.textContent  = 'Ver menos';
        moreCount.textContent = '';
        moreArrow.textContent = '↑';
        moreBtn.classList.add('expanded');
      } else {
        moreText.textContent  = 'Ver catálogo completo';
        moreCount.textContent = `(${hidden} productos más)`;
        moreArrow.textContent = '↓';
        moreBtn.classList.remove('expanded');
      }
    } else {
      moreWrap.style.display = 'none';
    }
  }

  const titles = { all:'Todos los productos', herramientas:'Herramientas', electricidad:'Electricidad', plomeria:'Plomería', pintura:'Pintura', fijacion:'Fijación', seguridad:'Seguridad', jardin:'Jardín' };
  document.getElementById('sectionTitle').textContent = currentSearch ? `Resultados para "${currentSearch}"` : (titles[currentCategory] || 'Productos');
  document.getElementById('sectionCount').textContent = `${list.length} producto${list.length !== 1 ? 's' : ''} encontrado${list.length !== 1 ? 's' : ''}`;
}

function productCard(p) {
  const discount = p.oldPrice ? Math.round((1 - p.price/p.oldPrice)*100) : 0;
  const isFav = favorites.includes(p.id);
  const inCart = cart.find(c => c.id === p.id);
  const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '½' : '');
  const lowStock = p.stock !== undefined && p.stock <= 5;

  return `
  <div class="product-card">
    <div class="product-img">
      ${p.photo
        ? `<img src="${p.photo}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" />`
        : `<span>${p.emoji}</span>`}
      ${p.pinned ? `<span class="product-tag pinned">📌 Destacado</span>` : p.tag ? `<span class="product-tag ${p.tag === 'new' ? 'new' : ''}">${p.tag === 'sale' ? `${discount}% OFF` : 'Nuevo'}</span>` : ''}
      <button class="product-fav ${isFav ? 'active' : ''}" onclick="toggleFav(${p.id})">${isFav ? '❤️' : '♡'}</button>
    </div>
    <div class="product-body">
      <div class="product-brand">${p.brand}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-rating"><span class="stars">${stars}</span><span>${p.rating} (${p.reviews})</span></div>
      <div class="product-price-row">
        <span class="product-price">$${p.price.toLocaleString('es-AR')}</span>
        ${p.oldPrice ? `<span class="product-old-price">$${p.oldPrice.toLocaleString('es-AR')}</span>` : ''}
        ${discount ? `<span class="product-discount">${discount}% OFF</span>` : ''}
      </div>
      <div class="product-cuotas">${p.cuotas > 1 ? `<span>${p.cuotas} cuotas sin interés de $${Math.round(p.price/p.cuotas).toLocaleString('es-AR')}</span>` : 'Pago único'}</div>
      ${lowStock ? `<div class="low-stock">⚠️ Últimas ${p.stock} unidades</div>` : ''}
      <button class="btn-add ${inCart ? 'added' : ''}" onclick="addToCart(${p.id})">
        ${inCart ? '✓ En el carrito' : '+ Agregar al carrito'}
      </button>
    </div>
  </div>`;
}

// ===== FILTER & SEARCH =====
function filterCategory(cat) {
  currentCategory = cat;
  currentSearch = '';
  document.getElementById('searchInput').value = '';
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  const map = { all:0, herramientas:1, electricidad:2, plomeria:3, pintura:4, fijacion:5, seguridad:6, jardin:7 };
  const navBtns = document.querySelectorAll('.nav-link');
  if (navBtns[map[cat]] !== undefined) navBtns[map[cat]].classList.add('active');
  renderProducts();
  document.getElementById('products').scrollIntoView({ behavior:'smooth', block:'start' });
}

function searchProducts() {
  currentSearch = document.getElementById('searchInput').value.trim();
  currentCategory = 'all';
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.nav-link')[0].classList.add('active');
  renderProducts();
  document.getElementById('products').scrollIntoView({ behavior:'smooth', block:'start' });
}

function sortProducts() {
  currentSort = document.getElementById('sortSelect').value;
  renderProducts();
}

function scrollToOffers() {
  document.getElementById('offers').scrollIntoView({ behavior:'smooth' });
}

function toggleCatalog() {
  catalogExpanded = !catalogExpanded;
  renderProducts();
  if (!catalogExpanded) {
    document.getElementById('products').scrollIntoView({ behavior:'smooth', block:'start' });
  }
}

// ===== CARRITO =====
function addToCart(id) {
  const products = getProducts();
  const product = products.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(c => c.id === id);
  const maxQty = product.stock || 99;
  if (existing) {
    if (existing.qty >= maxQty) { showToast('⚠️ No hay más stock disponible'); return; }
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartBadge();
  renderCartItems();
  renderProducts();
  showToast(`✓ ${product.name} agregado al carrito`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartBadge();
  renderCartItems();
  renderProducts();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  const products = getProducts();
  const product = products.find(p => p.id === id);
  const maxQty = product ? (product.stock || 99) : 99;
  if (delta > 0 && item.qty >= maxQty) { showToast('⚠️ No hay más stock disponible'); return; }
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { updateCartBadge(); renderCartItems(); }
}

function updateCartBadge() {
  document.getElementById('cartBadge').textContent = cart.reduce((s, c) => s + c.qty, 0);
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty"><span>🛒</span><p>Tu carrito está vacío</p><button class="btn-primary" onclick="toggleCart()">Seguir comprando</button></div>`;
    footer.style.display = 'none';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toLocaleString('es-AR')}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Eliminar</button>
        </div>
      </div>
    </div>`).join('');

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  document.getElementById('cartTotal').textContent = `$${total.toLocaleString('es-AR')}`;
  footer.style.display = 'block';
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

// ===== CHECKOUT =====
function openCheckout() {
  if (cart.length === 0) return;
  toggleCart();
  // rellenar resumen
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  document.getElementById('ckItemsList').innerHTML = cart.map(i =>
    `<div class="ck-item"><span>${i.emoji} ${i.name} x${i.qty}</span><span>$${(i.price*i.qty).toLocaleString('es-AR')}</span></div>`
  ).join('');
  document.getElementById('ckTotalShow').textContent = `$${total.toLocaleString('es-AR')}`;
  // reset a paso 1
  document.getElementById('step1').style.display = 'block';
  document.getElementById('step2').style.display = 'none';
  document.getElementById('checkoutModal').classList.add('open');
  document.getElementById('checkoutOverlay').classList.add('open');
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('open');
  document.getElementById('checkoutOverlay').classList.remove('open');
}

function confirmOrder() {
  const nombre = document.getElementById('ckNombre').value.trim();
  const tel    = document.getElementById('ckTel').value.trim();
  const dir    = document.getElementById('ckDir').value.trim();
  const notas  = document.getElementById('ckNotas').value.trim();
  const pago   = document.querySelector('input[name="pago"]:checked').value;
  const entrega= document.querySelector('input[name="entrega"]:checked').value;

  if (!nombre || !tel || !dir) { showToast('⚠️ Completá los campos obligatorios'); return; }

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const orderId = 'CS-' + Date.now().toString().slice(-6);
  const order = {
    id: orderId,
    fecha: new Date().toLocaleString('es-AR'),
    nombre, tel, dir, notas, pago, entrega,
    items: cart.map(i => ({ id:i.id, name:i.name, emoji:i.emoji, price:i.price, qty:i.qty })),
    total,
    estado: 'pendiente'
  };

  // guardar en localStorage
  const orders = JSON.parse(localStorage.getItem('cs_orders') || '[]');
  orders.unshift(order);
  localStorage.setItem('cs_orders', JSON.stringify(orders));

  // descontar stock
  const extraProds = JSON.parse(localStorage.getItem('cs_products') || '[]');
  cart.forEach(cartItem => {
    const ep = extraProds.find(p => p.id === cartItem.id);
    if (ep) ep.stock = Math.max(0, (ep.stock || 0) - cartItem.qty);
    // para productos base, no modificamos (son estáticos)
  });
  localStorage.setItem('cs_products', JSON.stringify(extraProds));

  // mostrar confirmación
  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'block';
  document.getElementById('ckTelShow').textContent = tel;
  document.getElementById('orderBox').innerHTML = `
    <div class="order-detail-row"><span>N° de pedido:</span><strong>${orderId}</strong></div>
    <div class="order-detail-row"><span>Cliente:</span><strong>${nombre}</strong></div>
    <div class="order-detail-row"><span>Entrega:</span><strong>${entrega === 'envio' ? '🚚 Envío a ' + dir : '🏪 Retiro en tienda'}</strong></div>
    <div class="order-detail-row"><span>Pago:</span><strong>${{efectivo:'💵 Efectivo',transferencia:'🏦 Transferencia',tarjeta:'💳 Tarjeta',mercadopago:'💙 MercadoPago'}[pago]}</strong></div>
    <div class="order-detail-row total"><span>Total:</span><strong>$${total.toLocaleString('es-AR')}</strong></div>
    <div class="order-items-list">${cart.map(i=>`<div>${i.emoji} ${i.name} x${i.qty}</div>`).join('')}</div>
  `;

  // limpiar carrito
  cart = [];
  updateCartBadge();
  renderCartItems();
  renderProducts();
}

// ===== FAVORITOS =====
function toggleFav(id) {
  const products = getProducts();
  const idx = favorites.indexOf(id);
  const product = products.find(p => p.id === id);
  if (idx === -1) { favorites.push(id); showToast(`❤️ ${product.name} guardado en favoritos`); }
  else { favorites.splice(idx, 1); showToast(`🗑️ ${product.name} eliminado de favoritos`); }
  document.getElementById('favBadge').textContent = favorites.length;
  renderProducts();
}

function toggleFavorites() {
  showToast('💡 Sección de favoritos próximamente');
}

// ===== MODAL FORMAS DE PAGO =====
function openPagosModal() {
  document.getElementById('pagosModal').classList.add('open');
  document.getElementById('pagosOverlay').classList.add('open');
}
function closePagosModal() {
  document.getElementById('pagosModal').classList.remove('open');
  document.getElementById('pagosOverlay').classList.remove('open');
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}
