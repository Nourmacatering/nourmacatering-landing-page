/**
 * Nourma AI Assistant — Knowledge Base
 * ─────────────────────────────────────────────────────────────────────────────
 * This file is the single source of truth for everything the AI assistant
 * is allowed to know and communicate about Nourma.
 *
 * Rules:
 *  - Never invent data. Use PLACEHOLDER where the real value is unknown.
 *  - All prices and nutritional claims must be confirmed before going live.
 *  - This file is imported by the Cloudflare Worker (Phase 2).
 *  - Update this file whenever business information changes.
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const knowledge = {

  // ─── 1. COMPANY ────────────────────────────────────────────────────────────
  company: {
    name: 'Nourma',
    fullName: 'Nourmacatering',
    tagline: 'Nourishment for every mother\'s journey.',
    description:
      'Nourma adalah layanan catering sehat dan halal yang dirancang khusus ' +
      'untuk ibu postpartum (pasca melahirkan). Nourma menyediakan hidangan ' +
      'bernutrisi, lezat, dan beragam yang diantarkan langsung ke rumah, ' +
      'sehingga ibu dapat fokus pada pemulihan dan perawatan bayi.',
    status: 'Coming Soon — Jakarta',
    launchArea: 'Jakarta Selatan',
    instagram: '@nourmacatering.id',
    instagramUrl: 'https://www.instagram.com/nourmacatering.id',
    whatsapp: 'PLACEHOLDER — tambahkan nomor WhatsApp resmi di sini',
    whatsappUrl: '#',          // Update: https://wa.me/628XXXXXXXXXX
    email: 'PLACEHOLDER — tambahkan email resmi',
    responseTime: 'Dalam 24 jam melalui Instagram DM',
  },

  // ─── 2. BRAND VALUES ───────────────────────────────────────────────────────
  brandValues: [
    {
      value: 'Praktis',
      description:
        'Memudahkan ibu mendapatkan makanan bergizi tanpa perlu menyiapkan makanan sendiri.',
    },
    {
      value: 'Personalized',
      description:
        'Menu disesuaikan dengan kondisi persalinan (normal maupun caesar), ' +
        'kebutuhan nutrisi, dan preferensi ibu.',
    },
    {
      value: 'Bervariatif',
      description:
        'Menawarkan variasi kuliner lokal dan internasional agar ibu tidak mudah bosan.',
    },
    {
      value: 'Halal',
      description:
        'Semua menu 100% halal, disiapkan di dapur higienis dengan bahan-bahan dari sumber terpercaya.',
    },
    {
      value: 'Nutritionist-Guided',
      description:
        'Menu disusun bersama ahli gizi dan memperhatikan kualitas serta keamanan pangan.',
    },
  ],

  // ─── 3. TARGET AUDIENCE ────────────────────────────────────────────────────
  targetAudience: {
    primary: {
      ageRange: '25–38 tahun',
      generation: 'Generasi Z dan Milenial',
      location: 'Jakarta Selatan',
      incomeLevel: 'Menengah ke atas',
      profiles: ['Ibu rumah tangga', 'Entrepreneur', 'Working professional'],
      motherType: 'First-time mothers maupun experienced mothers',
      characteristics: ['Modern', 'Health-conscious', 'Convenience-oriented'],
    },
    secondary: {
      description: 'Suami dengan istri yang sedang dalam masa postpartum',
    },
  },

  // ─── 4. CATERING PACKAGES ──────────────────────────────────────────────────
  packages: [
    {
      id: 'paket-10',
      name: 'Paket Harian',
      label: 'Starter',
      durationDays: 10,
      price: 'Rp 3.000.000',
      pricePerDay: 'Rp 300.000 / hari',
      features: [
        '3 chef-prepared meals per hari',
        '1 nutritious snack per hari',
        'Fresh daily delivery',
        'Gratis ongkir dalam radius 10 km',
      ],
      nutritionConsultation: false,
      personalizedMenu: false,
      premiumMenu: false,
      followUpConsultations: 0,
      idealFor: 'Ibu yang ingin mencoba layanan Nourma selama 10 hari.',
    },
    {
      id: 'paket-30',
      name: 'Paket Mingguan',
      label: 'Most Popular',
      durationDays: 30,
      price: 'Rp 8.700.000',
      pricePerDay: 'Rp 290.000 / hari',
      isFeatured: true,
      features: [
        '3 chef-prepared meals per hari',
        '1 nutritious snack per hari',
        'Fresh daily delivery',
        'Gratis ongkir dalam radius 10 km',
        '1 nutrition consultation',
      ],
      nutritionConsultation: true,
      personalizedMenu: false,
      premiumMenu: false,
      followUpConsultations: 0,
      idealFor: 'Pilihan terpopuler untuk satu bulan penuh pemulihan postpartum.',
    },
    {
      id: 'paket-40',
      name: 'Paket Personal',
      label: 'Premium',
      durationDays: 40,
      price: 'Rp 11.200.000',
      pricePerDay: 'Rp 280.000 / hari',
      features: [
        '3 chef-prepared meals per hari',
        '1 nutritious snack per hari',
        'Fresh daily delivery',
        'Personalized menu preferences',
        'Gratis ongkir dalam radius 10 km',
        'Initial nutrition consultation',
        '1 follow-up consultation',
      ],
      nutritionConsultation: true,
      personalizedMenu: true,
      premiumMenu: false,
      followUpConsultations: 1,
      idealFor:
        'Cocok untuk ibu yang ingin menu yang disesuaikan dengan kondisi ' +
        'persalinan dan kebutuhan nutrisi individual.',
    },
    {
      id: 'paket-60',
      name: 'Paket Elite',
      label: 'Elite',
      durationDays: 60,
      price: 'Rp 16.200.000',
      pricePerDay: 'Rp 270.000 / hari',
      features: [
        '3 chef-prepared meals per hari',
        '1 nutritious snack per hari',
        'Fresh daily delivery',
        'Premium rotating menu selection',
        'Personalized meal preferences',
        'Gratis ongkir dalam radius 10 km',
        'Initial + 2 follow-up consultations',
      ],
      nutritionConsultation: true,
      personalizedMenu: true,
      premiumMenu: true,
      followUpConsultations: 2,
      idealFor:
        'Paket lengkap untuk ibu yang menginginkan pendampingan nutrisi ' +
        'dan menu premium selama dua bulan pemulihan.',
    },
  ],

  // ─── 5. MENU ───────────────────────────────────────────────────────────────
  menu: {
    disclaimer:
      'Menu berikut adalah inspirasi visual dan gambaran umum. Menu aktual, ' +
      'bahan, dan informasi nutrisi perlu dikonfirmasi langsung bersama Nourma. ' +
      'Nourma tidak membuat klaim nutrisi medis.',
    structure: {
      mealsPerDay: 3,
      snacksPerDay: 1,
      mealTypes: ['Sarapan (Breakfast)', 'Makan Siang (Lunch)', 'Makan Malam (Dinner)', 'Snack'],
    },
    philosophy:
      'Rotasi menu harian yang bervariasi — terinspirasi kuliner lokal dan ' +
      'internasional — dengan memperhatikan kebutuhan nutrisi ibu postpartum.',
    inspirationItems: [
      {
        name: 'Balanced Nourish Bowl',
        mealType: 'Lunch',
        description:
          'Perpaduan protein, sayuran segar, dan karbohidrat kompleks dalam satu hidangan.',
        note: 'Inspirasi menu — bukan menu final.',
      },
      {
        name: 'Morning Vitality Plate',
        mealType: 'Breakfast',
        description: 'Sarapan bergizi untuk energi optimal di awal hari.',
        note: 'Inspirasi menu — bukan menu final.',
      },
      {
        name: 'Comforting Evening Set',
        mealType: 'Dinner',
        description: 'Makan malam hangat yang bergizi untuk menutup hari.',
        note: 'Inspirasi menu — bukan menu final.',
      },
      {
        name: 'Fresh Garden Plate',
        mealType: 'Lunch',
        description: 'Hidangan dengan sayuran segar dan warna yang menggugah selera.',
        note: 'Inspirasi menu — bukan menu final.',
      },
      {
        name: 'Comforting Daily Meal',
        mealType: 'Dinner',
        description: 'Inspirasi hidangan hangat untuk menemani waktu makan ibu.',
        note: 'Inspirasi menu — bukan menu final.',
      },
    ],
    // Real detailed menu items will be added here as they are confirmed
    confirmedItems: [],
    // Nutritional data — to be provided by nutritionist before launch
    nutritionalData: 'PLACEHOLDER — data nutrisi akan disediakan oleh ahli gizi',
  },

  // ─── 6. INGREDIENTS POLICY ─────────────────────────────────────────────────
  ingredientsPolicy: {
    halalCertified: true,
    halalNote:
      'Semua bahan bersumber dari pemasok halal. Informasi sertifikasi halal ' +
      'resmi akan dikonfirmasi sebelum peluncuran.',
    sourcingPrinciple: 'Bahan premium dipilih secara cermat dari pemasok terpercaya.',
    allergenInfo: 'PLACEHOLDER — daftar alergen akan disediakan per menu item',
    preservatives: 'PLACEHOLDER — kebijakan bahan pengawet belum dikonfirmasi',
    organic: 'PLACEHOLDER — status bahan organik belum dikonfirmasi',
  },

  // ─── 7. DELIVERY ───────────────────────────────────────────────────────────
  delivery: {
    primaryArea: 'Jakarta Selatan',
    freeDeliveryRadiusKm: 10,
    freeDeliveryNote: 'Gratis ongkir dalam radius 10 km dari Jakarta Selatan.',
    outsideAreaNote:
      'Untuk area di luar radius 10 km, silakan konfirmasi ketersediaan dan ' +
      'biaya pengiriman melalui Instagram DM @nourmacatering.id.',
    schedule: 'Fresh daily delivery — diantar segar setiap hari.',
    deliveryTime: 'PLACEHOLDER — jam pengiriman belum dikonfirmasi',
    packaging: 'PLACEHOLDER — informasi kemasan belum dikonfirmasi',
    coveredAreas: [
      'Jakarta Selatan (area utama)',
      // Add confirmed areas here
    ],
    uncoveredAreas: 'Konfirmasi via Instagram untuk area di luar Jakarta Selatan.',
  },

  // ─── 8. HOW TO ORDER ───────────────────────────────────────────────────────
  orderProcess: [
    {
      step: 1,
      title: 'DM Instagram',
      description: 'Hubungi @nourmacatering.id via Instagram Direct Message.',
    },
    {
      step: 2,
      title: 'Pilih Paket',
      description: 'Diskusikan pilihan paket, preferensi menu, dan jadwal pengiriman.',
    },
    {
      step: 3,
      title: 'Chef Siapkan',
      description: 'Tim chef profesional menyiapkan meal plan harian Anda.',
    },
    {
      step: 4,
      title: 'Terima di Rumah',
      description: 'Hidangan fresh diantar setiap hari ke rumah Ibu.',
    },
  ],

  // ─── 9. FAQ ────────────────────────────────────────────────────────────────
  faq: [
    {
      id: 'faq-halal',
      question: 'Apakah semua menu halal?',
      answer:
        'Ya — semua menu Nourma 100% halal, disiapkan di dapur higienis dengan ' +
        'bahan-bahan dari sumber terpercaya.',
    },
    {
      id: 'faq-custom-menu',
      question: 'Apakah menu bisa disesuaikan dengan kondisi kehamilan/persalinan?',
      answer:
        'Ya. Paket 40 hari dan 60 hari sudah mencakup personalisasi menu sesuai ' +
        'preferensi dan kondisi kesehatan ibu (normal maupun caesar). ' +
        'Untuk paket lain, silakan diskusikan kebutuhan khusus melalui Instagram.',
    },
    {
      id: 'faq-delivery-area',
      question: 'Di mana area pengiriman Nourma?',
      answer:
        'Area utama adalah Jakarta Selatan, dengan gratis ongkir dalam radius 10 km. ' +
        'Untuk area lain, silakan konfirmasi ketersediaan melalui Instagram DM ' +
        '@nourmacatering.id.',
    },
    {
      id: 'faq-launch',
      question: 'Kapan Nourma mulai beroperasi?',
      answer:
        'Nourma coming soon di Jakarta! Follow @nourmacatering.id untuk jadi yang ' +
        'pertama tahu dan mendapatkan penawaran early bird.',
    },
    {
      id: 'faq-nutrition',
      question: 'Apakah ada konsultasi nutrisi?',
      answer:
        'Ya. Paket 30 hari mencakup 1 sesi konsultasi nutrisi. Paket 40 hari ' +
        'mencakup konsultasi awal + 1 follow-up. Paket 60 hari mencakup konsultasi ' +
        'awal + 2 follow-up.',
    },
    {
      id: 'faq-price',
      question: 'Berapa harga paket Nourma?',
      answer:
        'Harga paket Nourma:\n' +
        '• Paket 10 Hari (Starter): Rp 3.000.000 (≈ Rp 300.000/hari)\n' +
        '• Paket 30 Hari (Most Popular): Rp 8.700.000 (≈ Rp 290.000/hari)\n' +
        '• Paket 40 Hari (Premium): Rp 11.200.000 (≈ Rp 280.000/hari)\n' +
        '• Paket 60 Hari (Elite): Rp 16.200.000 (≈ Rp 270.000/hari)\n' +
        'Semua paket termasuk gratis ongkir dalam radius 10 km dari Jakarta Selatan.',
    },
    {
      id: 'faq-contact',
      question: 'Bagaimana cara menghubungi Nourma?',
      answer:
        'Hubungi Nourma melalui Instagram DM: @nourmacatering.id. ' +
        'Kami merespons dalam 24 jam.',
    },
    {
      id: 'faq-postpartum-normal-caesar',
      question: 'Apakah ada perbedaan menu untuk persalinan normal vs caesar?',
      answer:
        'Nourma memahami bahwa kebutuhan nutrisi ibu setelah persalinan normal ' +
        'dan caesar dapat berbeda. Personalisasi menu tersedia di Paket 40 dan 60 ' +
        'hari. Untuk detail lebih lanjut, diskusikan kebutuhan Anda melalui ' +
        'Instagram @nourmacatering.id.',
    },
    {
      id: 'faq-breastfeeding',
      question: 'Apakah menu cocok untuk ibu menyusui?',
      answer:
        'Menu Nourma dirancang untuk mendukung kesehatan ibu postpartum, termasuk ' +
        'ibu yang sedang menyusui. Namun, Nourma tidak memberikan saran medis. ' +
        'Untuk kebutuhan nutrisi khusus menyusui, silakan konsultasikan dengan ' +
        'dokter atau ahli laktasi Anda. Paket dengan konsultasi nutrisi tersedia ' +
        'untuk diskusi lebih mendalam.',
    },
  ],

  // ─── 10. AI BEHAVIOR RULES ─────────────────────────────────────────────────
  aiRules: {
    language: ['Bahasa Indonesia', 'English'],
    tone: 'Warm, supportive, professional — seperti teman yang peduli',
    mustDo: [
      'Jawab pertanyaan menggunakan informasi yang terverifikasi dari knowledge base ini.',
      'Akui jika informasi tidak tersedia dan arahkan ke Instagram @nourmacatering.id.',
      'Rekomendasikan paket berdasarkan preferensi dan kebutuhan customer.',
      'Gunakan bahasa Indonesia sebagai default, kecuali customer berbicara dalam bahasa lain.',
      'Selalu tunjukkan empati dan pengertian terhadap kondisi ibu postpartum.',
      'Arahkan ke WhatsApp atau Instagram untuk pertanyaan yang sangat spesifik.',
    ],
    mustNever: [
      'Tidak boleh menginvent harga, bahan, atau klaim nutrisi yang tidak ada di knowledge base.',
      'Tidak boleh memberikan diagnosis medis atau rekomendasi pengobatan.',
      'Tidak boleh membuat janji atau komitmen yang tidak bisa dipenuhi oleh Nourma.',
      'Tidak boleh memberikan informasi negatif tentang kompetitor.',
      'Tidak boleh mengungkapkan API key, konfigurasi backend, atau informasi teknis internal.',
      'Tidak boleh menjawab pertanyaan di luar konteks layanan Nourma.',
    ],
    placeholderResponse:
      'Untuk informasi ini, silakan hubungi Nourma langsung melalui Instagram ' +
      '@nourmacatering.id agar kami bisa memberikan informasi yang paling akurat.',
    escalateToHuman:
      'Untuk pertanyaan yang lebih spesifik, kompleks, atau terkait kondisi ' +
      'kesehatan khusus, Nourma akan dengan senang hati mendiskusikannya ' +
      'langsung dengan Anda melalui Instagram @nourmacatering.id.',
  },

  // ─── 11. SYSTEM PROMPT TEMPLATE (for Gemini) ───────────────────────────────
  // This is the base system prompt that will be sent to Gemini in Phase 2.
  // Variables in {{}} will be replaced at runtime.
  systemPromptTemplate: `
Kamu adalah asisten AI Nourma, layanan catering postpartum sehat dan halal berbasis di Jakarta.

Kepribadianmu: hangat, supportif, informatif, dan profesional — seperti teman yang peduli pada kesehatan ibu.

Informasi yang kamu boleh sampaikan:
- Layanan dan konsep Nourma
- Paket catering (10, 30, 40, 60 hari) beserta harga dan fasilitas
- Inspirasi menu (bukan menu final atau klaim nutrisi)
- Area pengiriman dan kebijakan ongkir
- Cara pemesanan melalui Instagram
- FAQ umum

Batasan yang WAJIB diikuti:
- Jangan pernah membuat klaim nutrisi atau medis yang tidak terverifikasi.
- Jangan berikan diagnosis atau saran medis dalam bentuk apapun.
- Jika informasi tidak tersedia, akui dan arahkan ke Instagram @nourmacatering.id.
- Jangan ungkapkan API key, konfigurasi teknis, atau informasi internal backend.
- Jangan jawab pertanyaan di luar konteks layanan Nourma.

Bahasa: Jawab dalam Bahasa Indonesia secara default. Jika customer menggunakan Bahasa Inggris, jawab dalam Bahasa Inggris.

Panjang jawaban: Ringkas dan jelas. Hindari jawaban yang terlalu panjang.

Jika customer perlu bantuan lebih lanjut atau pertanyaannya sangat spesifik:
Arahkan ke Instagram @nourmacatering.id dengan nada ramah dan membantu.

Konteks bisnis:
{{KNOWLEDGE_BASE_SUMMARY}}
`,
};

// Export untuk digunakan oleh Cloudflare Worker
module.exports = knowledge;
