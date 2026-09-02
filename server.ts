import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Supported and fallback models in priority order
const CANDIDATE_MODELS = ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

function getAI(customApiKey?: string) {
  const apiKey = customApiKey?.trim() || process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('Kunci API Gemini tidak ditemukan. Harap sediakan GEMINI_API_KEY di environment atau pasang di pengaturan aplikasi.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Helper to call Gemini models with automatic retries and fallback models
 */
async function generateGeminiContentWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  options: {
    temperature?: number;
    responseMimeType?: string;
    maxRetriesPerModel?: number;
  } = {}
): Promise<{ text: string; usedModel: string }> {
  const { temperature = 0.5, responseMimeType = 'application/json', maxRetriesPerModel = 2 } = options;
  let lastError: Error | null = null;

  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
      try {
        console.log(`[Gemini API] Requesting model: ${model} (attempt ${attempt}/${maxRetriesPerModel})...`);
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature,
            responseMimeType,
          },
        });

        const text = response.text;
        if (text && text.trim().length > 0) {
          console.log(`[Gemini API] Success with model: ${model}`);
          return { text, usedModel: model };
        }
        throw new Error(`Empty response from model ${model}`);
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        const errMessage = lastError.message || '';
        const isUnavailableOrBusy =
          errMessage.includes('503') ||
          errMessage.includes('UNAVAILABLE') ||
          errMessage.includes('high demand') ||
          errMessage.includes('429') ||
          errMessage.includes('RESOURCE_EXHAUSTED') ||
          errMessage.includes('overloaded');

        console.warn(
          `[Gemini API] Warning on model ${model} (attempt ${attempt}): ${errMessage}. Unavailable flag: ${isUnavailableOrBusy}`
        );

        if (isUnavailableOrBusy) {
          if (attempt < maxRetriesPerModel) {
            await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
            continue;
          }
          break;
        } else {
          if (errMessage.includes('API key') || errMessage.includes('PERMISSION_DENIED') || errMessage.includes('INVALID_ARGUMENT')) {
            throw lastError;
          }
          if (attempt < maxRetriesPerModel) {
            await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
          }
        }
      }
    }
  }

  throw (
    lastError ||
    new Error('Semua model Gemini sedang mengalami lonjakan beban sesaat. Silakan coba kembali dalam beberapa detik.')
  );
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Status check to know if server has Gemini API Key
app.get('/api/gemini/status', (req: Request, res: Response) => {
  const hasServerKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  res.json({
    hasServerKey,
    model: 'gemini-3.7-flash',
  });
});

// Endpoint: Generate Full Arabic Reading (Reading-First, Tashkeel, Vocab, Grammar, & Quiz)
app.post('/api/gemini/generate', async (req: Request, res: Response) => {
  try {
    const {
      category = 'Kehidupan Sehari-hari',
      topic = 'Rutinitas Pagi',
      subtopic,
      level = 'A2',
      grammarLevel = 'auto',
      grammarLanguage = 'ar_id',
      style = 'cerita_naratif',
      lengthPreset = '1_page',
      customWordCount,
      includeTransliteration = true,
      apiKey,
    } = req.body;

    const ai = getAI(apiKey);

    const lengthMap: Record<string, { min: number; max: number; label: string }> = {
      '1_page': { min: 250, max: 320, label: '1 Halaman (±250 - 320 kata)' },
      '2_pages': { min: 500, max: 620, label: '2 Halaman (±500 - 620 kata)' },
      '3_pages': { min: 750, max: 920, label: '3 Halaman (±750 - 920 kata)' },
      '5_pages': { min: 1250, max: 1550, label: '5 Halaman (±1.250 - 1.550 kata)' },
      custom: { min: Math.max(80, (customWordCount || 300) - 30), max: (customWordCount || 300) + 40, label: `${customWordCount || 300} kata` },
    };

    const targetRange = lengthMap[lengthPreset] || lengthMap['1_page'];
    const targetWordsApprox = Math.round((targetRange.min + targetRange.max) / 2);

    const effectiveGrammarLevel = grammarLevel === 'auto' ? level : grammarLevel;

    const promptText = `
Anda adalah Pakar Linguistik Bahasa Arab Fuṣḥā, Pengembang Kurikulum CEFR Bahasa Arab, dan Ahli Nahwu-Sharaf Terapan Otoritatif.

TUGAS UTAMA:
Susun teks materi bacaan Bahasa Arab Fuṣḥā yang koheren, mengalir alami, dan kaya wawasan sesuai parameter pedagogis berikut:

==================================================
PARAMETER PERMINTAAN PENGGUNA
==================================================
- KATEGORI: "${category}"
- TOPIK / SUBTOPIK: "${topic}${subtopic ? ` - ${subtopic}` : ''}"
- LEVEL BACAAN (CEFR): "${level}"
- LEVEL URAIAN KAIDAH: "${effectiveGrammarLevel}"
- GAYA BACAAN: "${style}"
- TARGET PANJANG KATA: ${targetRange.min} - ${targetRange.max} KATA BAHASA ARAB (Target ideal: ${targetWordsApprox} kata).

==================================================
PRINSIP UTAMA:
1. TOPIK dan LEVEL CEFR TERPISAH:
   Topik "${topic}" dapat digunakan di level manapun. Kompleksitas bahasa, kosakata, struktur kalimat, dan abstraksi isi harus menyesuaikan LEVEL BACAAN "${level}".
   - A1: Dunia konkret, kalimat sangat sederhana, kosakata dasar harian, struktur lugas.
   - A2: Pengalaman & deskripsi sederhana, urutan waktu kronologis, sebab-akibat sederhana.
   - B1: Realitas sosial & pengalaman manusia, mulai memuat sudut pandang & pembahasan masalah.
   - B2: Analisis, perbandingan isu sosial, hubungan sebab-akibat lebih mendalam, konsep abstrak menengah.
   - C1: Gagasan abstrak, pemikiran kritis, argumentasi kompleks, nuansa semantik & retoris.
   - C2: Wacana multidisipliner, analisis filosofis mendalam, asumsi tersembunyi, retorika tinggi.

2. LEVEL URAIAN KAIDAH TERPISAH DARI LEVEL BACAAN:
   Penjelasan kaidah (nahwu/sharaf) harus ditulis dengan tingkat kedalaman "${effectiveGrammarLevel}":
   - Jika A1-A2: Bahasa Indonesia sangat sederhana, istilah Arab langsung diterjemahkan.
   - Jika B1-B2: Istilah nahwu & sharaf dijelaskan dengan gamblang.
   - Jika C1-C2: Analisis linguistik komprehensif (semantik, sintaksis, i'rab mendalam).

3. BAHASA ARAB FUṢḤĀ MURNI:
   - Wajib 100% Bahasa Arab Fuṣḥā (fasih). Dilarang keras menggunakan dialek 'ammiyyah.
   - Teks harus koheren dan utuh (bukan kumpulan kalimat terpisah).
   - Teks berharakat lengkap (Tashkeel) yang 100% akurat secara kaidah nahwu & sharaf.

4. SUMBER OTORITATIF LINGUISTIK:
   - Kosakata & Makna: المعجم الوسيط / المعجم الأساسي / معجم اللغة العربية المعاصرة
   - Nahwu: النحو الواضح / النحو الوافي / جامع الدروس العربية
   - Sharaf: شذا العرف في فن الصرف / التطبيق الصرفي

==================================================
FORMAT OUTPUT (JSON MURNI SAJA):
{
  "title_ar": "Judul teks dalam Bahasa Arab berharakat lengkap (sesuai ${topic})",
  "title_id": "Judul teks dalam Bahasa Indonesia",
  "summary": "Ringkasan isi bacaan dalam 2-3 kalimat Bahasa Indonesia",
  "paragraphs": [
    {
      "id": 1,
      "ar_harakat": "Paragraf 1 dalam bahasa Arab dengan harakat lengkap...",
      "ar_gundul": "Paragraf 1 dalam bahasa Arab tanpa harakat...",
      "id_translation": "Terjemahan paragraf 1 dalam bahasa Indonesia..."
    }
  ],
  "vocabulary": [
    {
      "word_ar": "كَلِمَةٌ",
      "word_clean": "كلمة",
      "word_id": "Arti dalam konteks kalimat naskah (Bahasa Indonesia)",
      "meaning_basic": "Arti dasar leksikal kamus",
      "meaning_detail": "Penjelasan mengapa kata ini bermakna demikian di kalimat ini",
      "root": "Akar kata (ج - ذ - ر) atau '-' jika tidak dapat diverifikasi",
      "pos": "Jenis kata (اسم / فعل / حرف / صفة / مصدر / اسم فاعل / إلخ)",
      "wazan": "Pola kata (فَعَلَ / اِفْتَعَلَ / مَفْعُول / إلخ)",
      "sarf_analysis": "Penjelasan morfologis ringkas (cth: فعل ماضٍ مجرد ثلاثي)",
      "nahwu_function": "Fungsi dalam kalimat (فاعل / مفعول به / مبتدأ / خبر / إلخ)",
      "grammar_rule": "Kaidah yang terlihat pada kata sesuai level ${effectiveGrammarLevel}",
      "transliteration": "Transliterasi Latin",
      "nahwu_note": "Catatan tanda I'rab (cth: Marfu' bil-dhammah)",
      "uslub_alternative": {
        "original_phrase": "Frasa atau kata asli dalam naskah",
        "alternative_ar": "Bentuk pengungkapan alternatif Fuṣḥā yang fasih",
        "nuance_difference": "Perbedaan nuansa, fokus penekanan, atau tingkat formalitas"
      },
      "sources": [
        {
          "name": "المعجم الوسيط",
          "category": "lexical",
          "usage": "Verifikasi makna leksikal kata"
        },
        {
          "name": "النحو الواضح",
          "category": "nahwu",
          "usage": "Analisis fungsi dan jabatan sintaksis kata dalam kalimat"
        }
      ],
      "verification_status": "verified"
    }
  ],
  "grammar_analysis": [
    {
      "id": "g-1",
      "title": "Nama Kaidah (cth: Al-Fa'il wa Ahkamuhu)",
      "category": "nahwu",
      "rule_ar": "Penjelasan kaidah dalam bahasa Arab ringkas",
      "rule_id": "Penjelasan kaidah dalam bahasa Indonesia",
      "example_ar": "Contoh kalimat dari teks berharakat",
      "example_id": "Arti contoh kalimat",
      "explanation": "Uraian cara mengidentifikasi kaidah ini di dalam teks",
      "transliteration": "Transliterasi contoh",
      "sources": ["النحو الواضح", "جامع الدروس العربية"]
    }
  ],
  "comprehension_quiz": [
    {
      "id": 1,
      "question_ar": "Pertanyaan pemahaman dalam bahasa Arab berharakat sesuai teks",
      "question_id": "Pertanyaan pemahaman dalam bahasa Indonesia sesuai teks",
      "options": ["Pilihan A (Arab)", "Pilihan B (Arab)", "Pilihan C (Arab)", "Pilihan D (Arab)"],
      "correct_index": 0,
      "explanation": "Penjelasan jawaban yang benar dalam bahasa Indonesia"
    }
  ]
}

Sajikan minimal 8-15 butir kosakata kunci dan 3-5 poin kaidah tata bahasa yang mendidik dan relevan.
`;

    const { text, usedModel } = await generateGeminiContentWithFallback(ai, promptText, {
      temperature: 0.65,
      responseMimeType: 'application/json',
    });

    const cleanJsonStr = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanJsonStr);

    res.json({ success: true, data: parsed, targetWordsApprox, usedModel });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menghasilkan materi bacaan.';
    console.error('Error in /api/gemini/generate:', message);
    res.status(500).json({ success: false, error: message });
  }
});

// Endpoint: Interactive Word & Phrase Linguistic Analysis with Source-Based Grounding
app.post('/api/gemini/analyze-word', async (req: Request, res: Response) => {
  try {
    const {
      word,
      contextSentence,
      grammarLevel = 'A2',
      mode = 'word', // 'word' (كلمة) or 'phrase' (عبارة / أسلوب)
      apiKey,
    } = req.body;

    if (!word) {
      return res.status(400).json({ success: false, error: 'Parameter "word" diperlukan.' });
    }

    const ai = getAI(apiKey);

    const isPhrase = mode === 'phrase' || word.trim().includes(' ');

    const promptText = `
Anda adalah Pakar Linguistik Bahasa Arab Fuṣḥā Otoritatif.
Tugas Anda adalah melakukan ANALISIS INTERAKTIF ${isPhrase ? 'FRASA/USLUB (عبارة / أسلوب)' : 'KATA (كلمة)'} Bahasa Arab Fuṣḥā secara ilmiah, berbasis sumber rujukan otoritatif.

INPUT:
- Teks yang Dianalisis: "${word}"
- Konteks Kalimat: "${contextSentence || word}"
- Mode Analisis: "${isPhrase ? 'عبارة / أسلوب (Unit Makna Frasa)' : 'كلمة (Kata Individual)'}"
- Level Uraian Kaidah: "${grammarLevel}"

PRINSIP SUMBER & ANTI-HALUSINASI:
1. Bedakan Makna Konteks (Arti dalam kalimat naskah) dan Makna Dasar/Kamus (Makna leksikal).
2. Sumber Otoritatif yang diakui:
   - Kosakata: المعجم الوسيط / المعجم الأساسي / معجم اللغة العربية المعاصرة
   - Nahwu: النحو الواضح / النحو الوافي / جامع الدروس العربية
   - Sharaf: شذا العرف في فن الصرف / التطبيق الصرفي
   - Klasik/Turats (jika relevan): لسان العرب / تاج العروس / مقاييس اللغة
3. Jangan memaksakan analisis jika tidak relevan:
   - Jika حرف جر atau ضمير: sembunyikan akar kata / wazan ("-").
   - Jika akar kata tidak dapat diverifikasi secara pasti: tulis "غير متحقق" atau "-".
4. Sediakan contoh "أُسْلُوبٌ آخَرُ" (Uslūb alternatif Fuṣḥā yang fasih) beserta penjelasan perbedaan nuansa/penekanan secara semantik.

Kembalikan HANYA format JSON murni:
{
  "word_ar": "${word}",
  "word_clean": "${word.replace(/[\u064B-\u065F\u0670]/g, '')}",
  "word_id": "Arti dalam Bahasa Indonesia SESUAI KONTEKS kalimat",
  "meaning_basic": "Makna dasar leksikal kata",
  "meaning_detail": "Penjelasan mengapa kata/frasa memiliki arti tersebut dalam kalimat ini",
  "root": "Akar kata (ج - ذ - ر) jika ada dan terverifikasi, atau '-' jika berupa harf/dhamir/tidak terverifikasi",
  "pos": "Jenis kata (اسم / فعل / حرف / صفة / مصدر / اسم فاعل / ظرف / ضمير / إلخ)",
  "wazan": "Wazan atau pola pembentukan jika ada (atau '-')",
  "sarf_analysis": "Analisis morfologis ringkas (bentuk kata, fi'il madhi/mudhari', wazan)",
  "nahwu_function": "Fungsi kata dalam kalimat (فاعل / مفعول به / مبتدأ / خبر / اسم مجرور / صفة / حال / إلخ)",
  "grammar_rule": "Penjelasan kaidah bahasa Arab yang disesuaikan dengan level kemudahan ${grammarLevel}",
  "transliteration": "Transliterasi Latin pelafalan yang tepat",
  "nahwu_note": "Catatan i'rab / harakat akhir",
  "is_phrase": ${isPhrase},
  "uslub_alternative": {
    "original_phrase": "${word}",
    "alternative_ar": "Contoh cara pengungkapan lain dalam Bahasa Arab Fuṣḥā yang menyampaikan makna serupa",
    "nuance_difference": "Penjelasan perbedaan nuansa makna, tingkat formalitas, atau fokus penekanan",
    "formality_level": "Formal Fuṣḥā"
  },
  "sources": [
    {
      "name": "المعجم الوسيط",
      "category": "lexical",
      "usage": "Rujukan makna leksikal dan semantik kontekstual",
      "entry_snippet": "Kutipan atau ringkasan entri jika relevan"
    },
    {
      "name": "النحو الواضح",
      "category": "nahwu",
      "usage": "Rujukan verifikasi kedudukan dan fungsi sintaksis kata",
      "entry_snippet": "Kaidah posisi gramatikal dalam kalimat"
    },
    {
      "name": "شذا العرف في فن الصرف",
      "category": "sarf",
      "usage": "Rujukan struktur wazan dan morfologi"
    }
  ],
  "verification_status": "verified",
  "verification_note": "Informasi diverifikasi berdasarkan prinsip rujukan kebahasaan bahasa Arab Fuṣḥā standar."
}
`;

    const { text } = await generateGeminiContentWithFallback(ai, promptText, {
      temperature: 0.3,
      responseMimeType: 'application/json',
    });

    const cleanJson = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const result = JSON.parse(cleanJson);

    res.json({ success: true, wordData: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menganalisis kata.';
    console.error('Error in /api/gemini/analyze-word:', message);
    res.status(500).json({ success: false, error: message });
  }
});

function splitTextIntoTTSChunks(text: string, maxLen = 150): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return [clean];

  const chunks: string[] = [];
  const regex = /([^.!?؟\n،;؛]+[.!?؟\n،;؛]*)/g;
  const matches = clean.match(regex) || [clean];

  let current = '';
  for (const part of matches) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (trimmed.length > maxLen) {
      if (current) {
        chunks.push(current);
        current = '';
      }
      const words = trimmed.split(' ');
      let subCurrent = '';
      for (const w of words) {
        if ((subCurrent + ' ' + w).trim().length <= maxLen) {
          subCurrent = (subCurrent + ' ' + w).trim();
        } else {
          if (subCurrent) chunks.push(subCurrent);
          subCurrent = w;
        }
      }
      if (subCurrent) chunks.push(subCurrent);
    } else if ((current + ' ' + trimmed).trim().length <= maxLen) {
      current = (current + ' ' + trimmed).trim();
    } else {
      if (current) chunks.push(current);
      current = trimmed;
    }
  }
  if (current) chunks.push(current);
  return chunks.filter((c) => c.length > 0);
}

async function fetchGoogleTTSChunk(chunk: string, tl: string): Promise<Buffer> {
  const encoded = encodeURIComponent(chunk);
  const primaryUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${tl}&client=tw-ob`;

  let res = await fetch(primaryUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Referer: 'https://translate.google.com/',
    },
  });

  if (!res.ok) {
    const fallbackTl = tl.startsWith('en') ? 'en' : 'ar';
    const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${fallbackTl}&client=tw-ob`;
    res = await fetch(fallbackUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
      },
    });
  }

  if (!res.ok) {
    throw new Error(`TTS upstream failed with status ${res.status}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// Endpoint: Natural Multi-Language & Dialect Text-To-Speech Audio Proxy
app.get(['/api/tts', '/api/tts/arabic'], async (req: Request, res: Response) => {
  try {
    const text = (req.query.text as string) || '';
    const lang = (req.query.lang as string) || (req.query.tl as string) || 'ar';
    if (!text || !text.trim()) {
      return res.status(400).send('Parameter text diperlukan.');
    }

    const cleanText = text.trim();
    // Map language version codes to Google TTS tl codes
    let tlCode = 'ar';
    if (lang === 'en_british' || lang === 'en-GB' || lang === 'en-gb') {
      tlCode = 'en-GB';
    } else if (lang === 'en_american' || lang === 'en-US' || lang === 'en-us' || lang.startsWith('en')) {
      tlCode = 'en-US';
    } else if (lang === 'ar_egyptian' || lang === 'ar-EG') {
      tlCode = 'ar-EG';
    } else if (lang === 'ar_saudi' || lang === 'ar-SA') {
      tlCode = 'ar-SA';
    } else if (lang === 'ar_gulf' || lang === 'ar-AE') {
      tlCode = 'ar-AE';
    } else if (lang === 'ar_levantine' || lang === 'ar-LB' || lang === 'ar-SY') {
      tlCode = 'ar-LB';
    } else {
      tlCode = 'ar';
    }

    const chunks = splitTextIntoTTSChunks(cleanText, 150);
    const audioBuffers: Buffer[] = [];

    for (const chunk of chunks) {
      const buf = await fetchGoogleTTSChunk(chunk, tlCode);
      audioBuffers.push(buf);
    }

    const combinedBuffer = Buffer.concat(audioBuffers);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(combinedBuffer);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menghasilkan audio TTS.';
    console.error('Error in /api/tts:', message);
    res.status(500).json({ success: false, error: message });
  }
});

// Vite middleware in dev mode, Static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
