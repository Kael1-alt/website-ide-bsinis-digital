// ========== AI RECOMMENDATION DATA ==========
const recommendations = {
    minimal: {
        programming: {
            title: "Freelance Programming / Web Development",
            description: "Mulai sebagai freelancer untuk proyek kecil di platform seperti Upwork, Fiverr, atau lokal. Kembangkan portfolio sambil membangun klien tetap. Investasi minimal dengan potensi income tinggi."
        },
        marketing: {
            title: "Social Media Management / Content Creator",
            description: "Kelola media sosial untuk bisnis lokal atau mulai sebagai content creator. Butuh laptop dan internet saja. Monetisasi melalui sponsorship, affiliate, atau layanan jasa."
        },
        design: {
            title: "Graphic Design Freelance",
            description: "Tawarkan layanan desain grafis (logo, poster, banner) di platform freelance. Gunakan tools gratis seperti Canva untuk memulai. Kembangkan skill dan harga seiring waktu."
        },
        education: {
            title: "Online Tutor / Course Creator",
            description: "Ajarkan skill Anda melalui platform seperti Skillshare, Udemy, atau Zoom classes. Modal minimal dengan income pasif jika course terjual dengan baik."
        },
        finance: {
            title: "Digital Dropshipping Store",
            description: "Mulai toko online tanpa stok barang. Gunakan platform seperti Shopify atau lokal yang mendukung dropshipping. Fokus pada marketing."
        }
    },
    kecil: {
        programming: {
            title: "Aplikasi Mobile/Web SaaS",
            description: "Develop aplikasi atau software untuk memecahkan masalah spesifik. Jual dengan model subscription. Modal untuk hosting dan marketing sudah cukup."
        },
        marketing: {
            title: "Digital Marketing Agency",
            description: "Tawarkan layanan SEO, content marketing, ads management untuk bisnis lokal. Investasi untuk tools dan iklan promosi sendiri."
        },
        design: {
            title: "Design Studio / Branding Agency",
            description: "Buka jasa desain komprehensif untuk branding bisnis. Kemudian expand ke video editing, motion graphics, dll."
        },
        education: {
            title: "Online Learning Platform",
            description: "Bangun platform untuk menjual multiple courses. Investasi untuk development dan marketing awal."
        },
        finance: {
            title: "E-commerce Store (Fashion/Produk)",
            description: "Buka toko online dengan inventory sendiri. Fokus pada niche market yang spesifik untuk kompetisi lebih rendah."
        }
    },
    menengah: {
        programming: {
            title: "Software Development Company",
            description: "Buka agensi development yang kompleks dengan tim. Bidang custom development, konsultasi, maintenance kontrak jangka panjang."
        },
        marketing: {
            title: "Performance Marketing Company",
            description: "Spesialisasi dalam hasil terukur untuk e-commerce dan startup. Invest dalam tools premium dan talent terbaik."
        },
        design: {
            title: "Full-Service Creative Agency",
            description: "Agensi kreatif lengkap dengan tim designer, developer, copywriter. Serve corporate clients dengan project besar."
        },
        education: {
            title: "Boot Camp / Intensive Training",
            description: "Buat intensive training program (coding, digital marketing, design). Butuh mentor berpengalaman dan marketing budget besar."
        },
        finance: {
            title: "Multi-channel E-commerce Marketplace",
            description: "Bangun marketplace atau expand ke multiple platform. Investasi besar di inventory, logistics, customer service."
        }
    },
    besar: {
        programming: {
            title: "Tech Startup / AI Platform",
            description: "Develop innovative tech solution dengan AI/Machine Learning. Cukup capital untuk R&D, hire talent terbaik, dan market expansion."
        },
        marketing: {
            title: "Marketing Technology Company",
            description: "Develop marketing automation platform atau data analytics tool. Potential untuk venture capital funding dan exit besar."
        },
        design: {
            title: "Digital Product Company",
            description: "Develop design tools, templates, atau stock resource platform. Recurring revenue dengan customer base besar."
        },
        education: {
            title: "EdTech Platform Unicorn",
            description: "Bangun platform edukasi skala besar dengan innovative approach. Target market Indonesia yang huge dengan investasi marketing besar."
        },
        finance: {
            title: "Fintech Platform / Payment Gateway",
            description: "Develop financial technology solution. Butuh capital besar, compliance penuh, dan team expert."
        }
    }
};

const businessIdeas = [
    { title: "Toko Produk Digital", category: "digital", icon: "🛒", description: "Jual template, preset, e-book, atau aset desain dengan sistem otomatis." },
    { title: "Aplikasi SaaS Niche", category: "digital", icon: "💻", description: "Buat aplikasi berlangganan untuk menyelesaikan satu masalah spesifik bisnis." },
    { title: "Agensi Iklan Digital", category: "jasa", icon: "📣", description: "Bantu UMKM mendapatkan pelanggan lewat iklan dan strategi pemasaran yang terukur." },
    { title: "Jasa Admin Marketplace", category: "jasa", icon: "📦", description: "Kelola katalog, chat pelanggan, pesanan, dan promosi toko online." },
    { title: "Jasa Foto Produk", category: "jasa", icon: "📸", description: "Sediakan foto dan video pendek yang membuat produk lebih menarik untuk dijual." },
    { title: "Katering Sehat", category: "produk", icon: "🥗", description: "Tawarkan menu mingguan praktis untuk pekerja, keluarga, atau komunitas olahraga." },
    { title: "Produk Perawatan Alami", category: "produk", icon: "🌿", description: "Kembangkan produk perawatan dengan bahan lokal dan cerita brand yang kuat." },
    { title: "Urban Farming", category: "produk", icon: "🌱", description: "Jual sayuran segar, bibit, atau paket kebun rumah dengan layanan berlangganan." },
    { title: "Kursus Skill Kerja", category: "edukasi", icon: "🎓", description: "Buat kelas singkat tentang spreadsheet, desain, coding, atau keterampilan kerja." },
    { title: "Mentor Karier", category: "edukasi", icon: "🧭", description: "Bantu pencari kerja memperbaiki CV, portofolio, dan persiapan wawancara." },
    { title: "Newsletter Berbayar", category: "digital", icon: "📰", description: "Kurasi wawasan industri tertentu dan bangun pendapatan dari pelanggan loyal." },
    { title: "Event Komunitas", category: "jasa", icon: "🎤", description: "Selenggarakan workshop atau networking untuk niche profesional tertentu." }
];

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

document.addEventListener('DOMContentLoaded', function() {
    renderBusinessIdeas();
    const categoryFilter = document.getElementById('businessCategoryFilter');
    if (categoryFilter) categoryFilter.addEventListener('change', event => renderBusinessIdeas(event.target.value));
    const salaryForm = document.getElementById('salaryForm');
    if (salaryForm) salaryForm.addEventListener('submit', calculateSalary);
});

const storefrontProducts = [
    {
        id: 1,
        name: 'Laptop Pro 14"',
        category: 'electronics',
        price: 12990000,
        oldPrice: 14990000,
        rating: 4.9,
        reviews: 182,
        badge: 'Best Seller',
        seller: 'NovaTech',
        emoji: '💻'
    },
    {
        id: 2,
        name: 'Sneaker Urban Flex',
        category: 'fashion',
        price: 859000,
        oldPrice: 1099000,
        rating: 4.8,
        reviews: 256,
        badge: 'Trending',
        seller: 'Stride Co',
        emoji: '👟'
    },
    {
        id: 3,
        name: 'Glow Ritual Kit',
        category: 'beauty',
        price: 249000,
        oldPrice: 349000,
        rating: 4.7,
        reviews: 141,
        badge: 'Top Rated',
        seller: 'Luma Beauty',
        emoji: '🧴'
    },
    {
        id: 4,
        name: 'Smart Lamp Aura',
        category: 'home',
        price: 499000,
        oldPrice: 699000,
        rating: 4.9,
        reviews: 92,
        badge: 'New',
        seller: 'Mitra Home',
        emoji: '💡'
    },
    {
        id: 5,
        name: 'Career Boost Bundle',
        category: 'books',
        price: 199000,
        oldPrice: 329000,
        rating: 4.8,
        reviews: 210,
        badge: 'Popular',
        seller: 'SkillNest',
        emoji: '📚'
    },
    {
        id: 6,
        name: 'AirPods Max Lite',
        category: 'electronics',
        price: 2399000,
        oldPrice: 2999000,
        rating: 4.9,
        reviews: 318,
        badge: 'Limited',
        seller: 'AudioLab',
        emoji: '🎧'
    }
];

// ========== AI DESCRIPTION TEMPLATES ==========
const descriptionTemplates = [
    "{bizName} adalah platform inovatif di bidang {bizType} yang dirancang untuk {benefit1}. Dengan teknologi terkini dan user interface yang intuitif, kami membuat {benefit2} menjadi lebih mudah dan efisien.",
    "{bizName} menghadirkan solusi revolusioner dalam industri {bizType}. Kami berkomitmen untuk {benefit1} sambil memberikan pengalaman terbaik kepada setiap pengguna dalam {benefit2}.",
    "Bergabunglah dengan {bizName}, pelopor dalam {bizType} yang telah membantu ribuan pengguna untuk {benefit1}. Platform kami menawarkan {benefit2} dengan fitur-fitur canggih dan dukungan pelanggan 24/7.",
    "{bizName} adalah solusi terpercaya untuk kebutuhan {bizType} Anda. Kami mengintegrasikan teknologi AI dan machine learning untuk memberikan pengalaman {benefit1} yang personal dan {benefit2} yang maksimal."
];

const benefits = [
    "mencapai kesuksesan bisnis digital",
    "mengoptimalkan pertumbuhan bisnis",
    "meningkatkan efisiensi operasional",
    "mengembangkan skill digital",
    "membangun brand yang kuat",
    "menjangkau pasar lebih luas",
    "menghemat biaya operasional",
    "meningkatkan engagement pelanggan"
];

// ========== CHATBOT RESPONSES ==========
const chatbotResponses = {
    greeting: [
        "Halo! 👋 Ada yang bisa saya bantu tentang ide bisnis digital?",
        "Selamat datang! 😊 Saya siap membantu Anda menemukan ide bisnis yang sempurna.",
        "Hi there! 🚀 Ingin tahu lebih banyak tentang peluang bisnis digital?"
    ],
    ideas: [
        "Ada 6 kategori bisnis digital populer: E-Commerce, Aplikasi Mobile, Edukasi Digital, SaaS, Konten Kreatif, dan Digital Service. Manakah yang menarik Anda?",
        "Ide bisnis digital bisa dimulai dari passion Anda! Apakah Anda lebih tertarik ke teknologi, marketing, creative, atau bidang lain?"
    ],
    modal: [
        "Modal yang diperlukan tergantung jenis bisnis. Freelancing bisa dimulai dengan 0, dropshipping butuh 1-10 juta, aplikasi mungkin butuh lebih besar untuk marketing.",
        "Untuk bisnis digital, Anda bisa mulai dengan modal minimal asalkan punya koneksi internet dan skills. Fokus pada marketing dan customer acquisition!"
    ],
    profit: [
        "Profitabilitas tergantung bisnis model. Freelancing profit langsung, course/produk digital bisa passive income, SaaS membutuhkan user base besar.",
        "Rata-rata startup digital butuh 6-12 bulan untuk break even. Kunci sukses adalah customer acquisition cost yang rendah dan retention yang tinggi."
    ],
    tips: [
        "Tips sukses bisnis digital: 1) Validasi ide dulu dengan customer, 2) Start small dan iterate, 3) Focus pada marketing, 4) Build community, 5) Analyze metrics.",
        "Jangan lupa: riset market dulu, understand your competition, build unique value proposition, dan selalu dengarkan feedback customer!"
    ],
    default: [
        "Menarik! 🤔 Bisa jelaskan lebih detail tentang apa yang Anda maksud?",
        "Saya kurang paham maksud Anda. Coba tanya tentang ide bisnis, modal, profit, atau tips sukses? 💡"
    ]
};

// ========== TOGGLE CHATBOT ==========
function toggleChatbot() {
    const chatbotContent = document.getElementById('chatbotContent');
    const toggle = document.querySelector('.chatbot-toggle');
    
    if (chatbotContent.classList.contains('hidden')) {
        chatbotContent.classList.remove('hidden');
        toggle.textContent = '−';
    } else {
        chatbotContent.classList.add('hidden');
        toggle.textContent = '+';
    }
}

// ========== SEND CHAT MESSAGE ==========
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addChatMessage(message, 'user-message');
    input.value = '';
    
    // Get AI response
    setTimeout(() => {
        const response = getAIChatResponse(message);
        addChatMessage(response, 'ai-message');
    }, 500);
}

function handleChatKey(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
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
    } else if (lowerMessage.includes('ide') || lowerMessage.includes('bisnis') || lowerMessage.includes('kategori')) {
        return getRandomResponse(chatbotResponses.ideas);
    } else if (lowerMessage.includes('modal') || lowerMessage.includes('berapa') || lowerMessage.includes('biaya')) {
        return getRandomResponse(chatbotResponses.modal);
    } else if (lowerMessage.includes('profit') || lowerMessage.includes('untung') || lowerMessage.includes('income')) {
        return getRandomResponse(chatbotResponses.profit);
    } else if (lowerMessage.includes('tips') || lowerMessage.includes('cara') || lowerMessage.includes('bagaimana')) {
        return getRandomResponse(chatbotResponses.tips);
    } else {
        return getRandomResponse(chatbotResponses.default);
    }
}

function getRandomResponse(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// ========== AI RECOMMENDATION ==========
function getAIRecommendation() {
    const modal = document.getElementById('modal').value;
    const skill = document.getElementById('skill').value;
    const time = document.getElementById('time').value;
    
    if (!modal || !skill || !time) {
        alert('⚠️ Silakan lengkapi semua field terlebih dahulu!');
        return;
    }
    
    const recommendation = recommendations[modal][skill];
    
    const resultDiv = document.getElementById('aiResult');
    const recommendationText = document.getElementById('recommendationText');
    
    recommendationText.innerHTML = `
        <h4>📊 ${recommendation.title}</h4>
        <p>${recommendation.description}</p>
        <p style="margin-top: 15px; font-size: 0.9em; color: #667eea;"><strong>💡 Tips:</strong> Mulai dengan research, validate dengan target customer, dan launch MVP sesegera mungkin!</p>
    `;
    
    document.getElementById('aiForm').style.display = 'none';
    resultDiv.style.display = 'block';
}

function closeRecommendation() {
    document.getElementById('aiForm').style.display = 'block';
    document.getElementById('aiResult').style.display = 'none';
    document.getElementById('modal').value = '';
    document.getElementById('skill').value = '';
    document.getElementById('time').value = '';
}

// ========== AI TEXT GENERATOR ==========
function generateDescription() {
    const bizName = document.getElementById('bizName').value.trim();
    const bizType = document.getElementById('bizType').value.trim();
    
    if (!bizName || !bizType) {
        alert('⚠️ Silakan isi nama bisnis dan tipe bisnis terlebih dahulu!');
        return;
    }
    
    // Get random template and benefits
    const template = descriptionTemplates[Math.floor(Math.random() * descriptionTemplates.length)];
    const benefit1 = benefits[Math.floor(Math.random() * benefits.length)];
    const benefit2 = benefits[Math.floor(Math.random() * benefits.length)];
    
    let description = template
        .replace('{bizName}', bizName)
        .replace('{bizType}', bizType)
        .replace('{benefit1}', benefit1)
        .replace('{benefit2}', benefit2);
    
    document.getElementById('generatedText').textContent = description;
    document.getElementById('generatorResult').style.display = 'block';
    document.querySelector('.generator-form').style.display = 'none';
}

function copyToClipboard() {
    const text = document.getElementById('generatedText').textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ Deskripsi berhasil dicopy ke clipboard!');
    });
}

// ========== MODAL FUNCTIONS (LOGIN & REGISTER) ==========
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
    const publicApp = document.getElementById('publicApp');

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
        const matchesSearch = !normalizedSearch || product.name.toLowerCase().includes(normalizedSearch) || product.seller.toLowerCase().includes(normalizedSearch);
        return matchesFilter && matchesSearch;
    });

    if (!filteredProducts.length) {
        productGrid.innerHTML = '<div class="empty-state">Produk yang Anda cari tidak tersedia saat ini.</div>';
        return;
    }

    productGrid.innerHTML = filteredProducts.map((product) => `
        <article class="product-card" data-category="${product.category}">
            <div class="product-image">${product.emoji}</div>
            <div class="product-tag">${product.badge}</div>
            <div class="product-content">
                <div class="product-meta">
                    <span>${product.seller}</span>
                    <span>⭐ ${product.rating}</span>
                </div>
                <h3>${product.name}</h3>
                <div class="product-price-row">
                    <strong>Rp ${(product.price).toLocaleString('id-ID')}</strong>
                    <span>Rp ${(product.oldPrice).toLocaleString('id-ID')}</span>
                </div>
                <div class="product-actions">
                    <button class="primary-btn small" type="button">Tambah</button>
                    <button class="secondary-btn small" type="button">Beli</button>
                </div>
            </div>
        </article>
    `).join('');
}

function loginWithGoogle() {
    alert('🔍 Fitur Login Google sedang dalam pengembangan.\n\nNanti akan terhubung ke Google OAuth.');
}

function registerWithGoogle() {
    alert('🔍 Fitur Registrasi Google sedang dalam pengembangan.\n\nNanti akan terhubung ke Google OAuth.');
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
   const currentPage = window.location.pathname.split('/').pop() || 'index.html';
   const isLoggedIn = localStorage.getItem('digistart-logged-in') === 'true';

   if (currentPage === 'storefront.html') {
       if (!isLoggedIn) {
           window.location.href = 'index.html';
           return;
       }

       setAuthState(true);
       renderStorefrontProducts();

       const searchInput = document.getElementById('productSearch');
       if (searchInput) {
           searchInput.addEventListener('input', (event) => {
               const selectedFilter = document.querySelector('.store-nav-item.active')?.dataset.filter || 'all';
               renderStorefrontProducts(selectedFilter, event.target.value);
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
               localStorage.removeItem('digistart-logged-in');
               setAuthState(false);
               window.location.href = 'index.html';
           });
       }

       return;
   }

   if (currentPage === 'login.html') {
       if (isLoggedIn) {
           window.location.href = 'storefront.html';
           return;
       }
   }

   if (currentPage === 'index.html' && isLoggedIn) {
       window.location.href = 'storefront.html';
       return;
   }

   const loginForm = document.getElementById('loginForm');
   if (loginForm) {
       loginForm.addEventListener('submit', function(e) {
           e.preventDefault();
           const email = document.getElementById('loginEmail').value.trim();
           const password = document.getElementById('loginPassword').value.trim();

           if (!email || !password) {
               alert('⚠️ Silakan isi semua field!');
               return;
           }

           localStorage.setItem('digistart-logged-in', 'true');
           alert(`✅ Login berhasil!\n\nEmail/HP: ${email}\n\nSelamat datang!`);
           loginForm.reset();
           window.location.href = 'storefront.html';
       });
   }

   const registerForm = document.getElementById('registerForm');
   if (registerForm) {
       registerForm.addEventListener('submit', function(e) {
           e.preventDefault();
           const name = document.getElementById('registerName').value.trim();
           const email = document.getElementById('registerEmail').value.trim();
           const phone = document.getElementById('registerPhone').value.trim();
           const password = document.getElementById('registerPassword').value.trim();

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
   const registerModal = document.getElementById('registerModal');

   if (loginModal) {
       loginModal.addEventListener('click', function(e) {
           if (e.target === this) {
               closeLoginModal();
           }
       });
   }

   if (registerModal) {
       registerModal.addEventListener('click', function(e) {
           if (e.target === this) {
               closeRegisterModal();
           }
       });
   }

   setTimeout(() => {
       const chatMessages = document.getElementById('chatMessages');
       if (chatMessages && typeof addChatMessage === 'function') {
           addChatMessage(getRandomResponse(chatbotResponses.greeting), 'ai-message');
       }
   }, 500);
});
