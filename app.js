// ===== ESTADO =====
let cart = [];
let favorites = [];
let currentCategory = 'all';
let currentSearch = '';
let currentSort = 'default';
let catalogExpanded = false;
let allProducts = [];         // se llena desde Firestore en tiempo real
const INITIAL_LIMIT = 8;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadFavorites();
  loadCart();
  listenProducts();            // escucha Firestore en tiempo real

  document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchProducts();
  });
});

// ===== FIRESTORE – ESCUCHAR PRODUCTOS EN TIEMPO REAL =====
function listenProducts() {
  showLoadingGrid();
  db.collection('products')
    .onSnapshot(snapshot => {
      allProducts = snapshot.docs
        .map(doc => ({ firestoreId: doc.id, ...doc.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      renderProducts();
    }, err => {
      console.error('Error cargando productos:', err);
      showErrorGrid();
    });
}

function showLoadingGrid() {
  document.getElementById('productsGrid').innerHTML = `
    <div class="grid-loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <span>Cargando productos…</span>
    </div>`;
}
function showErrorGrid() {
  document.getElementById('productsGrid').innerHTML = `
    <div class="grid-loading">
      <i class="fa-solid fa-triangle-exclamation" style="color:#ef4444"></i>
      <span>Error al cargar productos</span>
    </div>`;
}

// ===== RENDER PRODUCTS =====
function renderProducts() {
  let list = allProducts.filter(p => !p.stock || p.stock > 0);

  if (currentCategory !== 'all') list = list.filter(p => p.category === currentCategory);
  if (currentSearch) {
    const q = currentSearch.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // anclados primero (salvo que haya orden manual)
  if (currentSort === 'default') list.sort((a,b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  if (currentSort === 'price-asc')  list.sort((a,b) => a.price - b.price);
  if (currentSort === 'price-desc') list.sort((a,b) => b.price - a.price);
  if (currentSort === 'name')       list.sort((a,b) => a.name.localeCompare(b.name));
  if (currentSort === 'rating')     list.sort((a,b) => (b.rating||0) - (a.rating||0));

  const grid      = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  const moreWrap  = document.getElementById('showMoreWrap');
  const moreText  = document.getElementById('showMoreText');
  const moreCount = document.getElementById('showMoreCount');
  const moreArrow = document.getElementById('showMoreArrow');
  const moreBtn   = document.getElementById('showMoreBtn');

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
        moreArrow.className   = 'fa-solid fa-chevron-up';
        moreBtn.classList.add('expanded');
      } else {
        moreText.textContent  = 'Ver catálogo completo';
        moreCount.textContent = `(${hidden} productos más)`;
        moreArrow.className   = 'fa-solid fa-chevron-down';
        moreBtn.classList.remove('expanded');
      }
    } else {
      moreWrap.style.display = 'none';
    }
  }

  const titles = {
    all:'Todos los productos', herramientas:'Herramientas',
    electricidad:'Electricidad', plomeria:'Plomería',
    pintura:'Pintura', fijacion:'Fijación',
    construccion:'Materiales de Construcción', jardin:'Jardín'
  };
  document.getElementById('sectionTitle').textContent =
    currentSearch ? `Resultados para "${currentSearch}"` : (titles[currentCategory] || 'Productos');
  document.getElementById('sectionCount').textContent =
    `${list.length} producto${list.length !== 1 ? 's' : ''} encontrado${list.length !== 1 ? 's' : ''}`;
}

function productCard(p) {
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const isFav    = favorites.includes(p.firestoreId);
  const inCart   = cart.find(c => c.firestoreId === p.firestoreId);
  const stars    = '★'.repeat(Math.floor(p.rating || 4)) + ((p.rating||4) % 1 >= 0.5 ? '½' : '');
  const lowStock = p.stock !== undefined && p.stock > 0 && p.stock <= 5;

  return `
  <div class="product-card">
    <div class="product-img">
      ${p.photo
        ? `<img src="${p.photo}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" />`
        : `<i class="fa-solid fa-box-open" style="font-size:60px;color:#ccc"></i>`}
      ${p.pinned
        ? `<span class="product-tag pinned"><i class="fa-solid fa-thumbtack"></i> Destacado</span>`
        : p.tag
          ? `<span class="product-tag ${p.tag === 'new' ? 'new' : ''}">${p.tag === 'sale' ? `${discount}% OFF` : 'Nuevo'}</span>`
          : ''}
      <button class="product-fav ${isFav ? 'active' : ''}" onclick="toggleFav('${p.firestoreId}')">
        <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
      </button>
    </div>
    <div class="product-body">
      <div class="product-brand">${p.brand}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-rating"><span class="stars">${stars}</span><span>${p.rating || 4} (${p.reviews || 0})</span></div>
      <div class="product-price-row">
        <span class="product-price">$${Number(p.price).toLocaleString('es-AR')}</span>
        ${p.oldPrice ? `<span class="product-old-price">$${Number(p.oldPrice).toLocaleString('es-AR')}</span>` : ''}
        ${discount ? `<span class="product-discount">${discount}% OFF</span>` : ''}
      </div>
      <div class="product-cuotas">
        ${p.cuotas > 1
          ? `<span>${p.cuotas} cuotas sin interés de $${Math.round(p.price / p.cuotas).toLocaleString('es-AR')}</span>`
          : 'Pago único'}
      </div>
      ${lowStock ? `<div class="low-stock"><i class="fa-solid fa-triangle-exclamation"></i> Últimas ${p.stock} unidades</div>` : ''}
      <button class="btn-add ${inCart ? 'added' : ''}" onclick="addToCart('${p.firestoreId}')">
        ${inCart
          ? '<i class="fa-solid fa-check"></i> En el carrito'
          : '<i class="fa-solid fa-plus"></i> Agregar al carrito'}
      </button>
    </div>
  </div>`;
}

// ===== FILTER & SEARCH =====
function filterCategory(cat) {
  currentCategory = cat;
  currentSearch   = '';
  catalogExpanded = false;
  document.getElementById('searchInput').value = '';
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  const map = { all:0, herramientas:1, electricidad:2, plomeria:3, pintura:4, fijacion:5, construccion:6, jardin:7 };
  const navBtns = document.querySelectorAll('.nav-link');
  if (navBtns[map[cat]] !== undefined) navBtns[map[cat]].classList.add('active');
  renderProducts();
  document.getElementById('products').scrollIntoView({ behavior:'smooth', block:'start' });
}

function searchProducts() {
  currentSearch   = document.getElementById('searchInput').value.trim();
  currentCategory = 'all';
  catalogExpanded = false;
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
function addToCart(firestoreId) {
  const product = allProducts.find(p => p.firestoreId === firestoreId);
  if (!product) return;
  const existing = cart.find(c => c.firestoreId === firestoreId);
  const maxQty   = product.stock || 99;
  if (existing) {
    if (existing.qty >= maxQty) { showToast('⚠ Sin más stock disponible'); return; }
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  updateCartBadge();
  renderCartItems();
  renderProducts();
  showToast(`Agregado: ${product.name}`);
}

function removeFromCart(firestoreId) {
  cart = cart.filter(c => c.firestoreId !== firestoreId);
  saveCart();
  updateCartBadge();
  renderCartItems();
  renderProducts();
}

function changeQty(firestoreId, delta) {
  const item    = cart.find(c => c.firestoreId === firestoreId);
  if (!item) return;
  const product = allProducts.find(p => p.firestoreId === firestoreId);
  const maxQty  = product ? (product.stock || 99) : 99;
  if (delta > 0 && item.qty >= maxQty) { showToast('⚠ Sin más stock disponible'); return; }
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(firestoreId);
  else { saveCart(); updateCartBadge(); renderCartItems(); }
}

function updateCartBadge() {
  document.getElementById('cartBadge').textContent = cart.reduce((s,c) => s + c.qty, 0);
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const footer    = document.getElementById('cartFooter');
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-cart-shopping" style="font-size:48px;color:#ddd;display:block;margin-bottom:12px"></i>
        <p>Tu carrito está vacío</p>
        <button class="btn-primary" onclick="toggleCart()">Seguir comprando</button>
      </div>`;
    footer.style.display = 'none';
    return;
  }
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">
        ${item.photo
          ? `<img src="${item.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:8px">`
          : `<i class="fa-solid fa-box-open" style="font-size:24px;color:#ccc"></i>`}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toLocaleString('es-AR')}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty('${item.firestoreId}',-1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.firestoreId}',1)">+</button>
          <button class="cart-item-remove" onclick="removeFromCart('${item.firestoreId}')">Eliminar</button>
        </div>
      </div>
    </div>`).join('');

  const total = cart.reduce((s,c) => s + c.price * c.qty, 0);
  document.getElementById('cartTotal').textContent = `$${total.toLocaleString('es-AR')}`;
  footer.style.display = 'block';
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

function saveCart() {
  localStorage.setItem('cs_cart', JSON.stringify(cart));
}
function loadCart() {
  cart = JSON.parse(localStorage.getItem('cs_cart') || '[]');
  updateCartBadge();
  renderCartItems();
}

// ===== CHECKOUT =====
function openCheckout() {
  if (cart.length === 0) return;
  toggleCart();
  const total = cart.reduce((s,c) => s + c.price * c.qty, 0);
  document.getElementById('ckItemsList').innerHTML = cart.map(i =>
    `<div class="ck-item"><span>${i.name} x${i.qty}</span><span>$${(i.price*i.qty).toLocaleString('es-AR')}</span></div>`
  ).join('');
  document.getElementById('ckTotalShow').textContent = `$${total.toLocaleString('es-AR')}`;
  document.getElementById('step1').style.display = 'block';
  document.getElementById('step2').style.display = 'none';
  document.getElementById('checkoutModal').classList.add('open');
  document.getElementById('checkoutOverlay').classList.add('open');
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('open');
  document.getElementById('checkoutOverlay').classList.remove('open');
}

async function confirmOrder() {
  const nombre  = document.getElementById('ckNombre').value.trim();
  const tel     = document.getElementById('ckTel').value.trim();
  const dir     = document.getElementById('ckDir').value.trim();
  const notas   = document.getElementById('ckNotas').value.trim();
  const pago    = document.querySelector('input[name="pago"]:checked').value;
  const entrega = document.querySelector('input[name="entrega"]:checked').value;

  if (!nombre || !tel || !dir) { showToast('Completá los campos obligatorios'); return; }

  const total   = cart.reduce((s,c) => s + c.price * c.qty, 0);
  const orderId = 'CS-' + Date.now().toString().slice(-6);

  const order = {
    orderId, nombre, tel, dir, notas, pago, entrega,
    items: cart.map(i => ({ firestoreId:i.firestoreId, name:i.name, price:i.price, qty:i.qty })),
    total,
    estado: 'pendiente',
    fecha: new Date().toLocaleString('es-AR'),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    const btn = document.querySelector('#step1 .btn-primary:last-child');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando…';

    await db.collection('orders').add(order);

    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    document.getElementById('ckTelShow').textContent = tel;
    document.getElementById('orderBox').innerHTML = `
      <div class="order-detail-row"><span>N° pedido:</span><strong>${orderId}</strong></div>
      <div class="order-detail-row"><span>Cliente:</span><strong>${nombre}</strong></div>
      <div class="order-detail-row"><span>Entrega:</span><strong>${entrega === 'envio' ? 'Envío a '+dir : 'Retiro en tienda'}</strong></div>
      <div class="order-detail-row"><span>Pago:</span><strong>${{efectivo:'Efectivo',transferencia:'Transferencia',tarjeta:'Tarjeta',mercadopago:'MercadoPago'}[pago]}</strong></div>
      <div class="order-detail-row total"><span>Total:</span><strong>$${total.toLocaleString('es-AR')}</strong></div>
      <div class="order-items-list">${cart.map(i=>`<div>${i.name} x${i.qty}</div>`).join('')}</div>`;

    cart = [];
    saveCart();
    updateCartBadge();
    renderCartItems();
    renderProducts();
  } catch(err) {
    console.error(err);
    showToast('Error al enviar el pedido. Intentá de nuevo.');
    const btn = document.querySelector('#step1 .btn-primary:last-child');
    if (btn) { btn.disabled = false; btn.innerHTML = 'Confirmar pedido <i class="fa-solid fa-arrow-right"></i>'; }
  }
}

// ===== FAVORITOS =====
function toggleFav(firestoreId) {
  const product = allProducts.find(p => p.firestoreId === firestoreId);
  const idx = favorites.indexOf(firestoreId);
  if (idx === -1) {
    favorites.push(firestoreId);
    showToast(`Guardado en favoritos: ${product?.name || ''}`);
  } else {
    favorites.splice(idx, 1);
    showToast(`Eliminado de favoritos`);
  }
  localStorage.setItem('cs_favorites', JSON.stringify(favorites));
  document.getElementById('favBadge').textContent = favorites.length;
  renderProducts();
}
function loadFavorites() {
  favorites = JSON.parse(localStorage.getItem('cs_favorites') || '[]');
  document.getElementById('favBadge').textContent = favorites.length;
}
function toggleFavorites() { showToast('Sección de favoritos próximamente'); }

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
