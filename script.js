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

// ========== SCROLL ANIMATION ==========
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chatbot with greeting
    setTimeout(() => {
        addChatMessage(getRandomResponse(chatbotResponses.greeting), 'ai-message');
    }, 500);
});

// ========== MODAL FUNCTIONS (LOGIN & REGISTER) ==========
function openLoginModal() {
    document.getElementById('loginModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function openRegisterModal() {
    document.getElementById('registerModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeRegisterModal() {
    document.getElementById('registerModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function switchToLogin() {
    closeRegisterModal();
    setTimeout(() => {
        openLoginModal();
    }, 300);
}

function switchToRegister() {
    closeLoginModal();
    setTimeout(() => {
        openRegisterModal();
    }, 300);
}

function switchRegisterTab(tab) {
    // Hide all tabs
    document.querySelectorAll('.register-tab').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tab + 'RegisterForm').classList.add('active');
    event.target.classList.add('active');
}

// Login with Google
function loginWithGoogle() {
    alert('🔍 Fitur Login Google sedang dalam pengembangan.\n\nNanti akan terhubung ke Google OAuth.');
    // Implementasi Google OAuth akan ditambahkan
}

// Register with Google
function registerWithGoogle() {
    alert('🔍 Fitur Registrasi Google sedang dalam pengembangan.\n\nNanti akan terhubung ke Google OAuth.');
    // Implementasi Google OAuth akan ditambahkan
}

// Handle login form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Validasi
            if (!email || !password) {
                alert('⚠️ Silakan isi semua field!');
                return;
            }
            
            // Simulasi login
            alert(`✅ Login berhasil!\n\nEmail/HP: ${email}\n\nSelamat datang!`);
            closeLoginModal();
            loginForm.reset();
        });
    }
    
    const phoneRegisterForm = document.getElementById('phoneRegisterForm');
    if (phoneRegisterForm) {
        phoneRegisterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const phone = document.getElementById('regPhone').value;
            const password = document.getElementById('regPassword').value;
            const passwordConfirm = document.getElementById('regPasswordConfirm').value;
            
            // Validasi
            if (!name || !phone || !password || !passwordConfirm) {
                alert('⚠️ Silakan isi semua field!');
                return;
            }
            
            if (password !== passwordConfirm) {
                alert('⚠️ Password tidak cocok!');
                return;
            }
            
            if (password.length < 8) {
                alert('⚠️ Password minimal 8 karakter!');
                return;
            }
            
            // Simulasi registrasi
            alert(`✅ Registrasi berhasil!\n\nNama: ${name}\nNomor HP: ${phone}\n\nSelamat datang di DigiStart!`);
            closeRegisterModal();
            phoneRegisterForm.reset();
        });
    }
    
    const emailRegisterForm = document.getElementById('emailRegisterForm');
    if (emailRegisterForm) {
        emailRegisterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('regNameEmail').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPasswordEmail').value;
            const passwordConfirm = document.getElementById('regPasswordEmailConfirm').value;
            
            // Validasi
            if (!name || !email || !password || !passwordConfirm) {
                alert('⚠️ Silakan isi semua field!');
                return;
            }
            
            if (password !== passwordConfirm) {
                alert('⚠️ Password tidak cocok!');
                return;
            }
            
            if (password.length < 8) {
                alert('⚠️ Password minimal 8 karakter!');
                return;
            }
            
            // Simulasi registrasi
            alert(`✅ Registrasi berhasil!\n\nNama: ${name}\nEmail: ${email}\n\nSelamat datang di DigiStart!`);
            closeRegisterModal();
            emailRegisterForm.reset();
        });
    }
});

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
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
});
