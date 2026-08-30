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

// ========== PRODUCT DATA ==========
const products = [
    {
        id: 1,
        name: "Premium Website Builder",
        category: "software",
        price: 499000,
        description: "Software untuk membuat website profesional tanpa coding",
        icon: "🌐"
    },
    {
        id: 2,
        name: "E-Commerce Template Pack",
        category: "template",
        price: 199000,
        description: "50+ template siap pakai untuk toko online Anda",
        icon: "🛒"
    },
    {
        id: 3,
        name: "Digital Marketing Masterclass",
        category: "course",
        price: 299000,
        description: "Kursus lengkap strategi marketing digital dari expert",
        icon: "📚"
    },
    {
        id: 4,
        name: "SEO Optimization Tool",
        category: "software",
        price: 349000,
        description: "Tools lengkap untuk SEO dan optimasi mesin pencari",
        icon: "🔍"
    },
    {
        id: 5,
        name: "Social Media Design Bundle",
        category: "template",
        price: 149000,
        description: "Koleksi design template untuk media sosial",
        icon: "📱"
    },
    {
        id: 6,
        name: "Copywriting Academy",
        category: "course",
        price: 249000,
        description: "Master skill copywriting untuk meningkatkan penjualan",
        icon: "✍️"
    },
    {
        id: 7,
        name: "Logo Design Service",
        category: "service",
        price: 299000,
        description: "Jasa desain logo custom dari designer profesional",
        icon: "🎨"
    },
    {
        id: 8,
        name: "Content Writing Service",
        category: "service",
        price: 199000,
        description: "Layanan penulisan konten profesional untuk bisnis Anda",
        icon: "📝"
    },
    {
        id: 9,
        name: "Mobile App Template",
        category: "template",
        price: 179000,
        description: "Template aplikasi mobile yang siap disesuaikan",
        icon: "📲"
    },
    {
        id: 10,
        name: "Analytics Dashboard Software",
        category: "software",
        price: 399000,
        description: "Platform analytics real-time untuk data bisnis",
        icon: "📊"
    },
    {
        id: 11,
        name: "Video Marketing Course",
        category: "course",
        price: 349000,
        description: "Pelajari cara membuat video marketing yang viral",
        icon: "🎬"
    },
    {
        id: 12,
        name: "Brand Strategy Consulting",
        category: "service",
        price: 499000,
        description: "Konsultasi strategis untuk membangun brand yang kuat",
        icon: "💼"
    },
    {
        id: 13,
        name: "Pupuk Organik Premium",
        category: "pertanian",
        price: 129000,
        description: "Pupuk organik berkualitas untuk pertumbuhan tanaman yang optimal",
        icon: "🌾"
    },
    {
        id: 14,
        name: "Alat Irigasi Hemat Air",
        category: "pertanian",
        price: 359000,
        description: "Sistem irigasi efisien untuk lahan pertanian dan kebun",
        icon: "🚜"
    }
];
