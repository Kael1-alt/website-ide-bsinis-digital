const loginPanel = document.getElementById('loginPanel');
const ordersPanel = document.getElementById('ordersPanel');
const loginForm = document.getElementById('adminLoginForm');
const loginMessage = document.getElementById('loginMessage');
const ordersMessage = document.getElementById('ordersMessage');
const ordersTableBody = document.getElementById('ordersTableBody');

function getApiErrorMessage(error) {
    if (window.location.protocol === 'file:' || error instanceof TypeError) {
        return 'Server tidak terhubung. Jalankan `npm.cmd start` di folder proyek lalu buka halaman melalui http://localhost:3000/orders-admin.html.';
    }
    return error.message || 'Permintaan ke server gagal.';
}

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

async function adminRequest(url, options = {}) {
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
        throw new Error(getApiErrorMessage(error));
    }
    const result = await response.json();
    if (!response.ok) {
        if (response.status === 401) {
            showLogin();
        }
        throw new Error(result.error || 'Permintaan admin gagal.');
    }
    return result;
}

function showLogin() {
    loginPanel.hidden = false;
    ordersPanel.hidden = true;
}

function showOrders() {
    loginPanel.hidden = true;
    ordersPanel.hidden = false;
}

function renderOrders(orders) {
    if (!orders.length) {
        ordersTableBody.innerHTML = '<tr><td class="empty-row" colspan="7">Belum ada pesanan.</td></tr>';
        return;
    }
    ordersTableBody.innerHTML = orders.map(order => {
        const items = order.items.map(item => `${escapeHtml(item.name)} × ${item.quantity}`).join('<br>');
        const statusLabels = {
            processing: 'Diproses',
            shipped: 'Dikirim',
            delivered: 'Sampai',
            cancelled: 'Dibatalkan'
        };
        const nextStatuses = order.fulfillmentStatus === 'processing'
            ? [
                ...(['paid', 'cod_due'].includes(order.paymentStatus) ? [['shipped', statusLabels.shipped]] : []),
                ...(['failed', 'cod_due'].includes(order.paymentStatus) ? [['cancelled', statusLabels.cancelled]] : [])
            ]
            : order.fulfillmentStatus === 'shipped' ? [['delivered', statusLabels.delivered]] : [];
        const statusControl = nextStatuses.length
            ? `<select class="fulfillment-select" data-order-id="${escapeHtml(order.id)}" aria-label="Status pengiriman ${escapeHtml(order.id)}">
                <option value="${escapeHtml(order.fulfillmentStatus)}">${statusLabels[order.fulfillmentStatus]}</option>
                ${nextStatuses.map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}
            </select>`
            : `<span class="status">${statusLabels[order.fulfillmentStatus] || escapeHtml(order.fulfillmentStatus)}</span>`;
        return `<tr>
            <td><span class="order-id">${escapeHtml(order.id)}</span><small>${escapeHtml(order.payment)}</small></td>
            <td>${escapeHtml(order.customer.name)}<small>${escapeHtml(order.customer.phone)}</small><small>${escapeHtml(order.customer.address)}</small></td>
            <td>${items}<small>${escapeHtml(order.shipping)} · ${formatCurrency(order.shippingFee)}</small></td>
            <td><span class="status">${escapeHtml(order.paymentStatus)}</span></td>
            <td>${statusControl}</td>
            <td>${formatCurrency(order.total)}</td>
            <td>${new Date(order.createdAt).toLocaleString('id-ID')}</td>
        </tr>`;
    }).join('');
}

async function loadOrders() {
    ordersMessage.textContent = 'Memuat pesanan...';
    try {
        const result = await adminRequest('/api/admin/orders?limit=300');
        renderOrders(result.orders);
        ordersMessage.textContent = `${result.orders.length} pesanan terakhir. Status pembayaran diperbarui otomatis oleh webhook Midtrans.`;
    } catch (error) {
        ordersMessage.textContent = getApiErrorMessage(error);
    }
}

loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    loginMessage.textContent = 'Memeriksa akses...';
    const button = loginForm.querySelector('button');
    button.disabled = true;
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identifier: 'admin@kaelstore.com',
                password: document.getElementById('adminPassword').value
            })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Login admin gagal.');
        loginForm.reset();
        showOrders();
        await loadOrders();
    } catch (error) {
        loginMessage.textContent = getApiErrorMessage(error);
    } finally {
        button.disabled = false;
    }
});

document.getElementById('refreshOrders').addEventListener('click', loadOrders);
document.getElementById('adminLogout').addEventListener('click', () => {
    ordersTableBody.replaceChildren();
    adminRequest('/api/auth/logout', { method: 'POST' }).finally(showLogin);
});
ordersTableBody.addEventListener('change', async event => {
    const select = event.target.closest('.fulfillment-select');
    if (!select) return;
    select.disabled = true;
    try {
        await adminRequest(`/api/admin/orders/${encodeURIComponent(select.dataset.orderId)}`, {
            method: 'PATCH',
            body: JSON.stringify({ fulfillmentStatus: select.value })
        });
        ordersMessage.textContent = 'Status pengiriman berhasil diperbarui.';
        await loadOrders();
    } catch (error) {
        ordersMessage.textContent = getApiErrorMessage(error);
        await loadOrders();
    }
});

showOrders();
loadOrders();
