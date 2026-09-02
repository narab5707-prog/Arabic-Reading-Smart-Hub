import {
  CEFRLevel,
  GrammarLanguage,
  GrammarLevel,
  ReadingItem,
  ReadingLengthPreset,
  ReadingStyle,
  TopicSuggestion,
  WordData,
} from '../types';

export interface GenerateReadingParams {
  apiKey?: string;
  category?: string;
  topic: string;
  subtopic?: string;
  level: CEFRLevel;
  style: ReadingStyle;
  lengthPreset: ReadingLengthPreset;
  customWordCount?: number;
  grammarLevel: GrammarLevel;
  grammarLanguage: GrammarLanguage;
  includeTransliteration: boolean;
  showHarakat: boolean;
}

export const FALLBACK_TOPICS_BY_LEVEL: Record<CEFRLevel, TopicSuggestion[]> = {
  A1: [
    {
      id: 'fb-a1-1',
      title_ar: 'يَوْمِي فِي المَدْرَسَةِ الجَدِيدَةِ',
      title_id: 'Hariku di Sekolah Baru',
      topic_prompt: 'Kisah sederhana tentang hari pertama seorang murid di sekolah baru, memperkenalkan diri kepada guru dan teman, serta benda-benda di dalam kelas.',
      category: 'Pendidikan & Pembelajaran',
      preview_snippet: 'Perkenalan diri, suasana kelas, teman baru, dan kosakata harian.',
    },
    {
      id: 'fb-a1-2',
      title_ar: 'عَائِلَتِي السَّعِيدَةُ فِي الحَدِيقَةِ',
      title_id: 'Keluargaku yang Bahagia di Taman',
      topic_prompt: 'Cerita santai keluarga yang pergi piknik di taman kota pada akhir pekan, nama anggota keluarga dan makanan yang dibawa.',
      category: 'Keluarga & Hubungan',
      preview_snippet: 'Ayah, ibu, saudara berkumpul di taman yang asri.',
    },
    {
      id: 'fb-a1-3',
      title_ar: 'فِي سُوقِ الفَوَاكِهِ وَالخُضْرَاوَاتِ',
      title_id: 'Di Pasar Buah dan Sayuran',
      topic_prompt: 'Dialog jual beli sederhana antara pembeli dan penjual buah di pasar tradisional tentang harga dan jenis buah segar.',
      category: 'Kehidupan Sehari-hari',
      preview_snippet: 'Membeli apel, jeruk, dan kurma dengan sapaan sopan.',
    },
  ],
  A2: [
    {
      id: 'fb-a2-1',
      title_ar: 'قِصَّةُ حِكْمَةِ الرَّجُلِ الصَّابِرِ فِي الصَّحْرَاءِ',
      title_id: 'Kisah Kearifan Musafir di Padang Pasir',
      topic_prompt: 'Kisah inspiratif tentang seorang pengelana bijak yang bertemu dengan seorang pemuda yang kehausan di gurun dan mengajarkan pentingnya berbagi.',
      category: 'Psikologi & Pengembangan Diri',
      preview_snippet: 'Pelajaran tentang kesabaran, pertolongan, dan kedermawanan.',
    },
    {
      id: 'fb-a2-2',
      title_ar: 'حِوَارٌ فِي مَقْهَى الفِيشَاوِي التَّقْلِيدِي',
      title_id: 'Percakapan di Kedai Kopi Tradisional',
      topic_prompt: 'Dua sahabat bertemu di kedai kopi bersejarah di Kairo, bertukar kabar, memesan teh mint dan kopi Arab, serta mendiskusikan rencana akhir pekan.',
      category: 'Masyarakat & Budaya',
      preview_snippet: 'Suasana kedai kopi klasik, memesan minuman dan canda tawa hangat.',
    },
    {
      id: 'fb-a2-3',
      title_ar: 'رِحْلَةُ القِطَارِ إِلَى الإِسْكَنْدَرِيَّةِ',
      title_id: 'Perjalanan Kereta ke Alexandria',
      topic_prompt: 'Pengalaman menaiki kereta api menuju kota pesisir laut tengah bersama keluarga, pemandangan delta Nil, dan suasana stasiun.',
      category: 'Safar & Petualangan',
      preview_snippet: 'Perjalanan kereta, tiket, pemandangan alam, dan suasana pantai.',
    },
  ],
  B1: [
    {
      id: 'fb-b1-1',
      title_ar: 'ابْنُ سِينَا: أَمِيرُ الأَطِبَّاءِ فِي بَغْدَادَ',
      title_id: 'Ibnu Sina: Pangeran Kedokteran di Baghdad',
      topic_prompt: 'Biografi naratif tentang masa muda Ibnu Sina (Avicenna), ketekunannya membaca buku di perpustakaan istana Samaniyah, dan penulisan kitab Al-Qanun fi Ath-Thibb.',
      category: 'Sains & Pengetahuan',
      preview_snippet: 'Dedikasi keilmuan, metode diagnosis penyakit, dan perpustakaan kuno.',
    },
    {
      id: 'fb-b1-2',
      title_ar: 'بَيْتُ الحِكْمَةِ وَعَصْرُ التَّرْجَمَةِ الذَّهَبِيُّ',
      title_id: 'Baitul Hikmah dan Era Keemasan Penerjemahan',
      topic_prompt: 'Artikel mendalam tentang pusat riset dan perpustakaan Baitul Hikmah pada masa Khalifah Al-Ma\'mun, gerakan penerjemahan karya Yunani, dan sains Arab.',
      category: 'Sejarah & Peradaban',
      preview_snippet: 'Kebangkitan sains, astronomi, dan matematika di Baghdad abad ke-9.',
    },
    {
      id: 'fb-b1-3',
      title_ar: 'رِحْلَةُ ابْنِ بَطُّوطَةَ إِلَى جَزِيرَةِ سُومَطْرَةَ',
      title_id: 'Catatan Perjalanan Ibnu Battuta ke Nusantara',
      topic_prompt: 'Catatan perjalanan penjelajah dunia Ibnu Battuta saat singgah di Samudera Pasai (Sumatera), keramahan sultan, dan jalur rempah dunia.',
      category: 'Safar & Petualangan',
      preview_snippet: 'Pengamatan maritim, diplomasi kerajaan Islam, dan eksotisme Nusantara.',
    },
  ],
  B2: [
    {
      id: 'fb-b2-1',
      title_ar: 'قُرْطُبَةُ: مَنَارَةُ العِلْمِ وَالتَّسَامُحِ فِي الأَنْدَلُسِ',
      title_id: 'Cordoba: Mercusuar Ilmu dan Toleransi di Andalusia',
      topic_prompt: 'Teks deskriptif-reflektif tentang kemegahan kota Cordoba, jembatan Romawi di atas sungai Guadalquivir, perpustakaan Al-Hakam II, dan koeksistensi damai.',
      category: 'Sejarah & Peradaban',
      preview_snippet: 'Arsitektur Masjid Agung Cordoba dan pertemuan cendekiawan lintas bangsa.',
    },
    {
      id: 'fb-b2-2',
      title_ar: 'الذَّكَاءُ الاصْطِنَاعِيُّ وَمُسْتَقْبَلُ اللُّغَةِ العَرَبِيَّةِ',
      title_id: 'Kecerdasan Buatan dan Masa Depan Bahasa Arab',
      topic_prompt: 'Artikel analitis tentang pengolahan bahasa alami (NLP) untuk dialek dan fusha Arab, digitalisasi manuskrip kuno, dan peluang generasi muda.',
      category: 'Teknologi & Masa Depan',
      preview_snippet: 'Tantangan korpus linguistik Arab modern dalam era revolusi AI.',
    },
    {
      id: 'fb-b2-3',
      title_ar: 'فَلْسَفَةُ المَاءِ فِي التُّرَاثِ العَرَبِيِّ وَالعِمَارَةِ الإِسْلَامِيَّةِ',
      title_id: 'Filosofi Air dalam Arsitektur dan Sastra Islam',
      topic_prompt: 'Refleksi mendalam tentang peran air sebagai simbol kehidupan, kesucian, serta rekayasa air mancur dan saluran irigasi istana Alhambra.',
      category: 'Lingkungan & Alam',
      preview_snippet: 'Harmoni suara gemericik air, estetika geometris, dan ketenangan jiwa.',
    },
  ],
  C1: [
    {
      id: 'fb-c1-1',
      title_ar: 'جَدَلِيَّةُ الأَصَالَةِ وَالمُعَاصَرَةِ فِي الأَدَبِ العَرَبِيِّ الحَدِيثِ',
      title_id: 'Dialektika Orisinalitas dan Modernitas dalam Sastra Arab Modern',
      topic_prompt: 'Teks esai argumentatif-sastrawi mengenai perdebatan antara pemeliharaan fusha klasik dan adaptasi tema-tema modern eksistensialisme dalam novel dan puisi Arab.',
      category: 'Sastra & Narasi',
      preview_snippet: 'Evolusi stilistika bahasa Arab dari era Nahdhah hingga era digital.',
    },
    {
      id: 'fb-c1-2',
      title_ar: 'البَلَاغَةُ العَرَبِيَّةُ وَإِعْجَازُ الصُّورَةِ البَيَانِيَّةِ',
      title_id: 'Estetika Balaghah dan Kedalaman Majaz Metaforis',
      topic_prompt: 'Kajian mendalam tentang seni Isti\'arah, Kinayah, dan Thibaq dalam khazanah prosa dan puisi Arab klasik beserta nilai filosofis di baliknya.',
      category: 'Pemikiran Islam & Turāth',
      preview_snippet: 'Analisis kekuatan diksi dan resonansi makna di balik struktur retorika Arab.',
    },
  ],
  C2: [
    {
      id: 'fb-c2-1',
      title_ar: 'فَلْسَفَةُ التَّأْوِيلِ وَظِلَالُ المَعْنَى عِنْدَ أَعْلَامِ البَلَاغَةِ وَالتَّصَوُّفِ',
      title_id: 'Hermeneutika Makna dan Estetika Sufistik dalam Turats Arab',
      topic_prompt: 'Teks tingkat tinggi bernilai sastra fusha murni dengan rima dan diksi klasik mendalam, mengeksplorasi konsep keindahan mutlak, pencarian kebenaran, dan keterbatasan bahasa.',
      category: 'Filsafat & Pemikiran',
      preview_snippet: 'Karya fusha berbobot tinggi dengan i\'rab kompleks dan kekayaan metafora.',
    },
  ],
};

export class GeminiService {
  /**
   * Count actual Arabic words
   */
  public static countArabicWords(text: string): number {
    if (!text) return 0;
    const clean = text
      .replace(/[،؛؟.,!?:()«»"'\-[\]]/g, ' ')
      .trim();
    if (!clean) return 0;
    const words = clean.split(/\s+/).filter((w) => w.length > 0);
    return words.length;
  }

  /**
   * Remove Tashkeel (harakat)
   */
  public static removeTashkeel(text: string): string {
    return text.replace(/[\u064B-\u065F\u0670]/g, '');
  }

  /**
   * Check if the server has Gemini API Key configured
   */
  public static async checkServerStatus(): Promise<{ hasServerKey: boolean; model: string }> {
    try {
      const res = await fetch('/api/gemini/status');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // ignore
    }
    return { hasServerKey: false, model: 'gemini-3.7-flash' };
  }

  /**
   * Request dynamic AI-generated topic suggestions based on CEFR level and Style
   */
  public static async suggestTopics(params: {
    level: CEFRLevel;
    style: ReadingStyle;
    category?: string;
    apiKey?: string;
  }): Promise<TopicSuggestion[]> {
    try {
      const response = await fetch('/api/gemini/suggest-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          return data.suggestions;
        }
      }
    } catch (e) {
      console.warn('Could not fetch topic suggestions from server, using fallback:', e);
    }

    const fallbackList = FALLBACK_TOPICS_BY_LEVEL[params.level] || FALLBACK_TOPICS_BY_LEVEL['A2'];
    return fallbackList;
  }

  /**
   * Generate complete Arabic Reading text using Google Gemini API
   */
  public static async generateReading(params: GenerateReadingParams): Promise<ReadingItem> {
    const {
      apiKey,
      category,
      topic,
      subtopic,
      level,
      style,
      lengthPreset,
      customWordCount,
      grammarLevel,
      grammarLanguage,
      includeTransliteration,
      showHarakat,
    } = params;

    const response = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: apiKey?.trim() || undefined,
        category: category || 'Kehidupan Sehari-hari',
        topic: topic?.trim() || 'Rutinitas Pagi',
        subtopic: subtopic?.trim() || undefined,
        level,
        style,
        lengthPreset,
        customWordCount,
        grammarLevel,
        grammarLanguage,
        includeTransliteration,
        showHarakat,
      }),
    });

    if (!response.ok) {
      let errorMsg = `Server error ${response.status}: ${response.statusText}`;
      try {
        const errJson = await response.json();
        if (errJson.error) {
          errorMsg = errJson.error;
        }
      } catch {
        // ignore
      }
      throw new Error(errorMsg);
    }

    const payload = await response.json();
    if (!payload.success || !payload.data) {
      throw new Error(payload.error || 'Gagal menghasilkan materi bacaan dari Gemini API.');
    }

    const parsed = payload.data;

    const fullTextHarakat = (parsed.paragraphs || []).map((p: any) => p.ar_harakat).join('\n\n');
    const fullTextGundul = (parsed.paragraphs || [])
      .map((p: any) => p.ar_gundul || this.removeTashkeel(p.ar_harakat))
      .join('\n\n');

    const actualWordCount = this.countArabicWords(fullTextHarakat);

    const readingItem: ReadingItem = {
      id: `reading-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      title_ar: parsed.title_ar || 'نص قرائي جديد',
      title_id: parsed.title_id || 'Teks Bacaan Arab Baru',
      category: category || 'Kehidupan Sehari-hari',
      topic: topic || 'Umum',
      subtopic: subtopic,
      level,
      style,
      length_preset: lengthPreset,
      target_word_count: payload.targetWordsApprox || actualWordCount,
      actual_word_count: actualWordCount,
      grammar_level: grammarLevel,
      grammar_language: grammarLanguage,
      show_harakat_default: showHarakat,
      transliteration_enabled: includeTransliteration,
      summary: parsed.summary || 'Bacaan bahasa Arab interaktif dengan kosakata dan tata bahasa.',
      full_text_harakat: fullTextHarakat,
      full_text_gundul: fullTextGundul,
      paragraphs: parsed.paragraphs || [],
      vocabulary: parsed.vocabulary || [],
      grammar_analysis: parsed.grammar_analysis || [],
      comprehension_quiz: parsed.comprehension_quiz || [],
      read_count: 1,
      is_favorite: false,
    };

    return readingItem;
  }

  /**
   * Interactive Word & Phrase Linguistic Analysis with Source-Based Grounding
   */
  public static async analyzeSingleWord(
    word: string,
    contextSentence: string,
    apiKey?: string,
    grammarLevel: GrammarLevel = 'A2',
    mode: 'word' | 'phrase' = 'word'
  ): Promise<WordData> {
    try {
      const response = await fetch('/api/gemini/analyze-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word,
          contextSentence,
          grammarLevel,
          mode,
          apiKey: apiKey?.trim() || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.wordData) {
          return data.wordData;
        }
      }
    } catch (e) {
      console.warn('Word analysis fetch error:', e);
    }

    const clean = this.removeTashkeel(word);
    return {
      word_ar: word,
      word_clean: clean,
      word_id: `Kata: "${clean}"`,
      meaning_basic: `Makna dasar: ${clean}`,
      root: '-',
      pos: 'Kosakata Arab',
      meaning_detail: `Kata "${word}" dalam konteks kalimat.`,
      transliteration: clean,
      verification_status: 'reference',
      sources: [
        {
          name: 'المعجم الوسيط',
          category: 'lexical',
          usage: 'Rujukan leksikal umum',
        },
      ],
    };
  }
}
