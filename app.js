// ===== DATOS DE PRODUCTOS =====
const products = [
  { id:1,  name:'Taladro Percutor 750W',         brand:'Black & Decker', category:'herramientas', emoji:'🔩', price:18990, oldPrice:24990, rating:4.8, reviews:312, tag:'sale',  cuotas:12 },
  { id:2,  name:'Set Destornilladores 12 piezas', brand:'Stanley',        category:'herramientas', emoji:'🔧', price:5490,  oldPrice:null,  rating:4.6, reviews:187, tag:'new',   cuotas:6  },
  { id:3,  name:'Nivel Digital 60cm',             brand:'Bahco',          category:'herramientas', emoji:'📏', price:8990,  oldPrice:11990, rating:4.7, reviews:94,  tag:'sale',  cuotas:6  },
  { id:4,  name:'Sierra Circular 1400W',          brand:'Bosch',          category:'herramientas', emoji:'⚙️', price:29990, oldPrice:36990, rating:4.9, reviews:201, tag:'sale',  cuotas:12 },
  { id:5,  name:'Llave Inglesa 12"',              brand:'Bahco',          category:'herramientas', emoji:'🔑', price:3990,  oldPrice:null,  rating:4.5, reviews:76,  tag:null,   cuotas:3  },
  { id:6,  name:'Martillo de Uña 500g',           brand:'Stanley',        category:'herramientas', emoji:'🔨', price:2990,  oldPrice:null,  rating:4.4, reviews:143, tag:null,   cuotas:3  },
  { id:7,  name:'Disyuntor Termomagnético 20A',   brand:'Schneider',      category:'electricidad', emoji:'⚡', price:2490,  oldPrice:3200,  rating:4.7, reviews:88,  tag:'sale',  cuotas:3  },
  { id:8,  name:'Cable Unipolar 2.5mm x 100m',   brand:'Prysmian',       category:'electricidad', emoji:'🔌', price:12990, oldPrice:15990, rating:4.8, reviews:256, tag:'sale',  cuotas:6  },
  { id:9,  name:'Tomacorriente Doble c/tierra',   brand:'Bticino',        category:'electricidad', emoji:'🔋', price:890,   oldPrice:null,  rating:4.6, reviews:321, tag:'new',   cuotas:1  },
  { id:10, name:'Tablero Eléctrico 12 Bocas',     brand:'Schneider',      category:'electricidad', emoji:'🗃️', price:7990,  oldPrice:9500,  rating:4.7, reviews:112, tag:'sale',  cuotas:6  },
  { id:11, name:'Caño Corrugado 25mm x 25m',      brand:'Iram',           category:'electricidad', emoji:'🌀', price:1890,  oldPrice:null,  rating:4.3, reviews:67,  tag:null,   cuotas:1  },
  { id:12, name:'Cinta Aisladora 10m x5',         brand:'3M',             category:'electricidad', emoji:'🩹', price:990,   oldPrice:null,  rating:4.5, reviews:408, tag:null,   cuotas:1  },
  { id:13, name:'Inodoro Salida Dual',             brand:'FV',             category:'plomeria',     emoji:'🚽', price:24990, oldPrice:29990, rating:4.6, reviews:143, tag:'sale',  cuotas:12 },
  { id:14, name:'Canilla Monocomando Cocina',      brand:'Grohe',          category:'plomeria',     emoji:'🚿', price:15990, oldPrice:19990, rating:4.8, reviews:97,  tag:'sale',  cuotas:6  },
  { id:15, name:'Cinta Teflón x 10 unidades',     brand:'Iram',           category:'plomeria',     emoji:'🧵', price:590,   oldPrice:null,  rating:4.4, reviews:512, tag:null,   cuotas:1  },
  { id:16, name:'Flexible Acero 30cm',            brand:'Ferrum',         category:'plomeria',     emoji:'🔗', price:890,   oldPrice:null,  rating:4.3, reviews:178, tag:'new',   cuotas:1  },
  { id:17, name:'Pintura Látex Interior 20L',      brand:'Sherwin Williams',category:'pintura',     emoji:'🎨', price:16990, oldPrice:20990, rating:4.7, reviews:234, tag:'sale',  cuotas:6  },
  { id:18, name:'Rodillo Antialpiste 22cm',        brand:'Montana',        category:'pintura',      emoji:'🖌️', price:1490,  oldPrice:null,  rating:4.5, reviews:167, tag:null,   cuotas:1  },
  { id:19, name:'Enduído Interior 10L',            brand:'Sinteplast',     category:'pintura',      emoji:'🪣', price:8990,  oldPrice:11990, rating:4.6, reviews:89,  tag:'sale',  cuotas:6  },
  { id:20, name:'Barniz Marino 4L',                brand:'Berdín',         category:'pintura',      emoji:'✨', price:7490,  oldPrice:null,  rating:4.4, reviews:55,  tag:'new',   cuotas:3  },
  { id:21, name:'Tarugos Plásticos 8mm x 100u',   brand:'Fischer',        category:'fijacion',     emoji:'🔩', price:890,   oldPrice:null,  rating:4.8, reviews:634, tag:null,   cuotas:1  },
  { id:22, name:'Tornillos Cabeza Plana 4x40 x50', brand:'Fischer',       category:'fijacion',     emoji:'⚙️', price:490,   oldPrice:null,  rating:4.7, reviews:412, tag:null,   cuotas:1  },
  { id:23, name:'Silicona Neutra Transparente',    brand:'Sika',           category:'fijacion',     emoji:'💧', price:1290,  oldPrice:1590,  rating:4.6, reviews:289, tag:'sale',  cuotas:1  },
  { id:24, name:'Pistola de Silicona Profesional', brand:'Ironside',       category:'fijacion',     emoji:'🔫', price:2490,  oldPrice:null,  rating:4.5, reviews:123, tag:'new',   cuotas:3  },
  { id:25, name:'Cerradura Doble Paleta',          brand:'Yale',           category:'seguridad',    emoji:'🔐', price:6990,  oldPrice:8990,  rating:4.9, reviews:312, tag:'sale',  cuotas:6  },
  { id:26, name:'Candado Arco Largo 50mm',         brand:'Abus',           category:'seguridad',    emoji:'🔒', price:3490,  oldPrice:null,  rating:4.8, reviews:198, tag:null,   cuotas:3  },
  { id:27, name:'Cámara IP WiFi Exterior',         brand:'Hikvision',      category:'seguridad',    emoji:'📷', price:11990, oldPrice:14990, rating:4.7, reviews:267, tag:'sale',  cuotas:6  },
  { id:28, name:'Alarma Inalámbrica 8 Zonas',      brand:'DSC',            category:'seguridad',    emoji:'🚨', price:19990, oldPrice:24990, rating:4.6, reviews:145, tag:'sale',  cuotas:12 },
  { id:29, name:'Pala de Punta Mango Largo',       brand:'Bellota',        category:'jardin',       emoji:'⛏️', price:4490,  oldPrice:5990,  rating:4.6, reviews:134, tag:'sale',  cuotas:3  },
  { id:30, name:'Manguera Reforzada 3/4" x 20m',   brand:'Iram',           category:'jardin',       emoji:'🌊', price:5990,  oldPrice:null,  rating:4.5, reviews:211, tag:'new',   cuotas:3  },
  { id:31, name:'Aspersor Giratorio 360°',         brand:'Gardena',        category:'jardin',       emoji:'💦', price:1990,  oldPrice:2490,  rating:4.4, reviews:87,  tag:'sale',  cuotas:1  },
  { id:32, name:'Tijera de Podar Profesional',     brand:'Bellota',        category:'jardin',       emoji:'✂️', price:3290,  oldPrice:null,  rating:4.7, reviews:156, tag:null,   cuotas:3  },
];

// ===== ESTADO =====
let cart = [];
let favorites = [];
let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'default';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchProducts();
  });
});

// ===== RENDER PRODUCTS =====
function renderProducts() {
  let list = [...products];

  if (currentCategory !== 'all') {
    list = list.filter(p => p.category === currentCategory);
  }
  if (currentSearch) {
    const q = currentSearch.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // Sort
  if (currentSort === 'price-asc')  list.sort((a,b) => a.price - b.price);
  if (currentSort === 'price-desc') list.sort((a,b) => b.price - a.price);
  if (currentSort === 'name')       list.sort((a,b) => a.name.localeCompare(b.name));
  if (currentSort === 'rating')     list.sort((a,b) => b.rating - a.rating);

  const grid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');

  if (list.length === 0) {
    grid.innerHTML = '';
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
    grid.innerHTML = list.map(p => productCard(p)).join('');
  }

  // section title
  const titles = {
    all:'Todos los productos', herramientas:'Herramientas',
    electricidad:'Electricidad', plomeria:'Plomería',
    pintura:'Pintura', fijacion:'Fijación',
    seguridad:'Seguridad', jardin:'Jardín'
  };
  document.getElementById('sectionTitle').textContent =
    currentSearch ? `Resultados para "${currentSearch}"` : (titles[currentCategory] || 'Productos');
  document.getElementById('sectionCount').textContent =
    `${list.length} producto${list.length !== 1 ? 's' : ''} encontrado${list.length !== 1 ? 's' : ''}`;
}

function productCard(p) {
  const discount = p.oldPrice ? Math.round((1 - p.price/p.oldPrice)*100) : 0;
  const isFav = favorites.includes(p.id);
  const inCart = cart.find(c => c.id === p.id);
  const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '½' : '');

  return `
  <div class="product-card">
    <div class="product-img">
      <span>${p.emoji}</span>
      ${p.tag ? `<span class="product-tag ${p.tag === 'new' ? 'new' : ''}">${p.tag === 'sale' ? `${discount}% OFF` : 'Nuevo'}</span>` : ''}
      <button class="product-fav ${isFav ? 'active' : ''}" onclick="toggleFav(${p.id})">${isFav ? '❤️' : '♡'}</button>
    </div>
    <div class="product-body">
      <div class="product-brand">${p.brand}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-rating">
        <span class="stars">${stars}</span>
        <span>${p.rating} (${p.reviews})</span>
      </div>
      <div class="product-price-row">
        <span class="product-price">$${p.price.toLocaleString('es-AR')}</span>
        ${p.oldPrice ? `<span class="product-old-price">$${p.oldPrice.toLocaleString('es-AR')}</span>` : ''}
        ${discount ? `<span class="product-discount">${discount}% OFF</span>` : ''}
      </div>
      <div class="product-cuotas">${p.cuotas > 1 ? `<span>${p.cuotas} cuotas sin interés de $${Math.round(p.price/p.cuotas).toLocaleString('es-AR')}</span>` : 'Pago único'}</div>
      <button class="btn-add ${inCart ? 'added' : ''}" onclick="addToCart(${p.id})">
        ${inCart ? '✓ Agregado' : '+ Agregar al carrito'}
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
  if (navBtns[map[cat]]) navBtns[map[cat]].classList.add('active');
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

// ===== CARRITO =====
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) {
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
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { updateCartBadge(); renderCartItems(); }
}

function updateCartBadge() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  document.getElementById('cartBadge').textContent = total;
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <span>🛒</span>
        <p>Tu carrito está vacío</p>
        <button class="btn-primary" onclick="toggleCart()">Seguir comprando</button>
      </div>`;
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

// ===== FAVORITOS =====
function toggleFav(id) {
  const idx = favorites.indexOf(id);
  const product = products.find(p => p.id === id);
  if (idx === -1) {
    favorites.push(id);
    showToast(`❤️ ${product.name} guardado en favoritos`);
  } else {
    favorites.splice(idx, 1);
    showToast(`🗑️ ${product.name} eliminado de favoritos`);
  }
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
