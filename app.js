// ===== PRODUCTOS BASE (se mezclan con los del admin via localStorage) =====
const defaultProducts = [
  { id:1,  name:'Taladro Percutor 750W',         brand:'Black & Decker', category:'herramientas', emoji:'🔩', price:18990, oldPrice:24990, rating:4.8, reviews:312, tag:'sale',  cuotas:12, stock:15 },
  { id:2,  name:'Set Destornilladores 12 piezas', brand:'Stanley',        category:'herramientas', emoji:'🔧', price:5490,  oldPrice:null,  rating:4.6, reviews:187, tag:'new',   cuotas:6,  stock:30 },
  { id:3,  name:'Nivel Digital 60cm',             brand:'Bahco',          category:'herramientas', emoji:'📏', price:8990,  oldPrice:11990, rating:4.7, reviews:94,  tag:'sale',  cuotas:6,  stock:12 },
  { id:4,  name:'Sierra Circular 1400W',          brand:'Bosch',          category:'herramientas', emoji:'⚙️', price:29990, oldPrice:36990, rating:4.9, reviews:201, tag:'sale',  cuotas:12, stock:8  },
  { id:5,  name:'Llave Inglesa 12"',              brand:'Bahco',          category:'herramientas', emoji:'🔑', price:3990,  oldPrice:null,  rating:4.5, reviews:76,  tag:null,   cuotas:3,  stock:20 },
  { id:6,  name:'Martillo de Uña 500g',           brand:'Stanley',        category:'herramientas', emoji:'🔨', price:2990,  oldPrice:null,  rating:4.4, reviews:143, tag:null,   cuotas:3,  stock:25 },
  { id:7,  name:'Disyuntor Termomagnético 20A',   brand:'Schneider',      category:'electricidad', emoji:'⚡', price:2490,  oldPrice:3200,  rating:4.7, reviews:88,  tag:'sale',  cuotas:3,  stock:40 },
  { id:8,  name:'Cable Unipolar 2.5mm x 100m',   brand:'Prysmian',       category:'electricidad', emoji:'🔌', price:12990, oldPrice:15990, rating:4.8, reviews:256, tag:'sale',  cuotas:6,  stock:10 },
  { id:9,  name:'Tomacorriente Doble c/tierra',   brand:'Bticino',        category:'electricidad', emoji:'🔋', price:890,   oldPrice:null,  rating:4.6, reviews:321, tag:'new',   cuotas:1,  stock:60 },
  { id:10, name:'Tablero Eléctrico 12 Bocas',     brand:'Schneider',      category:'electricidad', emoji:'🗃️', price:7990,  oldPrice:9500,  rating:4.7, reviews:112, tag:'sale',  cuotas:6,  stock:7  },
  { id:11, name:'Caño Corrugado 25mm x 25m',      brand:'Iram',           category:'electricidad', emoji:'🌀', price:1890,  oldPrice:null,  rating:4.3, reviews:67,  tag:null,   cuotas:1,  stock:30 },
  { id:12, name:'Cinta Aisladora 10m x5',         brand:'3M',             category:'electricidad', emoji:'🩹', price:990,   oldPrice:null,  rating:4.5, reviews:408, tag:null,   cuotas:1,  stock:80 },
  { id:13, name:'Inodoro Salida Dual',             brand:'FV',             category:'plomeria',     emoji:'🚽', price:24990, oldPrice:29990, rating:4.6, reviews:143, tag:'sale',  cuotas:12, stock:5  },
  { id:14, name:'Canilla Monocomando Cocina',      brand:'Grohe',          category:'plomeria',     emoji:'🚿', price:15990, oldPrice:19990, rating:4.8, reviews:97,  tag:'sale',  cuotas:6,  stock:9  },
  { id:15, name:'Cinta Teflón x 10 unidades',     brand:'Iram',           category:'plomeria',     emoji:'🧵', price:590,   oldPrice:null,  rating:4.4, reviews:512, tag:null,   cuotas:1,  stock:100},
  { id:16, name:'Flexible Acero 30cm',            brand:'Ferrum',         category:'plomeria',     emoji:'🔗', price:890,   oldPrice:null,  rating:4.3, reviews:178, tag:'new',   cuotas:1,  stock:50 },
  { id:17, name:'Pintura Látex Interior 20L',      brand:'Sherwin Williams',category:'pintura',     emoji:'🎨', price:16990, oldPrice:20990, rating:4.7, reviews:234, tag:'sale',  cuotas:6,  stock:18 },
  { id:18, name:'Rodillo Antialpiste 22cm',        brand:'Montana',        category:'pintura',      emoji:'🖌️', price:1490,  oldPrice:null,  rating:4.5, reviews:167, tag:null,   cuotas:1,  stock:35 },
  { id:19, name:'Enduído Interior 10L',            brand:'Sinteplast',     category:'pintura',      emoji:'🪣', price:8990,  oldPrice:11990, rating:4.6, reviews:89,  tag:'sale',  cuotas:6,  stock:20 },
  { id:20, name:'Barniz Marino 4L',                brand:'Berdín',         category:'pintura',      emoji:'✨', price:7490,  oldPrice:null,  rating:4.4, reviews:55,  tag:'new',   cuotas:3,  stock:11 },
  { id:21, name:'Tarugos Plásticos 8mm x 100u',   brand:'Fischer',        category:'fijacion',     emoji:'🔩', price:890,   oldPrice:null,  rating:4.8, reviews:634, tag:null,   cuotas:1,  stock:200},
  { id:22, name:'Tornillos Cabeza Plana 4x40 x50', brand:'Fischer',       category:'fijacion',     emoji:'⚙️', price:490,   oldPrice:null,  rating:4.7, reviews:412, tag:null,   cuotas:1,  stock:300},
  { id:23, name:'Silicona Neutra Transparente',    brand:'Sika',           category:'fijacion',     emoji:'💧', price:1290,  oldPrice:1590,  rating:4.6, reviews:289, tag:'sale',  cuotas:1,  stock:45 },
  { id:24, name:'Pistola de Silicona Profesional', brand:'Ironside',       category:'fijacion',     emoji:'🔫', price:2490,  oldPrice:null,  rating:4.5, reviews:123, tag:'new',   cuotas:3,  stock:22 },
  { id:25, name:'Cerradura Doble Paleta',          brand:'Yale',           category:'seguridad',    emoji:'🔐', price:6990,  oldPrice:8990,  rating:4.9, reviews:312, tag:'sale',  cuotas:6,  stock:14 },
  { id:26, name:'Candado Arco Largo 50mm',         brand:'Abus',           category:'seguridad',    emoji:'🔒', price:3490,  oldPrice:null,  rating:4.8, reviews:198, tag:null,   cuotas:3,  stock:28 },
  { id:27, name:'Cámara IP WiFi Exterior',         brand:'Hikvision',      category:'seguridad',    emoji:'📷', price:11990, oldPrice:14990, rating:4.7, reviews:267, tag:'sale',  cuotas:6,  stock:6  },
  { id:28, name:'Alarma Inalámbrica 8 Zonas',      brand:'DSC',            category:'seguridad',    emoji:'🚨', price:19990, oldPrice:24990, rating:4.6, reviews:145, tag:'sale',  cuotas:12, stock:4  },
  { id:29, name:'Pala de Punta Mango Largo',       brand:'Bellota',        category:'jardin',       emoji:'⛏️', price:4490,  oldPrice:5990,  rating:4.6, reviews:134, tag:'sale',  cuotas:3,  stock:16 },
  { id:30, name:'Manguera Reforzada 3/4" x 20m',   brand:'Iram',           category:'jardin',       emoji:'🌊', price:5990,  oldPrice:null,  rating:4.5, reviews:211, tag:'new',   cuotas:3,  stock:19 },
  { id:31, name:'Aspersor Giratorio 360°',         brand:'Gardena',        category:'jardin',       emoji:'💦', price:1990,  oldPrice:2490,  rating:4.4, reviews:87,  tag:'sale',  cuotas:1,  stock:33 },
  { id:32, name:'Tijera de Podar Profesional',     brand:'Bellota',        category:'jardin',       emoji:'✂️', price:3290,  oldPrice:null,  rating:4.7, reviews:156, tag:null,   cuotas:3,  stock:21 },
];

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

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}
