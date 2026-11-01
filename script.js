// ========== AI RECOMMENDATION DATA ==========
const recommendations = {
    minimal: {
        programming: {
            title: 'Freelance Programming / Web Development',
            description: 'Mulai sebagai freelancer untuk proyek kecil di platform seperti Upwork, Fiverr, atau lokal. Kembangkan portfolio sambil membangun klien tetap. Investasi minimal dengan potensi income tinggi.'
        },
        marketing: {
            title: 'Social Media Management / Content Creator',
            description: 'Kelola media sosial untuk bisnis lokal atau mulai sebagai content creator. Butuh laptop dan internet saja. Monetisasi melalui sponsorship, affiliate, atau layanan jasa.'
        },
        design: {
            title: 'Graphic Design Freelance',
            description: 'Tawarkan layanan desain grafis (logo, poster, banner) di platform freelance. Gunakan tools gratis seperti Canva untuk memulai. Kembangkan skill dan harga seiring waktu.'
        },
        education: {
            title: 'Online Tutor / Course Creator',
            description: 'Ajarkan skill Anda melalui platform seperti Skillshare, Udemy, atau Zoom classes. Modal minimal dengan income pasif jika course terjual dengan baik.'
        },
        finance: {
            title: 'Digital Dropshipping Store',
            description: 'Mulai toko online tanpa stok barang. Gunakan platform seperti Shopify atau lokal yang mendukung dropshipping. Fokus pada marketing.'
        }
    },
    kecil: {
        programming: {
            title: 'Aplikasi Mobile/Web SaaS',
            description: 'Develop aplikasi atau software untuk memecahkan masalah spesifik. Jual dengan model subscription. Modal untuk hosting dan marketing sudah cukup.'
        },
        marketing: {
            title: 'Digital Marketing Agency',
            description: 'Tawarkan layanan SEO, content marketing, ads management untuk bisnis lokal. Investasi untuk tools dan iklan promosi sendiri.'
        },
        design: {
            title: 'Design Studio / Branding Agency',
            description: 'Buka jasa desain komprehensif untuk branding bisnis. Kemudian expand ke video editing, motion graphics, dll.'
        },
        education: {
            title: 'Online Learning Platform',
            description: 'Bangun platform untuk menjual multiple courses. Investasi untuk development dan marketing awal.'
        },
        finance: {
            title: 'E-commerce Store (Fashion/Produk)',
            description: 'Buka toko online dengan inventory sendiri. Fokus pada niche market yang spesifik untuk kompetisi lebih rendah.'
        }
    },
    menengah: {
        programming: {
            title: 'Software Development Company',
            description: 'Buka agensi development yang kompleks dengan tim. Bidang custom development, konsultasi, maintenance kontrak jangka panjang.'
        },
        marketing: {
            title: 'Performance Marketing Company',
            description: 'Spesialisasi dalam hasil terukur untuk e-commerce dan startup. Invest dalam tools premium dan talent terbaik.'
        },
        design: {
            title: 'Full-Service Creative Agency',
            description: 'Agensi kreatif lengkap dengan tim designer, developer, copywriter. Serve corporate clients dengan project besar.'
        },
        education: {
            title: 'Boot Camp / Intensive Training',
            description: 'Buat intensive training program (coding, digital marketing, design). Butuh mentor berpengalaman dan marketing budget besar.'
        },
        finance: {
            title: 'Multi-channel E-commerce Marketplace',
            description: 'Bangun marketplace atau expand ke multiple platform. Investasi besar di inventory, logistics, customer service.'
        }
    },
    besar: {
        programming: {
            title: 'Tech Startup / AI Platform',
            description: 'Develop innovative tech solution dengan AI/Machine Learning. Cukup capital untuk R&D, hire talent terbaik, dan market expansion.'
        },
        marketing: {
            title: 'Marketing Technology Company',
            description: 'Develop marketing automation platform atau data analytics tool. Potential untuk venture capital funding dan exit besar.'
        },
        design: {
            title: 'Digital Product Company',
            description: 'Develop design tools, templates, atau stock resource platform. Recurring revenue dengan customer base besar.'
        },
        education: {
            title: 'EdTech Platform Unicorn',
            description: 'Bangun platform edukasi skala besar dengan innovative approach. Target market Indonesia yang huge dengan investasi marketing besar.'
        },
        finance: {
            title: 'Fintech Platform / Payment Gateway',
            description: 'Develop financial technology solution. Butuh capital besar, compliance penuh, dan team expert.'
        }
    }
};

const businessIdeas = [
    { title: 'Toko Produk Digital', category: 'digital', icon: '🛒', description: 'Jual template, preset, e-book, atau aset desain dengan sistem otomatis.' },
    { title: 'Aplikasi SaaS Niche', category: 'digital', icon: '💻', description: 'Buat aplikasi berlangganan untuk menyelesaikan satu masalah spesifik bisnis.' },
    { title: 'Agensi Iklan Digital', category: 'jasa', icon: '📣', description: 'Bantu UMKM mendapatkan pelanggan lewat iklan dan strategi pemasaran yang terukur.' },
    { title: 'Jasa Admin Marketplace', category: 'jasa', icon: '📦', description: 'Kelola katalog, chat pelanggan, pesanan, dan promosi toko online.' },
    { title: 'Jasa Foto Produk', category: 'jasa', icon: '📸', description: 'Sediakan foto dan video pendek yang membuat produk lebih menarik untuk dijual.' },
    { title: 'Katering Sehat', category: 'produk', icon: '🥗', description: 'Tawarkan menu mingguan praktis untuk pekerja, keluarga, atau komunitas olahraga.' },
    { title: 'Produk Perawatan Alami', category: 'produk', icon: '🌿', description: 'Kembangkan produk perawatan dengan bahan lokal dan cerita brand yang kuat.' },
    { title: 'Urban Farming', category: 'produk', icon: '🌱', description: 'Jual sayuran segar, bibit, atau paket kebun rumah dengan layanan berlangganan.' },
    { title: 'Kursus Skill Kerja', category: 'edukasi', icon: '🎓', description: 'Buat kelas singkat tentang spreadsheet, desain, coding, atau keterampilan kerja.' },
    { title: 'Mentor Karier', category: 'edukasi', icon: '🧭', description: 'Bantu pencari kerja memperbaiki CV, portofolio, dan persiapan wawancara.' },
    { title: 'Newsletter Berbayar', category: 'digital', icon: '📰', description: 'Kurasi wawasan industri tertentu dan bangun pendapatan dari pelanggan loyal.' },
    { title: 'Event Komunitas', category: 'jasa', icon: '🎤', description: 'Selenggarakan workshop atau networking untuk niche profesional tertentu.' }
];

let storefrontProducts = [];

let cart = JSON.parse(localStorage.getItem('kaelCart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('kaelWishlist') || '[]');

function saveCartState() {
    localStorage.setItem('kaelCart', JSON.stringify(cart));
    updateCartBadge();
    renderCartDrawer();
}

function saveWishlistState() {
    localStorage.setItem('kaelWishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
}

function updateCartBadge() {
    const cartCount = document.getElementById('cartCount');
    const floatingCartCount = document.getElementById('floatingCartCount');
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = itemCount;
    }
    if (floatingCartCount) {
        floatingCartCount.textContent = itemCount;
    }
}

function updateWishlistBadge() {
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}

function addToCart(productId) {
    const product = storefrontProducts.find(item => item.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCartState();
    toggleCartDrawer(true);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartState();
}

function toggleCartDrawer(forceOpen = false) {
    const drawer = document.getElementById('cartDrawer');
    if (!drawer) return;

    const shouldOpen = forceOpen || !drawer.classList.contains('open');
    drawer.classList.toggle('open', shouldOpen);
    renderCartDrawer();
}

function renderCartDrawer() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    if (!cartItems || !cartTotal) return;

    if (!cart.length) {
        cartItems.innerHTML = '<div class="empty-state cart-empty">Keranjang masih kosong.</div>';
        cartTotal.textContent = 'Rp 0';
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map((item) => {
        total += item.price * item.quantity;
        const safeName = escapeStorefrontHtml(item.name);
        return `
            <div class="cart-item">
                <div class="cart-item-emoji">${item.emoji}</div>
                <div class="cart-item-info">
                    <h4>${safeName}</h4>
                    <p>${item.quantity} x Rp ${(item.price).toLocaleString('id-ID')}</p>
                </div>
                <button class="remove-btn" type="button" data-id="${item.id}">Hapus</button>
            </div>
        `;
    }).join('');

    cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;

    document.querySelectorAll('.remove-btn').forEach((button) => {
        button.addEventListener('click', () => removeFromCart(Number(button.dataset.id)));
    });
}

function openCheckout() {
    if (!cart.length) {
        alert('Keranjang masih kosong. Tambahkan produk terlebih dahulu.');
        return;
    }

    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutTotal = document.getElementById('checkoutTotal');
    if (!checkoutModal || !checkoutTotal) return;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    checkoutTotal.textContent = formatRupiah(total + getShippingCost());
    checkoutModal.classList.add('open');
    checkoutModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function getShippingCost() {
    return document.getElementById('shippingMethod')?.value === 'Express' ? 15000 : 0;
}

function getPaymentRequestError(error) {
    if (window.location.protocol === 'file:' || error instanceof TypeError) {
        return 'Server pembayaran tidak terhubung. Jalankan `npm.cmd start` di folder proyek, lalu buka http://localhost:3000/storefront.html (bukan file:// atau Live Server).';
    }
    return error.message || 'Terjadi kesalahan saat membuat pesanan.';
}

function closeCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (!checkoutModal) return;

    checkoutModal.classList.remove('open');
    checkoutModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
}

async function createOrder(event) {
    event.preventDefault();
    if (!cart.length) return;

    const form = document.getElementById('checkoutForm');
    const submitButton = form?.querySelector('[type="submit"]');
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    if (!form || !paymentMethod) return;

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Memproses pesanan...';
    }

    try {
        const session = JSON.parse(localStorage.getItem('kaelstore-session') || 'null');
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer: {
                    name: document.getElementById('checkoutName').value.trim(),
                    phone: document.getElementById('checkoutPhone').value.trim(),
                    address: document.getElementById('checkoutAddress').value.trim()
                },
                shipping: document.getElementById('shippingMethod').value,
                paymentMethod,
                items: cart.map(item => ({ id: item.id, quantity: item.quantity }))
            })
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Pesanan tidak dapat diproses.');
        }

        localStorage.setItem('kaelLastOrder', JSON.stringify(result.order));
        cart = [];
        saveCartState();
        if (result.redirectUrl) {
            window.location.assign(result.redirectUrl);
            return;
        }

        closeCheckout();

        const orderModal = document.getElementById('orderModal');
        const orderNumber = document.getElementById('orderNumber');
        const paymentStatus = document.getElementById('paymentStatus');
        if (orderNumber) orderNumber.textContent = `Nomor pesanan ${result.order.id} · COD`;
        if (paymentStatus) paymentStatus.textContent = 'Bayar saat pesanan diterima';
        if (orderModal) {
            orderModal.classList.add('open');
            orderModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
        }
    } catch (error) {
        alert(getPaymentRequestError(error));
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Buat Pesanan';
        }
    }
}

function closeOrder() {
    const orderModal = document.getElementById('orderModal');
    if (!orderModal) return;

    orderModal.classList.remove('open');
    orderModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
}

function toggleWishlist(productId) {
    const exists = wishlist.includes(productId);

    if (exists) {
        wishlist = wishlist.filter(id => id !== productId);
    } else {
        wishlist.push(productId);
    }

    saveWishlistState();
    renderStorefrontProducts(document.querySelector('.store-nav-item.active')?.dataset.filter || 'all', document.getElementById('productSearch')?.value || '');
}

function attachProductActions() {
    document.querySelectorAll('.add-cart-btn').forEach((button) => {
        button.addEventListener('click', () => addToCart(Number(button.dataset.id)));
    });

    document.querySelectorAll('.favorite-btn').forEach((button) => {
        button.addEventListener('click', () => toggleWishlist(Number(button.dataset.id)));
    });
}

const descriptionTemplates = [
    '{bizName} adalah platform inovatif di bidang {bizType} yang dirancang untuk {benefit1}. Dengan teknologi terkini dan user interface yang intuitif, kami membuat {benefit2} menjadi lebih mudah dan efisien.',
    '{bizName} menghadirkan solusi revolusioner dalam industri {bizType}. Kami berkomitmen untuk {benefit1} sambil memberikan pengalaman terbaik kepada setiap pengguna dalam {benefit2}.',
    'Bergabunglah dengan {bizName}, pelopor dalam {bizType} yang telah membantu ribuan pengguna untuk {benefit1}. Platform kami menawarkan {benefit2} dengan fitur-fitur canggih dan dukungan pelanggan 24/7.',
    '{bizName} adalah solusi terpercaya untuk kebutuhan {bizType} Anda. Kami mengintegrasikan teknologi AI dan machine learning untuk memberikan pengalaman {benefit1} yang personal dan {benefit2} yang maksimal.'
];

const benefits = [
    'mencapai kesuksesan bisnis digital',
    'mengoptimalkan pertumbuhan bisnis',
    'meningkatkan efisiensi operasional',
    'mengembangkan skill digital',
    'membangun brand yang kuat',
    'menjangkau pasar lebih luas',
    'menghemat biaya operasional',
    'meningkatkan engagement pelanggan'
];

const chatbotResponses = {
    greeting: [
        'Halo! 👋 Ada yang bisa saya bantu tentang ide bisnis digital?',
        'Selamat datang! 😊 Saya siap membantu Anda menemukan ide bisnis yang sempurna.',
        'Hi there! 🚀 Ingin tahu lebih banyak tentang peluang bisnis digital?'
    ],
    ideas: [
        'Ada 6 kategori bisnis digital populer: E-Commerce, Aplikasi Mobile, Edukasi Digital, SaaS, Konten Kreatif, dan Digital Service. Manakah yang menarik Anda?',
        'Ide bisnis digital bisa dimulai dari passion Anda! Apakah Anda lebih tertarik ke teknologi, marketing, creative, atau bidang lain?'
    ],
    modal: [
        'Modal yang diperlukan tergantung jenis bisnis. Freelancing bisa dimulai dengan 0, dropshipping butuh 1-10 juta, aplikasi mungkin butuh lebih besar untuk marketing.',
        'Untuk bisnis digital, Anda bisa mulai dengan modal minimal asalkan punya koneksi internet dan skills. Fokus pada marketing dan customer acquisition!'
    ],
    profit: [
        'Profitabilitas tergantung bisnis model. Freelancing profit langsung, course/produk digital bisa passive income, SaaS membutuhkan user base besar.',
        'Rata-rata startup digital butuh 6-12 bulan untuk break even. Kunci sukses adalah customer acquisition cost yang rendah dan retention yang tinggi.'
    ],
    tips: [
        'Tips sukses bisnis digital: 1) Validasi ide dulu dengan customer, 2) Start small dan iterate, 3) Focus pada marketing, 4) Build community, 5) Analyze metrics.',
        'Jangan lupa: riset market dulu, understand your competition, build unique value proposition, dan selalu dengarkan feedback customer!'
    ],
    default: [
        'Menarik! 🤔 Bisa jelaskan lebih detail tentang apa yang Anda maksud?',
        'Saya kurang paham maksud Anda. Coba tanya tentang ide bisnis, modal, profit, atau tips sukses? 💡'
    ]
};

function getRandomResponse(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function renderBusinessIdeas(category = 'all') {
    const grid = document.getElementById('businessCatalogGrid');
    if (!grid) return;

    const visibleIdeas = category === 'all' ? businessIdeas : businessIdeas.filter(idea => idea.category === category);
    grid.innerHTML = visibleIdeas.map(idea => `
        <article class="business-idea-card">
            <div class="business-idea-icon">${idea.icon}</div>
            <div>
                <span class="business-idea-category">${idea.category}</span>
                <h3>${idea.title}</h3>
                <p>${idea.description}</p>
            </div>
        </article>
    `).join('');
}

function formatRupiah(value) {
    return `Rp ${Math.round(value).toLocaleString('id-ID')}`;
}

function calculateSalary(event) {
    event.preventDefault();
    const amount = Number(document.getElementById('salaryAmount').value);
    const type = document.getElementById('salaryType').value;
    const region = document.getElementById('salaryRegion').value;
    const taxRates = { jawa: 0.05, sumatera: 0.04, kalimantan: 0.03, papua: 0.02 };
    const taxRate = taxRates[region] || 0.05;
    const grossIncome = type === 'gross' ? amount : amount / (1 - taxRate);
    const tax = type === 'gross' ? grossIncome * taxRate : grossIncome - amount;
    const netIncome = grossIncome - tax;
    const allocations = [
        ['Kebutuhan hidup utama', 40],
        ['Cicilan atau utang aktif', 30],
        ['Tabungan', 20],
        ['Dana darurat', 10]
    ];
    const result = document.getElementById('salaryResult');
    result.innerHTML = `
        <div class="salary-summary">
            <p>Pendapatan kotor <strong>${formatRupiah(grossIncome)}</strong></p>
            <p>Estimasi pajak (${taxRate * 100}%) <strong>${formatRupiah(tax)}</strong></p>
            <p class="salary-net">Pendapatan bersih <strong>${formatRupiah(netIncome)}</strong></p>
        </div>
        <div class="allocation-list">
            ${allocations.map(([label, percentage]) => `
                <div class="allocation-row">
                    <span>${label} <b>${percentage}%</b></span>
                    <strong>${formatRupiah(netIncome * percentage / 100)}</strong>
                </div>
            `).join('')}
        </div>
        <p class="calculator-note">Pembagian menggunakan pendapatan bersih: 40% kebutuhan utama, 30% cicilan/utang, 20% tabungan, dan 10% dana darurat.</p>
    `;
}

function toggleChatbot() {
    const chatbotContent = document.getElementById('chatbotContent');
    const toggle = document.querySelector('.chatbot-toggle');

    if (!chatbotContent || !toggle) return;

    if (chatbotContent.classList.contains('hidden')) {
        chatbotContent.classList.remove('hidden');
        toggle.textContent = '−';
    } else {
        chatbotContent.classList.add('hidden');
        toggle.textContent = '+';
    }
}

function addChatMessage(message, type) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getAIChatResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('halo') || lowerMessage.includes('hai') || lowerMessage.includes('hello')) {
        return getRandomResponse(chatbotResponses.greeting);
    }
    if (lowerMessage.includes('ide') || lowerMessage.includes('bisnis') || lowerMessage.includes('kategori')) {
        return getRandomResponse(chatbotResponses.ideas);
    }
    if (lowerMessage.includes('modal') || lowerMessage.includes('berapa') || lowerMessage.includes('biaya')) {
        return getRandomResponse(chatbotResponses.modal);
    }
    if (lowerMessage.includes('profit') || lowerMessage.includes('untung') || lowerMessage.includes('income')) {
        return getRandomResponse(chatbotResponses.profit);
    }
    if (lowerMessage.includes('tips') || lowerMessage.includes('cara') || lowerMessage.includes('bagaimana')) {
        return getRandomResponse(chatbotResponses.tips);
    }
    return getRandomResponse(chatbotResponses.default);
}

function handleChatKey(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;

    const message = input.value.trim();
    if (!message) return;

    addChatMessage(message, 'user-message');
    input.value = '';

    setTimeout(() => {
        const response = getAIChatResponse(message);
        addChatMessage(response, 'ai-message');
    }, 500);
}

function getAIRecommendation() {
    const modal = document.getElementById('modal')?.value;
    const skill = document.getElementById('skill')?.value;
    const time = document.getElementById('time')?.value;

    if (!modal || !skill || !time) {
        alert('⚠️ Silakan lengkapi semua field terlebih dahulu!');
        return;
    }

    const recommendation = recommendations[modal]?.[skill];
    const resultDiv = document.getElementById('aiResult');
    const recommendationText = document.getElementById('recommendationText');

    if (!recommendation || !resultDiv || !recommendationText) return;

    recommendationText.innerHTML = `
        <h4>📊 ${recommendation.title}</h4>
        <p>${recommendation.description}</p>
        <p style="margin-top: 15px; font-size: 0.9em; color: #667eea;"><strong>💡 Tips:</strong> Mulai dengan research, validate dengan target customer, dan launch MVP sesegera mungkin!</p>
    `;

    document.getElementById('aiForm').style.display = 'none';
    resultDiv.style.display = 'block';
}

function closeRecommendation() {
    const aiForm = document.getElementById('aiForm');
    const aiResult = document.getElementById('aiResult');
    const modalEl = document.getElementById('modal');
    const skillEl = document.getElementById('skill');
    const timeEl = document.getElementById('time');

    if (aiForm) aiForm.style.display = 'block';
    if (aiResult) aiResult.style.display = 'none';
    if (modalEl) modalEl.value = '';
    if (skillEl) skillEl.value = '';
    if (timeEl) timeEl.value = '';
}

function generateDescription() {
    const bizName = document.getElementById('bizName')?.value.trim();
    const bizType = document.getElementById('bizType')?.value.trim();

    if (!bizName || !bizType) {
        alert('⚠️ Silakan isi nama bisnis dan tipe bisnis terlebih dahulu!');
        return;
    }

    const template = descriptionTemplates[Math.floor(Math.random() * descriptionTemplates.length)];
    const benefit1 = benefits[Math.floor(Math.random() * benefits.length)];
    const benefit2 = benefits[Math.floor(Math.random() * benefits.length)];

    const description = template
        .replace('{bizName}', bizName)
        .replace('{bizType}', bizType)
        .replace('{benefit1}', benefit1)
        .replace('{benefit2}', benefit2);

    const generatedText = document.getElementById('generatedText');
    const generatorResult = document.getElementById('generatorResult');
    const generatorForm = document.querySelector('.generator-form');

    if (generatedText) generatedText.textContent = description;
    if (generatorResult) generatorResult.style.display = 'block';
    if (generatorForm) generatorForm.style.display = 'none';
}

function copyToClipboard() {
    const text = document.getElementById('generatedText')?.textContent;
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Deskripsi berhasil dicopy ke clipboard!');
    });
}

function initializeBusinessGame() {
    const coinsEl = document.getElementById('gameCoins');
    const levelEl = document.getElementById('gameLevel');
    const targetEl = document.getElementById('gameTarget');
    const powerEl = document.getElementById('gamePower');
    const actionBtn = document.getElementById('gameActionBtn');
    const gameLog = document.getElementById('gameLog');
    const resetBtn = document.getElementById('gameResetBtn');
    const upgradeButtons = document.querySelectorAll('.upgrade-btn');

    if (!coinsEl || !levelEl || !targetEl || !powerEl || !actionBtn || !gameLog || !resetBtn) return;

    const gameState = {
        coins: 0,
        level: 1,
        target: 100,
        power: 1,
        upgrades: {
            ads: 0,
            team: 0,
            automation: 0
        }
    };

    const upgradeCost = {
        ads: 25,
        team: 60,
        automation: 120
    };

    const updateGameUI = () => {
        coinsEl.textContent = Math.floor(gameState.coins);
        levelEl.textContent = gameState.level;
        targetEl.textContent = gameState.target;
        powerEl.textContent = gameState.power;
    };

    const setLog = (message) => {
        gameLog.textContent = message;
    };

    const levelUp = () => {
        if (gameState.coins >= gameState.target) {
            gameState.coins -= gameState.target;
            gameState.level += 1;
            gameState.target = Math.round(gameState.target * 1.8);
            gameState.power += 1;
            setLog(`🎉 Level naik! Bisnismu sekarang ada di level ${gameState.level}. Bonus power +1.`);
            updateGameUI();
        }
    };

    actionBtn.addEventListener('click', () => {
        const gain = gameState.power + Math.floor(Math.random() * 4);
        gameState.coins += gain;
        const message = `✅ Kamu berhasil menjual produk! +${gain} rupiah dari penjualan hari ini.`;
        setLog(message);
        levelUp();
        updateGameUI();
    });

    upgradeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const upgrade = button.dataset.upgrade;
            const cost = upgradeCost[upgrade];
            if (!upgrade || !cost) return;

            if (gameState.coins < cost) {
                setLog(`⚠️ Uangmu belum cukup. Butuh Rp ${cost} untuk upgrade ${upgrade}.`);
                return;
            }

            gameState.coins -= cost;
            gameState.upgrades[upgrade] += 1;

            if (upgrade === 'ads') gameState.power += 2;
            if (upgrade === 'team') gameState.power += 3;
            if (upgrade === 'automation') gameState.power += 5;

            setLog(`🚀 Upgrade ${upgrade} aktif! Power klikmu bertambah.`);
            updateGameUI();
        });
    });

    resetBtn.addEventListener('click', () => {
        gameState.coins = 0;
        gameState.level = 1;
        gameState.target = 100;
        gameState.power = 1;
        gameState.upgrades = { ads: 0, team: 0, automation: 0 };
        setLog('🔄 Game direset. Bisnis baru siap dibangun kembali!');
        updateGameUI();
    });

    updateGameUI();
}

function initializeAdvancedBusinessGame() {
    const cube = document.getElementById('businessCube');
    const coinsEl = document.getElementById('gameCoins');
    const levelEl = document.getElementById('gameLevel');
    const targetEl = document.getElementById('gameTarget');
    const powerEl = document.getElementById('gamePower');
    const actionBtn = document.getElementById('gameActionBtn');
    const gameLog = document.getElementById('gameLog');
    const saveBtn = document.getElementById('saveGameBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    const marketMeterFill = document.getElementById('marketMeterFill');
    const marketDemandValue = document.getElementById('marketDemandValue');
    const gameStatus = document.getElementById('gameStatus');
    const upgradeButtons = document.querySelectorAll('.upgrade-btn');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const modePanels = document.querySelectorAll('.game-mode-panel');
    const leaderboardList = document.getElementById('leaderboardList');
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const quizQuestion = document.getElementById('quizQuestion');
    const quizChoices = document.getElementById('quizChoices');
    const nextQuizBtn = document.getElementById('nextQuizBtn');
    const quizScore = document.getElementById('quizScore');
    const battleActionBtn = document.getElementById('battleActionBtn');
    const playerBattleBar = document.getElementById('playerBattleBar');
    const rivalBattleBar = document.getElementById('rivalBattleBar');
    const playerBattleScore = document.getElementById('playerBattleScore');
    const rivalBattleScore = document.getElementById('rivalBattleScore');
    const countdownTimer = document.getElementById('countdownTimer');
    const playerNameInput = document.getElementById('playerNameInput');
    const countdownBox = countdownTimer?.closest('.countdown-box');
    const supermarketMap = document.getElementById('supermarketMap');
    const simCustomerText = document.getElementById('simCustomerText');
    const simServed = document.getElementById('simServed');
    const simInventory = document.getElementById('simInventory');
    const simInteractBtn = document.getElementById('simInteractBtn');
    const simProductButtons = document.querySelectorAll('.sim-product-btn');
    const simMoveButtons = document.querySelectorAll('.sim-dpad [data-move]');
    const simLog = document.getElementById('simLog');

    if (!cube || !coinsEl || !levelEl || !targetEl || !powerEl || !actionBtn || !gameLog || !saveBtn || !newGameBtn || !marketMeterFill || !marketDemandValue || !gameStatus) return;

    const storageKey = 'kaelBusinessGameSave';
    const leaderboardKey = 'kaelBusinessLeaderboard';
    const defaultState = {
        coins: 80,
        level: 1,
        target: 120,
        power: 1,
        demand: 35,
        rotation: 0,
        score: 0,
        timeLeft: 90,
        mode: 'builder',
        upgrades: { ads: 0, team: 0, automation: 0 },
        quiz: { index: 0, score: 0 },
        battle: { player: 0, rival: 0, target: 180, active: false },
        supermarket: {
            player: { x: 4, y: 6 },
            selectedProduct: 'snack',
            inventory: { snack: 2, drink: 2, bread: 2 },
            shelves: { snack: 1, drink: 0, bread: 0 },
            customer: { product: 'snack', phase: 'shopping' },
            served: 0,
            arrival: 0
        }
    };

    const upgradeCost = {
        ads: 25,
        team: 60,
        automation: 120
    };

    const createDefaultState = () => ({
        ...defaultState,
        upgrades: { ...defaultState.upgrades },
        quiz: { ...defaultState.quiz },
        battle: { ...defaultState.battle },
        supermarket: {
            ...defaultState.supermarket,
            player: { ...defaultState.supermarket.player },
            inventory: { ...defaultState.supermarket.inventory },
            shelves: { ...defaultState.supermarket.shelves },
            customer: { ...defaultState.supermarket.customer }
        }
    });

    const quizBank = [
        {
            question: 'Faktor utama yang harus diperiksa sebelum meluncurkan ide bisnis digital adalah?',
            options: ['Riset pasar dan feedback calon pelanggan', 'Jumlah like di media sosial', 'Warna logo favorit', 'Jumlah follower orang tua'],
            answer: 0
        },
        {
            question: 'Model bisnis paling cocok untuk produk digital yang bisa diulang adalah?',
            options: ['Subscription', 'Hanya satu kali beli', 'Menunggu pelanggan datang sendiri', 'Mengandalkan promosi tanpa produk'],
            answer: 0
        },
        {
            question: 'Apa manfaat utama strategi pemasaran digital yang terukur?',
            options: ['Meningkatkan efisiensi iklan dan sales', 'Mengurangi semua inovasi', 'Menurunkan kualitas produk', 'Menghilangkan brand'],
            answer: 0
        },
        {
            question: 'Strategi paling efektif saat memulai usaha digital dengan modal terbatas adalah?',
            options: ['Validasi ide kecil dan fokus pada satu niche', 'Langsung membeli semua fitur mahal', 'Membuat banyak produk tanpa riset', 'Hanya mengandalkan distribusi gratis tanpa target'],
            answer: 0
        },
        {
            question: 'Hal yang paling penting untuk menjaga loyalitas pelanggan adalah?',
            options: ['Layanan yang konsisten dan pengalaman user yang baik', 'Menghindari komunikasi', 'Membuat produk tanpa update', 'Menjual tanpa promosi'],
            answer: 0
        }
    ];

    const loadGameState = () => {
        try {
            const raw = localStorage.getItem(storageKey);
            const initialState = createDefaultState();
            if (!raw) return initialState;
            const saved = JSON.parse(raw);
            return {
                ...initialState,
                ...saved,
                timeLeft: saved.mode === 'builder' ? 90 : saved.timeLeft,
                coins: saved.supermarket ? saved.coins : Math.max(60, Number(saved.coins) || 0),
                upgrades: { ...initialState.upgrades, ...saved.upgrades },
                quiz: { ...initialState.quiz, ...saved.quiz },
                battle: { ...initialState.battle, ...saved.battle },
                supermarket: {
                    ...initialState.supermarket,
                    ...saved.supermarket,
                    player: { ...initialState.supermarket.player, ...saved.supermarket?.player },
                    inventory: { ...initialState.supermarket.inventory, ...saved.supermarket?.inventory },
                    shelves: { ...initialState.supermarket.shelves, ...saved.supermarket?.shelves },
                    customer: saved.supermarket?.customer || { ...initialState.supermarket.customer }
                }
            };
        } catch (error) {
            return createDefaultState();
        }
    };

    const loadLeaderboard = () => {
        try {
            const raw = localStorage.getItem(leaderboardKey);
            return raw ? JSON.parse(raw) : [];
        } catch (error) {
            return [];
        }
    };

    const persistGameState = (state) => {
        localStorage.setItem(storageKey, JSON.stringify(state));
    };

    const persistLeaderboard = (entries) => {
        localStorage.setItem(leaderboardKey, JSON.stringify(entries));
    };

    let state = loadGameState();
    if (countdownBox) countdownBox.hidden = state.mode === 'builder';
    let audioCtx = null;
    let musicInterval = null;
    let countdownInterval = null;
    let audioEnabled = true;

    const setLog = (message) => {
        gameLog.textContent = message;
        if (simLog) simLog.textContent = message;
    };

    const supermarketProducts = {
        snack: { name: 'Snack', icon: '🥫', price: 28 },
        drink: { name: 'Minuman', icon: '🥤', price: 32 },
        bread: { name: 'Roti', icon: '🍞', price: 36 }
    };
    const supermarketStations = {
        '1,1': { kind: 'depot', name: 'Gudang', icon: '📦' },
        '3,2': { kind: 'shelf', product: 'snack' },
        '3,3': { kind: 'rack', product: 'snack' },
        '5,2': { kind: 'shelf', product: 'drink' },
        '5,3': { kind: 'rack', product: 'drink' },
        '7,2': { kind: 'shelf', product: 'bread' },
        '7,3': { kind: 'rack', product: 'bread' },
        '1,5': { kind: 'cashier', name: 'Kasir', icon: '🧾' },
        '4,0': { kind: 'entrance', name: 'Masuk', icon: '🚪' }
    };
    const supermarketCells = [];
    const shopDistance = (x, y, target) => Math.abs(x - target.x) + Math.abs(y - target.y);

    const createSupermarketMap = () => {
        if (!supermarketMap || supermarketMap.children.length) return;
        for (let y = 0; y < 7; y += 1) {
            for (let x = 0; x < 9; x += 1) {
                const key = `${x},${y}`;
                const station = supermarketStations[key];
                const cell = document.createElement('div');
                cell.className = 'sim-cell';
                cell.setAttribute('role', 'gridcell');
                cell.dataset.x = x;
                cell.dataset.y = y;
                if (station) {
                    cell.classList.add(`is-${station.kind}`);
                    if (station.kind !== 'entrance') cell.classList.add('is-blocked');
                    const product = supermarketProducts[station.product];
                    const icon = product?.icon || station.icon;
                    const name = product?.name || station.name;
                    cell.innerHTML = `<span class="sim-cell-content"><span class="sim-icon">${icon}</span><span>${name}</span></span>`;
                    if (station.kind === 'shelf' || station.kind === 'rack') {
                        cell.insertAdjacentHTML('beforeend', `<span class="sim-stock-count" data-stock="${station.product}">0</span>`);
                    }
                }
                supermarketMap.appendChild(cell);
                supermarketCells.push({ cell, x, y, station });
            }
        }
    };

    const getNearbyStation = () => {
        const player = state.supermarket.player;
        return Object.entries(supermarketStations).filter(([key, station]) => {
            if (station.kind === 'rack' || station.kind === 'entrance') return false;
            const [x, y] = key.split(',').map(Number);
            return shopDistance(player.x, player.y, { x, y }) <= 1;
        }).sort(([, first], [, second]) => {
            return Number(second.product === state.supermarket.selectedProduct) - Number(first.product === state.supermarket.selectedProduct);
        })[0] || null;
    };

    const updateSupermarketUI = () => {
        if (!supermarketMap) return;
        const shop = state.supermarket;
        const player = shop.player;
        const customer = shop.customer;
        const customerPosition = customer?.phase === 'checkout' ? { x: 2, y: 5 } : { x: 4, y: 0 };

        supermarketCells.forEach(({ cell, x, y, station }) => {
            cell.classList.toggle('is-nearby', Boolean(station && station.kind !== 'rack' && shopDistance(player.x, player.y, { x, y }) <= 1));
            cell.querySelectorAll('.sim-player, .sim-customer').forEach((token) => token.remove());
            if (station?.kind === 'shelf' || station?.kind === 'rack') {
                const stock = cell.querySelector('.sim-stock-count');
                if (stock) stock.textContent = shop.shelves[station.product];
            }
            if (player.x === x && player.y === y) {
                const playerToken = document.createElement('span');
                playerToken.className = 'sim-player';
                playerToken.setAttribute('aria-label', 'Pemain');
                playerToken.textContent = '🧑‍💼';
                cell.appendChild(playerToken);
            }
            if (customer && customerPosition.x === x && customerPosition.y === y) {
                const customerToken = document.createElement('span');
                customerToken.className = 'sim-customer';
                customerToken.setAttribute('aria-label', `Pelanggan mencari ${supermarketProducts[customer.product].name}`);
                customerToken.textContent = '🧍';
                cell.appendChild(customerToken);
            }
        });

        simProductButtons.forEach((button) => button.classList.toggle('active', button.dataset.product === shop.selectedProduct));
        if (simInventory) {
            simInventory.textContent = Object.entries(supermarketProducts)
                .map(([key, product]) => `${product.name} ${shop.inventory[key]}`)
                .join(' · ');
        }
        if (simServed) simServed.textContent = `${shop.served} pelanggan`;
        if (simCustomerText) {
            if (!customer) simCustomerText.textContent = `Pelanggan berikutnya ${shop.arrival}s lagi`;
            else {
                const productName = supermarketProducts[customer.product].name;
                simCustomerText.textContent = customer.phase === 'checkout'
                    ? `Menunggu di kasir · ${productName}`
                    : `Mencari ${productName} di rak`;
            }
        }
        if (simInteractBtn) {
            const nearby = getNearbyStation()?.[1];
            if (!nearby) simInteractBtn.textContent = 'Cari interaksi';
            else if (nearby.kind === 'depot') simInteractBtn.textContent = `Ambil stok · Rp 18`;
            else if (nearby.kind === 'cashier') simInteractBtn.textContent = customer?.phase === 'checkout' ? 'Layani pelanggan' : 'Periksa kasir';
            else simInteractBtn.textContent = `Isi rak ${supermarketProducts[nearby.product].name}`;
        }
    };

    const moveShopPlayer = (direction) => {
        if (state.mode !== 'builder' || !supermarketMap) return;
        const offsets = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
        const [dx, dy] = offsets[direction] || [0, 0];
        const next = { x: state.supermarket.player.x + dx, y: state.supermarket.player.y + dy };
        const blocked = supermarketStations[`${next.x},${next.y}`];
        if (next.x < 0 || next.x > 8 || next.y < 0 || next.y > 6 || (blocked && blocked.kind !== 'entrance')) return;
        state.supermarket.player = next;
        updateSupermarketUI();
        persistGameState(state);
    };

    const interactWithSupermarket = () => {
        if (state.mode !== 'builder' || !supermarketMap) return;
        const nearby = getNearbyStation();
        if (!nearby) {
            setLog('Berjalanlah mendekati gudang, rak, atau kasir untuk berinteraksi.');
            return;
        }

        const station = nearby[1];
        const shop = state.supermarket;
        if (station.kind === 'depot') {
            if (state.coins < 18) {
                setLog('Uang belum cukup untuk membeli satu dus stok. Layani pelanggan terlebih dahulu.');
                return;
            }
            state.coins -= 18;
            shop.inventory[shop.selectedProduct] += 3;
            setLog(`Satu dus ${supermarketProducts[shop.selectedProduct].name} masuk ke inventaris. Biaya Rp 18.`);
        } else if (station.kind === 'shelf') {
            const product = station.product;
            if (shop.inventory[product] < 1) {
                setLog(`Stok ${supermarketProducts[product].name} di tangan habis. Ambil dus baru di gudang.`);
                return;
            }
            if (shop.shelves[product] >= 6) {
                setLog(`Rak ${supermarketProducts[product].name} sudah penuh.`);
                return;
            }
            shop.inventory[product] -= 1;
            shop.shelves[product] += 1;
            setLog(`${supermarketProducts[product].name} ditata di rak. Isi rak: ${shop.shelves[product]}/6.`);
        } else if (station.kind === 'cashier') {
            if (shop.customer?.phase !== 'checkout') {
                setLog('Belum ada pelanggan di antrean kasir. Pastikan barang yang dicari tersedia di rak.');
                return;
            }
            const product = supermarketProducts[shop.customer.product];
            state.coins += product.price;
            shop.served += 1;
            shop.customer = null;
            shop.arrival = 4;
            state.score = Math.max(state.score, Math.floor(state.coins));
            state.level = Math.floor(shop.served / 5) + 1;
            state.demand = Math.min(100, state.demand + 2);
            setLog(`Pembayaran ${product.name} berhasil. +Rp ${product.price}; pelanggan berikutnya segera datang.`);
            playTone(720, 0.16, 'triangle', 0.035);
        }

        updateBuilderUI();
        persistGameState(state);
    };

    const updateSupermarketCustomers = () => {
        if (!supermarketMap || state.mode !== 'builder') return;
        const shop = state.supermarket;
        if (shop.customer?.phase === 'shopping' && shop.shelves[shop.customer.product] > 0) {
            const product = supermarketProducts[shop.customer.product];
            shop.shelves[shop.customer.product] -= 1;
            shop.customer.phase = 'checkout';
            setLog(`Pelanggan mengambil ${product.name} dan menuju kasir.`);
            persistGameState(state);
        } else if (!shop.customer) {
            shop.arrival = Math.max(0, shop.arrival - 1);
            if (shop.arrival === 0) {
                const productKeys = Object.keys(supermarketProducts);
                const product = productKeys[Math.floor(Math.random() * productKeys.length)];
                shop.customer = { product, phase: 'shopping' };
                setLog(`Pelanggan baru masuk. Mereka mencari ${supermarketProducts[product].name}.`);
            }
        }
        updateSupermarketUI();
    };

    const getStatusText = () => {
        if (state.demand >= 80) return 'Demand super tinggi';
        if (state.demand >= 60) return 'Demand stabil';
        if (state.demand >= 40) return 'Demand naik';
        return 'Demand mulai tumbuh';
    };

    const updateCountdownUI = () => {
        if (countdownTimer) {
            countdownTimer.textContent = `${Math.max(0, state.timeLeft)}s`;
        }
    };

    const updateLeaderboard = () => {
        const entries = loadLeaderboard().sort((a, b) => b.score - a.score).slice(0, 5);
        if (!leaderboardList) return;
        leaderboardList.innerHTML = entries.length ? entries.map((item, index) => `
            <li><span>#${index + 1} ${item.name}</span><strong>${item.score}</strong></li>
        `).join('') : '<li><span>Belum ada skor</span><strong>0</strong></li>';
    };

    const unlockAudio = () => {
        if (!audioCtx) {
            const AudioContextCls = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextCls) return;
            audioCtx = new AudioContextCls();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    };

    const playTone = (frequency, duration = 0.18, type = 'triangle', volume = 0.05) => {
        if (!audioEnabled || !audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = frequency;
        gain.gain.value = volume;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.stop(audioCtx.currentTime + duration);
    };

    const startMusicLoop = () => {
        if (!audioEnabled || musicInterval) return;
        unlockAudio();
        const melody = [261.63, 293.66, 329.63, 349.23, 392.0, 349.23, 329.63, 293.66, 261.63, 220.0, 246.94, 293.66];
        let index = 0;
        musicInterval = setInterval(() => {
            if (!audioEnabled || !audioCtx) return;
            playTone(melody[index % melody.length], 0.28, 'sine', 0.018);
            index += 1;
        }, 500);
    };

    const stopMusicLoop = () => {
        if (musicInterval) {
            clearInterval(musicInterval);
            musicInterval = null;
        }
    };

    const startCountdown = () => {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        if (state.mode === 'builder') {
            state.timeLeft = 90;
            updateCountdownUI();
            return;
        }

        countdownInterval = setInterval(() => {
            state.timeLeft = Math.max(0, state.timeLeft - 1);
            updateCountdownUI();
            persistGameState(state);

            if (state.timeLeft <= 0) {
                clearInterval(countdownInterval);
                countdownInterval = null;
                saveScoreToLeaderboard(true);
                setLog('⏰ Waktu habis! Round berakhir. Skor Anda berhasil disimpan.');
            }
        }, 1000);
    };

    const setMode = (mode) => {
        state.mode = mode;
        if (countdownBox) countdownBox.hidden = mode === 'builder';
        modeButtons.forEach((button) => {
            button.classList.toggle('active', button.dataset.mode === mode);
        });
        modePanels.forEach((panel) => {
            panel.classList.toggle('active', panel.id === `${mode}Mode`);
        });
        updateSupermarketUI();
        if (mode === 'builder') {
            if (countdownInterval) clearInterval(countdownInterval);
            countdownInterval = null;
            state.timeLeft = 90;
            updateCountdownUI();
        } else {
            if (state.timeLeft <= 0) state.timeLeft = 90;
            startCountdown();
        }
        persistGameState(state);
    };

    const updateBuilderUI = () => {
        if (!cube || !coinsEl || !levelEl || !targetEl || !powerEl || !marketMeterFill || !marketDemandValue || !gameStatus) return;
        cube.style.transform = `rotateX(-18deg) rotateY(${state.rotation}deg)`;
        coinsEl.textContent = Math.floor(state.coins);
        levelEl.textContent = state.level;
        targetEl.textContent = state.target;
        powerEl.textContent = state.power;

        const demandPercent = Math.max(8, Math.min(100, state.demand));
        marketMeterFill.style.width = `${demandPercent}%`;
        marketDemandValue.textContent = `${demandPercent}%`;
        gameStatus.textContent = getStatusText();
        updateCountdownUI();
        updateSupermarketUI();
    };

    const updateQuizUI = () => {
        if (!quizQuestion || !quizChoices || !quizScore) return;
        const quiz = quizBank[state.quiz.index] || null;
        if (!quiz) {
            quizQuestion.textContent = 'Semua soal selesai! Skor akhir Anda: ' + state.quiz.score;
            quizChoices.innerHTML = '';
            quizScore.textContent = 'Skor: ' + state.quiz.score;
            return;
        }

        quizQuestion.textContent = quiz.question;
        quizScore.textContent = 'Skor: ' + state.quiz.score;
        quizChoices.innerHTML = quiz.options.map((option, index) => `
            <button class="quiz-choice-btn" type="button" data-index="${index}">${index + 1}. ${option}</button>
        `).join('');

        quizChoices.querySelectorAll('.quiz-choice-btn').forEach((button) => {
            button.addEventListener('click', () => {
                const selectedIndex = Number(button.dataset.index);
                const correct = selectedIndex === quiz.answer;
                if (correct) {
                    state.quiz.score += 20;
                    state.coins += 30;
                    setLog('✅ Jawaban benar! Kamu mendapat bonus Rp 30.');
                    playTone(660, 0.2, 'square', 0.04);
                } else {
                    state.coins = Math.max(0, state.coins - 10);
                    setLog(`❌ Jawaban salah. Jawaban benar: ${quiz.options[quiz.answer]}`);
                    playTone(180, 0.2, 'sawtooth', 0.03);
                }

                state.quiz.index += 1;
                persistGameState(state);
                updateQuizUI();
                updateBuilderUI();
            });
        });
    };

    const updateBattleUI = () => {
        if (!playerBattleBar || !rivalBattleBar || !playerBattleScore || !rivalBattleScore) return;
        const playerPercent = Math.min(100, (state.battle.player / state.battle.target) * 100);
        const rivalPercent = Math.min(100, (state.battle.rival / state.battle.target) * 100);
        playerBattleBar.style.width = `${playerPercent}%`;
        rivalBattleBar.style.width = `${rivalPercent}%`;
        playerBattleScore.textContent = state.battle.player;
        rivalBattleScore.textContent = state.battle.rival;
    };

    const levelUp = () => {
        if (state.coins >= state.target) {
            state.coins -= state.target;
            state.level += 1;
            state.target = Math.round(state.target * 1.8);
            state.power += 1;
            state.demand = Math.min(95, state.demand + 12);
            setLog(`🎉 Level naik! Bisnismu masuk level ${state.level}. Power +1.`);
            playTone(740, 0.25, 'triangle', 0.045);
        }
    };

    const saveScoreToLeaderboard = (silent = false) => {
        const leaderboard = loadLeaderboard();
        const name = (playerNameInput?.value || 'Player').trim() || 'Player';
        const scoreValue = Math.max(0, Math.floor(state.score || state.coins || state.quiz.score || state.battle.player));
        leaderboard.push({ name: String(name).slice(0, 18), score: scoreValue });
        leaderboard.sort((a, b) => b.score - a.score);
        persistLeaderboard(leaderboard.slice(0, 8));
        updateLeaderboard();
        if (!silent) {
            setLog('🏆 Skor berhasil disimpan ke leaderboard.');
            playTone(880, 0.18, 'square', 0.04);
        }
    };

    const resetGame = () => {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        state = createDefaultState();
        localStorage.removeItem(storageKey);
        if (playerNameInput) {
            playerNameInput.value = 'Player';
        }
        if (countdownBox) countdownBox.hidden = true;
        if (quizQuestion && quizChoices) {
            updateQuizUI();
        }
        updateBuilderUI();
        updateBattleUI();
        setLog('🔄 Game baru dimulai. Bangun bisnis dari nol!');
        startCountdown();
        playTone(220, 0.25, 'triangle', 0.05);
    };

    actionBtn.addEventListener('click', () => {
        unlockAudio();
        const gain = state.power + Math.floor(Math.random() * 7) + (state.upgrades.ads * 2);
        state.coins += gain;
        state.score = Math.max(state.score, Math.floor(state.coins));
        state.rotation += 45;
        state.demand = Math.min(99, Math.max(16, state.demand + (Math.random() > 0.5 ? 10 : -4) + state.upgrades.team));
        setLog(`✅ Produk baru laris! Kamu dapat +${gain} rupiah hari ini.`);
        playTone(520, 0.15, 'square', 0.04);
        levelUp();
        updateBuilderUI();
        persistGameState(state);
    });

    upgradeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            unlockAudio();
            const upgrade = button.dataset.upgrade;
            const cost = upgradeCost[upgrade];
            if (!upgrade || typeof cost === 'undefined') return;

            if (state.coins < cost) {
                setLog(`⚠️ Modal belum cukup. Butuh Rp ${cost} untuk upgrade ${upgrade}.`);
                return;
            }

            state.coins -= cost;
            state.upgrades[upgrade] += 1;
            state.score = Math.max(state.score, Math.floor(state.coins));

            if (upgrade === 'ads') state.power += 2;
            if (upgrade === 'team') state.power += 3;
            if (upgrade === 'automation') state.power += 5;

            state.demand = Math.min(100, state.demand + 8);
            setLog(`🚀 Upgrade ${upgrade} aktif! Bisnismu makin kuat.`);
            playTone(620, 0.18, 'triangle', 0.04);
            updateBuilderUI();
            persistGameState(state);
        });
    });

    saveBtn.addEventListener('click', () => {
        unlockAudio();
        persistGameState(state);
        saveScoreToLeaderboard();
    });

    newGameBtn.addEventListener('click', () => {
        resetGame();
    });

    audioToggleBtn.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        audioToggleBtn.textContent = audioEnabled ? '🔊 Musik: ON' : '🔇 Musik: OFF';
        if (audioEnabled) {
            startMusicLoop();
            setLog('🎵 Musik diaktifkan.');
        } else {
            stopMusicLoop();
            setLog('🔇 Musik dimatikan.');
        }
    });

    modeButtons.forEach((button) => {
        button.addEventListener('click', () => setMode(button.dataset.mode));
    });

    simMoveButtons.forEach((button) => {
        button.addEventListener('click', () => moveShopPlayer(button.dataset.move));
    });

    simProductButtons.forEach((button) => {
        button.addEventListener('click', () => {
            state.supermarket.selectedProduct = button.dataset.product;
            updateSupermarketUI();
            persistGameState(state);
        });
    });

    simInteractBtn?.addEventListener('click', interactWithSupermarket);

    document.addEventListener('keydown', (event) => {
        if (state.mode !== 'builder' || !supermarketMap || event.target.closest('input, textarea, select, button')) return;
        const directions = {
            ArrowUp: 'up', w: 'up', W: 'up',
            ArrowDown: 'down', s: 'down', S: 'down',
            ArrowLeft: 'left', a: 'left', A: 'left',
            ArrowRight: 'right', d: 'right', D: 'right'
        };
        if (directions[event.key]) {
            event.preventDefault();
            moveShopPlayer(directions[event.key]);
        } else if (event.key === 'e' || event.key === 'E' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            interactWithSupermarket();
        }
    });

    nextQuizBtn.addEventListener('click', () => {
        if (state.quiz.index >= quizBank.length) {
            state.quiz.index = 0;
            state.quiz.score = 0;
        }
        updateQuizUI();
    });

    battleActionBtn.addEventListener('click', () => {
        unlockAudio();
        state.battle.player += state.power + Math.floor(Math.random() * 6);
        state.battle.rival += 2 + Math.floor(Math.random() * 8);
        setLog('⚔️ Serangan berhasil! Lanjutkan menekan untuk menang.');
        playTone(440, 0.18, 'square', 0.035);

        const target = state.battle.target;
        if (state.battle.player >= target) {
            state.coins += 80;
            state.score = Math.max(state.score, state.coins);
            setLog('🏆 Kamu menang dalam battle bisnis! Reward +Rp 80.');
            playTone(780, 0.25, 'triangle', 0.05);
            state.battle.player = 0;
            state.battle.rival = 0;
        } else if (state.battle.rival >= target) {
            state.coins = Math.max(0, state.coins - 20);
            setLog('💥 Kompetitor unggul. Coba strategi pemasaran baru.');
            playTone(220, 0.22, 'sawtooth', 0.03);
            state.battle.player = 0;
            state.battle.rival = 0;
        }

        updateBattleUI();
        updateBuilderUI();
        persistGameState(state);
    });

    if (state.mode === 'quiz') {
        setMode('quiz');
    }

    if (playerNameInput) {
        playerNameInput.addEventListener('input', () => {
            const trimmed = playerNameInput.value.trim();
            if (trimmed) {
                playerNameInput.value = trimmed.slice(0, 18);
            }
        });
    }

    createSupermarketMap();
    updateLeaderboard();
    updateBuilderUI();
    updateBattleUI();
    updateQuizUI();
    startCountdown();
    startMusicLoop();
    setInterval(updateSupermarketCustomers, 1400);
}

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('show');
    }
    document.body.style.overflow = 'auto';
}

function openRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.classList.remove('show');
    }
    document.body.style.overflow = 'auto';
}

function switchToLogin() {
    closeRegisterModal();
    setTimeout(() => openLoginModal(), 300);
}

function switchToRegister() {
    closeLoginModal();
    setTimeout(() => openRegisterModal(), 300);
}

function switchRegisterTab(tab, buttonElement = null) {
    document.querySelectorAll('.register-tab').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    const selectedTab = document.getElementById(tab + 'RegisterForm');
    if (selectedTab) selectedTab.classList.add('active');
    if (buttonElement) buttonElement.classList.add('active');
}

function setAuthState(isLoggedIn) {
    document.body.classList.toggle('logged-in', isLoggedIn);
    const storefrontView = document.getElementById('storefrontView');
    const publicApp = document.querySelector('.public-app');

    if (storefrontView) {
        storefrontView.classList.toggle('hidden', !isLoggedIn);
    }

    if (publicApp) {
        publicApp.style.display = isLoggedIn ? 'none' : 'block';
    }

    if (isLoggedIn) {
        localStorage.setItem('digistart-logged-in', 'true');
    } else {
        localStorage.removeItem('digistart-logged-in');
    }
}

function renderStorefrontProducts(filter = 'all', searchTerm = '') {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    const normalizedSearch = (searchTerm || '').trim().toLowerCase();
    const filteredProducts = storefrontProducts.filter((product) => {
        const matchesFilter = filter === 'all' || product.category === filter;
        const matchesSearch = !normalizedSearch || product.name.toLowerCase().includes(normalizedSearch) || product.seller.toLowerCase().includes(normalizedSearch) || product.badge.toLowerCase().includes(normalizedSearch);
        return matchesFilter && matchesSearch;
    });

    if (!filteredProducts.length) {
        productGrid.innerHTML = '<div class="empty-state">Produk yang Anda cari tidak tersedia saat ini.</div>';
        return;
    }

    productGrid.innerHTML = filteredProducts.map((product) => {
        const name = escapeStorefrontHtml(product.name);
        const seller = escapeStorefrontHtml(product.seller);
        const badge = escapeStorefrontHtml(product.badge);
        const category = escapeStorefrontHtml(product.category);
        const image = escapeStorefrontHtml(product.image);
        return `
        <article class="product-card" data-category="${category}">
            <button class="favorite-btn ${wishlist.includes(product.id) ? 'active' : ''}" type="button" data-id="${product.id}" aria-label="Simpan ke wishlist">
                ${wishlist.includes(product.id) ? '♥' : '♡'}
            </button>
            <div class="product-image">
                <img src="${image}" alt="${name}">
            </div>
            <div class="product-tag">${badge}</div>
            <div class="product-content">
                <div class="product-meta">
                    <span>${seller}</span>
                    <span>⭐ ${product.rating}</span>
                </div>
                <h3>${name}</h3>
                <div class="product-price-row">
                    <strong>Rp ${(product.price).toLocaleString('id-ID')}</strong>
                    <span>Rp ${(product.oldPrice).toLocaleString('id-ID')}</span>
                </div>
                <div class="product-footer-row">
                    <span class="shipping-tag">Gratis Ongkir</span>
                    <span class="stock-tag">Ready stock</span>
                </div>
                <div class="product-actions">
                    <button class="primary-btn small add-cart-btn" type="button" data-id="${product.id}">Tambah</button>
                    <button class="secondary-btn small" type="button">Beli</button>
                </div>
            </div>
        </article>
    `;
    }).join('');

    attachProductActions();
}

function escapeStorefrontHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function loginWithGoogle() {
    alert('🔍 Fitur Login Google sedang dalam pengembangan.\n\nNanti akan terhubung ke Google OAuth.');
}

function registerWithGoogle() {
    alert('🔍 Fitur Registrasi Google sedang dalam pengembangan.\n\nNanti akan terhubung ke Google OAuth.');
}

function switchAITab(tabName, buttonElement = null) {
    const tabContents = document.querySelectorAll('.ai-tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    const tabBtns = document.querySelectorAll('.ai-tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));

    const selectedTab = document.getElementById(`ai-tab-${tabName}`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    const targetBtn = buttonElement || document.querySelector(`.ai-tab-btn[data-tab="${tabName}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    renderBusinessIdeas();

    const categoryFilter = document.getElementById('businessCategoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (event) => renderBusinessIdeas(event.target.value));
    }

    const salaryForm = document.getElementById('salaryForm');
    if (salaryForm) {
        salaryForm.addEventListener('submit', calculateSalary);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail')?.value.trim();
            const password = document.getElementById('loginPassword')?.value.trim();

            if (!email || !password) {
                alert('⚠️ Silakan isi semua field!');
                return;
            }

            alert('✅ Login berhasil! Selamat datang.');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            closeLoginModal();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName')?.value.trim();
            const email = document.getElementById('registerEmail')?.value.trim();
            const phone = document.getElementById('registerPhone')?.value.trim();
            const password = document.getElementById('registerPassword')?.value.trim();

            if (!name || !email || !phone || !password) {
                alert('⚠️ Silakan isi semua field!');
                return;
            }

            localStorage.setItem('digistart-logged-in', 'true');
            alert(`✅ Registrasi berhasil!\n\nNama: ${name}\nEmail: ${email}\n\nSelamat datang di Kaelstore!`);
            registerForm.reset();
            window.location.href = 'storefront.html';
        });
    }

    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLoginModal();
            }
        });
    }

    const registerModal = document.getElementById('registerModal');
    if (registerModal) {
        registerModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeRegisterModal();
            }
        });
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    let currentSession = null;
    try {
        currentSession = JSON.parse(localStorage.getItem('kaelstore-session') || 'null');
    } catch {
        currentSession = null;
    }
    const isLoggedIn = Boolean(currentSession && ['admin', 'seller', 'buyer'].includes(currentSession.role));

    if (currentPage === 'storefront.html') {
        if (!isLoggedIn) {
            window.location.href = 'login.html';
            return;
        }

        if (!currentSession) {
            localStorage.removeItem('kaelstore-session');
            window.location.href = 'login.html';
            return;
        }

        setAuthState(true);
        updateCartBadge();
        updateWishlistBadge();
        renderCartDrawer();
        fetch('/api/products')
            .then(response => {
                if (!response.ok) throw new Error('Daftar produk tidak dapat dimuat.');
                return response.json();
            })
            .then(result => {
                storefrontProducts = result.products;
                const currentProducts = new Map(storefrontProducts.map(product => [product.id, product]));
                cart = cart.flatMap(item => {
                    const currentProduct = currentProducts.get(Number(item.id));
                    return currentProduct ? [{ ...currentProduct, quantity: item.quantity }] : [];
                });
                saveCartState();
                renderStorefrontProducts();
            })
            .catch(error => {
                const productGrid = document.getElementById('productGrid');
                if (productGrid) productGrid.innerHTML = `<div class="empty-state">${error.message}</div>`;
            });

        const cartToggle = document.getElementById('cartToggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => toggleCartDrawer());
        }

        const floatingCartBtn = document.getElementById('floatingCartBtn');
        if (floatingCartBtn) {
            floatingCartBtn.addEventListener('click', () => toggleCartDrawer(true));
        }

        const closeCartDrawer = document.getElementById('closeCartDrawer');
        if (closeCartDrawer) {
            closeCartDrawer.addEventListener('click', () => toggleCartDrawer(false));
        }

        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);

        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) checkoutForm.addEventListener('submit', createOrder);
        const shippingMethod = document.getElementById('shippingMethod');
        if (shippingMethod) {
            shippingMethod.addEventListener('change', () => {
                const checkoutTotal = document.getElementById('checkoutTotal');
                if (checkoutTotal) {
                    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                    checkoutTotal.textContent = formatRupiah(subtotal + getShippingCost());
                }
            });
        }
        if (currentSession?.role === 'admin') {
            const adminOrdersLink = document.getElementById('adminOrdersLink');
            if (adminOrdersLink) adminOrdersLink.hidden = false;
        }
        const accountLink = document.getElementById('accountLink');
        if (accountLink) accountLink.textContent = currentSession?.role === 'seller'
            ? 'Dashboard Seller'
            : currentSession?.role === 'admin' ? 'Dashboard Admin' : 'Pesanan Saya';

        const closeCheckoutButton = document.getElementById('closeCheckout');
        if (closeCheckoutButton) closeCheckoutButton.addEventListener('click', closeCheckout);

        const closeOrderButton = document.getElementById('closeOrder');
        if (closeOrderButton) closeOrderButton.addEventListener('click', closeOrder);

        document.querySelectorAll('.checkout-modal, .order-modal').forEach((modal) => {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.id === 'checkoutModal' ? closeCheckout() : closeOrder();
                }
            });
        });

        const wishlistToggle = document.getElementById('wishlistToggle');
        if (wishlistToggle) {
            wishlistToggle.addEventListener('click', () => {
                alert('Wishlist Anda berisi ' + wishlist.length + ' produk.');
            });
        }

        const sortProducts = document.getElementById('sortProducts');
        if (sortProducts) {
            sortProducts.addEventListener('change', (event) => {
                const selectedFilter = document.querySelector('.store-nav-item.active')?.dataset.filter || 'all';
                const currentProducts = [...storefrontProducts].filter((product) => {
                    const matchesFilter = selectedFilter === 'all' || product.category === selectedFilter;
                    const searchTerm = document.getElementById('productSearch')?.value || '';
                    const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.seller.toLowerCase().includes(searchTerm.toLowerCase());
                    return matchesFilter && matchesSearch;
                });

                const sortedProducts = [...currentProducts];
                const value = event.target.value;

                if (value === 'price-asc') sortedProducts.sort((a, b) => a.price - b.price);
                if (value === 'price-desc') sortedProducts.sort((a, b) => b.price - a.price);
                if (value === 'rating') sortedProducts.sort((a, b) => b.rating - a.rating);

                const productGrid = document.getElementById('productGrid');
                if (!productGrid) return;
                productGrid.innerHTML = sortedProducts.map((product) => {
                    const name = escapeStorefrontHtml(product.name);
                    const seller = escapeStorefrontHtml(product.seller);
                    const badge = escapeStorefrontHtml(product.badge);
                    const category = escapeStorefrontHtml(product.category);
                    const image = escapeStorefrontHtml(product.image);
                    return `
                    <article class="product-card" data-category="${category}">
                        <button class="favorite-btn ${wishlist.includes(product.id) ? 'active' : ''}" type="button" data-id="${product.id}" aria-label="Simpan ke wishlist">
                            ${wishlist.includes(product.id) ? '♥' : '♡'}
                        </button>
                        <div class="product-image">
                            <img src="${image}" alt="${name}">
                        </div>
                        <div class="product-tag">${badge}</div>
                        <div class="product-content">
                            <div class="product-meta">
                                <span>${seller}</span>
                                <span>⭐ ${product.rating}</span>
                            </div>
                            <h3>${name}</h3>
                            <div class="product-price-row">
                                <strong>Rp ${(product.price).toLocaleString('id-ID')}</strong>
                                <span>Rp ${(product.oldPrice).toLocaleString('id-ID')}</span>
                            </div>
                            <div class="product-footer-row">
                                <span class="shipping-tag">Gratis Ongkir</span>
                                <span class="stock-tag">Ready stock</span>
                            </div>
                            <div class="product-actions">
                                <button class="primary-btn small add-cart-btn" type="button" data-id="${product.id}">Tambah</button>
                                <button class="secondary-btn small" type="button">Beli</button>
                            </div>
                        </div>
                    </article>
                `;
                }).join('');

                attachProductActions();
            });
        }

        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                const selectedFilter = document.querySelector('.store-nav-item.active')?.dataset.filter || 'all';
                renderStorefrontProducts(selectedFilter, event.target.value);
            });
        }

        const categoryPills = document.querySelectorAll('.category-pill');
        if (categoryPills.length) {
            categoryPills.forEach((button) => {
                button.addEventListener('click', () => {
                    categoryPills.forEach((item) => item.classList.remove('active'));
                    button.classList.add('active');

                    const filter = button.dataset.filter || 'all';
                    document.querySelectorAll('.store-nav-item').forEach((navItem) => {
                        navItem.classList.toggle('active', navItem.dataset.filter === filter);
                    });

                    renderStorefrontProducts(filter, document.getElementById('productSearch')?.value || '');
                });
            });
        }

        document.querySelectorAll('.store-nav-item').forEach((button) => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.store-nav-item').forEach((item) => item.classList.remove('active'));
                button.classList.add('active');
                renderStorefrontProducts(button.dataset.filter, document.getElementById('productSearch')?.value || '');
            });
        });

        const logoutButton = document.getElementById('logoutBtn');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('kaelstore-session');
                localStorage.removeItem('digistart-logged-in');
                setAuthState(false);
                window.location.href = 'login.html';
            });
        }
        return;
    }

    if (currentPage === 'login.html') {
        if (isLoggedIn) {
            window.location.href = 'dashboard.html';
            return;
        }
    }

    if (currentPage === 'index.html' && isLoggedIn) {
        window.location.href = 'dashboard.html';
        return;
    }

    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                sendChatMessage();
            }
        });
    }

    const initialChat = document.getElementById('chatMessages');
    if (initialChat) {
        setTimeout(() => {
            addChatMessage(getRandomResponse(chatbotResponses.greeting), 'ai-message');
        }, 500);
    }

    initializeBusinessGame();
    initializeAdvancedBusinessGame();
});
