const orderId = new URLSearchParams(window.location.search).get('order_id');
const orderIdElement = document.getElementById('orderId');
const paymentState = document.getElementById('paymentState');
const fulfillmentState = document.getElementById('fulfillmentState');
const statusMessage = document.getElementById('statusMessage');
const paymentLabels = {
    paid: 'Pembayaran berhasil dikonfirmasi.',
    pending: 'Menunggu pembayaran atau konfirmasi dari Midtrans.',
    failed: 'Pembayaran gagal atau kedaluwarsa. Hubungi toko untuk bantuan.',
    refunded: 'Pembayaran telah dikembalikan.',
    cod_due: 'Pesanan COD dibuat. Bayar ketika pesanan diterima.'
};
let attempts = 0;

function getApiErrorMessage(error) {
    if (window.location.protocol === 'file:' || error instanceof TypeError) {
        return 'Server pembayaran tidak terhubung. Jalankan `npm.cmd start` di folder proyek lalu buka halaman melalui http://localhost:3000.';
    }
    return error.message || 'Status pesanan tidak dapat dimuat.';
}

orderIdElement.textContent = orderId ? `Nomor pesanan: ${orderId}` : 'Nomor pesanan tidak ditemukan.';

async function refreshPaymentStatus() {
    if (!orderId) {
        paymentState.textContent = 'Nomor pesanan tidak valid.';
        return;
    }
    try {
        const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, { cache: 'no-store' });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Status pesanan tidak dapat dimuat.');
        paymentState.textContent = paymentLabels[result.order.paymentStatus] || result.order.paymentStatus;
        fulfillmentState.textContent = `Status pengiriman: ${result.order.fulfillmentStatus}`;
        if (result.order.paymentStatus === 'pending' && attempts < 40) {
            attempts += 1;
            window.setTimeout(refreshPaymentStatus, 3000);
        } else if (result.order.paymentStatus === 'pending') {
            statusMessage.textContent = 'Status masih menunggu. Muat ulang halaman ini nanti untuk memeriksa kembali.';
        } else {
            statusMessage.textContent = 'Status ini berasal dari catatan server dan notifikasi pembayaran Midtrans.';
        }
    } catch (error) {
        paymentState.textContent = 'Tidak dapat memeriksa status.';
        statusMessage.textContent = getApiErrorMessage(error);
    }
}

refreshPaymentStatus();
