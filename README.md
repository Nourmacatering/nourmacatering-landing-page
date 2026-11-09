# Nourma Catering – Landing Page

Landing page resmi untuk **Nourma Catering**, layanan katering profesional untuk berbagai acara.

---

## Struktur Proyek

```
nourmacatering-landing-page/
├── index.html          # Halaman utama (single-page)
├── css/
│   └── style.css       # Stylesheet utama
├── js/
│   └── main.js         # JavaScript utama
├── assets/
│   └── images/         # Logo, foto menu, foto galeri, dll.
├── .gitignore
└── README.md
```

---

## Teknologi

- **HTML5** – Semantik & aksesibel
- **CSS3** – Custom properties, CSS Grid, Flexbox, responsive design
- **JavaScript (Vanilla ES6+)** – Tanpa dependensi eksternal

---

## Cara Menjalankan

Karena ini adalah static website, cukup buka `index.html` di browser:

```bash
# Dengan VS Code Live Server:
# Klik kanan index.html → "Open with Live Server"

# Atau via Python HTTP server:
python -m http.server 8000
# Buka http://localhost:8000
```

---

## Seksi Halaman

| Seksi | ID | Status |
|---|---|---|
| Navigasi | `#header` | ✅ Skeleton siap |
| Hero | `#hero` | ✅ Skeleton siap |
| Tentang Kami | `#about` | 🔧 Konten akan diisi |
| Menu | `#menu` | 🔧 Konten akan diisi |
| Layanan | `#services` | 🔧 Konten akan diisi |
| Galeri | `#gallery` | 🔧 Konten akan diisi |
| Testimoni | `#testimonials` | 🔧 Konten akan diisi |
| Kontak | `#contact` | ✅ Form skeleton siap |
| Footer | `#footer` | ✅ Skeleton siap |

---

## Pengembangan Selanjutnya

- [ ] Tambahkan logo & foto ke `assets/images/`
- [ ] Isi konten seksi About dengan teks & foto
- [ ] Tambahkan kartu menu dengan gambar dan harga
- [ ] Tambahkan kartu layanan (wedding, corporate, dll.)
- [ ] Isi galeri dengan foto kegiatan
- [ ] Tambahkan kartu testimoni klien
- [ ] Lengkapi informasi kontak (alamat, WhatsApp, Instagram)
- [ ] Integrasikan link media sosial di footer
- [ ] Optimasi SEO (Open Graph, sitemap, robots.txt)
- [ ] Optimasi performa (lazy loading gambar, minifikasi aset)

---

## Lisensi

© 2024 Nourma Catering. All rights reserved.
