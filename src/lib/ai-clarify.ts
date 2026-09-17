// ==============================================================================
// SATUDULU — Free AI Task Clarification Engine
// Works 100% free offline with expert cognitive heuristics,
// and supports free-tier Google Gemini Flash API when configured.
// ==============================================================================

export interface ClarificationSuggestion {
  title: string;
  why_it_matters: string;
  estimated_duration: number;
}

const HEURISTIC_PATTERNS: Array<{
  keywords: string[];
  generate: (input: string) => ClarificationSuggestion[];
}> = [
  {
    keywords: ["skripsi", "thesis", "tugas akhir", "bab"],
    generate: (input) => [
      {
        title: "Tulis draf sub-bab metodologi penelitian",
        why_it_matters: "Menyelesaikan bagian teknis untuk dikonsultasikan dengan pembimbing.",
        estimated_duration: 60,
      },
      {
        title: "Sintesis 3 jurnal pendukung tinjauan pustaka",
        why_it_matters: "Memperkuat argumen teoritis pada bab 2.",
        estimated_duration: 45,
      },
      {
        title: "Perbaiki catatan revisi dari dosen pembimbing",
        why_it_matters: "Memastikan masukan evaluasi sebelumnya terpenuhi.",
        estimated_duration: 45,
      },
    ],
  },
  {
    keywords: ["belajar", "study", "baca", "pelajari", "ujian"],
    generate: (input) => [
      {
        title: `Ringkas poin inti materi ${input.replace(/belajar|study|pelajari/gi, "").trim() || "utama"}`,
        why_it_matters: "Menciptakan catatan ringkas untuk persiapan evaluasi mandiri.",
        estimated_duration: 35,
      },
      {
        title: "Kerjakan 5 latihan soal evaluasi konsep",
        why_it_matters: "Menguji pemahaman aktif tanpa melihat catatan.",
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
    keywords: ["koding", "coding", "bug", "fitur", "api", "auth", "program", "deploy"],
    generate: (input) => [
      {
        title: `Implementasi fungsi inti: ${input.trim()}`,
        why_it_matters: "Membangun alur kerja dasar agar dapat diuji di lingkungan lokal.",
        estimated_duration: 45,
      },
      {
        title: `Investigasi dan perbaiki akar masalah: ${input.trim()}`,
        why_it_matters: "Mencegah error berulang di lingkungan staging.",
        estimated_duration: 40,
      },
      {
        title: `Refactor dan tulis unit test untuk: ${input.trim()}`,
        why_it_matters: "Menjamin stabilitas kode sebelum digabungkan ke branch utama.",
        estimated_duration: 30,
      },
    ],
  },
  {
    keywords: ["desain", "design", "ui", "ux", "landing", "figma"],
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
    keywords: ["proposal", "klien", "presentasi", "laporan", "meeting"],
    generate: (input) => [
      {
        title: `Susun kerangka slide presentasi: ${input.trim()}`,
        why_it_matters: "Menyelaraskan poin utama dan ruang lingkup proyek.",
        estimated_duration: 45,
      },
      {
        title: "Tulis estimasi anggaran dan linimasa deliverable",
        why_it_matters: "Memberikan kejelasan biaya dan jadwal kepada pemangku kepentingan.",
        estimated_duration: 40,
      },
      {
        title: "Kirim draf tinjauan awal untuk masukan tim",
        why_it_matters: "Mendapatkan kesepakatan sebelum presentasi resmi.",
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
  apiKey?: string
): Promise<ClarificationSuggestion[]> {
  const clean = rawTitle.trim();
  if (!clean) return [];

  // 1. If API key is provided, attempt call to Google Gemini Flash (free tier)
  if (apiKey) {
    try {
      const prompt = `Anda adalah asisten klarifikasi produktivitas SatuDulu. Tugas: Ubah tugas samar berikut menjadi 3 pilihan komitmen yang konkret, berbatas jelas (single action), dan dapat dieksekusi dalam 25-60 menit dalam Bahasa Indonesia.
Tugas asal: "${clean}"

Keluarkan HANYA JSON array persis seperti ini tanpa markdown formatting:
[
  {"title": "Judul tindakan konkret", "why_it_matters": "Mengapa ini penting / definisi selesai", "estimated_duration": 45},
  {"title": "Pilihan kedua", "why_it_matters": "Alasan penting", "estimated_duration": 30},
  {"title": "Pilihan ketiga", "why_it_matters": "Alasan penting", "estimated_duration": 60}
]`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
      console.warn("Gemini API call failed, falling back to smart heuristic parser:", err);
    }
  }

  // 2. Free Intelligent Heuristic Engine (instant, zero cost, 100% offline)
  const lower = clean.toLowerCase();
  for (const pattern of HEURISTIC_PATTERNS) {
    if (pattern.keywords.some((kw) => lower.includes(kw))) {
      return pattern.generate(clean);
    }
  }

  // Default smart decomposition
  return [
    {
      title: `Tulis draf awal dan batasan untuk: ${clean}`,
      why_it_matters: "Mengubah ide abstrak menjadi dokumen kerja pertama.",
      estimated_duration: 45,
    },
    {
      title: `Selesaikan bagian paling krusial dari: ${clean}`,
      why_it_matters: "Menghilangkan hambatan terbesar sebelum melanjutkan.",
      estimated_duration: 60,
    },
    {
      title: `Review dan rapikan hasil akhir dari: ${clean}`,
      why_it_matters: "Memastikan standar kualitas terpenuhi sebelum dianggap selesai.",
      estimated_duration: 30,
    },
  ];
}
