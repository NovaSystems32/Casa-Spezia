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
  db.collection('orders').orderBy('createdAt','desc').get().then(snap => {
    const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
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
  if (unsubOrders) return; // ya escuchando
  unsubOrders = db.collection('orders')
    .orderBy('createdAt','desc')
    .onSnapshot(snap => {
      window._orders = snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
      renderOrders();
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
  await db.collection('orders').doc(firestoreId).update({ estado: newEstado });
  showToast('✓ Estado actualizado');
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
    .orderBy('createdAt','desc')
    .onSnapshot(snap => {
      window._products = snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
      renderAdminProducts();
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
      if (p.photo) {
        document.getElementById('pf_photoData').value = p.photo;
        document.getElementById('photoPreview').innerHTML = `
          <img src="${p.photo}" alt="preview" style="width:100%;height:100%;object-fit:cover;border-radius:8px"/>`;
        document.getElementById('btnRemovePhoto').classList.remove('hidden');
        document.getElementById('photoUploadArea').style.border = '2px solid var(--yellow)';
      }
    }
  }
  document.getElementById('productFormModal').classList.remove('hidden');
  document.getElementById('productFormOverlay').classList.remove('hidden');
}

function editProduct(fid) { openProductForm(fid); }

function clearProductForm() {
  ['pf_fid','pf_name','pf_brand','pf_price','pf_oldprice','pf_stock','pf_photoData'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('pf_emoji').value    = '🔧';
  document.getElementById('pf_tag').value      = '';
  document.getElementById('pf_cuotas').value   = '1';
  document.getElementById('pf_category').value = 'herramientas';
  document.getElementById('pf_pinned').checked = false;
  removePhoto();
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
  const pinned   = document.getElementById('pf_pinned').checked;
  const photo    = document.getElementById('pf_photoData').value || null;
  const fid      = document.getElementById('pf_fid').value;

  if (!name || !brand || isNaN(price) || isNaN(stock)) {
    showToast('Completá los campos obligatorios');
    return;
  }

  const data = { name, brand, price, oldPrice, stock, emoji, tag, cuotas, category, pinned, photo, rating: 4.5, reviews: 0 };

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

// ===== FOTO / COMPRESIÓN =====
function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const MAX_SIZE = 600;
  const QUALITY  = 0.72;
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
      document.getElementById('pf_photoData').value = compressed;
      document.getElementById('photoPreview').innerHTML = `
        <img src="${compressed}" style="width:100%;height:100%;object-fit:cover;border-radius:8px"/>
        <div class="photo-compress-badge">📦 ${originalKB}KB → ${compressedKB}KB</div>`;
      document.getElementById('btnRemovePhoto').classList.remove('hidden');
      document.getElementById('photoUploadArea').style.border = '2px solid var(--yellow)';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  document.getElementById('pf_photoData').value = '';
  document.getElementById('pf_photo').value     = '';
  document.getElementById('photoPreview').innerHTML = `
    <span>📷</span>
    <p>Hacé clic para subir una foto</p>
    <small>JPG, PNG, WEBP — se comprime automáticamente</small>`;
  document.getElementById('btnRemovePhoto').classList.add('hidden');
  document.getElementById('photoUploadArea').style.border = '';
}

// ===== STOCK =====
function listenStock() {
  if (unsubStock) { renderStock(); return; }
  unsubStock = db.collection('products')
    .orderBy('createdAt','desc')
    .onSnapshot(snap => {
      window._products = snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
      renderStock();
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

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('adminToast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}
