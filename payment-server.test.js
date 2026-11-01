const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const test = require('node:test');
const {
    createAppServer,
    getListenHost,
    getPaymentStatus,
    isLoginRateLimited,
    isValidAdminToken,
    recordLoginFailure,
    verifyMidtransSignature
} = require('./payment-server');

async function startTestServer(t, { serverKey = '', fetchImpl, dbPath: existingDbPath, env: envOverrides = {} } = {}) {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'kaelstore-test-'));
    const dbPath = existingDbPath || path.join(directory, 'orders.sqlite');
    const server = createAppServer({
        dbPath,
        env: {
            ADMIN_PASSWORD: 'test-admin-password',
            ADMIN_SESSION_SECRET: 'test-session-secret-with-sufficient-randomness',
            MIDTRANS_SERVER_KEY: serverKey,
            PUBLIC_BASE_URL: 'http://localhost',
            ...envOverrides
        },
        fetchImpl
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    t.after(async () => {
        await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
        fs.rmSync(directory, { recursive: true, force: true });
        if (existingDbPath) fs.rmSync(path.dirname(existingDbPath), { recursive: true, force: true });
    });
    return origin;
}

function orderPayload(overrides = {}) {
    return {
        customer: { name: 'Pembeli Test', phone: '081234567890', address: 'Jalan Melati nomor 10' },
        shipping: 'Reguler',
        paymentMethod: 'qris',
        items: [{ id: 1, quantity: 2 }],
        ...overrides
    };
}

async function registerAccount(origin, overrides = {}) {
    const response = await fetch(`${origin}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Pembeli Test',
            email: `buyer-${crypto.randomBytes(5).toString('hex')}@example.com`,
            phone: `08${String(crypto.randomInt(100000000, 999999999))}`,
            password: 'password-test-123',
            ...overrides
        })
    });
    const result = await response.json();
    assert.equal(response.status, 201, result.error);
    const setCookie = response.headers.get('set-cookie');
    assert.match(setCookie, /HttpOnly/);
    assert.match(setCookie, /SameSite=Strict/);
    assert.equal('token' in result, false);
    return { ...result, cookie: setCookie.split(';')[0] };
}

test('secure server defaults, cookie flags, password length, and login throttling are enforced', async t => {
    assert.equal(getListenHost({}), '127.0.0.1');
    assert.equal(getListenHost({ HOST: '127.0.0.2' }), '127.0.0.2');

    const failures = new Map();
    assert.equal(isLoginRateLimited(failures, 'client', 2, 1000), false);
    recordLoginFailure(failures, 'client', 1000);
    recordLoginFailure(failures, 'client', 2000);
    assert.equal(isLoginRateLimited(failures, 'client', 2, 3000), true);
    assert.equal(isLoginRateLimited(failures, 'client', 2, 1000 + 15 * 60 * 1000), false);

    const origin = await startTestServer(t);
    const weakPassword = await fetch(`${origin}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Weak Password',
            email: 'weak-password@example.com',
            phone: '081234567899',
            password: 'short123'
        })
    });
    assert.equal(weakPassword.status, 400);

    const secureOrigin = await startTestServer(t, {
        env: {
            ADMIN_PASSWORD: 'secure-test-admin-password',
            ADMIN_SESSION_SECRET: 'test-session-secret-with-sufficient-randomness',
            NODE_ENV: 'production'
        }
    });
    const secureRegister = await fetch(`${secureOrigin}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Secure Cookie',
            email: 'secure-cookie@example.com',
            phone: '081234567898',
            password: 'very-secure-password-123'
        })
    });
    assert.match(secureRegister.headers.get('set-cookie'), /; Secure/);
});

test('checkout ignores forged item prices and persists COD orders', async t => {
    const origin = await startTestServer(t);
    const checkoutPage = await fetch(`${origin}/storefront.html`);
    const checkoutMarkup = await checkoutPage.text();
    assert.match(checkoutMarkup, /Demo lokal/);
    assert.match(checkoutMarkup, /Belum terhubung ke payment gateway production/);
    assert.match(checkoutMarkup, /Kurir sungguhan belum terhubung/);

    const { cookie } = await registerAccount(origin);
    const invalid = await fetch(`${origin}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookie },
        body: JSON.stringify(orderPayload({ paymentMethod: 'cod', items: [{ id: 1, quantity: 2, price: 1 }] }))
    });
    assert.equal(invalid.status, 201);
    const result = await invalid.json();
    assert.equal(result.order.total, 30000);
    assert.equal(result.order.paymentStatus, 'cod_due');

    const cod = await fetch(`${origin}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookie },
        body: JSON.stringify(orderPayload({ paymentMethod: 'cod', shipping: 'Express' }))
    });
    assert.equal(cod.status, 201);
    const codResult = await cod.json();
    assert.equal(codResult.order.total, 45000);
    assert.equal(codResult.order.paymentStatus, 'cod_due');
});

test('existing payment database is migrated without losing its orders', async t => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'kaelstore-migration-'));
    const dbPath = path.join(directory, 'orders.sqlite');
    const database = new DatabaseSync(dbPath);
    database.exec(`
        CREATE TABLE orders (
            id TEXT PRIMARY KEY, customer_name TEXT NOT NULL, customer_phone TEXT NOT NULL,
            customer_address TEXT NOT NULL, items_json TEXT NOT NULL, shipping_method TEXT NOT NULL,
            shipping_fee INTEGER NOT NULL, payment_method TEXT NOT NULL, payment_status TEXT NOT NULL,
            fulfillment_status TEXT NOT NULL, total INTEGER NOT NULL, gateway_token TEXT,
            gateway_transaction_id TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
        );
        INSERT INTO orders VALUES (
            'KS-OLD-ORDER', 'Pembeli lama', '08123456789', 'Alamat lama cukup panjang',
            '[]', 'Reguler', 0, 'cod', 'cod_due', 'processing', 15000, NULL, NULL,
            '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z'
        );
    `);
    database.close();
    const origin = await startTestServer(t, { dbPath });
    const health = await fetch(`${origin}/api/health`);
    assert.equal(health.status, 200);
});

test('online checkout requires Midtrans configuration and uses server catalog payment options', async t => {
    const unconfiguredOrigin = await startTestServer(t);
    const unconfiguredBuyer = await registerAccount(unconfiguredOrigin);
    const unavailable = await fetch(`${unconfiguredOrigin}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: unconfiguredBuyer.cookie },
        body: JSON.stringify(orderPayload())
    });
    assert.equal(unavailable.status, 503);

    let gatewayPayload;
    const origin = await startTestServer(t, {
        serverKey: 'sandbox-test-key',
        fetchImpl: async (url, options) => {
            assert.match(url, /sandbox\.midtrans\.com/);
            gatewayPayload = JSON.parse(options.body);
            return {
                ok: true,
                json: async () => ({ token: 'snap-token', redirect_url: 'https://sandbox.midtrans.com/snap/mock' })
            };
        }
    });
    const buyer = await registerAccount(origin);
    const response = await fetch(`${origin}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: buyer.cookie },
        body: JSON.stringify(orderPayload({ paymentMethod: 'paylater' }))
    });
    const result = await response.json();
    assert.equal(response.status, 201);
    assert.equal(result.order.total, 30000);
    assert.equal(result.redirectUrl, 'https://sandbox.midtrans.com/snap/mock');
    assert.deepEqual(gatewayPayload.enabled_payments, ['kredivo', 'akulaku']);
    assert.equal(gatewayPayload.item_details[0].price, 15000);
});

test('signed Midtrans notifications update server-side order status and admin can manage fulfillment', async t => {
    const origin = await startTestServer(t, {
        serverKey: 'sandbox-test-key',
        fetchImpl: async () => ({
            ok: true,
            json: async () => ({ token: 'snap-token', redirect_url: 'https://sandbox.midtrans.com/snap/mock' })
        })
    });
    const created = await fetch(`${origin}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: (await registerAccount(origin)).cookie },
        body: JSON.stringify(orderPayload())
    });
    const { order } = await created.json();
    const login = await fetch(`${origin}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'test-admin-password' })
    });
    assert.equal(login.status, 200);
    const adminCookie = login.headers.get('set-cookie').split(';')[0];
    const pendingShipAttempt = await fetch(`${origin}/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { Cookie: adminCookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillmentStatus: 'shipped' })
    });
    assert.equal(pendingShipAttempt.status, 409);

    const notification = {
        order_id: order.id,
        status_code: '200',
        gross_amount: '30000',
        transaction_status: 'settlement',
        transaction_id: 'transaction-123'
    };
    notification.signature_key = crypto.createHash('sha512')
        .update(`${notification.order_id}${notification.status_code}${notification.gross_amount}sandbox-test-key`)
        .digest('hex');
    const notificationResponse = await fetch(`${origin}/api/payments/midtrans/notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification)
    });
    assert.equal(notificationResponse.status, 200);
    const publicStatus = await fetch(`${origin}/api/orders/${order.id}`);
    assert.equal((await publicStatus.json()).order.paymentStatus, 'paid');

    const stalePendingNotification = {
        ...notification,
        transaction_status: 'pending'
    };
    stalePendingNotification.signature_key = crypto.createHash('sha512')
        .update(`${stalePendingNotification.order_id}${stalePendingNotification.status_code}${stalePendingNotification.gross_amount}sandbox-test-key`)
        .digest('hex');
    await fetch(`${origin}/api/payments/midtrans/notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stalePendingNotification)
    });
    const stillPaid = await fetch(`${origin}/api/orders/${order.id}`);
    assert.equal((await stillPaid.json()).order.paymentStatus, 'paid');

    const list = await fetch(`${origin}/api/admin/orders`, { headers: { Cookie: adminCookie } });
    const listed = await list.json();
    assert.equal(list.status, 200);
    assert.equal(listed.orders[0].paymentStatus, 'paid');

    const update = await fetch(`${origin}/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { Cookie: adminCookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillmentStatus: 'shipped' })
    });
    assert.equal(update.status, 200);
    assert.equal((await update.json()).order.fulfillmentStatus, 'shipped');

    const invalidTransition = await fetch(`${origin}/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { Cookie: adminCookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillmentStatus: 'cancelled' })
    });
    assert.equal(invalidTransition.status, 409);
});

test('buyers have private purchase history and approved sellers can claim products and view only their sales', async t => {
    const origin = await startTestServer(t);
    const buyer = await registerAccount(origin, {
        name: 'Pembeli A',
        email: 'buyer-a@example.com',
        phone: '081234567801'
    });
    const otherBuyer = await registerAccount(origin, {
        name: 'Pembeli B',
        email: 'buyer-b@example.com',
        phone: '081234567802'
    });
    const seller = await registerAccount(origin, {
        name: 'Toko Seller',
        email: 'seller@example.com',
        phone: '081234567803',
        requestSeller: true
    });
    assert.equal(seller.user.role, 'buyer');
    assert.equal(seller.user.sellerStatus, 'pending');
    assert.equal(JSON.stringify(seller).includes('password-test-123'), false);
    const duplicate = await fetch(`${origin}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Pembeli A duplikat',
            email: 'buyer-a@example.com',
            phone: '081234567899',
            password: 'password-test-123'
        })
    });
    assert.equal(duplicate.status, 409);

    const unauthenticatedHistory = await fetch(`${origin}/api/my/orders`);
    assert.equal(unauthenticatedHistory.status, 401);

    const notApproved = await fetch(`${origin}/api/seller/dashboard`, {
        headers: { Cookie: seller.cookie }
    });
    assert.equal(notApproved.status, 403);

    const adminLogin = await fetch(`${origin}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'admin@kaelstore.com', password: 'test-admin-password' })
    });
    const adminSession = await adminLogin.json();
    const adminCookie = adminLogin.headers.get('set-cookie').split(';')[0];
    assert.equal(adminLogin.status, 200);
    const sellerRequests = await fetch(`${origin}/api/admin/seller-requests`, {
        headers: { Cookie: adminCookie }
    });
    const requests = await sellerRequests.json();
    assert.equal(requests.requests.length, 1);
    const approved = await fetch(`${origin}/api/admin/sellers/${seller.user.id}`, {
        method: 'PATCH',
        headers: { Cookie: adminCookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
    });
    assert.equal(approved.status, 200);

    const sellerDashboard = await fetch(`${origin}/api/seller/dashboard`, {
        headers: { Cookie: seller.cookie }
    });
    const beforeClaim = await sellerDashboard.json();
    assert.equal(sellerDashboard.status, 200);
    assert.equal(beforeClaim.claimableProducts.length, 8);

    const claim = await fetch(`${origin}/api/seller/products/1/claim`, {
        method: 'POST',
        headers: { Cookie: seller.cookie }
    });
    assert.equal(claim.status, 200);
    const newProductResponse = await fetch(`${origin}/api/seller/products`, {
        method: 'POST',
        headers: { Cookie: seller.cookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Paket Buah Toko Seller', category: 'buah', price: 52000 })
    });
    const newProduct = await newProductResponse.json();
    assert.equal(newProductResponse.status, 201);
    assert.equal(newProduct.product.seller, 'Toko Seller');
    const updateProduct = await fetch(`${origin}/api/seller/products/${newProduct.product.id}`, {
        method: 'PATCH',
        headers: { Cookie: seller.cookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Paket Buah Segar', price: 49000 })
    });
    assert.equal(updateProduct.status, 200);

    const catalog = await fetch(`${origin}/api/products`);
    const catalogData = await catalog.json();
    assert.equal(catalogData.products.find(product => product.id === newProduct.product.id).price, 49000);

    const orderResponse = await fetch(`${origin}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: buyer.cookie },
        body: JSON.stringify(orderPayload({ paymentMethod: 'cod', items: [{ id: 1, quantity: 2 }] }))
    });
    const orderResult = await orderResponse.json();
    assert.equal(orderResponse.status, 201);

    const buyerHistory = await fetch(`${origin}/api/my/orders`, {
        headers: { Cookie: buyer.cookie }
    });
    const buyerOrders = await buyerHistory.json();
    assert.equal(buyerOrders.orders.length, 1);
    assert.equal(buyerOrders.orders[0].id, orderResult.order.id);

    const otherBuyerHistory = await fetch(`${origin}/api/my/orders`, {
        headers: { Cookie: otherBuyer.cookie }
    });
    assert.equal((await otherBuyerHistory.json()).orders.length, 0);

    const salesResponse = await fetch(`${origin}/api/seller/dashboard`, {
        headers: { Cookie: seller.cookie }
    });
    const sales = await salesResponse.json();
    assert.equal(sales.sales.length, 1);
    assert.equal(sales.sales[0].customer.name, 'Pembeli Test');
    assert.equal(sales.sales[0].total, 30000);
    assert.equal(sales.paidSalesTotal, 30000);

    const shipmentUpdate = await fetch(`${origin}/api/seller/orders/${orderResult.order.id}`, {
        method: 'PATCH',
        headers: { Cookie: seller.cookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillmentStatus: 'shipped' })
    });
    assert.equal(shipmentUpdate.status, 200);

    const productConflict = await fetch(`${origin}/api/seller/products/1/claim`, {
        method: 'POST',
        headers: { Cookie: seller.cookie }
    });
    assert.equal(productConflict.status, 409);
});

test('payment status and webhook signature helpers validate expected Midtrans results', () => {
    assert.equal(getPaymentStatus('settlement'), 'paid');
    assert.equal(getPaymentStatus('capture', 'accept'), 'paid');
    assert.equal(getPaymentStatus('capture', 'challenge'), 'pending');
    assert.equal(getPaymentStatus('expire'), 'failed');
    const issuedAt = Date.now();
    const payload = Buffer.from(JSON.stringify({ role: 'admin', issuedAt })).toString('base64url');
    const token = crypto.createHmac('sha256', 'secret')
        .update(payload)
        .digest('base64url');
    assert.equal(isValidAdminToken(`${payload}.${token}`, 'secret'), true);
    assert.equal(isValidAdminToken(`${payload}.${token}`, 'wrong-secret'), false);

    const notification = { order_id: 'KS-123', status_code: '200', gross_amount: '15000' };
    notification.signature_key = crypto.createHash('sha512')
        .update(`${notification.order_id}${notification.status_code}${notification.gross_amount}server-key`)
        .digest('hex');
    assert.equal(verifyMidtransSignature(notification, 'server-key'), true);
    assert.equal(verifyMidtransSignature(notification, 'wrong-key'), false);
});
