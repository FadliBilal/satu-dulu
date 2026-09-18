// ==============================================================================
// SATUDULU — 100% Free, Safe, Zero-Cost AI Task Clarification Engine
// Works 100% free offline with expert cognitive heuristics (zero API key needed),
// and optionally connects to Google Gemini 1.5 Flash Free Tier (no credit card).
// ==============================================================================

export interface ClarificationSuggestion {
  title: string;
  why_it_matters: string;
  estimated_duration: number;
}

export function getActiveGeminiKey(explicitKey?: string): string | null {
  if (explicitKey && explicitKey.trim()) return explicitKey.trim();
  if (typeof window !== "undefined") {
    const localKey = localStorage.getItem("satudulu_gemini_key");
    if (localKey && localKey.trim()) return localKey.trim();
  }
  if (process.env.NEXT_PUBLIC_GEMINI_API_KEY && process.env.NEXT_PUBLIC_GEMINI_API_KEY.trim()) {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY.trim();
  }
  return null;
}

export function isGeminiConfigured(explicitKey?: string): boolean {
  return Boolean(getActiveGeminiKey(explicitKey));
}

const HEURISTIC_PATTERNS: Array<{
  keywords: string[];
  generate: (input: string) => ClarificationSuggestion[];
}> = [
  {
    keywords: ["skripsi", "thesis", "tugas akhir", "bab", "dosen", "bimbingan", "sidang"],
    generate: (input) => [
      {
        title: `Tulis draf sub-bab metodologi penelitian: ${input.trim()}`,
        why_it_matters: "Menyelesaikan bagian teknis untuk dikonsultasikan dengan pembimbing.",
        estimated_duration: 60,
      },
      {
        title: "Sintesis 3 jurnal pendukung tinjauan pustaka",
        why_it_matters: "Memperkuat argumen teoritis pada bab pendukung.",
        estimated_duration: 45,
      },
      {
        title: "Perbaiki catatan revisi evaluasi pembimbing",
        why_it_matters: "Memastikan masukan evaluasi sebelumnya terpenuhi sebelum konsultasi berikutnya.",
        estimated_duration: 45,
      },
    ],
  },
  {
    keywords: ["belajar", "study", "baca", "pelajari", "ujian", "uts", "uas", "kuis", "materi"],
    generate: (input) => [
      {
        title: `Ringkas poin inti materi: ${input.replace(/belajar|study|pelajari|baca/gi, "").trim() || "konsep utama"}`,
        why_it_matters: "Menciptakan catatan ringkas untuk persiapan evaluasi mandiri.",
        estimated_duration: 35,
      },
      {
        title: "Kerjakan 5 latihan soal evaluasi konsep",
        why_it_matters: "Menguji pemahaman aktif (active recall) tanpa melihat contekan catatan.",
        estimated_duration: 45,
      },
      {
        title: "Review dan tandai konsep yang belum dipahami",
        why_it_matters: "Mengetahui celah pemahaman sebelum masuk topik lanjutan.",
        estimated_duration: 25,
      },
    ],
  },
  {
    keywords: ["koding", "coding", "bug", "fitur", "api", "auth", "program", "deploy", "backend", "frontend", "database"],
    generate: (input) => [
      {
        title: `Implementasi fungsi inti: ${input.trim()}`,
        why_it_matters: "Membangun alur kerja dasar agar dapat diuji di lingkungan lokal.",
        estimated_duration: 45,
      },
      {
        title: `Investigasi dan perbaiki akar masalah error: ${input.trim()}`,
        why_it_matters: "Menghilangkan bug penghambat tanpa menimbulkan efek samping pada fungsi lain.",
        estimated_duration: 40,
      },
      {
        title: `Refactor dan tulis tes verifikasi untuk: ${input.trim()}`,
        why_it_matters: "Menjamin stabilitas kode sebelum digabungkan ke branch utama.",
        estimated_duration: 30,
      },
    ],
  },
  {
    keywords: ["desain", "design", "ui", "ux", "landing", "figma", "poster", "banner", "logo"],
    generate: (input) => [
      {
        title: `Buat wireframe hitam-putih untuk ${input.replace(/desain|design/gi, "").trim() || "halaman utama"}`,
        why_it_matters: "Menyepakati hierarki informasi sebelum masuk ke tahap visual detail.",
        estimated_duration: 45,
      },
      {
        title: "Eksplorasi 2 alternatif layout visual di Figma",
        why_it_matters: "Memberikan opsi perbandingan estetika dan kemudahan navigasi.",
        estimated_duration: 60,
      },
      {
        title: "Rapikan komponen dan token warna desain sistem",
        why_it_matters: "Mempermudah proses serah terima ke tim pengembang.",
        estimated_duration: 30,
      },
    ],
  },
  {
    keywords: ["proposal", "klien", "presentasi", "laporan", "meeting", "pitch", "deck", "slide"],
    generate: (input) => [
      {
        title: `Susun kerangka 5 slide utama presentasi: ${input.trim()}`,
        why_it_matters: "Menyelaraskan poin utama dan ruang lingkup pesan yang ingin disampaikan.",
        estimated_duration: 45,
      },
      {
        title: "Tulis estimasi anggaran dan linimasa deliverable",
        why_it_matters: "Memberikan kejelasan biaya dan jadwal kepada pemangku kepentingan.",
        estimated_duration: 40,
      },
      {
        title: "Kirim draf tinjauan awal untuk masukan internal",
        why_it_matters: "Mendapatkan kesepakatan sebelum presentasi resmi dimulai.",
        estimated_duration: 25,
      },
    ],
  },
  {
    keywords: ["email", "hubungi", "telepon", "chat", "follow up", "pesan", "surat"],
    generate: (input) => [
      {
        title: `Tulis draf pesan singkat dan to-the-point untuk: ${input.trim()}`,
        why_it_matters: "Menyampaikan maksud utama dengan jelas tanpa multitafsir.",
        estimated_duration: 20,
      },
      {
        title: "Kirim pesan dan catat batas waktu respon berikutnya",
        why_it_matters: "Memastikan koordinasi berjalan dan ada kejelasan langkah lanjut.",
        estimated_duration: 15,
      },
      {
        title: "Kumpulkan dokumen pendukung sebelum membalas komunikasi",
        why_it_matters: "Menyediakan konteks lengkap agar tidak bolak-balik tanya.",
        estimated_duration: 25,
      },
    ],
  },
  {
    keywords: ["analisa", "riset", "data", "excel", "spreadsheet", "hitung"],
    generate: (input) => [
      {
        title: `Ekstrak dan bersihkan dataset mentah: ${input.trim()}`,
        why_it_matters: "Memastikan kualitas data valid sebelum ditarik kesimpulan.",
        estimated_duration: 40,
      },
      {
        title: "Buat tabel rekap perbandingan metrik utama",
        why_it_matters: "Menghasilkan visualisasi angka yang mudah dipahami pengambil keputusan.",
        estimated_duration: 45,
      },
      {
        title: "Tulis 3 poin kesimpulan ringkas dari hasil analisa",
        why_it_matters: "Mengubah data mentah menjadi rekomendasi tindakan nyata.",
        estimated_duration: 25,
      },
    ],
  },
];

/**
 * Clarifies a raw task into 3 actionable proposals using free NLP heuristics
 * or via free Google Gemini API if user configured GEMINI_API_KEY.
 */
export async function clarifyTaskWithAI(
  rawTitle: string,
  apiKeyOverride?: string
): Promise<ClarificationSuggestion[]> {
  const clean = rawTitle.trim();
  if (!clean) return [];

  const key = getActiveGeminiKey(apiKeyOverride);

  // 1. If Gemini API Key is available, attempt call to Google Gemini Flash (100% Free Tier, No Card)
  if (key) {
    try {
      const prompt = `Anda adalah asisten klarifikasi produktivitas SatuDulu. Tugas: Ubah tugas samar berikut menjadi 3 pilihan komitmen yang konkret, berbatas jelas (single action), dan dapat dieksekusi dalam 25-60 menit dalam Bahasa Indonesia.
Tugas asal: "${clean}"

Keluarkan HANYA JSON array persis seperti format ini tanpa tambahan teks atau markdown:
[
  {"title": "Judul tindakan konkret pertama", "why_it_matters": "Mengapa ini penting / definisi selesai", "estimated_duration": 45},
  {"title": "Judul tindakan konkret alternatif kedua", "why_it_matters": "Alasan penting", "estimated_duration": 30},
  {"title": "Judul tindakan konkret alternatif ketiga", "why_it_matters": "Alasan penting", "estimated_duration": 60}
]`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.slice(0, 3);
          }
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, automatically using free cognitive heuristics:", err);
    }
  }

  // 2. 100% Free Offline Intelligent Cognitive Heuristics (Instant, 0 Cost, 0 Privacy Leak)
  const lower = clean.toLowerCase();
  for (const pattern of HEURISTIC_PATTERNS) {
    if (pattern.keywords.some((kw) => lower.includes(kw))) {
      return pattern.generate(clean);
    }
  }

  // 3. Fallback: Adaptive Cognitive Decomposition (Preparation -> Core Action -> Completion Review)
  return [
    {
      title: `Tulis draf awal dan tentukan batasan selesai untuk: ${clean}`,
      why_it_matters: "Mengubah ide abstrak menjadi dokumen kerja pertama yang konkret.",
      estimated_duration: 35,
    },
    {
      title: `Selesaikan bagian paling krusial dari: ${clean}`,
      why_it_matters: "Menghilangkan hambatan terbesar sebelum melanjutkan ke langkah lain.",
      estimated_duration: 50,
    },
    {
      title: `Review dan rapikan hasil akhir dari: ${clean}`,
      why_it_matters: "Memastikan standar mutu terpenuhi sebelum komitmen dianggap selesai.",
      estimated_duration: 25,
    },
  ];
}
