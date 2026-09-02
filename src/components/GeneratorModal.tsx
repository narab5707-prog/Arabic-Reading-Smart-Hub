import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  BookOpen,
  Layers,
  FileText,
  HelpCircle,
  Check,
  AlertCircle,
  Flame,
  Languages,
  Settings2,
  RefreshCw,
  Dices,
  Lightbulb,
  ArrowRight,
  Sliders,
  PenTool,
  CheckCircle2,
} from 'lucide-react';
import {
  CEFRLevel,
  GrammarLanguage,
  GrammarLevel,
  ReadingLengthPreset,
  ReadingStyle,
  TopicSuggestion,
} from '../types';
import { TOPIC_CATEGORIES, getRandomSubtopic } from '../data/topicDatabase';
import { GeminiService, GenerateReadingParams, FALLBACK_TOPICS_BY_LEVEL } from '../services/geminiService';

interface GeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onOpenApiKeyModal: () => void;
  onGenerate: (params: GenerateReadingParams) => Promise<void>;
  isGenerating: boolean;
}

const READING_STYLES: { id: ReadingStyle; label: string; description: string }[] = [
  { id: 'cerita_naratif', label: 'Cerita Naratif', description: 'Tokoh → Situasi → Peristiwa → Perkembangan → Akhir' },
  { id: 'deskriptif', label: 'Deskriptif', description: 'Penggambaran rinci suasana, tempat, atau objek' },
  { id: 'artikel_informatif', label: 'Informatif', description: 'Penyampaian informasi dan fakta terstruktur' },
  { id: 'dialog_percakapan', label: 'Dialog', description: 'Percakapan alami antar-tokoh dalam ragam Fuṣḥā' },
  { id: 'biografi', label: 'Biografi', description: 'Kisah riwayat hidup tokoh, ilmuwan, atau sastrawan' },
  { id: 'artikel', label: 'Artikel', description: 'Ulasan topik populer, sosial, atau budaya kontemporer' },
  { id: 'esai_argumentatif', label: 'Esai Argumentatif', description: 'Pembahasan tesis, argumen logis, dan sudut pandang' },
  { id: 'reflektif_filosofis', label: 'Reflektif', description: 'Renungan mendalam, hikmah kehidupan, dan nilai batin' },
  { id: 'historis', label: 'Historis', description: 'Rekonstruksi peristiwa bersejarah dan peradaban' },
  { id: 'akademik', label: 'Akademik', description: 'Wacana ilmiah formal, istilah konseptual, dan analisis mendalam' },
];

const CEFR_GUIDES: Record<CEFRLevel, { label: string; focus: string; example: string }> = {
  A1: {
    label: 'A1 - Pemula Dasar',
    focus: 'Dunia konkret & dekat, kalimat pendek sangat sederhana, kosakata harian dasar.',
    example: 'Perjalanan sederhana atau kegiatan harian rutin.',
  },
  A2: {
    label: 'A2 - Elementer',
    focus: 'Pengalaman pribadi, urutan waktu kronologis, sebab-akibat dan deskripsi sederhana.',
    example: 'Cerita pengalaman perjalanan dan tempat baru.',
  },
  B1: {
    label: 'B1 - Menengah',
    focus: 'Pengalaman manusia & sosial, pembahasan masalah, sebab-akibat jelas, sudut pandang opini.',
    example: 'Manfaat dan tantangan dalam perjalanan hidup.',
  },
  B2: {
    label: 'B2 - Menengah Atas',
    focus: 'Analisis & perbandingan, isu sosial kompleks, argumentasi berkembang, konsep abstrak menengah.',
    example: 'Perjalanan dan pertukaran lintas budaya.',
  },
  C1: {
    label: 'C1 - Mahir',
    focus: 'Gagasan abstrak & kritis, makna tersirat, argumentasi multi-sudut pandang, nuansa semantik retoris.',
    example: 'Perjalanan dan proses pembentukan identitas diri.',
  },
  C2: {
    label: 'C2 - Master / Mahir Tinggi',
    focus: 'Wacana multidisipliner, analisis filosofis, asumsi tersembunyi, retorika dan turats mendalam.',
    example: 'Perjalanan antara penemuan dunia dan rekonsiliasi eksistensial diri.',
  },
};

export const GeneratorModal: React.FC<GeneratorModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onOpenApiKeyModal,
  onGenerate,
  isGenerating,
}) => {
  // Category & Subtopic state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('kehidupan_sehari_hari');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('Rutinitas pagi');
  const [isCustomTopicMode, setIsCustomTopicMode] = useState<boolean>(false);
  const [customTopicInput, setCustomTopicInput] = useState<string>('');

  // Core generation parameters
  const [level, setLevel] = useState<CEFRLevel>('A2');
  const [grammarLevel, setGrammarLevel] = useState<GrammarLevel>('auto');
  const [style, setStyle] = useState<ReadingStyle>('cerita_naratif');
  const [lengthPreset, setLengthPreset] = useState<ReadingLengthPreset>('1_page');
  const [customWordCount, setCustomWordCount] = useState<number>(300);
  const [grammarLanguage, setGrammarLanguage] = useState<GrammarLanguage>('ar_id');
  const [includeTransliteration, setIncludeTransliteration] = useState(true);
  const [showHarakat, setShowHarakat] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active Category Object
  const currentCategory = TOPIC_CATEGORIES.find((c) => c.id === selectedCategoryId) || TOPIC_CATEGORIES[0];

  // When category changes, auto-select first subtopic unless in custom mode
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    const cat = TOPIC_CATEGORIES.find((c) => c.id === categoryId);
    if (cat && cat.subtopics.length > 0) {
      setSelectedSubtopic(cat.subtopics[0]);
    }
  };

  if (!isOpen) return null;

  const handleRandomSubtopic = () => {
    const randomSub = getRandomSubtopic(selectedCategoryId);
    setSelectedSubtopic(randomSub);
    setIsCustomTopicMode(false);
  };

  const handleSurpriseEverything = () => {
    const randomCat = TOPIC_CATEGORIES[Math.floor(Math.random() * TOPIC_CATEGORIES.length)];
    setSelectedCategoryId(randomCat.id);
    const randomSub = randomCat.subtopics[Math.floor(Math.random() * randomCat.subtopics.length)];
    setSelectedSubtopic(randomSub);
    setIsCustomTopicMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const finalCategory = currentCategory.name;
    let finalTopic = '';

    if (isCustomTopicMode) {
      if (!customTopicInput.trim()) {
        setErrorMsg('Silakan tulis topik manual yang ingin Anda pelajari.');
        return;
      }
      finalTopic = customTopicInput.trim();
    } else {
      finalTopic = selectedSubtopic || currentCategory.subtopics[0] || currentCategory.name;
    }

    try {
      await onGenerate({
        apiKey,
        category: finalCategory,
        topic: finalTopic,
        subtopic: !isCustomTopicMode ? selectedSubtopic : undefined,
        level,
        style,
        lengthPreset,
        customWordCount: lengthPreset === 'custom' ? customWordCount : undefined,
        grammarLevel,
        grammarLanguage,
        includeTransliteration,
        showHarakat,
      });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat menghasilkan teks.';
      setErrorMsg(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-850 to-emerald-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/50 rounded-2xl border border-emerald-500/40 text-amber-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2">
                <span>Generator Teks Bacaan Bahasa Arab Fuṣḥā</span>
                <span className="text-[11px] bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full font-bold">
                  CEFR A1–C2
                </span>
              </h3>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Kategori → Topik → Subtopik → Level Bacaan → Gaya Bacaan (Reading-First System)
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-slate-800 text-sm">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. KATEGORI BACAAN (18 Kategori Lengkap) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-bold">
                  1
                </span>
                <span>Pilih Kategori Utama (18 Kategori Fuṣḥā)</span>
              </label>

              <button
                type="button"
                onClick={handleSurpriseEverything}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <Dices className="w-3.5 h-3.5" />
                <span>Acak Kategori & Subtopik</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TOPIC_CATEGORIES.map((cat) => {
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="text-xl shrink-0">{cat.icon}</span>
                    <span className="font-semibold text-xs leading-tight line-clamp-1">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. TOPIK & SUBTOPIK ATAU TULIS SENDIRI */}
          <div className="space-y-2.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-bold">
                  2
                </span>
                <span>Subtopik: {currentCategory.icon} {currentCategory.name}</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomTopicMode(!isCustomTopicMode)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isCustomTopicMode
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <PenTool className="w-3 h-3" />
                  <span>{isCustomTopicMode ? 'Gunakan Pilihan Database' : 'Tulis Topik Sendiri'}</span>
                </button>

                {!isCustomTopicMode && (
                  <button
                    type="button"
                    onClick={handleRandomSubtopic}
                    className="p-1 text-slate-500 hover:text-emerald-700 transition"
                    title="Pilih subtopik acak dari kategori ini"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {isCustomTopicMode ? (
              <div className="space-y-1.5 pt-1">
                <input
                  type="text"
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  placeholder={`Contoh: "Kopi Arab dan Tradisi Keramahan di Hijaz" atau "Kisah Kucing Cerdas"`}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs bg-white"
                />
                <p className="text-[11px] text-slate-500">
                  AI akan menerima topik Anda dan otomatis menyesuaikan kompleksitas bahasa dengan Level CEFR yang dipilih.
                </p>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <select
                  value={selectedSubtopic}
                  onChange={(e) => setSelectedSubtopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-xs text-slate-800 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                >
                  {currentCategory.subtopics.map((sub, idx) => (
                    <option key={idx} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentCategory.subtopics.slice(0, 6).map((sub, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedSubtopic(sub)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                        selectedSubtopic === sub
                          ? 'bg-emerald-700 text-white font-bold'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. LEVEL BACAAN CEFR (A1 - C2) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-bold">
                  3
                </span>
                <span>Level Kemahiran Bacaan (CEFR)</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {CEFR_GUIDES[level].label}
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1.5">
              {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => {
                const isCurrent = level === lvl;
                return (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setLevel(lvl)}
                    className={`py-2.5 px-2 rounded-xl font-bold text-center transition cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-800 text-white shadow-md ring-2 ring-emerald-600/30'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    <span className="text-sm block">{lvl}</span>
                    <span className="text-[10px] font-normal opacity-80 block truncate">
                      {lvl === 'A1' ? 'Dasar' : lvl === 'A2' ? 'Elementer' : lvl === 'B1' ? 'Menengah' : lvl === 'B2' ? 'Madya' : lvl === 'C1' ? 'Mahir' : 'Master'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Pedagogic Level Guide Explanation Box */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl text-xs space-y-1">
              <p className="font-semibold text-emerald-950">
                📌 Karakteristik Level {level}: <span className="font-normal text-emerald-900">{CEFR_GUIDES[level].focus}</span>
              </p>
              <p className="text-[11px] text-emerald-800 italic">
                Contoh adaptasi topik: "{CEFR_GUIDES[level].example}"
              </p>
            </div>
          </div>

          {/* 4. LEVEL URAIAN KAIDAH (TERPISAH DARI LEVEL BACAAN) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-bold">
                  4
                </span>
                <span>Tingkat Uraian Kaidah (Nahwu & Sharaf)</span>
              </label>
              <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Terpisah dari level naskah bacaan
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-xs">
              {(['auto', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as GrammarLevel[]).map((gl) => (
                <button
                  type="button"
                  key={gl}
                  onClick={() => setGrammarLevel(gl)}
                  className={`py-2 px-2 rounded-xl font-bold transition text-center cursor-pointer ${
                    grammarLevel === gl
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {gl === 'auto' ? `Auto (${level})` : gl}
                </button>
              ))}
            </div>
          </div>

          {/* 5. GAYA BACAAN (10 Styles) */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-bold">
                5
              </span>
              <span>Gaya Bacaan (Reading Style)</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {READING_STYLES.map((st) => (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setStyle(st.id)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    style === st.id
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs block leading-tight">{st.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 6. PANJANG HALAMAN & TARGET KATA */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-bold">
                6
              </span>
              <span>Panjang Halaman & Target Kata</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: '1_page', label: '1 Halaman', count: '±250–320 kata' },
                { id: '2_pages', label: '2 Halaman', count: '±500–620 kata' },
                { id: '3_pages', label: '3 Halaman', count: '±750–920 kata' },
                { id: '5_pages', label: '5 Halaman', count: '±1.250–1.550 kata' },
                { id: 'custom', label: 'Custom', count: `${customWordCount} kata` },
              ].map((lp) => (
                <button
                  type="button"
                  key={lp.id}
                  onClick={() => setLengthPreset(lp.id as ReadingLengthPreset)}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                    lengthPreset === lp.id
                      ? 'bg-emerald-800 text-white font-bold border-emerald-800 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs block font-bold">{lp.label}</span>
                  <span className="text-[10px] opacity-80 block">{lp.count}</span>
                </button>
              ))}
            </div>

            {lengthPreset === 'custom' && (
              <div className="pt-2 flex items-center gap-3">
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={customWordCount}
                  onChange={(e) => setCustomWordCount(Number(e.target.value))}
                  className="flex-1 accent-emerald-600"
                />
                <span className="font-mono text-xs font-bold text-emerald-900 px-3 py-1 bg-emerald-100 rounded-lg shrink-0">
                  {customWordCount} Kata
                </span>
              </div>
            )}
          </div>
        </form>

        {/* Modal Footer / Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200 transition cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isGenerating}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-800 hover:to-teal-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-900/20 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>Menghasilkan Teks Arab Fuṣḥā...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Hasilkan Teks Bacaan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
