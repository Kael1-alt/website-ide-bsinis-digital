const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const ROOT = __dirname;
const PRODUCT_CATALOG = [
    { id: 1, name: 'Tomat Segar Premium', category: 'sayur', price: 15000, oldPrice: 22000, rating: 4.9, reviews: 182, badge: 'Segar', seller: 'Tani Jaya', emoji: '🍅', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80' },
    { id: 2, name: 'Paket Sayur Campur', category: 'sayur', price: 34000, oldPrice: 47000, rating: 4.8, reviews: 256, badge: 'Hemat', seller: 'Sumber Hijau', emoji: '🥬', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80' },
    { id: 3, name: 'Jeruk Medan', category: 'buah', price: 28000, oldPrice: 36000, rating: 4.7, reviews: 141, badge: 'Populer', seller: 'Buah Sejati', emoji: '🍊', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=900&q=80' },
    { id: 4, name: 'Apel Fuji', category: 'buah', price: 32000, oldPrice: 42000, rating: 4.9, reviews: 92, badge: 'Fresh', seller: 'Fruit Market', emoji: '🍎', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=900&q=80' },
    { id: 5, name: 'Ayam Potong Segar', category: 'daging', price: 47000, oldPrice: 58000, rating: 4.8, reviews: 210, badge: 'Best Seller', seller: 'Daging Nusantara', emoji: '🍗', image: 'https://images.unsplash.com/photo-1607623486966-14789f1e7349?auto=format&fit=crop&w=900&q=80' },
    { id: 6, name: 'Ikan Salmon Beku', category: 'frozen', price: 69000, oldPrice: 89000, rating: 4.9, reviews: 318, badge: 'Premium', seller: 'Frozen Hub', emoji: '🐟', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80' },
    { id: 7, name: 'Paket Masak Harian', category: 'rumah', price: 99000, oldPrice: 125000, rating: 4.8, reviews: 174, badge: 'Hemat', seller: 'Rumahku', emoji: '🧂', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80' },
    { id: 8, name: 'Sabun Cuci Cair', category: 'rumah', price: 24000, oldPrice: 31000, rating: 4.7, reviews: 131, badge: 'Diskon', seller: 'Clean House', emoji: '🧼', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80' }
];
const PAYMENT_METHODS = {
    qris: ['qris'],
    ewallet: ['gopay', 'shopeepay'],
    paylater: ['kredivo', 'akulaku'],
    transfer: ['bank_transfer', 'bca_va', 'bni_va', 'bri_va', 'permata_va']
};
const PAYMENT_LABELS = {
    cod: 'COD',
    qris: 'QRIS',
    ewallet: 'E-wallet',
    paylater: 'PayLater',
    transfer: 'Transfer Bank'
};
const MIME_TYPES = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml'
};

function jsonResponse(response, status, payload, headers = {}) {
    response.writeHead(status, {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        ...headers
    });
    response.end(JSON.stringify(payload));
}

function readJson(request) {
    return new Promise((resolve, reject) => {
        let body = '';
        request.on('data', chunk => {
            body += chunk;
            if (body.length > 1024 * 1024) {
                reject(Object.assign(new Error('Permintaan terlalu besar.'), { status: 413 }));
                request.destroy();
            }
        });
        request.on('end', () => {
            try {
                resolve(JSON.parse(body || '{}'));
            } catch {
                reject(Object.assign(new Error('Format JSON tidak valid.'), { status: 400 }));
            }
        });
        request.on('error', reject);
    });
}

function loadDotEnv(filePath = path.join(ROOT, '.env')) {
    let contents;
    try {
        contents = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        if (error.code === 'ENOENT') return;
        throw error;
    }

    for (const line of contents.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
        if (!match || Object.hasOwn(process.env, match[1])) continue;
        process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
    }
}

function createAdminToken(sessionSecret, issuedAt = Date.now()) {
    const payload = Buffer.from(JSON.stringify({ role: 'admin', issuedAt })).toString('base64url');
    const signature = crypto.createHmac('sha256', sessionSecret).update(payload).digest('base64url');
    return `${payload}.${signature}`;
}

function createSessionToken(claims, sessionSecret, issuedAt = Date.now()) {
    const payload = Buffer.from(JSON.stringify({ ...claims, issuedAt })).toString('base64url');
    const signature = crypto.createHmac('sha256', sessionSecret).update(payload).digest('base64url');
    return `${payload}.${signature}`;
}

function readSessionToken(token, sessionSecret, now = Date.now()) {
    if (typeof token !== 'string') return null;
    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra) return null;
    const expected = crypto.createHmac('sha256', sessionSecret).update(payload).digest();
    let actual;
    try {
        actual = Buffer.from(signature, 'base64url');
    } catch {
        return null;
    }
    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;
    try {
        const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        if (!Number.isSafeInteger(claims.issuedAt) || claims.issuedAt > now || now - claims.issuedAt >= 8 * 60 * 60 * 1000) return null;
        return claims;
    } catch {
        return null;
    }
}

function isValidAdminToken(token, sessionSecret, now = Date.now()) {
    return readSessionToken(token, sessionSecret, now)?.role === 'admin';
}

function hashPassword(password, salt = crypto.randomBytes(16)) {
    const hash = crypto.scryptSync(password, salt, 64);
    return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

function verifyPassword(password, storedHash) {
    const [saltHex, hashHex] = String(storedHash).split(':');
    if (!saltHex || !hashHex) return false;
    const expected = Buffer.from(hashHex, 'hex');
    const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function getListenHost(env = process.env) {
    return env.HOST || '127.0.0.1';
}

function isLoginRateLimited(loginFailures, clientIp, limit, now = Date.now()) {
    const state = loginFailures.get(clientIp);
    if (!state) return false;
    if (now - state.startedAt >= 15 * 60 * 1000) {
        loginFailures.delete(clientIp);
        return false;
    }
    return state.count >= limit;
}

function recordLoginFailure(loginFailures, clientIp, now = Date.now()) {
    const state = loginFailures.get(clientIp);
    if (!state || now - state.startedAt >= 15 * 60 * 1000) {
        loginFailures.set(clientIp, { count: 1, startedAt: now });
        return;
    }
    state.count += 1;
}

function getPaymentStatus(transactionStatus, fraudStatus) {
    if (transactionStatus === 'settlement' || (transactionStatus === 'capture' && fraudStatus === 'accept')) return 'paid';
    if (transactionStatus === 'refund' || transactionStatus === 'partial_refund') return 'refunded';
    if (['deny', 'cancel', 'expire', 'failure'].includes(transactionStatus)) return 'failed';
    return 'pending';
}

function verifyMidtransSignature(notification, serverKey) {
    if (!notification || typeof notification !== 'object') return false;
    const { order_id: orderId, status_code: statusCode, gross_amount: grossAmount, signature_key: signature } = notification;
    if (![orderId, statusCode, grossAmount, signature].every(value => typeof value === 'string')) return false;
    const expected = crypto.createHash('sha512')
        .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
        .digest();
    let actual;
    try {
        actual = Buffer.from(signature, 'hex');
    } catch {
        return false;
    }
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function initializeDatabase(dbPath) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    const database = new DatabaseSync(dbPath);
    database.exec(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            buyer_id INTEGER,
            customer_name TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            customer_address TEXT NOT NULL,
            items_json TEXT NOT NULL,
            shipping_method TEXT NOT NULL,
            shipping_fee INTEGER NOT NULL,
            payment_method TEXT NOT NULL,
            payment_status TEXT NOT NULL,
            fulfillment_status TEXT NOT NULL,
            total INTEGER NOT NULL,
            gateway_token TEXT,
            gateway_transaction_id TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL COLLATE NOCASE UNIQUE,
            phone TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('buyer', 'seller')),
            seller_status TEXT NOT NULL CHECK (seller_status IN ('none', 'pending', 'approved', 'rejected')),
            created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price INTEGER NOT NULL,
            old_price INTEGER NOT NULL,
            rating REAL NOT NULL,
            reviews INTEGER NOT NULL,
            badge TEXT NOT NULL,
            store_name TEXT NOT NULL,
            emoji TEXT NOT NULL,
            image TEXT NOT NULL,
            seller_id INTEGER REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
            product_id INTEGER NOT NULL,
            seller_id INTEGER REFERENCES users(id),
            product_name TEXT NOT NULL,
            unit_price INTEGER NOT NULL,
            quantity INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);
        CREATE INDEX IF NOT EXISTS order_items_seller_idx ON order_items(seller_id, order_id);
    `);
    const orderColumns = database.prepare('PRAGMA table_info(orders)').all().map(column => column.name);
    if (!orderColumns.includes('buyer_id')) database.exec('ALTER TABLE orders ADD COLUMN buyer_id INTEGER');
    database.exec('CREATE INDEX IF NOT EXISTS orders_buyer_idx ON orders(buyer_id, created_at DESC)');
    const insertProduct = database.prepare(`
        INSERT OR IGNORE INTO products (
            id, name, category, price, old_price, rating, reviews, badge, store_name, emoji, image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const product of PRODUCT_CATALOG) {
        insertProduct.run(
            product.id, product.name, product.category, product.price, product.oldPrice,
            product.rating, product.reviews, product.badge, product.seller, product.emoji, product.image
        );
    }
    return database;
}

function validateOrder(body, database) {
    const customer = body?.customer;
    if (!customer || typeof customer.name !== 'string' || customer.name.trim().length < 2 || customer.name.length > 100) {
        throw Object.assign(new Error('Nama penerima wajib diisi (2–100 karakter).'), { status: 400 });
    }
    const phone = typeof customer.phone === 'string' ? customer.phone.trim() : '';
    const phoneDigits = phone.replace(/\D/g, '');
    if (!/^[0-9+()\-\s]{8,20}$/.test(phone) || phoneDigits.length < 8 || phoneDigits.length > 15) {
        throw Object.assign(new Error('Nomor WhatsApp tidak valid.'), { status: 400 });
    }
    if (typeof customer.address !== 'string' || customer.address.trim().length < 8 || customer.address.length > 500) {
        throw Object.assign(new Error('Alamat pengiriman wajib diisi (8–500 karakter).'), { status: 400 });
    }
    if (!['Reguler', 'Express'].includes(body.shipping)) {
        throw Object.assign(new Error('Pilihan pengiriman tidak valid.'), { status: 400 });
    }
    if (!['cod', ...Object.keys(PAYMENT_METHODS)].includes(body.paymentMethod)) {
        throw Object.assign(new Error('Metode pembayaran tidak valid.'), { status: 400 });
    }
    if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 100) {
        throw Object.assign(new Error('Keranjang belanja tidak valid.'), { status: 400 });
    }

    const seenIds = new Set();
    const items = body.items.map(item => {
        const id = Number(item?.id);
        const quantity = Number(item?.quantity);
        const product = database.prepare('SELECT id, name, price FROM products WHERE id = ?').get(id);
        if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99 || seenIds.has(id)) {
            throw Object.assign(new Error('Produk atau jumlah dalam keranjang tidak valid.'), { status: 400 });
        }
        seenIds.add(id);
        return { id, name: product.name, price: product.price, quantity };
    });
    const shippingFee = body.shipping === 'Express' ? 15000 : 0;
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, shippingFee);
    if (!Number.isSafeInteger(total) || total > 100000000) {
        throw Object.assign(new Error('Total pesanan melebihi batas.'), { status: 400 });
    }
    return {
        customer: {
            name: customer.name.trim(),
            phone,
            address: customer.address.trim()
        },
        items,
        shipping: body.shipping,
        shippingFee,
        paymentMethod: body.paymentMethod,
        total
    };
}

function mapOrder(row) {
    return {
        id: row.id,
        customer: { name: row.customer_name, phone: row.customer_phone, address: row.customer_address },
        items: JSON.parse(row.items_json),
        shipping: row.shipping_method,
        shippingFee: row.shipping_fee,
        paymentMethod: row.payment_method,
        payment: PAYMENT_LABELS[row.payment_method],
        paymentStatus: row.payment_status,
        fulfillmentStatus: row.fulfillment_status,
        total: row.total,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

function createAppServer(options = {}) {
    const env = options.env || process.env;
    const isProduction = env.MIDTRANS_IS_PRODUCTION === 'true';
    const adminPassword = env.ADMIN_PASSWORD || '';
    const suppliedSessionSecret = env.ADMIN_SESSION_SECRET || '';
    const config = {
        adminPassword: adminPassword.length >= 16 && !adminPassword.startsWith('replace-with-') ? adminPassword : '',
        sessionSecret: suppliedSessionSecret.length >= 32 && !suppliedSessionSecret.startsWith('replace-with-')
            ? suppliedSessionSecret
            : crypto.randomBytes(32).toString('hex'),
        publicBaseUrl: (env.PUBLIC_BASE_URL || 'http://localhost:3000').replace(/\/+$/, ''),
        serverKey: env.MIDTRANS_SERVER_KEY || '',
        secureCookies: env.COOKIE_SECURE === 'true' || env.NODE_ENV === 'production',
        snapUrl: isProduction
            ? 'https://app.midtrans.com/snap/v1/transactions'
            : 'https://app.sandbox.midtrans.com/snap/v1/transactions'
    };
    const database = initializeDatabase(options.dbPath || path.join(ROOT, 'data', 'orders.sqlite'));
    const loginFailures = new Map();
    const statements = {
        insert: database.prepare(`
            INSERT INTO orders (
                id, buyer_id, customer_name, customer_phone, customer_address, items_json,
                shipping_method, shipping_fee, payment_method, payment_status,
                fulfillment_status, total, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'processing', ?, ?, ?)
        `),
        insertItem: database.prepare(`
            INSERT INTO order_items (order_id, product_id, seller_id, product_name, unit_price, quantity)
            SELECT ?, p.id, p.seller_id, p.name, p.price, ?
            FROM products p WHERE p.id = ?
        `),
        byId: database.prepare('SELECT * FROM orders WHERE id = ?'),
        list: database.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT ?'),
        buyerOrders: database.prepare('SELECT * FROM orders WHERE buyer_id = ? ORDER BY created_at DESC LIMIT ?'),
        ownedProducts: database.prepare(`
            SELECT id, name, category, price, old_price, rating, reviews, badge, store_name, emoji, image, seller_id
            FROM products WHERE seller_id = ? ORDER BY id
        `),
        claimableProducts: database.prepare(`
            SELECT id, name, category, price, old_price, rating, reviews, badge, store_name, emoji, image
            FROM products WHERE seller_id IS NULL ORDER BY id
        `),
        sellerSales: database.prepare(`
            SELECT o.id, o.customer_name, o.customer_phone, o.customer_address, o.payment_method,
                o.payment_status, o.fulfillment_status, o.created_at, o.updated_at,
                oi.product_id, oi.product_name, oi.unit_price, oi.quantity,
                (SELECT COUNT(*) FROM order_items all_items WHERE all_items.order_id = o.id) AS total_item_count,
                (SELECT COUNT(*) FROM order_items seller_items WHERE seller_items.order_id = o.id AND seller_items.seller_id = ?) AS seller_item_count
            FROM order_items oi JOIN orders o ON o.id = oi.order_id
            WHERE oi.seller_id = ? ORDER BY o.created_at DESC LIMIT ?
        `),
        sellerRequests: database.prepare(`
            SELECT id, name, email, phone, created_at FROM users
            WHERE seller_status = 'pending' ORDER BY created_at
        `),
        paymentUpdate: database.prepare(`
            UPDATE orders
            SET payment_status = ?, gateway_transaction_id = COALESCE(?, gateway_transaction_id), updated_at = ?
            WHERE id = ?
        `),
        gatewayTokenUpdate: database.prepare(`
            UPDATE orders SET gateway_token = ?, updated_at = ? WHERE id = ?
        `),
        fulfillmentUpdate: database.prepare(`
            UPDATE orders SET fulfillment_status = ?, updated_at = ? WHERE id = ?
        `)
    };
    const fetchImpl = options.fetchImpl || fetch;
    const cookieOptions = config.secureCookies ? '; Secure' : '';

    function setSessionCookie(token, maxAge = 8 * 60 * 60) {
        return {
            'Set-Cookie': `kaelstore_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${cookieOptions}`
        };
    }

    function clearSessionCookie() {
        return {
            'Set-Cookie': `kaelstore_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${cookieOptions}`
        };
    }

    function currentUser(request) {
        const cookieHeader = request.headers.cookie || '';
        const token = cookieHeader.match(/(?:^|;\s*)kaelstore_session=([A-Za-z0-9._-]+)/)?.[1];
        const claims = readSessionToken(token, config.sessionSecret);
        if (!claims) return null;
        if (claims.role === 'admin' && (claims.userId || 0) === 0) {
            return { id: 0, name: 'Administrator', email: 'admin@kaelstore.com', role: 'admin', sellerStatus: 'approved' };
        }
        const user = database.prepare('SELECT id, name, email, phone, role, seller_status FROM users WHERE id = ?').get(claims.userId);
        if (!user) return null;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            sellerStatus: user.seller_status
        };
    }

    function requireUser(request) {
        const user = currentUser(request);
        if (!user) throw Object.assign(new Error('Masuk terlebih dahulu untuk melanjutkan.'), { status: 401 });
        return user;
    }

    function requireAdmin(request) {
        const user = currentUser(request);
        return user?.role === 'admin' ? user : null;
    }

    function requireApprovedSeller(request) {
        const user = requireUser(request);
        if (user.role !== 'seller' || user.sellerStatus !== 'approved') {
            throw Object.assign(new Error('Fitur penjual hanya tersedia untuk akun seller yang sudah disetujui admin.'), { status: 403 });
        }
        return user;
    }

    function mapProduct(row, sellerName = null) {
        return {
            id: row.id,
            name: row.name,
            category: row.category,
            price: row.price,
            oldPrice: row.old_price,
            rating: row.rating,
            reviews: row.reviews,
            badge: row.badge,
            seller: sellerName || row.store_name,
            sellerId: row.seller_id,
            emoji: row.emoji,
            image: row.image
        };
    }

    function orderItems(orderId) {
        return database.prepare(`
            SELECT product_id AS id, product_name AS name, unit_price AS price, quantity
            FROM order_items WHERE order_id = ? ORDER BY id
        `).all(orderId);
    }

    async function handle(request, response) {
        const requestUrl = new URL(request.url, 'http://localhost');
        const pathname = decodeURIComponent(requestUrl.pathname);

        if (request.method === 'GET' && pathname === '/api/health') {
            return jsonResponse(response, 200, {
                ok: true,
                mode: isProduction ? 'production' : 'sandbox',
                gatewayConfigured: Boolean(config.serverKey)
            });
        }

        if (request.method === 'GET' && pathname === '/api/products') {
            const products = database.prepare(`
                SELECT p.id, p.name, p.category, p.price, p.old_price, p.rating, p.reviews,
                    p.badge, p.store_name, p.emoji, p.image, p.seller_id, u.name AS seller_name
                FROM products p LEFT JOIN users u ON u.id = p.seller_id ORDER BY p.id
            `).all();
            return jsonResponse(response, 200, { products: products.map(product => mapProduct(product, product.seller_name)) });
        }

        if (request.method === 'POST' && pathname === '/api/auth/register') {
            if (!config.sessionSecret) return jsonResponse(response, 503, { error: 'Server belum dikonfigurasi untuk sesi akun.' });
            const body = await readJson(request);
            const name = typeof body.name === 'string' ? body.name.trim() : '';
            const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
            const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
            const password = typeof body.password === 'string' ? body.password : '';
            const phoneDigits = phone.replace(/\D/g, '');
            if (name.length < 2 || name.length > 100) return jsonResponse(response, 400, { error: 'Nama harus 2–100 karakter.' });
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || email === 'admin@kaelstore.com') {
                return jsonResponse(response, 400, { error: 'Email tidak valid.' });
            }
            if (!/^[0-9+()\-\s]{8,20}$/.test(phone) || phoneDigits.length < 8 || phoneDigits.length > 15) {
                return jsonResponse(response, 400, { error: 'Nomor HP tidak valid.' });
            }
            if (password.length < 12 || password.length > 200) return jsonResponse(response, 400, { error: 'Password harus minimal 12 karakter.' });
            const now = new Date().toISOString();
            try {
                const result = database.prepare(`
                    INSERT INTO users (name, email, phone, password_hash, role, seller_status, created_at)
                    VALUES (?, ?, ?, ?, 'buyer', ?, ?)
                `).run(name, email, phone, hashPassword(password), body.requestSeller === true ? 'pending' : 'none', now);
                const user = {
                    id: Number(result.lastInsertRowid),
                    name,
                    email,
                    phone,
                    role: 'buyer',
                    sellerStatus: body.requestSeller === true ? 'pending' : 'none'
                };
                const token = createSessionToken({ userId: user.id, role: user.role }, config.sessionSecret);
                return jsonResponse(response, 201, { user }, setSessionCookie(token));
            } catch (error) {
                if (error.errcode === 2067 || error.errcode === 1555) {
                    return jsonResponse(response, 409, { error: 'Email atau nomor HP sudah terdaftar.' });
                }
                throw error;
            }
        }

        if (request.method === 'POST' && pathname === '/api/auth/login') {
            if (!config.sessionSecret) return jsonResponse(response, 503, { error: 'Server belum dikonfigurasi untuk sesi akun.' });
            const body = await readJson(request);
            const identifier = typeof body.identifier === 'string' ? body.identifier.trim() : '';
            const password = typeof body.password === 'string' ? body.password : '';
            const clientIp = request.socket.remoteAddress || 'unknown';
            if (isLoginRateLimited(loginFailures, clientIp, 8)) {
                return jsonResponse(response, 429, { error: 'Terlalu banyak percobaan masuk. Coba lagi dalam 15 menit.' });
            }
            if (identifier.toLowerCase() === 'admin@kaelstore.com') {
                if (!config.adminPassword) {
                    return jsonResponse(response, 503, { error: 'Atur ADMIN_PASSWORD minimal 16 karakter di file .env.' });
                }
                const supplied = Buffer.from(password);
                const expected = Buffer.from(config.adminPassword);
                if (!config.adminPassword || supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
                    recordLoginFailure(loginFailures, clientIp);
                    return jsonResponse(response, 401, { error: 'Email atau password tidak cocok.' });
                }
                loginFailures.delete(clientIp);
                const user = { id: 0, name: 'Administrator', email: 'admin@kaelstore.com', role: 'admin', sellerStatus: 'approved' };
                const token = createSessionToken({ userId: 0, role: 'admin' }, config.sessionSecret);
                return jsonResponse(response, 200, { user }, setSessionCookie(token));
            }
            const user = database.prepare(`
                SELECT id, name, email, phone, password_hash, role, seller_status
                FROM users WHERE email = ? COLLATE NOCASE OR phone = ?
            `).get(identifier.toLowerCase(), identifier);
            if (!user || !verifyPassword(password, user.password_hash)) {
                recordLoginFailure(loginFailures, clientIp);
                return jsonResponse(response, 401, { error: 'Email atau password tidak cocok.' });
            }
            loginFailures.delete(clientIp);
            const publicUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                sellerStatus: user.seller_status
            };
            const token = createSessionToken({ userId: user.id, role: user.role }, config.sessionSecret);
            return jsonResponse(response, 200, { user: publicUser }, setSessionCookie(token));
        }

        if (pathname.startsWith('/api/')) {
            if (request.method === 'POST' && pathname === '/api/auth/logout') {
                return jsonResponse(response, 200, { ok: true }, clearSessionCookie());
            }
            if (request.method === 'GET' && pathname === '/api/me') {
                const user = requireUser(request);
                return jsonResponse(response, 200, { user });
            }
            if (request.method === 'GET' && pathname === '/api/my/orders') {
                const user = requireUser(request);
                const orders = statements.buyerOrders.all(user.id, 100).map(row => ({
                    ...mapOrder(row),
                    items: orderItems(row.id)
                }));
                return jsonResponse(response, 200, { orders });
            }
            if (request.method === 'GET' && pathname === '/api/seller/dashboard') {
                const user = requireApprovedSeller(request);
                const ownedProducts = statements.ownedProducts.all(user.id);
                const claimableProducts = statements.claimableProducts.all();
                const salesRows = statements.sellerSales.all(user.id, user.id, 300);
                const salesByOrder = new Map();
                for (const row of salesRows) {
                    let sale = salesByOrder.get(row.id);
                    if (!sale) {
                        sale = {
                            id: row.id,
                            customer: { name: row.customer_name, phone: row.customer_phone, address: row.customer_address },
                            payment: PAYMENT_LABELS[row.payment_method],
                            paymentStatus: row.payment_status,
                            fulfillmentStatus: row.fulfillment_status,
                            createdAt: row.created_at,
                            updatedAt: row.updated_at,
                            canManageFulfillment: row.total_item_count === row.seller_item_count,
                            items: [],
                            total: 0
                        };
                        salesByOrder.set(row.id, sale);
                    }
                    sale.items.push({ id: row.product_id, name: row.product_name, price: row.unit_price, quantity: row.quantity });
                    sale.total += row.unit_price * row.quantity;
                }
                const sales = [...salesByOrder.values()];
                return jsonResponse(response, 200, {
                    products: ownedProducts.map(product => mapProduct(product)),
                    claimableProducts: claimableProducts.map(product => mapProduct(product)),
                    sales,
                    paidSalesTotal: sales.filter(sale => sale.paymentStatus === 'paid' || sale.paymentStatus === 'cod_due')
                        .reduce((sum, sale) => sum + sale.total, 0)
                });
            }
            if (request.method === 'POST' && pathname === '/api/seller/products') {
                const user = requireApprovedSeller(request);
                const body = await readJson(request);
                const name = typeof body.name === 'string' ? body.name.trim() : '';
                const category = typeof body.category === 'string' ? body.category : '';
                const price = Number(body.price);
                if (name.length < 3 || name.length > 80) return jsonResponse(response, 400, { error: 'Nama produk harus 3–80 karakter.' });
                if (!['sayur', 'buah', 'frozen', 'daging', 'rumah'].includes(category)) {
                    return jsonResponse(response, 400, { error: 'Kategori produk tidak valid.' });
                }
                if (!Number.isSafeInteger(price) || price < 1 || price > 10000000) {
                    return jsonResponse(response, 400, { error: 'Harga harus berupa angka antara Rp 1 dan Rp 10.000.000.' });
                }
                const productId = Number(database.prepare(`
                    INSERT INTO products (
                        name, category, price, old_price, rating, reviews, badge,
                        store_name, emoji, image, seller_id
                    ) VALUES (?, ?, ?, ?, 0, 0, 'Produk Seller', ?, '🛍️', ?, ?)
                `).run(name, category, price, price, user.name, PRODUCT_CATALOG[0].image, user.id).lastInsertRowid);
                return jsonResponse(response, 201, {
                    product: mapProduct(database.prepare(`
                        SELECT id, name, category, price, old_price, rating, reviews, badge,
                            store_name, emoji, image, seller_id
                        FROM products WHERE id = ?
                    `).get(productId), user.name)
                });
            }
            const claimMatch = pathname.match(/^\/api\/seller\/products\/(\d+)\/claim$/);
            if (request.method === 'POST' && claimMatch) {
                const user = requireApprovedSeller(request);
                const result = database.prepare('UPDATE products SET seller_id = ? WHERE id = ? AND seller_id IS NULL')
                    .run(user.id, Number(claimMatch[1]));
                if (!result.changes) return jsonResponse(response, 409, { error: 'Produk sudah diklaim seller lain atau tidak ditemukan.' });
                return jsonResponse(response, 200, { ok: true });
            }
            const sellerProductMatch = pathname.match(/^\/api\/seller\/products\/(\d+)$/);
            if (request.method === 'PATCH' && sellerProductMatch) {
                const user = requireApprovedSeller(request);
                const body = await readJson(request);
                const name = typeof body.name === 'string' ? body.name.trim() : '';
                const price = Number(body.price);
                if (name.length < 3 || name.length > 80) return jsonResponse(response, 400, { error: 'Nama produk harus 3–80 karakter.' });
                if (!Number.isSafeInteger(price) || price < 1 || price > 10000000) {
                    return jsonResponse(response, 400, { error: 'Harga harus berupa angka antara Rp 1 dan Rp 10.000.000.' });
                }
                const updated = database.prepare(`
                    UPDATE products SET name = ?, price = ?, old_price = ?
                    WHERE id = ? AND seller_id = ?
                `).run(name, price, price, Number(sellerProductMatch[1]), user.id);
                if (!updated.changes) return jsonResponse(response, 404, { error: 'Produk bukan milik seller ini atau tidak ditemukan.' });
                return jsonResponse(response, 200, { ok: true });
            }
            const sellerOrderMatch = pathname.match(/^\/api\/seller\/orders\/(KS-[A-Za-z0-9-]+)$/);
            if (request.method === 'PATCH' && sellerOrderMatch) {
                const user = requireApprovedSeller(request);
                const body = await readJson(request);
                const order = statements.byId.get(sellerOrderMatch[1]);
                if (!order) return jsonResponse(response, 404, { error: 'Pesanan tidak ditemukan.' });
                const ownsItem = database.prepare('SELECT 1 FROM order_items WHERE order_id = ? AND seller_id = ? LIMIT 1')
                    .get(order.id, user.id);
                if (!ownsItem) return jsonResponse(response, 404, { error: 'Pesanan ini tidak berisi produk milik toko Anda.' });
                const ownsWholeOrder = database.prepare(`
                    SELECT COUNT(*) AS all_items,
                        SUM(CASE WHEN seller_id = ? THEN 1 ELSE 0 END) AS seller_items
                    FROM order_items WHERE order_id = ?
                `).get(user.id, order.id);
                if (ownsWholeOrder.all_items !== ownsWholeOrder.seller_items) {
                    return jsonResponse(response, 409, { error: 'Pesanan berisi produk dari beberapa toko. Hubungi admin untuk mengubah status pengiriman.' });
                }
                const allowedNext = {
                    processing: [
                        ...(['paid', 'cod_due'].includes(order.payment_status) ? ['shipped'] : []),
                        ...(['failed', 'cod_due'].includes(order.payment_status) ? ['cancelled'] : [])
                    ],
                    shipped: ['delivered'],
                    delivered: [],
                    cancelled: []
                };
                if (!allowedNext[order.fulfillment_status]?.includes(body.fulfillmentStatus)) {
                    return jsonResponse(response, 409, { error: 'Perubahan status tidak diizinkan sebelum pembayaran terkonfirmasi atau pesanan layak dibatalkan.' });
                }
                statements.fulfillmentUpdate.run(body.fulfillmentStatus, new Date().toISOString(), order.id);
                return jsonResponse(response, 200, { ok: true });
            }
        }

        if (request.method === 'POST' && pathname === '/api/orders') {
            const body = await readJson(request);
            const buyer = requireUser(request);
            if (buyer.role === 'admin') return jsonResponse(response, 403, { error: 'Admin tidak dapat membuat pesanan pembeli.' });
            const orderData = validateOrder(body, database);
            if (orderData.paymentMethod !== 'cod' && !config.serverKey) {
                return jsonResponse(response, 503, { error: 'Midtrans belum dikonfigurasi. Pesanan pembayaran online belum dapat dibuat.' });
            }

            const orderId = `KS-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
            const now = new Date().toISOString();
            const initialPaymentStatus = orderData.paymentMethod === 'cod' ? 'cod_due' : 'pending';
            statements.insert.run(
                orderId,
                buyer.id,
                orderData.customer.name,
                orderData.customer.phone,
                orderData.customer.address,
                JSON.stringify(orderData.items),
                orderData.shipping,
                orderData.shippingFee,
                orderData.paymentMethod,
                initialPaymentStatus,
                orderData.total,
                now,
                now
            );
            for (const item of orderData.items) {
                statements.insertItem.run(orderId, item.quantity, item.id);
            }

            if (orderData.paymentMethod === 'cod') {
                return jsonResponse(response, 201, { order: mapOrder(statements.byId.get(orderId)) });
            }

            const gatewayItems = orderData.items.map(item => ({
                id: String(item.id),
                price: item.price,
                quantity: item.quantity,
                name: item.name.slice(0, 50)
            }));
            if (orderData.shippingFee) {
                gatewayItems.push({ id: 'shipping-express', price: orderData.shippingFee, quantity: 1, name: 'Pengiriman Express' });
            }
            const payload = {
                transaction_details: { order_id: orderId, gross_amount: orderData.total },
                item_details: gatewayItems,
                customer_details: {
                    first_name: orderData.customer.name.slice(0, 50),
                    phone: orderData.customer.phone
                },
                enabled_payments: PAYMENT_METHODS[orderData.paymentMethod],
                callbacks: { finish: `${config.publicBaseUrl}/payment-status.html?order_id=${encodeURIComponent(orderId)}` }
            };
            try {
                const gatewayResponse = await fetchImpl(config.snapUrl, {
                    method: 'POST',
                    headers: {
                        Authorization: `Basic ${Buffer.from(`${config.serverKey}:`).toString('base64')}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    body: JSON.stringify(payload),
                    signal: AbortSignal.timeout(15000)
                });
                const gatewayResult = await gatewayResponse.json();
                if (!gatewayResponse.ok || typeof gatewayResult.redirect_url !== 'string' || typeof gatewayResult.token !== 'string') {
                    statements.paymentUpdate.run('failed', null, new Date().toISOString(), orderId);
                    console.error('Midtrans rejected transaction creation:', gatewayResult);
                    return jsonResponse(response, 502, { error: 'Midtrans gagal membuat transaksi. Coba lagi atau gunakan metode lain.' });
                }
                statements.gatewayTokenUpdate.run(gatewayResult.token, new Date().toISOString(), orderId);
                return jsonResponse(response, 201, {
                    order: mapOrder(statements.byId.get(orderId)),
                    redirectUrl: gatewayResult.redirect_url
                });
            } catch (error) {
                statements.paymentUpdate.run('failed', null, new Date().toISOString(), orderId);
                console.error('Midtrans request failed:', error);
                return jsonResponse(response, 502, { error: 'Tidak dapat menghubungi Midtrans. Pesanan belum dibayar; silakan coba lagi.' });
            }
        }

        if (request.method === 'POST' && pathname === '/api/payments/midtrans/notification') {
            const notification = await readJson(request);
            if (!config.serverKey || !verifyMidtransSignature(notification, config.serverKey)) {
                return jsonResponse(response, 401, { error: 'Tanda tangan notifikasi tidak valid.' });
            }
            const order = statements.byId.get(notification.order_id);
            if (!order) return jsonResponse(response, 404, { error: 'Pesanan tidak ditemukan.' });
            if (order.payment_method === 'cod' || Number(notification.gross_amount) !== order.total) {
                return jsonResponse(response, 409, { error: 'Detail transaksi tidak sesuai dengan pesanan.' });
            }
            const paymentStatus = getPaymentStatus(notification.transaction_status, notification.fraud_status);
            const canAdvance = order.payment_status === 'pending'
                || (order.payment_status === 'failed' && paymentStatus === 'paid')
                || (order.payment_status === 'paid' && paymentStatus === 'refunded');
            if (canAdvance) {
                statements.paymentUpdate.run(paymentStatus, notification.transaction_id || null, new Date().toISOString(), order.id);
            }
            return jsonResponse(response, 200, { ok: true });
        }

        const publicOrderMatch = pathname.match(/^\/api\/orders\/(KS-[A-Za-z0-9-]+)$/);
        if (request.method === 'GET' && publicOrderMatch) {
            const order = statements.byId.get(publicOrderMatch[1]);
            if (!order) return jsonResponse(response, 404, { error: 'Pesanan tidak ditemukan.' });
            return jsonResponse(response, 200, {
                order: {
                    id: order.id,
                    paymentStatus: order.payment_status,
                    fulfillmentStatus: order.fulfillment_status,
                    updatedAt: order.updated_at
                }
            });
        }

        if (request.method === 'POST' && pathname === '/api/admin/login') {
            if (!config.adminPassword || !config.sessionSecret) {
                return jsonResponse(response, 503, { error: 'ADMIN_PASSWORD dan ADMIN_SESSION_SECRET belum dikonfigurasi.' });
            }
            const body = await readJson(request);
            const clientIp = request.socket.remoteAddress || 'unknown';
            if (isLoginRateLimited(loginFailures, clientIp, 5)) {
                return jsonResponse(response, 429, { error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' });
            }
            const supplied = Buffer.from(String(body.password || ''));
            const expected = Buffer.from(config.adminPassword);
            if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
                recordLoginFailure(loginFailures, clientIp);
                return jsonResponse(response, 401, { error: 'Password admin salah.' });
            }
            loginFailures.delete(clientIp);
            const token = createAdminToken(config.sessionSecret);
            return jsonResponse(response, 200, { ok: true }, setSessionCookie(token));
        }

        if (pathname.startsWith('/api/admin/')) {
            if (!requireAdmin(request)) return jsonResponse(response, 401, { error: 'Sesi admin tidak valid atau sudah berakhir.' });
            if (request.method === 'GET' && pathname === '/api/admin/seller-requests') {
                return jsonResponse(response, 200, { requests: statements.sellerRequests.all() });
            }
            const sellerApprovalMatch = pathname.match(/^\/api\/admin\/sellers\/(\d+)$/);
            if (request.method === 'PATCH' && sellerApprovalMatch) {
                const body = await readJson(request);
                if (!['approved', 'rejected'].includes(body.status)) {
                    return jsonResponse(response, 400, { error: 'Status seller harus approved atau rejected.' });
                }
                const result = database.prepare(`
                    UPDATE users SET role = ?, seller_status = ?
                    WHERE id = ? AND seller_status IN ('pending', 'rejected')
                `).run(body.status === 'approved' ? 'seller' : 'buyer', body.status, Number(sellerApprovalMatch[1]));
                if (!result.changes) return jsonResponse(response, 404, { error: 'Permohonan seller tidak ditemukan atau sudah diproses.' });
                return jsonResponse(response, 200, { ok: true });
            }
            if (request.method === 'GET' && pathname === '/api/admin/orders') {
                const limit = Math.min(Math.max(Number(requestUrl.searchParams.get('limit')) || 100, 1), 500);
                return jsonResponse(response, 200, { orders: statements.list.all(limit).map(mapOrder) });
            }
            const updateMatch = pathname.match(/^\/api\/admin\/orders\/(KS-[A-Za-z0-9-]+)$/);
            if (request.method === 'PATCH' && updateMatch) {
                const body = await readJson(request);
                const order = statements.byId.get(updateMatch[1]);
                if (!order) return jsonResponse(response, 404, { error: 'Pesanan tidak ditemukan.' });
                const allowedNext = {
                    processing: [
                        ...(['paid', 'cod_due'].includes(order.payment_status) ? ['shipped'] : []),
                        ...(['failed', 'cod_due'].includes(order.payment_status) ? ['cancelled'] : [])
                    ],
                    shipped: ['delivered'],
                    delivered: [],
                    cancelled: []
                };
                if (!allowedNext[order.fulfillment_status]?.includes(body.fulfillmentStatus)) {
                    return jsonResponse(response, 409, { error: 'Perubahan status tidak diizinkan sebelum pembayaran terkonfirmasi atau pesanan layak dibatalkan.' });
                }
                if (body.fulfillmentStatus === 'cancelled' && order.payment_status === 'paid') {
                    return jsonResponse(response, 409, { error: 'Pesanan yang sudah dibayar tidak dapat dibatalkan dari panel ini. Proses refund secara terpisah.' });
                }
                statements.fulfillmentUpdate.run(body.fulfillmentStatus, new Date().toISOString(), order.id);
                return jsonResponse(response, 200, { order: mapOrder(statements.byId.get(order.id)) });
            }
            return jsonResponse(response, 404, { error: 'Endpoint admin tidak ditemukan.' });
        }

        if (request.method !== 'GET' && request.method !== 'HEAD') {
            return jsonResponse(response, 404, { error: 'Endpoint tidak ditemukan.' });
        }
        const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
        const filePath = path.resolve(ROOT, relativePath);
        if (!filePath.startsWith(`${ROOT}${path.sep}`) || !MIME_TYPES[path.extname(filePath).toLowerCase()]) {
            response.writeHead(404);
            return response.end('Tidak ditemukan.');
        }
        fs.readFile(filePath, (error, content) => {
            if (error) {
                response.writeHead(error.code === 'ENOENT' ? 404 : 500);
                return response.end(error.code === 'ENOENT' ? 'Tidak ditemukan.' : 'Gagal membaca halaman.');
            }
            response.writeHead(200, {
                'Cache-Control': 'no-cache',
                'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()],
                'X-Content-Type-Options': 'nosniff'
            });
            response.end(request.method === 'HEAD' ? undefined : content);
        });
    }

    const server = http.createServer((request, response) => {
        handle(request, response).catch(error => {
            if (response.headersSent || response.destroyed) return;
            if (!error.status || error.status >= 500) console.error('Request failed:', error);
            jsonResponse(response, error.status || 500, {
                error: error.status ? error.message : 'Terjadi kesalahan pada server.'
            });
        });
    });
    server.on('close', () => database.close());
    return server;
}

if (require.main === module) {
    loadDotEnv();
    const server = createAppServer();
    const port = Number(process.env.PORT || 3000);
    const host = getListenHost();
    server.listen(port, host, () => {
        console.log(`Kaelstore payment server berjalan di http://${host}:${port}`);
        console.log(`Mode Midtrans: ${process.env.MIDTRANS_IS_PRODUCTION === 'true' ? 'production' : 'sandbox'}`);
        if (!process.env.ADMIN_SESSION_SECRET) console.warn('ADMIN_SESSION_SECRET belum diatur; sesi login akan berubah saat server dimulai ulang.');
        if (!process.env.ADMIN_PASSWORD) console.warn('ADMIN_PASSWORD belum diatur; login admin dan persetujuan seller belum tersedia.');
    });
}

module.exports = {
    createAppServer,
    hashPassword,
    getPaymentStatus,
    getListenHost,
    isValidAdminToken,
    isLoginRateLimited,
    loadDotEnv,
    readSessionToken,
    recordLoginFailure,
    verifyMidtransSignature
};
