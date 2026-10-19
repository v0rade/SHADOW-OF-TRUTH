# 🕵️ SHADOWS OF TRUTH — 2D Detective Mystery Investigation

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://shadow-of-truth.vercel.app/)
[![Engine](https://img.shields.io/badge/Engine-Phaser_3.90-blue?style=for-the-badge&logo=phaser)](https://phaser.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-25_Passed_(Vitest)-green?style=for-the-badge&logo=vitest)](https://vitest.dev/)

> **Live Web App**: [https://shadow-of-truth.vercel.app/](https://shadow-of-truth.vercel.app/)  
> **Source Repository**: [https://github.com/v0rade/SHADOW-OF-TRUTH](https://github.com/v0rade/SHADOW-OF-TRUTH)

---

## 📖 Deskripsi Permainan (Game Overview)

**SHADOWS OF TRUTH** adalah game investigasi detektif naratif 2D bernuansa noir retro yang berjalan langsung di browser modern. Pemain berperan sebagai **Detektif Alex Morgan**, menyelidiki misteri kematian **Arthur Vance**, jurnalis investigasi senior surat kabar *Metro Herald* yang ditemukan tewas di ruang kerjanya di Riverview Apartments lantai 4.

Meskipun pejabat Balai Kota dan kepolisian setempat berusaha menutup kasus ini sebagai perampokan biasa atau bunuh diri di kamar terkunci (*locked-room suicide*), penyelidikan mendalam mengungkap konspirasi besar: gelas wiski beracun akonit, benang nilon yang digunakan pelaku untuk mengunci grendel pintu dari luar lorong, surat bunuh diri palsu bertinta langka, dan berkas skandal korupsi reklamasi pelabuhan senilai \$500.000.

Pemain harus menjelajahi TKP, mengumpulkan bukti fisik dan forensik, menginterogasi para saksi, membongkar kebohongan alibi melalui bukti tandingan (*Present Evidence*), menyusun benang merah di papan investigasi gabus (*Murder Board*), dan mengajukan dakwaan resmi di pengadilan.

---

## 🎮 Tautan Akses Langsung (Play Online)

Mainkan game langsung di browser Anda tanpa perlu install apa pun:
👉 **[https://shadow-of-truth.vercel.app/](https://shadow-of-truth.vercel.app/)**

---

## 🕹️ Panduan Kontrol (Controls Guide)

| Tombol Keyboard | Fungsi | Keterangan |
| :--- | :--- | :--- |
| **A / D** atau **Panah Kiri / Kanan** | Bergerak Kiri & Kanan | Navigasi koridor 2D side-scrolling |
| **W** / **Panah Atas (↑)** / **E** / **Klik** | Masuk Pintu / Berpindah Lokasi | Muncul ikon pintu 🚪 saat berada di dekat pintu |
| **E** / **Enter** / **Spasi** / **Klik** | Interaksi Utama | Memeriksa barang bukti atau bicara dengan saksi |
| **Tab** | Buku Catatan Detektif (*Notebook*) | Buka/tutup ringkasan kasus, bukti, profil, dan alibi |
| **B** | Papan Investigasi (*Murder Board*) | Hubungkan petunjuk dengan benang merah |
| **Spasi** | Percepat Teks Dialog | Melewatkan efek ketikan mesin tik |
| **Esc** | Menu Pengaturan / Jeda / Tutup Modal | Pengaturan volume suara, simpan & muat game |
| **Klik & Drag Mouse** | Interaksi Papan & Pemeriksaan | Pindahkan kartu bukti dan tarik koneksi benang |

---

## 🔍 Fitur-Fitur Utama (Key Features)

### 1. Eksplorasi 2D Noir (6 Lokasi Interkoneksi)
- **Morgan's Detective Agency**: Kantor awal detektif, meja kerja, mesin tik Remington, lampu kap hijau, dan jendela hujan rintik-rintik.
- **Arthur Vance's Apartment (TKP)**: Garis kapur jenazah korban, noda darah kering, grendel pintu kamar terkunci, radiator persembunyian senjata pembunuh, brankas rahasia, dan balkon luar berhujan.
- **The Metro Herald Newsroom**: Ruang redaksi surat kabar dengan suara mesin cetak bergemuruh, meja mesin tik, dan lemari arsip terkunci milik korban.
- **The Velvet Lounge (Speakeasy Bar)**: Bar bernuansa merah remang dengan lampu neon, rekaman mesin kasir audit tab, dan gang belakang tempat pembuangan botol racun.
- **Riverview Underground Parking Garage**: Tempat parkir bawah tanah dengan pilar beton bergaris hazard, tempat tercatatnya mobil mewah pelaku pada menit pembunuhan.
- **Marcus Sterling's Executive Suite**: Penthouse megah art-deco lantai 32 yang menghadap pelabuhan, kotak cerutu Kuba Bolivar langka, dan pulpen emas berpelat khusus.

### 2. Sistem Bukti & Forensik Mendalam (16 Clues)
Setiap bukti memiliki ID unik, kategori, nama, lokasi penemuan, catatan forensik laboratorium, karakter terkait, dan relevansi kasus:
- *Physical*: Gelas wiski beracun, piala elang kuningan berdarah, benang pancing monofilamen pintu, jam saku pecah (11:42 malam), abu cerutu Bolivar, pulpen emas bertinta biru merak, dan botol penetes racun akonit.
- *Documents*: Surat autopsi resmi forensik, surat bunuh diri palsu, draf investigasi skandal pelabuhan, struk register kasir bar, tiket parkir berstempel waktu, buku tamu gala amal, dan slip transfer suap \$50.000 ke rekening luar negeri (*Cayman Islands*).
- *Digital & Photographs*: Kaset rekaman rahasia diktafon korban Arthur Vance yang menunjuk langsung nama pelaku sebelum tewas.

### 3. Buku Catatan Detektif (Notebook - 6 Tab Fungsional)
- **📋 Case Summary**: Ringkasan kasus, identitas korban, catatan pengarahan, dan pelacak tujuan investigasi (*Live Objectives*).
- **🔍 Evidence**: Galeri kartu barang bukti yang sudah terkumpul lengkap dengan inspeksi detail forensik.
- **👥 Suspects**: Profil lengkap, hubungan dengan korban, motif tersembunyi, dan klaim alibi para saksi.
- **💬 Statements**: Transkrip percakapan yang dicatat otomatis selama proses interogasi.
- **⏱️ Timeline**: Urutan kronologis kejadian (20:00 - 07:30) yang membedakan fakta terverifikasi dan klaim yang terbongkar palsu.
- **💡 Hypotheses**: Kumpulan kesimpulan dan deduksi yang telah berhasil dibuktikan.

### 4. Sistem Interogasi & Bukti Tandingan (Present Evidence)
- Dialog dinamis bercabang (*branching dialogue trees*) dengan potret wajah berkarakter ekspresif.
- Tombol **`🔍 Present Evidence`** memungkinkan pemain memilih barang bukti di inventaris untuk mengonfrontasi saksi.
- **Contradiction Breakthrough**:
  - Menyodorkan *Struk Kasir Velvet Lounge* membongkar kebohongan waktu kepulangan korban oleh pemilik bar Vince Rossi.
  - Menyodorkan *Tiket Parkir Riverview Garage (11:28 - 11:58)* menghancurkan alibi pesta gala amal Anggota Dewan Marcus Sterling.
  - Menyodorkan *Kartu Pers Evelyn* membuktikan keberadaannya di tangga apartemen korban pada malam pembunuhan.

### 5. Papan Investigasi Interaktif (Murder Board & Deduction Engine)
- Papan gabus realistis di mana kartu-kartu bukti dapat digeser posisinya secara bebas.
- Klik kartu A lalu klik kartu B untuk menghubungkan benang merah:
  - *Benang Nilon + Surat Bunuh Diri Palsu* $\rightarrow$ **Rekayasa Kamar Terkunci**.
  - *Gelas Scotch + Laporan Autopsi Taksikologi* $\rightarrow$ **Pelumpuhan Racun Akonit**.
  - *Tiket Parkir + Jam Tangan Pecah (11:42)* $\rightarrow$ **Alibi Sterling Hancur Telak**.
  - *Slip Transfer Bank + Botol Racun* $\rightarrow$ **Konspirasi Suap \$50.000 Vince Rossi**.
  - *Surat Palsu + Pulpen Emas Sterling* $\rightarrow$ **Marcus Sterling Menulis Surat Palsu Sendiri**.

### 6. Tuduhan Akhir di Pengadilan (Grand Jury Indictment)
Pemain harus menetapkan 4 pilar dakwaan:
1. **Pelaku Utama (*Culprit*)**: `Councilman Marcus Sterling`
2. **Motif Kejahatan (*Motive*)**: `Silence the Harbor Scandal Exposé before morning publication`
3. **Metode Eksekusi (*Method*)**: `Aconite poisoning, blunt trauma with trophy, locked-room wire staging`
4. **Bukti Pendukung Utama (*Key Evidence*)**: Minimal 3 hingga 5 barang bukti otentik yang menguatkan dakwaan.

Sistem memberikan evaluasi independen dengan **5 Peringkat Akhir**:
- **RANK S (Master Detective)**: Skor 100/100, dakwaan sempurna, sindikat korupsi dibongkar total, Arthur Vance dikenang sebagai pahlawan jurnalistik.
- **RANK A (Conviction Secured)**: Vonis 25 tahun penjara tanpa grasi.
- **RANK B (Contested Trial)**: Sidang berlangsung alot akibat kekurangan detail bukti.
- **RANK C (Mistrial)**: Kurang bukti fisik kuat; pelaku bebas bersyarat.
- **RANK F (Botched Investigation)**: Salah menuduh orang; pembunuh sebenarnya melarikan diri ke luar negeri.

### 7. Synthesizer Musik Jazz Noir Prosedural (Web Audio API)
- Menggunakan sintesis Web Audio API murni (tanpa file MP3 eksternal, anti 404, hemat bandwidth):
  - Progresi akord jazz piano elektrik noir (Dm9, Gm9, Bbmaj7, A7#9) yang melankolis.
  - Generator efek suara hujan (*filtered pink noise*) dan gemuruh petir kejauhan.
  - Efek suara klik ketikan mesin tik, langkah kaki di lantai kayu, denting penemuan petir, dan akord dramatis saat kontradiksi pecah.
- Penggeser volume terpisah untuk Musik dan Efek Suara (SFX).

### 8. Penyimpanan Progres Otomatis (*Save / Load*)
- Menggunakan `localStorage` browser yang memvalidasi integritas data: menyimpan lokasi pemain, barang bukti, posisi kartu papan gabus, dan riwayat dialog.

---

## 📁 Arsitektur Proyek (Project Structure)

```
shadows-of-truth/
├── public/                     # Aset statis & favicon
├── src/
│   ├── main.ts                 # Bootstrap aplikasi & integrasi UI
│   ├── audio/
│   │   └── AudioManager.ts     # Web Audio API procedural jazz synth & rain
│   ├── case/
│   │   ├── CaseData.ts         # Tipe data kasus, lokasi, objektif
│   │   ├── CaseEvaluator.ts    # Evaluator dakwaan akhir & epilog cerita
│   │   ├── EvidenceData.ts     # Definisi tipe barang bukti & titik inspeksi
│   │   └── SuspectData.ts      # Definisi saksi, pohon dialog, kontradiksi
│   ├── data/case01/
│   │   ├── case.ts             # Definisi lengkap Kasus 01
│   │   ├── evidence.ts         # 16 barang bukti forensik
│   │   ├── suspects.ts         # 4 tersangka & percakapan interogasi
│   │   ├── timeline.ts         # 12 rangkaian kronologi waktu
│   │   └── deductions.ts       # 5 aturan deduksi papan benang merah
│   ├── dialogue/
│   │   └── DialogueManager.ts  # State manager interogasi & tandingan bukti
│   ├── game/
│   │   ├── Game.ts             # Konfigurasi Phaser 3 & pixel art scaling
│   │   ├── GameState.ts        # Singleton sentral penyimpan state kasus
│   │   └── SceneManager.ts     # Manajemen perpindahan scene
│   ├── investigation/
│   │   ├── DeductionEngine.ts  # Evaluator kombinasi petunjuk
│   │   ├── EvidenceManager.ts  # Manajer koleksi & pencegahan duplikasi
│   │   ├── InvestigationBoard.ts # Model data papan gabus & benang merah
│   │   ├── NotebookManager.ts  # Pengelola data 6 tab buku catatan
│   │   └── TimelineManager.ts  # Pengelola garis waktu & kontradiksi
│   ├── persistence/
│   │   └── SaveManager.ts      # Serialisasi & validasi simpan/muat lokal
│   ├── player/
│   │   ├── InteractionSystem.ts# Sistem deteksi interaksi & tombol W/E/klik
│   │   └── PlayerController.ts # Logika pergerakan karakter A/D & animasi
│   ├── scenes/
│   │   ├── AssetGenerator.ts   # Pembuat tekstur pixel-art prosedural
│   │   ├── BootScene.ts        # Inisialisasi generator tekstur
│   │   ├── CrimeScene.ts       # Scene khusus TKP apartemen
│   │   ├── LocationScene.ts    # Scene umum eksplorasi 2D
│   │   ├── MenuScene.ts        # Layar judul utama & menu mulai
│   │   └── OfficeScene.ts      # Scene kantor detektif
│   ├── styles/
│   │   └── main.css            # Desain antarmuka noir retro vintage
│   └── ui/
│       ├── AccusationUI.ts     # Antarmuka sidang dakwaan akhir & hasil skor
│       ├── DialogueUI.ts       # Kotak dialog mesin tik & drawer bukti
│       ├── EvidencePanel.ts    # Modal pemeriksaan bukti forensik
│       ├── HUD.ts              # Bar status atas layar
│       ├── InvestigationBoardUI.ts # Papan interaktif kartu geser & benang SVG
│       ├── NotebookUI.ts       # Jendela multi-tab buku catatan detektif
│       └── SettingsUI.ts       # Menu opsi volume & kontrol
├── tests/
│   └── investigation.test.ts   # 25 unit tests Vitest (100% lolos)
├── vercel.json                 # Konfigurasi deployment hosting Vercel
├── package.json
└── tsconfig.json
```

---

## 🛠️ Instalasi & Menjalankan di Komputer Lokal

Jika ingin menjalankan atau mengembangkan game ini di komputer lokal:

### 1. Kloning Repository
```bash
git clone https://github.com/v0rade/SHADOW-OF-TRUTH.git
cd SHADOW-OF-TRUTH
```

### 2. Pasang Dependencies
```bash
npm install
```

### 3. Jalankan Server Development
```bash
npm run dev
```
Buka `http://localhost:5173` di browser Anda.

### 4. Menjalankan Unit Tests (Vitest)
```bash
npm run test
```
Semua 25 pengujian unit akan dieksekusi memverifikasi koleksi bukti, percabangan dialog, pengujian alibi, evaluasi deduksi, penilaian dakwaan, dan integritas penyimpanan data.

### 5. Kompilasi Build Produksi
```bash
npm run build
```
Hasil kompilasi statis akan berada di direktori `dist/` siap di-deploy ke Vercel, Netlify, atau GitHub Pages.

---

## ⚖️ Lisensi
Dilisensikan di bawah [MIT License](LICENSE).
Dikembangkan untuk platform peramban modern dengan estetika noir klasik.
