const accountSessionKey = 'kaelstore-session';
const accountContent = document.getElementById('accountContent');
const accountMessage = document.getElementById('accountMessage');
let session;

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function formatCurrency(value) {
    return `Rp ${Number(value).toLocaleString('id-ID')}`;
}

async function apiRequest(url, options = {}) {
    let response;
    try {
        response = await fetch(url, {
            ...options,
            headers: {
                ...(options.body ? { 'Content-Type': 'application/json' } : {}),
                ...options.headers
            }
        });
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('Server akun tidak terhubung. Jalankan server Kaelstore dan buka halaman melalui localhost:3000.');
        }
        throw error;
    }
    const result = await response.json();
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem(accountSessionKey);
            window.location.replace('login.html');
        }
        throw new Error(result.error || 'Permintaan gagal.');
    }
    return result;
}

function renderOrders(orders, showCustomer = false, sellerCanManage = false) {
    if (!orders.length) return '<p class="muted">Belum ada transaksi. Pesanan yang berhasil dibuat akan tampil di sini.</p>';
    return `<div class="table-wrap"><table>
        <thead><tr><th>Pesanan</th>${showCustomer ? '<th>Pembeli</th>' : ''}<th>Produk</th><th>Pembayaran</th><th>Status</th><th>Total</th><th>Tanggal</th></tr></thead>
        <tbody>${orders.map(order => {
            const canManage = sellerCanManage && order.canManageFulfillment
                && ['processing', 'shipped'].includes(order.fulfillmentStatus);
            let statusCell = `<span class="account-status">${escapeHtml(order.fulfillmentStatus)}</span>`;
            if (canManage) {
                statusCell = `<select data-seller-order="${escapeHtml(order.id)}" aria-label="Status pengiriman ${escapeHtml(order.id)}">
                    <option value="${escapeHtml(order.fulfillmentStatus)}">${escapeHtml(order.fulfillmentStatus)}</option>
                    ${order.fulfillmentStatus === 'processing' && ['paid', 'cod_due'].includes(order.paymentStatus) ? '<option value="shipped">shipped</option>' : ''}
                    ${order.fulfillmentStatus === 'processing' && ['failed', 'cod_due'].includes(order.paymentStatus) ? '<option value="cancelled">cancelled</option>' : ''}
                    ${order.fulfillmentStatus === 'shipped' ? '<option value="delivered">delivered</option>' : ''}
                </select>`;
            } else if (sellerCanManage && !order.canManageFulfillment) {
                statusCell += '<small>Pesanan gabungan · hubungi admin</small>';
            }
            return `<tr>
            <td><span class="order-id">${escapeHtml(order.id)}</span></td>
            ${showCustomer ? `<td>${escapeHtml(order.customer.name)}<small>${escapeHtml(order.customer.phone)}</small><small>${escapeHtml(order.customer.address)}</small></td>` : ''}
            <td>${order.items.map(item => `${escapeHtml(item.name)} × ${item.quantity}`).join('<br>')}</td>
            <td>${escapeHtml(order.payment)}<small>${escapeHtml(order.paymentStatus)}</small></td>
            <td>${statusCell}</td>
            <td>${formatCurrency(order.total)}</td>
            <td>${new Date(order.createdAt).toLocaleString('id-ID')}</td>
        </tr>`;
        }).join('')}</tbody>
    </table></div>`;
}

async function renderBuyer(user) {
    document.getElementById('accountTitle').textContent = `Halo, ${user.name}`;
    document.getElementById('accountSubtitle').textContent = 'Riwayat pembelian dan status pesananmu tersimpan di akun server.';
    const result = await apiRequest('/api/my/orders');
    let sellerStatusMessage = '';
    if (user.sellerStatus === 'pending') {
        sellerStatusMessage = '<div class="revenue-card">Permohonan akun penjual sedang menunggu persetujuan admin.</div>';
    } else if (user.sellerStatus === 'rejected') {
        sellerStatusMessage = '<div class="revenue-card">Permohonan penjual sebelumnya ditolak. Hubungi admin bila ingin mengajukan kembali.</div>';
    }
    accountContent.innerHTML = `${sellerStatusMessage}<section class="account-section"><h2>Riwayat pembelian (${result.orders.length})</h2>${renderOrders(result.orders)}</section>`;
}

async function renderSeller(user) {
    document.getElementById('accountTitle').textContent = `Toko ${user.name}`;
    document.getElementById('accountSubtitle').textContent = 'Kelola produk yang diklaim dan pantau pesanan penjualan tokomu.';
    const dashboard = await apiRequest('/api/seller/dashboard');
    const claimCards = dashboard.claimableProducts.length
        ? `<div class="account-grid">${dashboard.claimableProducts.map(product => `<article class="account-card">
            <strong>${escapeHtml(product.name)}</strong>
            <p>${escapeHtml(product.category)} · ${formatCurrency(product.price)}</p>
            <p class="muted">Toko saat ini: ${escapeHtml(product.seller)}</p>
            <div class="account-actions"><button type="button" data-claim-product="${product.id}">Klaim produk</button></div>
        </article>`).join('')}</div>`
        : '<p class="muted">Semua produk demo sudah diklaim. Belum tersedia form untuk menambah produk baru.</p>';
    accountContent.innerHTML = `<div class="revenue-card">Penjualan terkonfirmasi / COD menunggu bayar<strong>${formatCurrency(dashboard.paidSalesTotal)}</strong></div>
        <section class="account-section"><h2>Tambah produk</h2>
        <form id="newSellerProductForm" class="account-grid">
            <label>Nama produk<input name="name" required minlength="3" maxlength="80"></label>
            <label>Kategori<select name="category" required><option value="sayur">Sayur</option><option value="buah">Buah</option><option value="frozen">Frozen</option><option value="daging">Daging</option><option value="rumah">Kebutuhan rumah</option></select></label>
            <label>Harga (Rp)<input name="price" type="number" min="1" max="10000000" required></label>
            <button type="submit">Terbitkan produk</button>
        </form></section>
        <section class="account-section"><h2>Produk saya (${dashboard.products.length})</h2>
        ${dashboard.products.length ? `<div class="account-grid">${dashboard.products.map(product => `<form class="account-card seller-product-form" data-product-id="${product.id}">
            <label>Nama produk<input name="name" value="${escapeHtml(product.name)}" required minlength="3" maxlength="80"></label>
            <label>Harga (Rp)<input name="price" type="number" min="1" max="10000000" value="${product.price}" required></label>
            <p class="muted">${escapeHtml(product.category)}</p>
            <button type="submit">Simpan perubahan</button>
        </form>`).join('')}</div>` : '<p class="muted">Belum ada produk yang diklaim atau diterbitkan.</p>'}
        </section>
        <section class="account-section"><h2>Klaim produk toko (${dashboard.claimableProducts.length} tersedia)</h2>${claimCards}</section>
        <section class="account-section"><h2>Pesanan penjualan (${dashboard.sales.length})</h2>${renderOrders(dashboard.sales, true, true)}</section>`;
}

async function renderAdmin(user) {
    document.getElementById('accountTitle').textContent = 'Dashboard Admin';
    document.getElementById('accountSubtitle').textContent = 'Setujui akun seller dan lihat ringkasan pembelian serta penjualan.';
    const [sellerResult, orderResult] = await Promise.all([
        apiRequest('/api/admin/seller-requests'),
        apiRequest('/api/admin/orders?limit=300')
    ]);
    const requests = sellerResult.requests.length
        ? sellerResult.requests.map(request => `<article class="account-card seller-request">
            <div><strong>${escapeHtml(request.name)}</strong><p>${escapeHtml(request.email)} · ${escapeHtml(request.phone)}</p><small>Daftar ${new Date(request.created_at).toLocaleString('id-ID')}</small></div>
            <div class="seller-request-actions"><button type="button" data-approve-seller="${request.id}">Setujui</button><button class="danger-button" type="button" data-reject-seller="${request.id}">Tolak</button></div>
        </article>`).join('')
        : '<p class="muted">Tidak ada permohonan seller yang menunggu.</p>';
    const total = orderResult.orders.reduce((sum, order) => sum + order.total, 0);
    accountContent.innerHTML = `<div class="revenue-card">Nilai seluruh pesanan tercatat<strong>${formatCurrency(total)}</strong><p>Termasuk pembayaran pending/gagal; cek status tiap pesanan di bawah.</p></div>
        <section class="account-section"><h2>Permohonan akun penjual (${sellerResult.requests.length})</h2><div class="account-grid">${requests}</div></section>
        <section class="account-section"><h2>Semua pembelian dan penjualan (${orderResult.orders.length})</h2>${renderOrders(orderResult.orders.map(order => ({ ...order, items: order.items || [] })), true)}</section>`;
}

async function refreshAccount() {
    session = JSON.parse(localStorage.getItem(accountSessionKey) || 'null');
    if (!session) {
        window.location.replace('login.html');
        return;
    }
    const result = await apiRequest('/api/me');
    session = { ...session, ...result.user };
    localStorage.setItem(accountSessionKey, JSON.stringify(session));
    if (session.role === 'admin') await renderAdmin(session);
    else if (session.role === 'seller') await renderSeller(session);
    else await renderBuyer(session);
    accountMessage.textContent = `${session.email} · ${session.role}`;
}

accountContent.addEventListener('click', async event => {
    const claimButton = event.target.closest('[data-claim-product]');
    const approveButton = event.target.closest('[data-approve-seller]');
    const rejectButton = event.target.closest('[data-reject-seller]');
    try {
        if (claimButton) {
            await apiRequest(`/api/seller/products/${claimButton.dataset.claimProduct}/claim`, { method: 'POST' });
        } else if (approveButton || rejectButton) {
            const button = approveButton || rejectButton;
            await apiRequest(`/api/admin/sellers/${button.dataset.approveSeller || button.dataset.rejectSeller}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: approveButton ? 'approved' : 'rejected' })
            });
        } else {
            return;
        }
        await refreshAccount();
    } catch (error) {
        accountMessage.textContent = error.message;
    }
});

accountContent.addEventListener('submit', async event => {
    const form = event.target;
    if (!form.matches('#newSellerProductForm, .seller-product-form')) return;
    event.preventDefault();
    const formData = new FormData(form);
    try {
        if (form.id === 'newSellerProductForm') {
            await apiRequest('/api/seller/products', {
                method: 'POST',
                body: JSON.stringify({
                    name: formData.get('name'),
                    category: formData.get('category'),
                    price: Number(formData.get('price'))
                })
            });
        } else {
            await apiRequest(`/api/seller/products/${form.dataset.productId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    name: formData.get('name'),
                    price: Number(formData.get('price'))
                })
            });
        }
        accountMessage.textContent = 'Data produk berhasil diperbarui.';
        await refreshAccount();
    } catch (error) {
        accountMessage.textContent = error.message;
    }
});

accountContent.addEventListener('change', async event => {
    const select = event.target.closest('[data-seller-order]');
    if (!select) return;
    select.disabled = true;
    try {
        await apiRequest(`/api/seller/orders/${encodeURIComponent(select.dataset.sellerOrder)}`, {
            method: 'PATCH',
            body: JSON.stringify({ fulfillmentStatus: select.value })
        });
        accountMessage.textContent = 'Status pengiriman berhasil diperbarui.';
        await refreshAccount();
    } catch (error) {
        accountMessage.textContent = error.message;
    }
});

document.getElementById('logoutButton').addEventListener('click', () => {
    apiRequest('/api/auth/logout', { method: 'POST' }).finally(() => {
        localStorage.removeItem(accountSessionKey);
        window.location.href = 'login.html';
    });
});

refreshAccount().catch(error => {
    accountMessage.textContent = error.message;
    if (error.message.includes('Masuk terlebih dahulu')) {
        localStorage.removeItem(accountSessionKey);
        window.location.replace('login.html');
    }
});
