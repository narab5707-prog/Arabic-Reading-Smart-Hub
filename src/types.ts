export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type GrammarLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'auto';

export type GrammarLanguage = 'ar_id' | 'ar_only' | 'id_only' | 'auto';

export type ReadingStyle =
  | 'cerita_naratif'
  | 'deskriptif'
  | 'artikel_informatif'
  | 'dialog_percakapan'
  | 'biografi'
  | 'artikel'
  | 'esai_argumentatif'
  | 'reflektif_filosofis'
  | 'historis'
  | 'akademik';

export type ReadingLengthPreset =
  | '1_page' // ±250-300 kata
  | '2_pages' // ±500-600 kata
  | '3_pages' // ±750-900 kata
  | '5_pages' // ±1.250-1.500 kata
  | 'custom';

export type ReadingMode = 'book' | 'portrait' | 'landscape' | 'focus' | 'two_pages';

export type ReadingTheme =
  | 'classic_light'
  | 'warm_paper'
  | 'dark'
  | 'deep_dark'
  | 'soft_green'
  | 'soft_blue'
  | 'high_contrast';

export type LineSpacingPreset = 'compact' | 'normal' | 'relaxed';

export type ArabicFontFamily = 'amiri' | 'scheherazade' | 'cairo' | 'tajawal';

export type FontSizePreset = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type LanguageVersion =
  | 'ar_fusha' // العربية الفصحى (Modern Standard Arabic)
  | 'ar_saudi' // 🇸🇦 Saudi Arabic (لهجة سعودية)
  | 'ar_egyptian' // 🇪🇬 Egyptian Arabic (لهجة مصرية)
  | 'ar_levantine' // 🇸🇾 Levantine Arabic (لهجة شامية)
  | 'ar_gulf' // 🌴 Gulf Arabic (لهجة خليجية)
  | 'en_british' // 🇬🇧 British English
  | 'en_american'; // 🇺🇸 American English

export type VoiceCharacterId =
  | 'female_calm' // Suara Perempuan Tenang & Lembut
  | 'female_clear' // Suara Perempuan Jelas (Pengajar/Guru)
  | 'male_calm' // Suara Laki-laki Tenang & Natural
  | 'male_clear' // Suara Laki-laki Jelas (Penyiar/Pendidik)
  | 'narrative' // Suara Naratif / Kisah & Cerita
  | 'academic' // Suara Akademik / Formal Stabil
  | 'warm_conversational' // Suara Hangat & Santai
  | 'formal'; // Suara Formal Resmi

export type ParagraphStatus = 'unread' | 'reading' | 'completed';

export interface ParagraphRecording {
  id: string; // e.g. `${reading_id}_p_${paragraph_id}`
  reading_id: string;
  paragraph_id: number;
  audio_url: string; // Base64 data URL
  duration_seconds: number;
  created_at: string;
}

export interface ParagraphProgress {
  paragraph_id: number;
  status: ParagraphStatus;
  audio_listened: boolean;
  recording_completed: boolean;
}

export type VerificationStatus = 'verified' | 'reference' | 'unverified';

export interface AuthoritativeSource {
  name: string;
  category: 'lexical' | 'nahwu' | 'sarf' | 'turath' | 'general';
  usage: string;
  entry_snippet?: string;
  digital_ref?: string;
}

export interface WordData {
  word_ar: string;
  word_clean: string;
  word_id: string; // Meaning in context (Bahasa Indonesia)
  meaning_basic?: string; // Makna dasar / leksikal kamus
  meaning_detail?: string; // Penjelasan makna dalam konteks kalimat ini
  root?: string; // Akar kata (جذر) - tidak boleh ditebak
  pos?: string; // Jenis kata (اسم / فعل / حرف / صفة / مصدر / اسم فاعل / إلخ)
  wazan?: string; // Wazan / Pola morfologis (وزن / صيغة)
  sarf_analysis?: string; // Bentuk kata, fi'il madhi/mudhari', wazan
  nahwu_function?: string; // Fungsi nahwu dalam kalimat (فاعل / مفعول به / مبتدأ / خبر / إلخ)
  grammar_rule?: string; // Kaidah bahasa sesuai LEVEL_URAIAN_KAIDAH
  transliteration?: string;
  nahwu_note?: string;
  
  // Uslub alternatif
  uslub_alternative?: {
    original_phrase?: string;
    alternative_ar: string;
    nuance_difference: string;
    formality_level?: string;
  };

  // Sumber referensi otoritatif & status verifikasi
  sources?: AuthoritativeSource[];
  verification_status?: VerificationStatus;
  verification_note?: string;
  is_phrase?: boolean; // Mode عبارة / أسلوب vs كلمة
}

export interface ParagraphData {
  id: number;
  ar_harakat: string;
  ar_gundul: string;
  id_translation: string;
  arabic_harakat?: string;
  arabic_gundul?: string;
  indonesian_text?: string;
  transliteration?: string;
}

export interface GrammarRule {
  id: string;
  title: string;
  category: 'nahwu' | 'shorof' | 'balaghah' | 'umum';
  rule_ar: string;
  rule_id: string;
  example_ar: string;
  example_id: string;
  explanation: string;
  transliteration?: string;
  sources?: string[];
}

export interface QuizQuestion {
  id: number;
  question_ar: string;
  question_id: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface ReadingItem {
  id: string;
  created_at: string;
  title_ar: string;
  title_id: string;
  category?: string;
  topic: string;
  subtopic?: string;
  level: CEFRLevel;
  style: ReadingStyle;
  length_preset: ReadingLengthPreset;
  language_version?: LanguageVersion;
  target_word_count: number;
  actual_word_count: number;
  grammar_level: GrammarLevel;
  grammar_language: GrammarLanguage;
  show_harakat_default: boolean;
  transliteration_enabled: boolean;
  
  summary: string;
  full_text_harakat: string;
  full_text_gundul: string;
  paragraphs: ParagraphData[];
  vocabulary: WordData[];
  grammar_analysis: GrammarRule[];
  comprehension_quiz?: QuizQuestion[];
  
  read_count?: number;
  is_favorite?: boolean;
  completed_at?: string;
}

export interface AudioRecordingItem {
  id: string;
  reading_id: string;
  reading_title: string;
  created_at: string;
  duration_seconds: number;
  audio_url: string; // Base64 data URL
  notes?: string;
}

export interface TopicCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  subtopics: string[];
}

export interface TopicSuggestion {
  id?: string;
  title_id: string;
  title_ar: string;
  category: string;
  topic_prompt: string;
  suitable_style?: ReadingStyle;
  preview_snippet?: string;
}

export interface UserStats {
  total_words_read: number;
  total_readings_completed: number;
  total_recording_seconds: number;
  total_flashcards_mastered: number;
  last_practice_date: string;
  current_streak_days: number;
  daily_completed_history?: {
    date: string;
    reading_id: string;
    reading_title: string;
    words_count: number;
    recorded: boolean;
  }[];
  level_counts: Record<CEFRLevel, number>;
}

export interface UserSettings {
  gemini_api_key: string;
  preferred_model: string;
  font_family: ArabicFontFamily;
  font_size: FontSizePreset;
  line_spacing: LineSpacingPreset;
  reading_mode: ReadingMode;
  reading_theme: ReadingTheme;
  language_version?: LanguageVersion;
  default_harakat: boolean;
  default_transliteration: boolean;
  auto_speak_on_click: boolean;
  auto_next_paragraph: boolean;
  voice_character: VoiceCharacterId;
  audio_speed: number;
}
