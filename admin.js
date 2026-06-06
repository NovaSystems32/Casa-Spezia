// ===== CREDENCIALES =====
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'spezia2026';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('cs_admin_logged') === '1') showAdmin();
  document.getElementById('loginPass').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
  document.getElementById('topbarDate').textContent =
    new Date().toLocaleDateString('es-AR', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
});

// ===== LOGIN =====
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
  document.getElementById('adminPanel').style.display  = 'flex';
  showSection('dashboard');
}

// ===== NAVEGACIÓN =====
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('sec-' + id).classList.add('active');

  const labels = { dashboard:'Dashboard', pedidos:'Pedidos', productos:'Productos', stock:'Stock' };
  document.getElementById('pageTitle').textContent = labels[id] || id;

  // activar botón sidebar
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(b => {
    if (b.textContent.toLowerCase().includes(id.slice(0,4))) b.classList.add('active');
  });

  if (id === 'dashboard') loadDashboard();
  if (id === 'pedidos')   listenOrders();
  if (id === 'productos') listenAdminProducts();
  if (id === 'stock')     listenStock();
}

// ===== LISTENERS FIRESTORE =====
let unsubOrders   = null;
let unsubProducts = null;
let unsubStock    = null;

// ===== DASHBOARD =====
function loadDashboard() {
  db.collection('orders').get().then(snap => {
    const orders = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    const pending = orders.filter(o => o.estado === 'pendiente').length;
    const totalSales = orders.filter(o => o.estado !== 'cancelado').reduce((s,o) => s + o.total, 0);
    document.getElementById('statPedidos').textContent    = orders.length;
    document.getElementById('statPendientes').textContent = pending;
    document.getElementById('statVentas').textContent     = '$ ' + totalSales.toLocaleString('es-AR') + ' ARS';

    const recEl = document.getElementById('dashRecentOrders');
    recEl.innerHTML = orders.length === 0
      ? '<p style="color:#aaa;font-size:13px;padding:10px 0">Sin pedidos todavía</p>'
      : orders.slice(0,5).map(o => `
          <div class="mini-order">
            <div><strong>${o.nombre}</strong><span>${o.orderId} · ${o.fecha}</span></div>
            <div style="text-align:right">
              <strong>$${o.total.toLocaleString('es-AR')}</strong>
              <span><span class="estado-badge estado-${(o.estado||'').replace(' ','-')}">${o.estado}</span></span>
            </div>
          </div>`).join('');
  });

  db.collection('products').get().then(snap => {
    const prods = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    document.getElementById('statProductos').textContent = prods.filter(p => p.stock > 0).length;

    const lowList = prods.filter(p => p.stock <= 5).sort((a,b) => a.stock - b.stock).slice(0,6);
    const lowEl = document.getElementById('dashLowStock');
    lowEl.innerHTML = lowList.length === 0
      ? '<p style="color:#aaa;font-size:13px;padding:10px 0">Todo el stock está OK ✅</p>'
      : lowList.map(p => `
          <div class="low-stock-row">
            <span>${p.name}</span>
            <span class="stock-pill ${p.stock===0?'out':'low'}">${p.stock===0?'Sin stock':p.stock+' uds'}</span>
          </div>`).join('');
  });
}

// ===== PEDIDOS =====
function listenOrders() {
  cargarPedidos();
}

function cargarPedidos() {
  const tbody = document.getElementById('ordersTbody');
  const empty = document.getElementById('ordersEmpty');
  if (!tbody) return;

  tbody.innerHTML = `
    <tr><td colspan="9" style="text-align:center;padding:40px;color:#aaa">
      <i class="fa-solid fa-spinner fa-spin" style="font-size:24px;display:block;margin-bottom:10px"></i>
      Cargando pedidos…
    </td></tr>`;
  if (empty) empty.classList.add('hidden');

  db.collection('orders').get()
    .then(snap => {
      window._orders = snap.docs
        .map(d => ({ firestoreId: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      renderOrders();
    })
    .catch(err => {
      console.error('Error pedidos:', err);
      tbody.innerHTML = `
        <tr><td colspan="9" style="text-align:center;padding:40px;color:#ef4444">
          <i class="fa-solid fa-triangle-exclamation" style="font-size:24px;display:block;margin-bottom:8px"></i>
          <strong>Error al cargar pedidos</strong><br/>
          <small>${err.message}</small>
        </td></tr>`;
    });
}

function renderOrders() {
  const q      = (document.getElementById('searchOrder')?.value || '').toLowerCase();
  const estado = document.getElementById('filterEstado')?.value || '';
  let orders   = (window._orders || []).slice();
  if (q)      orders = orders.filter(o => o.nombre?.toLowerCase().includes(q) || o.orderId?.toLowerCase().includes(q) || o.tel?.includes(q));
  if (estado) orders = orders.filter(o => o.estado === estado);

  const tbody = document.getElementById('ordersTbody');
  const empty = document.getElementById('ordersEmpty');
  const pagoLabel = { efectivo:'Efectivo', transferencia:'Transferencia', tarjeta:'Tarjeta', mercadopago:'MercadoPago' };

  if (orders.length === 0) {
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
    empty.innerHTML = `
      <span>📭</span>
      <p>No hay pedidos todavía</p>
      <small style="color:#aaa;font-size:12px">Los pedidos aparecen aquí cuando los clientes compran en la tienda</small>`;
    return;
  }
  empty.classList.add('hidden');
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>${o.orderId || o.firestoreId}</strong></td>
      <td>${o.fecha || '—'}</td>
      <td><strong>${o.nombre}</strong></td>
      <td>${o.tel}</td>
      <td>${o.entrega === 'envio' ? '<i class="fa-solid fa-truck"></i> Envío' : '<i class="fa-solid fa-store"></i> Retiro'}</td>
      <td>${pagoLabel[o.pago] || o.pago}</td>
      <td><strong>$${o.total.toLocaleString('es-AR')}</strong></td>
      <td><span class="estado-badge estado-${(o.estado||'').replace(' ','-')}">${o.estado}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-sm btn-view" onclick="viewOrder('${o.firestoreId}')">Ver</button>
          <button class="btn-sm btn-del"  onclick="deleteOrder('${o.firestoreId}')">Eliminar</button>
        </div>
      </td>
    </tr>`).join('');
}

function viewOrder(firestoreId) {
  const orders = window._orders || [];
  const o = orders.find(x => x.firestoreId === firestoreId);
  if (!o) return;
  const pagoLabel = { efectivo:'Efectivo', transferencia:'Transferencia', tarjeta:'Tarjeta', mercadopago:'MercadoPago' };
  document.getElementById('orderDetailTitle').textContent = `Pedido ${o.orderId || firestoreId}`;
  document.getElementById('orderDetailBody').innerHTML = `
    <div class="order-detail-section">
      <h4>Cliente</h4>
      <div class="detail-row"><span>Nombre</span><strong>${o.nombre}</strong></div>
      <div class="detail-row"><span>Teléfono</span><strong>${o.tel}</strong></div>
      <div class="detail-row"><span>Fecha</span><strong>${o.fecha}</strong></div>
    </div>
    <div class="order-detail-section">
      <h4>Entrega y pago</h4>
      <div class="detail-row"><span>Entrega</span><strong>${o.entrega==='envio'?'Envío a '+o.dir:'Retiro en tienda'}</strong></div>
      <div class="detail-row"><span>Pago</span><strong>${pagoLabel[o.pago]||o.pago}</strong></div>
      ${o.notas?`<div class="detail-row"><span>Notas</span><strong>${o.notas}</strong></div>`:''}
    </div>
    <div class="order-detail-section">
      <h4>Productos</h4>
      <table class="order-items-table">
        <thead><tr><th>Producto</th><th>Precio</th><th>Cant.</th><th>Subtotal</th></tr></thead>
        <tbody>
          ${(o.items||[]).map(i=>`<tr>
            <td>${i.name}</td>
            <td>$${Number(i.price).toLocaleString('es-AR')}</td>
            <td>${i.qty}</td>
            <td>$${(i.price*i.qty).toLocaleString('es-AR')}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="detail-total"><span>Total</span><span>$${o.total.toLocaleString('es-AR')}</span></div>
    <div class="change-estado-row">
      <label>Estado del pedido:</label>
      <select class="estado-select" onchange="changeOrderEstado('${firestoreId}', this.value)">
        <option ${o.estado==='pendiente'  ?'selected':''} value="pendiente">Pendiente</option>
        <option ${o.estado==='en proceso' ?'selected':''} value="en proceso">En proceso</option>
        <option ${o.estado==='enviado'    ?'selected':''} value="enviado">Enviado</option>
        <option ${o.estado==='entregado'  ?'selected':''} value="entregado">Entregado</option>
        <option ${o.estado==='cancelado'  ?'selected':''} value="cancelado">Cancelado</option>
      </select>
    </div>`;
  document.getElementById('orderDetailModal').classList.remove('hidden');
  document.getElementById('orderDetailOverlay').classList.remove('hidden');
}

async function changeOrderEstado(firestoreId, newEstado) {
  try {
    // leer el pedido DIRECTO desde Firestore (no del caché)
    const snap = await db.collection('orders').doc(firestoreId).get();
    if (!snap.exists) { showToast('Pedido no encontrado'); return; }

    const order        = snap.data();
    const estadoActual = order.estado || '';
    const items        = order.items  || [];

    const batch = db.batch();
    const orderRef = db.collection('orders').doc(firestoreId);

    // 1) actualizar estado
    batch.update(orderRef, { estado: newEstado });

    // 2) ajustar stock según el cambio de estado
    if (newEstado === 'cancelado' && estadoActual !== 'cancelado') {
      // cancelar → devolver stock
      items.forEach(item => {
        if (!item.firestoreId || !item.qty) return;
        batch.update(
          db.collection('products').doc(item.firestoreId),
          { stock: firebase.firestore.FieldValue.increment(Number(item.qty)) }
        );
      });
      await batch.commit();
      // actualizar caché local
      if (window._orders) {
        const local = window._orders.find(o => o.firestoreId === firestoreId);
        if (local) local.estado = newEstado;
      }
      showToast('✓ Pedido cancelado — stock restaurado');

    } else if (estadoActual === 'cancelado' && newEstado !== 'cancelado') {
      // reactivar → volver a descontar stock
      items.forEach(item => {
        if (!item.firestoreId || !item.qty) return;
        batch.update(
          db.collection('products').doc(item.firestoreId),
          { stock: firebase.firestore.FieldValue.increment(-Number(item.qty)) }
        );
      });
      await batch.commit();
      if (window._orders) {
        const local = window._orders.find(o => o.firestoreId === firestoreId);
        if (local) local.estado = newEstado;
      }
      showToast('✓ Pedido reactivado — stock ajustado');

    } else {
      // solo cambio de estado, sin tocar stock
      await batch.commit();
      if (window._orders) {
        const local = window._orders.find(o => o.firestoreId === firestoreId);
        if (local) local.estado = newEstado;
      }
      showToast('✓ Estado actualizado');
    }

    renderOrders();

  } catch(err) {
    console.error('Error cambiando estado:', err);
    showToast('Error: ' + err.message);
  }
}

function closeOrderDetail() {
  document.getElementById('orderDetailModal').classList.add('hidden');
  document.getElementById('orderDetailOverlay').classList.add('hidden');
}

async function deleteOrder(firestoreId) {
  if (!confirm('¿Eliminar este pedido? No se puede deshacer.')) return;
  await db.collection('orders').doc(firestoreId).delete();
  showToast('Pedido eliminado');
}

// ===== PRODUCTOS =====
function listenAdminProducts() {
  if (unsubProducts) { renderAdminProducts(); return; }
  unsubProducts = db.collection('products')
    .onSnapshot(snap => {
      window._products = snap.docs
        .map(d => ({ firestoreId: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      renderAdminProducts();
    }, err => {
      console.error('Error productos:', err);
      showToast('Error al cargar productos: ' + err.message);
    });
}

function renderAdminProducts() {
  const q = (document.getElementById('searchProd')?.value || '').toLowerCase();
  let prods = (window._products || []).slice();
  if (q) prods = prods.filter(p => p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q));

  document.getElementById('productsTbody').innerHTML = prods.map(p => {
    const discount = p.oldPrice ? Math.round((1 - p.price/p.oldPrice)*100) : 0;
    return `<tr>
      <td><div class="prod-cell">
        <div class="prod-emoji">${p.photo
          ? `<img src="${p.photo}" style="width:40px;height:40px;object-fit:cover;border-radius:8px">`
          : `<i class="fa-solid fa-box-open" style="font-size:22px;color:#ccc"></i>`}</div>
        <div><strong>${p.name}</strong><span>${p.brand}</span></div>
      </div></td>
      <td>${p.brand}</td>
      <td style="text-transform:capitalize">${p.category}</td>
      <td>
        <strong>$${Number(p.price).toLocaleString('es-AR')}</strong>
        ${discount?`<br><span style="font-size:11px;color:#16a34a">-${discount}%</span>`:''}
      </td>
      <td><span class="stock-pill ${p.stock===0?'out':p.stock<=5?'low':'ok'}">${p.stock}</span></td>
      <td>
        <span class="estado-badge ${p.stock>0?'estado-entregado':'estado-cancelado'}">${p.stock>0?'Activo':'Sin stock'}</span>
        ${p.pinned?'<span class="pin-badge"><i class="fa-solid fa-thumbtack"></i> Anclado</span>':''}
      </td>
      <td><div class="action-btns">
        <button class="btn-sm btn-edit" onclick="editProduct('${p.firestoreId}')">Editar</button>
        <button class="btn-sm btn-del"  onclick="deleteProduct('${p.firestoreId}')">Eliminar</button>
      </div></td>
    </tr>`;
  }).join('');
}

// ===== FORMULARIO PRODUCTO =====
function openProductForm(firestoreId) {
  clearProductForm();
  document.getElementById('pf_fid').value   = firestoreId || '';
  document.getElementById('productFormTitle').textContent = firestoreId ? 'Editar producto' : 'Nuevo producto';

  if (firestoreId) {
    const p = (window._products||[]).find(x => x.firestoreId === firestoreId);
    if (p) {
      document.getElementById('pf_name').value     = p.name;
      document.getElementById('pf_brand').value    = p.brand;
      document.getElementById('pf_price').value    = p.price;
      document.getElementById('pf_oldprice').value = p.oldPrice || '';
      document.getElementById('pf_stock').value    = p.stock;
      document.getElementById('pf_emoji').value    = p.emoji || '🔧';
      document.getElementById('pf_tag').value      = p.tag || '';
      document.getElementById('pf_cuotas').value   = p.cuotas || 1;
      document.getElementById('pf_category').value = p.category;
      document.getElementById('pf_pinned').checked = !!p.pinned;
      document.getElementById('pf_desc').value = p.description || '';
      // cargar fotos existentes
      currentPhotos = [];
      if (p.photos && p.photos.length) currentPhotos = [...p.photos];
      else if (p.photo) currentPhotos = [p.photo]; // compatibilidad con foto única vieja
      renderPhotoGrid();
    }
  }
  document.getElementById('productFormModal').classList.remove('hidden');
  document.getElementById('productFormOverlay').classList.remove('hidden');
}

function editProduct(fid) { openProductForm(fid); }

function clearProductForm() {
  ['pf_fid','pf_name','pf_brand','pf_price','pf_oldprice','pf_stock'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('pf_desc').value     = '';
  document.getElementById('pf_emoji').value    = '🔧';
  document.getElementById('pf_tag').value      = '';
  document.getElementById('pf_cuotas').value   = '1';
  document.getElementById('pf_category').value = 'herramientas';
  document.getElementById('pf_pinned').checked = false;
  clearPhotos();
}

function closeProductForm() {
  document.getElementById('productFormModal').classList.add('hidden');
  document.getElementById('productFormOverlay').classList.add('hidden');
}

async function saveProduct() {
  const name     = document.getElementById('pf_name').value.trim();
  const brand    = document.getElementById('pf_brand').value.trim();
  const price    = parseFloat(document.getElementById('pf_price').value);
  const oldPrice = parseFloat(document.getElementById('pf_oldprice').value) || null;
  const stock    = parseInt(document.getElementById('pf_stock').value);
  const emoji    = document.getElementById('pf_emoji').value.trim() || '🔧';
  const tag      = document.getElementById('pf_tag').value || null;
  const cuotas   = parseInt(document.getElementById('pf_cuotas').value);
  const category = document.getElementById('pf_category').value;
  const pinned      = document.getElementById('pf_pinned').checked;
  const description = document.getElementById('pf_desc').value.trim();
  const photos      = [...currentPhotos];
  const photo       = photos[0] || null;
  const fid         = document.getElementById('pf_fid').value;

  if (!name || !brand || isNaN(price) || isNaN(stock)) {
    showToast('Completá los campos obligatorios');
    return;
  }

  const data = { name, brand, price, oldPrice, stock, emoji, tag, cuotas, category, pinned, photo, photos, description, rating: 4.5, reviews: 0 };

  try {
    if (fid) {
      await db.collection('products').doc(fid).update(data);
      showToast('✓ Producto actualizado');
    } else {
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('products').add(data);
      showToast('✓ Producto agregado');
    }
    closeProductForm();
  } catch(err) {
    console.error(err);
    showToast('Error al guardar. Intentá de nuevo.');
  }
}

async function deleteProduct(fid) {
  if (!confirm('¿Eliminar este producto?')) return;
  await db.collection('products').doc(fid).delete();
  showToast('Producto eliminado');
}

// ===== FOTOS MÚLTIPLES =====
var currentPhotos = []; // array de base64

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (currentPhotos.length >= 5) { showToast('Máximo 5 fotos por producto'); return; }

  const MAX_SIZE = 700;
  const QUALITY  = 0.75;
  const reader   = new FileReader();

  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      let w = img.width, h = img.height;
      if (w > h) { if (w > MAX_SIZE) { h = Math.round(h * MAX_SIZE / w); w = MAX_SIZE; } }
      else       { if (h > MAX_SIZE) { w = Math.round(w * MAX_SIZE / h); h = MAX_SIZE; } }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const compressed   = canvas.toDataURL('image/jpeg', QUALITY);
      const originalKB   = Math.round(file.size / 1024);
      const compressedKB = Math.round((compressed.length * 3) / 4 / 1024);

      currentPhotos.push(compressed);
      renderPhotoGrid();
      showToast(`📷 Foto agregada (${originalKB}KB → ${compressedKB}KB)`);
    };
    img.src = e.target.result;
  };
  // limpiar input para poder subir la misma foto de nuevo
  event.target.value = '';
  reader.readAsDataURL(file);
}

function removePhoto(index) {
  currentPhotos.splice(index, 1);
  renderPhotoGrid();
}

function renderPhotoGrid() {
  const grid   = document.getElementById('multiPhotoGrid');
  const btnAdd = document.getElementById('btnAddPhoto');

  grid.innerHTML = currentPhotos.map((src, i) => `
    <div class="photo-thumb ${i === 0 ? 'main-thumb' : ''}">
      <img src="${src}" alt="foto ${i+1}" />
      ${i === 0 ? '<span class="thumb-label">Principal</span>' : ''}
      <button type="button" class="thumb-remove" onclick="removePhoto(${i})">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>`).join('');

  // mostrar/ocultar botón agregar
  btnAdd.style.display = currentPhotos.length >= 5 ? 'none' : 'flex';
}

function clearPhotos() {
  currentPhotos = [];
  renderPhotoGrid();
}

// ===== STOCK =====
function listenStock() {
  if (unsubStock) { renderStock(); return; }
  unsubStock = db.collection('products')
    .onSnapshot(snap => {
      window._products = snap.docs
        .map(d => ({ firestoreId: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      renderStock();
    }, err => {
      console.error('Error stock:', err);
      showToast('Error al cargar stock: ' + err.message);
    });
}

function renderStock() {
  const q = (document.getElementById('searchStock')?.value || '').toLowerCase();
  let prods = (window._products || []).slice();
  if (q) prods = prods.filter(p => p.name?.toLowerCase().includes(q));

  document.getElementById('stockTbody').innerHTML = prods.map(p => {
    const pill = p.stock===0 ? 'out' : p.stock<=5 ? 'low' : 'ok';
    const label = p.stock===0 ? 'Sin stock' : p.stock<=5 ? 'Stock bajo' : 'OK';
    return `<tr>
      <td><div class="prod-cell">
        <div class="prod-emoji">${p.photo
          ? `<img src="${p.photo}" style="width:40px;height:40px;object-fit:cover;border-radius:8px">`
          : `<i class="fa-solid fa-box-open" style="font-size:22px;color:#ccc"></i>`}</div>
        <div><strong>${p.name}</strong><span>${p.brand}</span></div>
      </div></td>
      <td style="text-transform:capitalize">${p.category}</td>
      <td><strong style="font-size:16px">${p.stock}</strong> uds</td>
      <td><span class="stock-pill ${pill}">${label}</span></td>
      <td>
        <div style="display:flex;gap:8px;align-items:center">
          <input type="number" class="stock-input" id="stock_${p.firestoreId}" value="${p.stock}" min="0"/>
          <button class="btn-save-stock" onclick="updateStock('${p.firestoreId}')">Guardar</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

async function updateStock(fid) {
  const val = parseInt(document.getElementById('stock_' + fid)?.value);
  if (isNaN(val) || val < 0) { showToast('Stock inválido'); return; }
  await db.collection('products').doc(fid).update({ stock: val });
  showToast('✓ Stock actualizado');
}

// ===== IMPORTAR EXCEL =====
var importedRows = [];

const CATEGORIAS_VALIDAS = ['herramientas','electricidad','plomeria','pintura','fijacion','construccion','jardin'];
const COL_MAP = {
  // acepta variantes del nombre de columna
  nombre:          ['nombre','name','producto'],
  marca:           ['marca','brand'],
  categoria:       ['categoria','categoría','category'],
  precio:          ['precio','price'],
  precio_anterior: ['precio_anterior','precio anterior','old_price','precio_viejo'],
  stock:           ['stock','cantidad','qty'],
  cuotas:          ['cuotas'],
  descripcion:     ['descripcion','descripción','description','detalle'],
  medidas:         ['medidas','medida','dimensiones','tamaño'],
  colores:         ['colores','color'],
  etiqueta:        ['etiqueta','tag','oferta'],
};

function findCol(headers, key) {
  const variants = COL_MAP[key] || [key];
  return headers.find(h => variants.includes(h.toLowerCase().trim()));
}

function importExcel(event) {
  const file = event.target.files[0];
  if (!file) return;
  event.target.value = '';

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheet    = workbook.Sheets[workbook.SheetNames[0]];
      const rows     = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      if (!rows.length) { showToast('El archivo está vacío'); return; }

      const headers = Object.keys(rows[0]);
      importedRows  = [];
      const errores = [];

      rows.forEach((row, idx) => {
        const num = idx + 2; // fila real en Excel (empieza en 2)

        const nombre   = String(row[findCol(headers,'nombre')]   || '').trim();
        const marca    = String(row[findCol(headers,'marca')]     || '').trim();
        const catRaw   = String(row[findCol(headers,'categoria')] || '').trim().toLowerCase();
        const precioRaw= row[findCol(headers,'precio')];
        const stockRaw = row[findCol(headers,'stock')];

        if (!nombre)   { errores.push(`Fila ${num}: falta el nombre`);    return; }
        if (!marca)    { errores.push(`Fila ${num}: falta la marca`);     return; }
        if (!precioRaw){ errores.push(`Fila ${num}: falta el precio`);    return; }

        const precio   = parseFloat(String(precioRaw).replace(/[^0-9.,]/g,'').replace(',','.'));
        const stock    = parseInt(String(stockRaw).replace(/[^0-9]/g,'')) || 0;
        const oldPrice = parseFloat(String(row[findCol(headers,'precio_anterior')]||'').replace(/[^0-9.,]/g,'').replace(',','.')) || null;
        const cuotas   = parseInt(row[findCol(headers,'cuotas')]) || 1;
        const etiqueta = String(row[findCol(headers,'etiqueta')]||'').trim().toLowerCase();
        const tag      = etiqueta === 'sale' || etiqueta === 'oferta' ? 'sale' : etiqueta === 'new' || etiqueta === 'nuevo' ? 'new' : null;

        // descripción: unir descripción + medidas + colores
        const desc     = String(row[findCol(headers,'descripcion')]||'').trim();
        const medidas  = String(row[findCol(headers,'medidas')]    ||'').trim();
        const colores  = String(row[findCol(headers,'colores')]    ||'').trim();
        const descFull = [desc, medidas ? `Medidas: ${medidas}` : '', colores ? `Colores: ${colores}` : ''].filter(Boolean).join('\n');

        // categoría: buscar la más parecida
        const categoria = CATEGORIAS_VALIDAS.find(c => catRaw.includes(c) || c.includes(catRaw)) || 'herramientas';

        if (isNaN(precio)) { errores.push(`Fila ${num}: precio inválido`); return; }

        importedRows.push({ nombre, marca, categoria, precio, oldPrice, stock, cuotas, tag, description: descFull, emoji: '🔧', rating: 4.5, reviews: 0, photo: null, photos: [], pinned: false });
      });

      if (errores.length) {
        showToast(`⚠ ${errores.length} fila(s) con errores — revisar consola`);
        console.warn('Errores importación:', errores);
      }

      renderImportPreview();
      document.getElementById('importModal').classList.remove('hidden');
      document.getElementById('importOverlay').classList.remove('hidden');

    } catch(err) {
      console.error(err);
      showToast('Error al leer el archivo: ' + err.message);
    }
  };
  reader.readAsBinaryString(file);
}

function renderImportPreview() {
  const catLabels = { herramientas:'Herramientas', electricidad:'Electricidad', plomeria:'Plomería', pintura:'Pintura', fijacion:'Fijación', construccion:'Construcción', jardin:'Jardín' };

  document.getElementById('importSummary').innerHTML = `
    <div style="background:#fffbe8;border:1px solid #e8e2cc;border-radius:8px;padding:12px 16px;font-size:14px">
      <i class="fa-solid fa-circle-check" style="color:#16a34a"></i>
      <strong>${importedRows.length} producto${importedRows.length!==1?'s':''}</strong> listos para importar.
      Revisá la vista previa y confirmá.
    </div>`;

  document.getElementById('importPreviewBody').innerHTML = importedRows.map((p, i) => `
    <tr>
      <td>${i+1}</td>
      <td><strong>${p.nombre}</strong></td>
      <td>${p.marca}</td>
      <td>${catLabels[p.categoria]||p.categoria}</td>
      <td>$${Number(p.precio).toLocaleString('es-AR')}</td>
      <td>${p.stock}</td>
      <td>${p.cuotas > 1 ? p.cuotas + ' cuotas' : 'único'}</td>
      <td style="max-width:200px;white-space:normal;font-size:12px;color:#666">${p.description||'—'}</td>
      <td><span class="estado-badge estado-entregado"><i class="fa-solid fa-check"></i> OK</span></td>
    </tr>`).join('');
}

async function confirmImport() {
  if (!importedRows.length) return;

  const btn = document.getElementById('btnConfirmImport');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subiendo…';

  try {
    // subir en lotes de 20 (límite de Firestore batch = 500 pero igual lo hacemos por chunks)
    const CHUNK = 20;
    let total = 0;
    for (let i = 0; i < importedRows.length; i += CHUNK) {
      const chunk = importedRows.slice(i, i + CHUNK);
      const batch = db.batch();
      chunk.forEach(p => {
        const ref = db.collection('products').doc();
        batch.set(ref, {
          name:        p.nombre,
          brand:       p.marca,
          category:    p.categoria,
          price:       p.precio,
          oldPrice:    p.oldPrice,
          stock:       p.stock,
          cuotas:      p.cuotas,
          tag:         p.tag,
          description: p.description,
          emoji:       p.emoji,
          photo:       null,
          photos:      [],
          pinned:      false,
          rating:      4.5,
          reviews:     0,
          createdAt:   firebase.firestore.FieldValue.serverTimestamp()
        });
      });
      await batch.commit();
      total += chunk.length;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Subiendo ${total}/${importedRows.length}…`;
    }

    closeImport();
    showToast(`✓ ${total} productos importados correctamente`);
    importedRows = [];
    listenAdminProducts();

  } catch(err) {
    console.error(err);
    showToast('Error al importar: ' + err.message);
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Confirmar importación';
  }
}

function closeImport() {
  document.getElementById('importModal').classList.add('hidden');
  document.getElementById('importOverlay').classList.add('hidden');
  document.getElementById('btnConfirmImport').disabled = false;
  document.getElementById('btnConfirmImport').innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Confirmar importación';
}

// ===== DESCARGAR PLANTILLA CSV (abre en Excel) =====
function downloadTemplate() {
  const filas = [
    ['nombre','marca','categoria','precio','precio_anterior','stock','cuotas','descripcion','medidas','colores','etiqueta'],
    ['Caño Corrugado 3/4 x 25m','Iram','plomeria','2490','','50','1','Caño corrugado plástico reforzado','25 metros','gris',''],
    ['Pintura Látex Interior 20L','Sherwin Williams','pintura','18990','22990','15','6','Pintura látex de alta cobertura lavable','Balde 20 litros','blanco / marfil','sale'],
    ['Taladro Percutor 750W','Black & Decker','herramientas','21990','27990','8','12','Taladro percutor velocidad variable mandril 13mm','largo 30cm','negro/amarillo','sale'],
    ['Tornillos 4x40 x100u','Fischer','fijacion','890','','200','1','Tornillos cabeza plana para madera x100 unidades','4x40mm','plateado',''],
  ];

  // BOM + CSV con separador coma, celdas entre comillas para evitar problemas con tildes
  const csv = '﻿' + filas
    .map(row => row.map(c => `"${String(c).replace(/"/g,'""')}"`).join(','))
    .join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'plantilla_casaspezia.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('✓ Plantilla descargada — abrila con Excel');
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('adminToast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}
