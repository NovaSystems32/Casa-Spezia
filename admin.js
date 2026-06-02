// ===== CREDENCIALES =====
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'spezia2026';

// ===== PRODUCTOS BASE (solo lectura) =====
const baseProducts = [
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

function getAllProducts() {
  const extra = JSON.parse(localStorage.getItem('cs_products') || '[]');
  return [...baseProducts, ...extra];
}
function getExtraProducts() {
  return JSON.parse(localStorage.getItem('cs_products') || '[]');
}
function saveExtraProducts(list) {
  localStorage.setItem('cs_products', JSON.stringify(list));
}
function getOrders() {
  return JSON.parse(localStorage.getItem('cs_orders') || '[]');
}
function saveOrders(list) {
  localStorage.setItem('cs_orders', JSON.stringify(list));
}

// ===== LOGIN =====
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('cs_admin_logged') === '1') showAdmin();
  document.getElementById('loginPass').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  document.getElementById('topbarDate').textContent = new Date().toLocaleDateString('es-AR', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
});

function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    localStorage.setItem('cs_admin_logged', '1');
    showAdmin();
  } else {
    document.getElementById('loginError').classList.remove('hidden');
  }
}

function doLogout() {
  localStorage.removeItem('cs_admin_logged');
  location.reload();
}

function showAdmin() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'flex';
  loadDashboard();
}

// ===== NAVEGACIÓN =====
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('sec-' + id).classList.add('active');

  const labels = { dashboard:'Dashboard', pedidos:'Pedidos', productos:'Productos', stock:'Stock' };
  document.getElementById('pageTitle').textContent = labels[id] || id;

  const btns = document.querySelectorAll('.nav-item');
  btns.forEach(b => { if (b.textContent.toLowerCase().includes(id.slice(0,4))) b.classList.add('active'); });

  if (id === 'dashboard') loadDashboard();
  if (id === 'pedidos')   renderOrders();
  if (id === 'productos') renderAdminProducts();
  if (id === 'stock')     renderStock();
}

// ===== DASHBOARD =====
function loadDashboard() {
  const orders  = getOrders();
  const prods   = getAllProducts();
  const pending = orders.filter(o => o.estado === 'pendiente').length;
  const totalSales = orders.filter(o => o.estado !== 'cancelado').reduce((s, o) => s + o.total, 0);

  document.getElementById('statPedidos').textContent   = orders.length;
  document.getElementById('statPendientes').textContent = pending;
  document.getElementById('statVentas').textContent    = '$ ' + totalSales.toLocaleString('es-AR') + ' ARS';
  document.getElementById('statProductos').textContent = prods.filter(p => p.stock > 0).length;

  // últimos pedidos
  const recEl = document.getElementById('dashRecentOrders');
  if (orders.length === 0) {
    recEl.innerHTML = '<p style="color:#aaa;font-size:13px;padding:10px 0">Sin pedidos todavía</p>';
  } else {
    recEl.innerHTML = orders.slice(0, 5).map(o => `
      <div class="mini-order">
        <div>
          <strong>${o.nombre}</strong>
          <span>${o.id} · ${o.fecha}</span>
        </div>
        <div style="text-align:right">
          <strong>$${o.total.toLocaleString('es-AR')}</strong>
          <span><span class="estado-badge estado-${o.estado.replace(' ','-')}">${o.estado}</span></span>
        </div>
      </div>`).join('');
  }

  // stock crítico
  const lowEl = document.getElementById('dashLowStock');
  const lowList = prods.filter(p => p.stock <= 5).sort((a,b) => a.stock - b.stock).slice(0, 6);
  if (lowList.length === 0) {
    lowEl.innerHTML = '<p style="color:#aaa;font-size:13px;padding:10px 0">Todo el stock está OK ✅</p>';
  } else {
    lowEl.innerHTML = lowList.map(p => `
      <div class="low-stock-row">
        <span>${p.emoji} ${p.name}</span>
        <span class="stock-pill ${p.stock === 0 ? 'out' : 'low'}">${p.stock === 0 ? 'Sin stock' : p.stock + ' uds'}</span>
      </div>`).join('');
  }
}

// ===== PEDIDOS =====
function renderOrders() {
  const q      = (document.getElementById('searchOrder')?.value || '').toLowerCase();
  const estado = document.getElementById('filterEstado')?.value || '';
  let orders   = getOrders();

  if (q)      orders = orders.filter(o => o.nombre.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.tel.includes(q));
  if (estado) orders = orders.filter(o => o.estado === estado);

  const tbody  = document.getElementById('ordersTbody');
  const empty  = document.getElementById('ordersEmpty');
  const pagoLabel = { efectivo:'💵 Efectivo', transferencia:'🏦 Transferencia', tarjeta:'💳 Tarjeta', mercadopago:'💙 MercadoPago' };

  if (orders.length === 0) {
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.fecha}</td>
      <td><strong>${o.nombre}</strong></td>
      <td>${o.tel}</td>
      <td>${o.entrega === 'envio' ? '🚚 Envío' : '🏪 Retiro'}</td>
      <td>${pagoLabel[o.pago] || o.pago}</td>
      <td><strong>$${o.total.toLocaleString('es-AR')}</strong></td>
      <td><span class="estado-badge estado-${o.estado.replace(' ','-')}">${o.estado}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-sm btn-view" onclick="viewOrder('${o.id}')">Ver</button>
          <button class="btn-sm btn-del"  onclick="deleteOrder('${o.id}')">Eliminar</button>
        </div>
      </td>
    </tr>`).join('');
}

function viewOrder(id) {
  const orders = getOrders();
  const o = orders.find(x => x.id === id);
  if (!o) return;
  const pagoLabel = { efectivo:'💵 Efectivo', transferencia:'🏦 Transferencia', tarjeta:'💳 Tarjeta', mercadopago:'💙 MercadoPago' };
  document.getElementById('orderDetailTitle').textContent = `Pedido ${o.id}`;
  document.getElementById('orderDetailBody').innerHTML = `
    <div class="order-detail-section">
      <h4>Cliente</h4>
      <div class="detail-row"><span>Nombre</span><strong>${o.nombre}</strong></div>
      <div class="detail-row"><span>Teléfono</span><strong>${o.tel}</strong></div>
      <div class="detail-row"><span>Fecha</span><strong>${o.fecha}</strong></div>
    </div>
    <div class="order-detail-section">
      <h4>Entrega y pago</h4>
      <div class="detail-row"><span>Entrega</span><strong>${o.entrega === 'envio' ? '🚚 Envío a ' + o.dir : '🏪 Retiro en tienda'}</strong></div>
      <div class="detail-row"><span>Pago</span><strong>${pagoLabel[o.pago] || o.pago}</strong></div>
      ${o.notas ? `<div class="detail-row"><span>Notas</span><strong>${o.notas}</strong></div>` : ''}
    </div>
    <div class="order-detail-section">
      <h4>Productos</h4>
      <table class="order-items-table">
        <thead><tr><th>Producto</th><th>Precio unit.</th><th>Cant.</th><th>Subtotal</th></tr></thead>
        <tbody>
          ${o.items.map(i => `<tr>
            <td>${i.emoji} ${i.name}</td>
            <td>$${i.price.toLocaleString('es-AR')}</td>
            <td>${i.qty}</td>
            <td>$${(i.price*i.qty).toLocaleString('es-AR')}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="detail-total"><span>Total</span><span>$${o.total.toLocaleString('es-AR')}</span></div>
    <div class="change-estado-row">
      <label>Estado del pedido:</label>
      <select class="estado-select" id="estadoSelect" onchange="changeOrderEstado('${o.id}', this.value)">
        <option ${o.estado==='pendiente'    ? 'selected' : ''} value="pendiente">Pendiente</option>
        <option ${o.estado==='en proceso'   ? 'selected' : ''} value="en proceso">En proceso</option>
        <option ${o.estado==='enviado'      ? 'selected' : ''} value="enviado">Enviado</option>
        <option ${o.estado==='entregado'    ? 'selected' : ''} value="entregado">Entregado</option>
        <option ${o.estado==='cancelado'    ? 'selected' : ''} value="cancelado">Cancelado</option>
      </select>
    </div>`;
  document.getElementById('orderDetailModal').classList.remove('hidden');
  document.getElementById('orderDetailOverlay').classList.remove('hidden');
}

function changeOrderEstado(id, newEstado) {
  const orders = getOrders();
  const o = orders.find(x => x.id === id);
  if (o) { o.estado = newEstado; saveOrders(orders); renderOrders(); showToast('✓ Estado actualizado'); }
}

function closeOrderDetail() {
  document.getElementById('orderDetailModal').classList.add('hidden');
  document.getElementById('orderDetailOverlay').classList.add('hidden');
}

function deleteOrder(id) {
  if (!confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) return;
  const orders = getOrders().filter(o => o.id !== id);
  saveOrders(orders);
  renderOrders();
  showToast('🗑️ Pedido eliminado');
}

// ===== PRODUCTOS =====
function renderAdminProducts() {
  const q = (document.getElementById('searchProd')?.value || '').toLowerCase();
  let prods = getAllProducts();
  if (q) prods = prods.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  const extra = getExtraProducts();

  document.getElementById('productsTbody').innerHTML = prods.map(p => {
    const isBase = !extra.find(e => e.id === p.id);
    const discount = p.oldPrice ? Math.round((1 - p.price/p.oldPrice)*100) : 0;
    return `<tr>
      <td><div class="prod-cell">
        <div class="prod-emoji">${p.photo ? `<img src="${p.photo}" style="width:40px;height:40px;object-fit:cover;border-radius:8px;">` : p.emoji}</div>
        <div><strong>${p.name}</strong><span>${p.brand}</span></div>
      </div></td>
      <td>${p.brand}</td>
      <td style="text-transform:capitalize">${p.category}</td>
      <td>
        <strong>$${p.price.toLocaleString('es-AR')}</strong>
        ${discount ? `<br><span style="font-size:11px;color:#16a34a">-${discount}%</span>` : ''}
      </td>
      <td><span class="stock-pill ${p.stock===0 ? 'out' : p.stock<=5 ? 'low' : 'ok'}">${p.stock}</span></td>
      <td><span class="estado-badge ${p.stock > 0 ? 'estado-entregado' : 'estado-cancelado'}">${p.stock > 0 ? 'Activo' : 'Sin stock'}</span></td>
      <td><div class="action-btns">
        ${!isBase ? `<button class="btn-sm btn-edit" onclick="editProduct(${p.id})">Editar</button>` : '<span style="font-size:11px;color:#aaa">Base</span>'}
        ${!isBase ? `<button class="btn-sm btn-del"  onclick="deleteProduct(${p.id})">Eliminar</button>` : ''}
      </div></td>
    </tr>`;
  }).join('');
}

// ===== FOTO / COMPRESIÓN =====
function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const MAX_SIZE = 600;   // px máximo lado más largo
  const QUALITY  = 0.72;  // calidad JPEG (0–1)

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      // calcular nuevas dimensiones manteniendo aspecto
      let w = img.width, h = img.height;
      if (w > h) { if (w > MAX_SIZE) { h = Math.round(h * MAX_SIZE / w); w = MAX_SIZE; } }
      else       { if (h > MAX_SIZE) { w = Math.round(w * MAX_SIZE / h); h = MAX_SIZE; } }

      const canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);

      const compressed = canvas.toDataURL('image/jpeg', QUALITY);
      const originalKB  = Math.round(file.size / 1024);
      const compressedKB = Math.round((compressed.length * 3) / 4 / 1024);

      document.getElementById('pf_photoData').value = compressed;
      document.getElementById('photoPreview').innerHTML = `
        <img src="${compressed}" alt="preview" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" />
        <div class="photo-compress-badge">📦 ${originalKB} KB → ${compressedKB} KB</div>`;
      document.getElementById('btnRemovePhoto').classList.remove('hidden');
      document.getElementById('photoUploadArea').style.border = '2px solid var(--yellow)';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  document.getElementById('pf_photoData').value = '';
  document.getElementById('pf_photo').value = '';
  document.getElementById('photoPreview').innerHTML = `
    <span>📷</span>
    <p>Hacé clic para subir una foto</p>
    <small>JPG, PNG, WEBP — se comprime automáticamente</small>`;
  document.getElementById('btnRemovePhoto').classList.add('hidden');
  document.getElementById('photoUploadArea').style.border = '';
}

function openProductForm(id) {
  document.getElementById('pf_id').value       = id || '';
  document.getElementById('pf_name').value     = '';
  document.getElementById('pf_brand').value    = '';
  document.getElementById('pf_price').value    = '';
  document.getElementById('pf_oldprice').value = '';
  document.getElementById('pf_stock').value    = '';
  document.getElementById('pf_emoji').value    = '🔧';
  document.getElementById('pf_tag').value      = '';
  document.getElementById('pf_cuotas').value   = '1';
  document.getElementById('pf_category').value = 'herramientas';
  document.getElementById('productFormTitle').textContent = id ? 'Editar producto' : 'Nuevo producto';
  removePhoto();

  if (id) {
    const extra = getExtraProducts();
    const p = extra.find(x => x.id === id);
    if (p) {
      document.getElementById('pf_name').value     = p.name;
      document.getElementById('pf_brand').value    = p.brand;
      document.getElementById('pf_price').value    = p.price;
      document.getElementById('pf_oldprice').value = p.oldPrice || '';
      document.getElementById('pf_stock').value    = p.stock;
      document.getElementById('pf_emoji').value    = p.emoji;
      document.getElementById('pf_tag').value      = p.tag || '';
      document.getElementById('pf_cuotas').value   = p.cuotas || 1;
      document.getElementById('pf_category').value = p.category;
      if (p.photo) {
        document.getElementById('pf_photoData').value = p.photo;
        document.getElementById('photoPreview').innerHTML = `
          <img src="${p.photo}" alt="preview" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" />`;
        document.getElementById('btnRemovePhoto').classList.remove('hidden');
        document.getElementById('photoUploadArea').style.border = '2px solid var(--yellow)';
      }
    }
  }
  document.getElementById('productFormModal').classList.remove('hidden');
  document.getElementById('productFormOverlay').classList.remove('hidden');
}

function editProduct(id) { openProductForm(id); }

function closeProductForm() {
  document.getElementById('productFormModal').classList.add('hidden');
  document.getElementById('productFormOverlay').classList.add('hidden');
}

function saveProduct() {
  const name     = document.getElementById('pf_name').value.trim();
  const brand    = document.getElementById('pf_brand').value.trim();
  const price    = parseFloat(document.getElementById('pf_price').value);
  const oldPrice = parseFloat(document.getElementById('pf_oldprice').value) || null;
  const stock    = parseInt(document.getElementById('pf_stock').value);
  const emoji    = document.getElementById('pf_emoji').value.trim() || '🔧';
  const tag      = document.getElementById('pf_tag').value || null;
  const cuotas   = parseInt(document.getElementById('pf_cuotas').value);
  const category = document.getElementById('pf_category').value;
  const editId   = document.getElementById('pf_id').value;
  const photo    = document.getElementById('pf_photoData').value || null;

  if (!name || !brand || isNaN(price) || isNaN(stock)) { showToast('⚠️ Completá los campos obligatorios'); return; }

  const extra = getExtraProducts();

  if (editId) {
    const idx = extra.findIndex(p => p.id === parseInt(editId));
    if (idx >= 0) extra[idx] = { ...extra[idx], name, brand, price, oldPrice, stock, emoji, tag, cuotas, category, photo };
  } else {
    extra.push({ id: Date.now(), name, brand, price, oldPrice, stock, emoji, tag, cuotas, category, photo, rating: 4.5, reviews: 0 });
  }

  saveExtraProducts(extra);
  closeProductForm();
  renderAdminProducts();
  showToast('✓ Producto guardado');
}

function deleteProduct(id) {
  if (!confirm('¿Eliminar este producto?')) return;
  const extra = getExtraProducts().filter(p => p.id !== id);
  saveExtraProducts(extra);
  renderAdminProducts();
  showToast('🗑️ Producto eliminado');
}

// ===== STOCK =====
function renderStock() {
  const q = (document.getElementById('searchStock')?.value || '').toLowerCase();
  let prods = getAllProducts();
  if (q) prods = prods.filter(p => p.name.toLowerCase().includes(q));
  const extra = getExtraProducts();

  document.getElementById('stockTbody').innerHTML = prods.map(p => {
    const isExtra = !!extra.find(e => e.id === p.id);
    const pill = p.stock === 0 ? 'out' : p.stock <= 5 ? 'low' : 'ok';
    const pillLabel = p.stock === 0 ? 'Sin stock' : p.stock <= 5 ? 'Stock bajo' : 'OK';
    return `<tr>
      <td><div class="prod-cell">
        <div class="prod-emoji">${p.emoji}</div>
        <div><strong>${p.name}</strong><span>${p.brand}</span></div>
      </div></td>
      <td style="text-transform:capitalize">${p.category}</td>
      <td><strong style="font-size:16px">${p.stock}</strong> uds</td>
      <td><span class="stock-pill ${pill}">${pillLabel}</span></td>
      <td>
        ${isExtra ? `
        <div style="display:flex;gap:8px;align-items:center">
          <input type="number" class="stock-input" id="stock_${p.id}" value="${p.stock}" min="0" />
          <button class="btn-save-stock" onclick="updateStock(${p.id})">Guardar</button>
        </div>` : '<span style="font-size:12px;color:#aaa">Solo lectura</span>'}
      </td>
    </tr>`;
  }).join('');
}

function updateStock(id) {
  const val = parseInt(document.getElementById('stock_' + id)?.value);
  if (isNaN(val) || val < 0) { showToast('⚠️ Stock inválido'); return; }
  const extra = getExtraProducts();
  const p = extra.find(x => x.id === id);
  if (p) { p.stock = val; saveExtraProducts(extra); renderStock(); showToast('✓ Stock actualizado'); }
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('adminToast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}
