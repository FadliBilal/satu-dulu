# SATUDULU

<p align="center">
  <strong>"Decide what matters. Do it one at a time."</strong><br>
  <em>Sistem Eksekusi Personal Berbasis Psikologi Kognitif untuk Pelajar & Pekerja Pengetahuan</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14_App_Router-black?style=flat-square&logo=next.js" alt="Next.js 14">
  <img src="https://img.shields.io/badge/TypeScript-Strict_Mode-blue?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-Custom_Design_System-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Tests-19%2F19_Passed_Vitest-emerald?style=flat-square" alt="Tests">
  <img src="https://img.shields.io/badge/PWA-Installable_Offline-orange?style=flat-square" alt="PWA Ready">
  <img src="https://img.shields.io/badge/Design_Rule-Strictly_No_Emojis-slate?style=flat-square" alt="Strictly No Emojis">
</p>

---

## Daftar Isi

1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [Pondasi Riset Ilmiah (Scientific Foundations)](#2-pondasi-riset-ilmiah-scientific-foundations)
3. [Mindmap Produk & Siklus Perilaku](#3-mindmap-produk--siklus-perilaku)
4. [Sketsa Wireframe & Arsitektur Fitur](#4-sketsa-wireframe--arsitektur-fitur)
5. [Tabel Komparasi Inovasi (Unique Selling Points)](#5-tabel-komparasi-inovasi-unique-selling-points)
6. [Arsitektur Sistem & Rekayasa Perangkat Lunak](#6-arsitektur-sistem--rekayasa-perangkat-lunak)
7. [Skema Basis Data (Database Schema & RLS)](#7-skema-basis-data-database-schema--rls)
8. [Panduan Instalasi & Menjalankan Aplikasi](#8-panduan-instalasi--menjalankan-aplikasi)
9. [Pengujian & Verifikasi Mutu](#9-pengujian--verifikasi-mutu)

---

## 1. Executive Summary & Problem Statement

### Paradoks Aplikasi To-Do Tradisional

Hampir semua aplikasi produktivitas konvensional (Todoist, TickTick, Apple Reminders, Trello) didesain sebagai **gudang penampung tugas tanpa batas** (*infinite task hoarding*). Akibatnya:

- **Cognitive Thrashing & Decision Fatigue**: Pengguna membuka aplikasi dan langsung disajikan 20-30 daftar tugas. Otak dipaksa memilih ulang apa yang harus dikerjakan setiap saat.
- **Overplanning & Ilusi Produktivitas**: Pengguna menghabiskan waktu berjam-jam merapikan tag, kategori, dan warna tanpa pernah benar-benar mengeksekusi tugas.
- **Guilt & Shame Rollover**: Tugas yang tidak selesai dicap merah dengan label *"Overdue"*, menimbulkan rasa bersalah yang berujung pada pengabaian aplikasi (*productivity abandonment*).
- **Constant Context Switching**: Melihat tugas lain saat sedang mengerjakan satu hal memicu kecemasan kognitif (*attention residue*).

### Solusi: SATUDULU

**SATUDULU** bukan sekadar to-do list. SATUDULU adalah **Personal Execution System** (Sistem Eksekusi Pribadi) yang dirancang untuk melindungi atensi dan energi mental pengguna melalui prinsip **Thread Tunggal (Single-Thread Execution)**:

1. **Satu Hal dalam Satu Waktu**: Di layar eksekusi, pengguna **hanya melihat Prioritas 01**. Judul tugas berikutnya sengaja disembunyikan.
2. **Kapasitas Adaptif (1–6 Komitmen)**: Batas maksimal 6 komitmen harian bukanlah target atau kuota, melainkan batas aman kognitif.
3. **Rollover Tanpa Rasa Bersalah**: Tugas yang belum terselesaikan tidak dianggap gagal; statusnya dialihkan ke `carried_forward` untuk dievaluasi ulang esok hari dengan tenang.
4. **Keputusan Tanpa Beban**: Algoritma komparasi biner (Pairwise Prioritization) membantu mengurutkan prioritas tanpa membebani pikiran.

---

## 2. Pondasi Riset Ilmiah (Scientific Foundations)

SATUDULU dibangun di atas 6 teori psikologi kognitif dan perilaku yang telah tervalidasi secara empiris:

```
+---------------------------------------------------------------------------------------------------+
|                                 PONDASI RISET ILMIAH SATUDULU                                     |
+------------------------------------+--------------------------------------------------------------+
| Teori & Peneliti                   | Penerapan Arsitektur & Desain pada SATUDULU                  |
+------------------------------------+--------------------------------------------------------------+
| 1. Miller's Law (1956)             | Batas kapasitas memori kerja 7±2 informasi. SATUDULU         |
|    George A. Miller                | membatasi komitmen harian maksimal 6 (rekomendasi 3-4).      |
+------------------------------------+--------------------------------------------------------------+
| 2. Ego Depletion (1998)            | Energi kemauan (*willpower*) terkuras oleh keputusan berulang.|
|    Roy Baumeister et al.           | Menggunakan Pairwise Biner (A vs B) untuk memangkas kelelahan.|
+------------------------------------+--------------------------------------------------------------+
| 3. Implementation Intentions (1999)| Rencana jika-maka (*if-then planning*) melipatgandakan       |
|    Peter Gollwitzer                | eksekusi. Fitur Clarify mewajibkan "Langkah Pertama Spesifik".|
+------------------------------------+--------------------------------------------------------------+
| 4. Goal-Setting Theory (2002)      | Kejelasan satu target spesifik menghasilkan performa 2x lebih|
|    Edwin Locke & Gary Latham       | tinggi dibanding instruksi umum "lakukan yang terbaik".      |
+------------------------------------+--------------------------------------------------------------+
| 5. Planning Fallacy (1979)         | Manusia secara konsisten meremehkan waktu penyelesaian.       |
|    Daniel Kahneman & Amos Tversky  | Sistem kalibrasi adaptif menghitung histori ritme nyata.      |
+------------------------------------+--------------------------------------------------------------+
| 6. Flow State (1990)               | Fokus mendalam tercapai saat bebas dari gangguan antrean.    |
|    Mihaly Csikszentmihalyi         | Mode Fokus Single-Thread menyembunyikan tugas masa depan.    |
+------------------------------------+--------------------------------------------------------------+
```

---

## 3. Mindmap Produk & Siklus Perilaku

### High-Level Product Mindmap

```mermaid
mindmap
  root((SATUDULU))
    Pondasi Ilmiah
      Miller's Law [Kapasitas 1-6]
      Ego Depletion [Pairwise Biner]
      Implementation Intentions [Langkah Pertama]
      Flow State [Single-Thread Execution]
    Capture & Decide
      Quick Dump Inbox
      AI Cognitive Clarifier [Heuristik Gratis / Gemini]
      Estimasi Durasi & Alasan Makna
    Prioritize & Calibrate
      Pairwise Matrix Tournament
      Kapasitas Berdasarkan Ritme Nyata
      Kunci Komitmen Pagi
    Execute & Focus
      Single-Thread View [Priority 01 Only]
      Picture-in-Picture [PiP Floating Timer]
      Pelindung Kognitif [Hide Future Titles]
      Transisi Tenang [Next Action Transition]
    Reflect & Vault
      Rollover Tanpa Rasa Bersalah [Timezone Asia/Jakarta]
      Evaluasi Rasio Selesai [1/1 = 4/4 = Perfect Day]
      Profil Perilaku [The Finisher, The Consistent, dsb]
      The Vault [Kalender Riwayat Eksekusi]
```

### Siklus Perilaku Harian Pengguna (The Daily Execution Loop)

```mermaid
flowchart TD
    A[Malam Hari: Buka Kotak Masuk] --> B[Clarify: Pecah Tugas Menjadi Konkret & Beri Alasan]
    B --> C[Pairwise Tournament: Bandingkan 2 Tugas Sekaligus]
    C --> D[Calibrate: Rekomendasi Kapasitas Realistis 1-6 Tugas]
    D --> E[Commit: Kunci Komitmen untuk Esok Hari]
    
    E --> F[Pagi Hari: Buka SATUDULU]
    F --> G[Tampilan Eksekusi Thread Tunggal: HANYA LIHAT PRIORITAS 01]
    G --> H[Mulai Mode Fokus & Aktifkan Timer PiP Melayang]
    H --> I{Apakah Ada Interupsi?}
    I -- Ya --> J[Replan Darurat: Catat Alasan & Tukar Prioritas]
    J --> G
    I -- Tidak --> K[Tandai Selesai: Transisi Tenang & Buka Prioritas Berikutnya]
    K --> L{Semua Selesai?}
    L -- Belum --> G
    L -- Selesai --> M[Malam Hari: Refleksi Cepat & Rollover Tanpa Rasa Bersalah]
    M --> A
```

---

## 4. Sketsa Wireframe & Arsitektur Fitur

### Sketsa 1: Landing Page (Bubble Header & Ambient Backdrop)

```
+-------------------------------------------------------------------------+
|                              [ S A T U D U L U ]                        |
|        [Filosofi]   [Riset Ilmiah]   [Panduan]   [Buka Aplikasi ->]     |  <- Floating Bubble Navbar
+-------------------------------------------------------------------------+
|                                                                         |
|                       SATU HAL DALAM SATU WAKTU                         |
|             Sistem Eksekusi Personal Berbasis Psikologi Kognitif        |
|                                                                         |
|                [ Mulai Komitmen Hari Ini ]   [ Baca Riset ]             |
|                                                                         |
|   +-------------------+  +--------------------+  +------------------+   |
|   | 1. Thread Tunggal |  | 2. Pairwise Biner  |  | 3. Bebas Bersalah|   |
|   | Hanya lihat fokus |  | Memilih A vs B     |  | Rollover tenang |   |
|   | aktif saat ini.   |  | tanpa overthinking |  | tanpa label gagal|   |
|   +-------------------+  +--------------------+  +------------------+   |
|                                                                         |
+-------------------------------------------------------------------------+
```

### Sketsa 2: Eksekusi Thread Tunggal & PiP Floating Timer (`/app`)

```
+-------------------------------------------------------------------------+
| SATUDULU          [Hari Ini]   [Kotak Masuk]   [Rencana]   [The Vault]  |
+-------------------------------------------------------------------------+
|                                                                         |
|  STATUS KOMITMEN: TERKUNCI (PAGI HARI)                 [Replan Darurat] |
|  PROGRES: ● ○ ○                                        Ritme: 1/3 Tugas |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |  PRIORITAS 01 (SEDANG DIKERJAKAN)                                  |  |
|  |                                                                   |  |
|  |  Selesaikan draf Bab 3 Metodologi Penelitian                      |  |
|  |  Estimasi: 45 Menit  |  Alasan: Agar siap bimbingan dosen Kamis  |  |
|  |                                                                   |  |
|  |  [ SELESAIKAN KOMITMEN INI ]    [ MASUK MODE FOKUS ]              |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
|  KOMITMEN MENDATANG (2 TUGAS TERJAGA)                                   |
|  +-------------------------------------------------------------------+  |
|  |  [Gembok] Prioritas 02  -  Judul disembunyikan untuk menjaga atensi|  |
|  |  [Gembok] Prioritas 03  -  Judul disembunyikan untuk menjaga atensi|  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
+-------------------------------------------------------------------------+
               \
                \--> [ PiP Floating Canvas Overlay di atas VS Code/Word ]
                     +---------------------------------------+
                     | SATUDULU FOCUS TIMER     [X]           |
                     | Prioritas 01: Draf Bab 3 Metodologi   |
                     | 00:34:12                              |
                     | [Jeda]  [Selesai]                     |
                     +---------------------------------------+
```

### Sketsa 3: Pairwise Prioritization Engine (`/app/plan`)

```
+-------------------------------------------------------------------------+
|                  MANA YANG LEBIH PENTING UNTUK BESOK?                  |
|               Perbandingan 3 dari 6  |  Tekan A atau B                   |
+-------------------------------------------------------------------------+
|                                                                         |
|       +---------------------------+   +---------------------------+     |
|       |          PILIHAN A        |   |          PILIHAN B        |     |
|       |                           |   |                           |     |
|       | Review pull request auth  |   | Siapkan slide presentasi  |     |
|       | service sebelum release   |   | investor meeting          |     |
|       |                           |   |                           |     |
|       |      [ PILIH INI (A) ]    |   |      [ PILIH INI (B) ]    |     |
|       +---------------------------+   +---------------------------+     |
|                                                                         |
|                      [ Keduanya Sama Penting ]                          |
+-------------------------------------------------------------------------+
```

---

## 5. Tabel Komparasi Inovasi (Unique Selling Points)

| Fitur / Paradigma | Aplikasi To-Do Biasa (Todoist, Notion, Reminders) | SATUDULU (Personal Execution System) |
| :--- | :--- | :--- |
| **Model Tampilan Tugas** | Daftar panjang 20-50 item sekaligus (*cognitive overload*). | **Single-Thread**: Hanya 1 tugas aktif; tugas berikutnya disembunyikan. |
| **Penentuan Prioritas** | Drag-and-drop manual yang memicu kebingungan. | **Pairwise Biner Tournament**: Otak hanya membandingkan 2 opsi sekaligus. |
| **Kapasitas Harian** | Tidak terbatas (*unlimited hoarding*). | **Batas Adaptif 1–6 Komitmen** berbasis riwayat kecepatan nyata. |
| **Tugas Belum Selesai** | Ditandai merah sebagai "Overdue / Gagal" (*guilt-inducing*). | **Zero-Guilt Rollover**: Masuk ke evaluasi esok hari tanpa rasa bersalah. |
| **Bantuan Perjelas Tugas** | Kosong atau bergantung prompt AI generik berbayar. | **Dual-Tier AI Clarifier**: Heuristik kognitif gratis otomatis + Gemini Flash. |
| **Timer Fokus Saat Bekerja** | Harus buka tab browser terus-menerus. | **Picture-in-Picture (PiP)**: Timer melayang native di atas app lain. |
| **Etika Gamifikasi** | Poin palsu, avatar kartun, dan emoji berlebihan. | **Meaningful Metrics**: Rasio selesai (1/1 = 4/4 = Perfect Day), zero emojis. |

---

## 6. Arsitektur Sistem & Rekayasa Perangkat Lunak

### Diagram Arsitektur Komponen

```mermaid
graph TD
    subgraph Client [Browser Client - Next.js 14 App Router]
        UI[UI Components & Tailwind System]
        State[Domain State Machines]
        PiP[Picture-in-Picture Canvas Engine]
        Notif[Web Notification Manager]
        AI[AI Clarify Cognitive Engine]
    end

    subgraph DataLayer [Decoupled Data Access Layer]
        RepoInterface[IRepository Interface]
        LocalRepo[LocalDemoRepository - LocalStorage Fallback]
        SupaRepo[SupabaseRepository - PostgreSQL]
    end

    subgraph Backend [Supabase Cloud Infrastructure]
        Postgres[(PostgreSQL with RLS)]
        Auth[Supabase Auth]
    end

    UI --> State
    State --> RepoInterface
    RepoInterface --> LocalRepo
    RepoInterface --> SupaRepo
    SupaRepo --> Postgres
    SupaRepo --> Auth
    UI --> PiP
    UI --> Notif
    UI --> AI
```

### Standar Rekayasa Perangkat Lunak

- **Strict TypeScript**: Bebas dari tipe `any`. Seluruh entitas model (`Commitment`, `DailyPlan`, `InboxItem`, `FocusSession`) didefinisikan secara tegas.
- **Clean Architecture Repository Pattern**: Logika bisnis aplikasi sepenuhnya terisolasi dari basis data melalui antarmuka `IRepository`. Aplikasi dapat berjalan offline secara instan melalui `LocalDemoRepository` atau terhubung ke `SupabaseRepository`.
- **Zero External UI Library Bloat**: Komponen modal, tombol, badge, dan kartu dibangun secara murni menggunakan Tailwind CSS dan Lucide Icons tanpa ketergantungan library berat.
- **Cross-Browser Picture-in-Picture**: Menggunakan kombinasi HTML5 Canvas `captureStream()` dan video element untuk memastikan fitur timer melayang berjalan di Google Chrome, Microsoft Edge, dan Safari.

---

## 7. Skema Basis Data (Database Schema & RLS)

Skema database PostgreSQL telah dioptimalkan dengan Row Level Security (RLS) di `supabase/migrations/20260918000001_initial_schema.sql`:

```mermaid
erDiagram
    PROFILES ||--o{ INBOX_ITEMS : owns
    PROFILES ||--o{ DAILY_PLANS : creates
    DAILY_PLANS ||--o{ COMMITMENTS : contains
    COMMITMENTS ||--o{ TASK_EVENTS : logs
    COMMITMENTS ||--o{ FOCUS_SESSIONS : tracks
    DAILY_PLANS ||--o| DAILY_REFLECTIONS : reflects
    PROFILES ||--o| EXECUTION_STATS : aggregates

    PROFILES {
        uuid id PK
        text email
        text full_name
        text timezone
        text occupation
    }

    DAILY_PLANS {
        uuid id PK
        uuid user_id FK
        date plan_date
        text status
        timestamp committed_at
    }

    COMMITMENTS {
        uuid id PK
        uuid daily_plan_id FK
        int priority_order
        text title
        text status
        int estimated_minutes
        int actual_minutes
        boolean carried_forward
    }
```

---

## 8. Panduan Instalasi & Menjalankan Aplikasi

### Kebutuhan Sistem
- **Node.js**: v18.17.0 atau lebih baru
- **npm** atau **pnpm**

### Langkah 1: Kloning Repositori
```bash
git clone https://github.com/FadliBilal/satu-dulu.git
cd satu-dulu
```

### Langkah 2: Pasang Dependensi
```bash
npm install
```

### Langkah 3: Jalankan Mode Pengujian
```bash
npm test
```

### Langkah 4: Jalankan Development Server
```bash
npm run dev
```
Buka peramban Anda di [http://localhost:3000](http://localhost:3000).

### Langkah 5: Konfigurasi Supabase (Opsional)
Jika ingin menghubungkan ke database cloud PostgreSQL:
1. Buat proyek baru di [supabase.com](https://supabase.com).
2. Jalankan skrip SQL di file `supabase/migrations/20260918000001_initial_schema.sql` pada SQL Editor Supabase.
3. Buat file `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://proyek-anda.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=kunci-anon-anda
   ```
4. Restart server. Sistem otomatis beralih ke cloud PostgreSQL dengan otentikasi aman.

---

## 9. Pengujian & Verifikasi Mutu

Seluruh logika bisnis inti diuji menggunakan **Vitest** dengan tingkat keberhasilan 100%:

```
 ✓ tests/domain/rollover.test.ts (2 tests)
 ✓ tests/domain/pairwise.test.ts (3 tests)
 ✓ tests/domain/state-machine.test.ts (7 tests)
 ✓ tests/domain/calibration.test.ts (4 tests)
 ✓ tests/domain/gamification.test.ts (3 tests)

 Test Files  5 passed (5)
      Tests  19 passed (19)
   Duration  1.58s
```

### Aspek yang Diverifikasi:
1. **Aturan Batas State Machine**: Menolak komitmen 0 atau >6; memastikan transisi dari `draft` -> `committed` -> `active` berjalan tanpa celah.
2. **Integritas Thread Tunggal**: Memastikan tugas prioritas selanjutnya hanya terbuka setelah prioritas pertama ditandai selesai.
3. **Turnamen Pairwise**: Perhitungan matriks perbandingan biner konsisten dan memecah seri (*tie-break*) dengan bobot tugas carryover.
4. **Kalibrasi Adaptif**: Perhitungan rata-rata ritme 7–14 hari secara akurat mengklasifikasikan kapasitas realistis.
5. **Idempotensi Rollover**: Tugas yang belum terselesaikan dialihkan secara aman tanpa duplikasi dan tidak pernah dipaksa menjadi Prioritas 1 otomatis.

---

<p align="center">
  Dibuat dengan dedikasi untuk memulihkan atensi dan kesehatan mental produktivitas.<br>
  <strong>SATUDULU &copy; 2026 Fadli Bilal. All Rights Reserved.</strong>
</p>
