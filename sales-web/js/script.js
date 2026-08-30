// ========== STATE MANAGEMENT ==========
let cart = [];
let wishlist = [];
let currentUser = null;
let currentProducts = [...products];

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    loadProductsGrid();
    loadCartFromStorage();
    loadWishlistFromStorage();
    loadUserFromStorage();
});

// ========== LOCAL STORAGE ==========
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('cart');
    cart = saved ? JSON.parse(saved) : [];
    updateCartCount();
}

function saveWishlistToStorage() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

function loadWishlistFromStorage() {
    const saved = localStorage.getItem('wishlist');
    wishlist = saved ? JSON.parse(saved) : [];
    updateWishlistCount();
}

function saveUserToStorage() {
    if (currentUser) {
        localStorage.setItem('user', JSON.stringify(currentUser));
    }
}

function loadUserFromStorage() {
    const saved = localStorage.getItem('user');
    currentUser = saved ? JSON.parse(saved) : null;
}

// ========== PRODUCTS ==========
function loadProductsGrid() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    currentProducts.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const isFavorited = wishlist.some(item => item.id === product.id);
    
    card.innerHTML = `
        <div class="product-image">${product.icon}</div>
        <div class="product-card-content">
            <h3>${product.name}</h3>
            <p class="product-info">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">Rp ${product.price.toLocaleString('id-ID')}</span>
                <button class="favorite-btn ${isFavorited ? 'active' : ''}" onclick="toggleWishlistItem(event, ${product.id})">❤️</button>
            </div>
        </div>
    `;
    
    card.addEventListener('click', (e) => {
        if (e.target.className !== 'favorite-btn' && !e.target.closest('.favorite-btn')) {
            showProductModal(product);
        }
    });
    
    return card;
}

function showProductModal(product) {
    const modal = document.getElementById('productModal');
    const image = document.getElementById('modalImage');
    const info = document.getElementById('modalInfo');
    
    image.innerHTML = product.icon;
    
    const isFavorited = wishlist.some(item => item.id === product.id);
    
    info.innerHTML = `
        <h2>${product.name}</h2>
        <p class="modal-price">Rp ${product.price.toLocaleString('id-ID')}</p>
        <p class="product-specs">${product.description}</p>
        <p class="product-specs">Kategori: <strong>${product.category}</strong></p>
        <button class="add-cart-btn" onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
        <button class="secondary-btn" onclick="toggleWishlistItem(null, ${product.id})">${isFavorited ? '❤️ Hapus dari Wishlist' : '🤍 Tambah ke Wishlist'}</button>
    `;
    
    modal.classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

// ========== CART ==========
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    closeProductModal();
    showNotification('Produk ditambahkan ke keranjang!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartDrawer();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.textContent = count;
    }
}

function updateCartDrawer() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Keranjang Anda kosong</div>';
        if (cartTotal) cartTotal.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Qty: ${item.quantity} × Rp ${item.price.toLocaleString('id-ID')}</p>
                <p><strong>Rp ${itemTotal.toLocaleString('id-ID')}</strong></p>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Hapus</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    if (cartTotal) cartTotal.textContent = total.toLocaleString('id-ID');
}

function toggleCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    drawer.classList.toggle('active');
    updateCartDrawer();
}

function goToCheckout() {
    if (cart.length === 0) {
        showNotification('Keranjang Anda kosong!');
        return;
    }
    
    if (!currentUser) {
        showNotification('Silakan login terlebih dahulu');
        closeRegisterModal();
        openLoginModal();
        return;
    }
    
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('storefrontPage').style.display = 'none';
    document.getElementById('checkoutPage').style.display = 'block';
    updateCheckoutSummary();
}

function updateCheckoutSummary() {
    const summary = document.getElementById('checkoutSummary');
    const total = document.getElementById('checkoutTotal');
    
    if (!summary) return;
    
    summary.innerHTML = '';
    let totalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const line = document.createElement('div');
        line.className = 'checkout-line';
        line.innerHTML = `
            <span>${item.name} × ${item.quantity}</span>
            <span>Rp ${itemTotal.toLocaleString('id-ID')}</span>
        `;
        summary.appendChild(line);
    });
    
    if (total) total.textContent = totalPrice.toLocaleString('id-ID');
}

// ========== WISHLIST ==========
function toggleWishlistItem(event, productId) {
    if (event) {
        event.stopPropagation();
    }
    
    const existing = wishlist.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (existing) {
        wishlist = wishlist.filter(item => item.id !== productId);
        showNotification('Dihapus dari wishlist');
    } else {
        wishlist.push(product);
        showNotification('Ditambahkan ke wishlist');
    }
    
    saveWishlistToStorage();
    loadProductsGrid();
    
    if (document.getElementById('productModal').classList.contains('active')) {
        showProductModal(product);
    }
}

function updateWishlistCount() {
    const badge = document.getElementById('wishlistCount');
    if (badge) {
        badge.textContent = wishlist.length;
    }
}

function toggleWishlist() {
    document.getElementById('wishlistModal').classList.toggle('active');
    updateWishlistModal();
}

function closeWishlist() {
    document.getElementById('wishlistModal').classList.remove('active');
}

function updateWishlistModal() {
    const items = document.getElementById('wishlistItems');
    if (!items) return;
    
    if (wishlist.length === 0) {
        items.innerHTML = '<div class="empty-cart">Wishlist Anda kosong</div>';
        return;
    }
    
    items.innerHTML = '';
    wishlist.forEach(item => {
        const wishItem = document.createElement('div');
        wishItem.className = 'wishlist-item';
        wishItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>Rp ${item.price.toLocaleString('id-ID')}</p>
            </div>
            <div>
                <button class="secondary-btn" onclick="addToCart(${item.id})">Beli</button>
            </div>
        `;
        items.appendChild(wishItem);
    });
}

// ========== FILTERS & SORTING ==========
function filterByCategory(category) {
    const buttons = document.querySelectorAll('.category-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (category === 'semua') {
        currentProducts = [...products];
    } else {
        currentProducts = products.filter(p => p.category === category);
    }
    
    loadProductsGrid();
}

function sortProducts(sortBy) {
    if (!sortBy) return;
    
    const sorted = [...currentProducts];
    
    switch(sortBy) {
        case 'name-asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
    }
    
    currentProducts = sorted;
    loadProductsGrid();
}

// ========== SEARCH ==========
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            if (query === '') {
                currentProducts = [...products];
            } else {
                currentProducts = products.filter(p => 
                    p.name.toLowerCase().includes(query) ||
                    p.description.toLowerCase().includes(query)
                );
            }
            loadProductsGrid();
        });
    }
});

// ========== AUTHENTICATION ==========
function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
}

function openRegisterModal() {
    document.getElementById('registerModal').classList.add('active');
}

function closeRegisterModal() {
    document.getElementById('registerModal').classList.remove('active');
}

function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    if (email && password) {
        currentUser = {
            email: email,
            name: email.split('@')[0]
        };
        saveUserToStorage();
        closeLoginModal();
        showNotification('Login berhasil!');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const inputs = form.querySelectorAll('input');
    const name = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value;
    const confirmPassword = inputs[3].value;
    
    if (password !== confirmPassword) {
        showNotification('Password tidak cocok!');
        return;
    }
    
    if (name && email && password) {
        currentUser = {
            name: name,
            email: email
        };
        saveUserToStorage();
        closeRegisterModal();
        openLoginModal();
        showNotification('Pendaftaran berhasil! Silakan login.');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('user');
    goToLanding();
    showNotification('Logout berhasil!');
}

// ========== PAGE NAVIGATION ==========
function goToLanding() {
    document.getElementById('landingPage').style.display = 'block';
    document.getElementById('storefrontPage').style.display = 'none';
    document.getElementById('checkoutPage').style.display = 'none';
}

function goToStorefront() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('storefrontPage').style.display = 'block';
    document.getElementById('checkoutPage').style.display = 'none';
}

// Redirect dari landing page to storefront when opening
function openStorefront() {
    goToStorefront();
}

// ========== THEME TOGGLE ==========
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    updateThemeToggleButton();
}

function updateThemeToggleButton() {
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
        btn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    }
}

// Load theme on startup
document.addEventListener('DOMContentLoaded', function() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeToggleButton();
    }
});

// ========== NOTIFICATIONS ==========
function showNotification(message) {
    // Simple notification - you can improve this with a toast library
    alert(message);
}

// ========== MODAL OVERLAYS ==========
document.addEventListener('click', function(e) {
    if (e.target.className === 'modal-overlay') {
        e.target.parentElement.classList.remove('active');
    }
});

// ========== FORM SUBMISSION ==========
const checkoutForm = document.querySelector('.checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Pesanan Anda sedang diproses! Terima kasih telah berbelanja.');
        cart = [];
        saveCartToStorage();
        goToLanding();
    });
}
