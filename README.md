# Catatanku - Notes App

Aplikasi catatan modern yang dibangun dengan Web Components, Webpack, dan RESTful API.

## Fitur

- ✅ Tambah catatan baru
- ✅ Lihat daftar catatan aktif dan arsip
- ✅ Arsip/batal arsip catatan
- ✅ Hapus catatan
- ✅ Validasi form real-time
- ✅ Loading indicators
- ✅ Notifikasi interaktif
- ✅ Responsive design
- ✅ Animasi halus

## Teknologi

- **Web Components** - Custom elements untuk komponen UI
- **Webpack** - Module bundler dan development server
- **RESTful API** - Integrasi dengan Notes API Dicoding
- **SweetAlert2** - Notifikasi dan konfirmasi yang menarik
- **Animate.css** - Animasi CSS yang halus
- **Fetch API** - HTTP requests asynchronous

## Instalasi

1. Clone repository ini
2. Install dependencies:
   ```bash
   npm install
   ```

## Penggunaan

### Development

Jalankan development server:

```bash
npm run start-dev
```

Aplikasi akan tersedia di `http://localhost:9000`

### Production Build

Build aplikasi untuk production:

```bash
npm run build
```

File hasil build akan tersedia di folder `dist/`

## Struktur Project

```
src/
├── components/          # Web Components
│   ├── app-header.js
│   ├── note-form.js
│   ├── note-item.js
│   └── loading-indicator.js
├── services/           # API services
│   └── notes-api.js
├── utils/             # Utilities
│   └── notification.js
├── styles/            # CSS styles
│   └── main.css
├── index.html         # HTML template
└── app.js            # Main application
```

## API Integration

Aplikasi ini menggunakan Notes API dari Dicoding:

- Base URL: `https://notes-api.dicoding.dev/v2`
- Endpoints yang digunakan:
  - `GET /notes` - Ambil catatan aktif
  - `GET /notes/archived` - Ambil catatan arsip
  - `POST /notes` - Buat catatan baru
  - `POST /notes/{id}/archive` - Arsipkan catatan
  - `POST /notes/{id}/unarchive` - Batal arsip catatan
  - `DELETE /notes/{id}` - Hapus catatan

## Fitur Unggulan

### Loading Indicators

- Loading overlay untuk operasi yang membutuhkan waktu
- Loading indicator component untuk menampilkan status loading
- Progress indicators pada form submission

### Error Handling

- Notifikasi error yang informatif menggunakan SweetAlert2
- Fallback untuk kegagalan network requests
- Validasi form dengan feedback real-time

### Animasi

- Smooth transitions menggunakan Animate.css
- Hover effects dan micro-interactions
- Staggered animations untuk list items

### Responsive Design

- Mobile-first approach
- Flexible grid layout
- Touch-friendly interface

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License
