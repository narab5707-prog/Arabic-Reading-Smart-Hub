import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Layers,
  BookMarked,
  HelpCircle,
  BarChart3,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  Flame,
  Volume2,
  FileText,
  Key,
  Zap,
  RefreshCw,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  ArabicFontFamily,
  AudioRecordingItem,
  CEFRLevel,
  FontSizePreset,
  ReadingItem,
  UserSettings,
  UserStats,
  WordData,
} from './types';
import { StorageService } from './services/storageService';
import { GeminiService, GenerateReadingParams, FALLBACK_TOPICS_BY_LEVEL } from './services/geminiService';
import { Header } from './components/Header';
import { ReadingViewer } from './components/ReadingViewer';
import { GrammarSection } from './components/GrammarSection';
import { VocabularySection } from './components/VocabularySection';
import { ComprehensionQuiz } from './components/ComprehensionQuiz';
import { GeneratorModal } from './components/GeneratorModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { WordAnalysisModal } from './components/WordAnalysisModal';
import { HistoryAndStatsModal } from './components/HistoryAndStatsModal';

export default function App() {
  // Persistence States
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());
  const [stats, setStats] = useState<UserStats>(StorageService.getStats());
  const [readings, setReadings] = useState<ReadingItem[]>(StorageService.getReadings());
  const [activeReadingId, setActiveReadingId] = useState<string>(
    StorageService.getActiveReadingId() || readings[0]?.id || ''
  );
  const [savedWords, setSavedWords] = useState<WordData[]>(StorageService.getSavedWords());
  const [recordings, setRecordings] = useState<AudioRecordingItem[]>(StorageService.getRecordings());

  // UI Active Sub-view (Reading, Grammar, Vocab, Quiz)
  const [activeSubTab, setActiveSubTab] = useState<'reading' | 'grammar' | 'vocab' | 'quiz'>('reading');

  // Modals
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const [wordContextSentence, setWordContextSentence] = useState<string>('');
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStatusText, setGeneratingStatusText] = useState('Menyusun narasi bacaan Arab...');
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [inlineTopic, setInlineTopic] = useState('');
  const [inlineLevel, setInlineLevel] = useState<CEFRLevel>('A2');

  // Active reading item
  const activeReading = readings.find((r) => r.id === activeReadingId) || readings[0];

  // Sync inlineLevel with active reading level if available
  useEffect(() => {
    if (activeReading?.level) {
      setInlineLevel(activeReading.level);
    }
  }, [activeReading?.level]);

  // Refresh saved items from storage
  const refreshStorageData = () => {
    setSettings(StorageService.getSettings());
    setStats(StorageService.getStats());
    setReadings(StorageService.getReadings());
    setSavedWords(StorageService.getSavedWords());
    setRecordings(StorageService.getRecordings());
  };

  // Handle word click on Arabic reading text
  const handleWordClick = (word: WordData, contextSentence?: string) => {
    setSelectedWord(word);
    setWordContextSentence(contextSentence || '');
    setIsWordModalOpen(true);
  };

  // Direct manual topic submit from inline input
  const handleDirectTopicSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanTopic = inlineTopic.trim();
    if (!cleanTopic) {
      setIsGeneratorOpen(true);
      return;
    }
    await handleGenerateReading({
      apiKey: settings.gemini_api_key,
      topic: cleanTopic,
      level: inlineLevel,
      style: activeReading?.style || 'cerita_naratif',
      lengthPreset: '1_page',
      grammarLevel: 'auto',
      grammarLanguage: 'ar_id',
      includeTransliteration: true,
      showHarakat: true,
    });
    setInlineTopic('');
  };

  // Generate new reading text with Gemini AI
  const handleGenerateReading = async (params: GenerateReadingParams) => {
    setIsGenerating(true);
    setGenerationError(null);
    setGeneratingStatusText(`Gemini AI sedang menulis teks bacaan level ${params.level}...`);
    try {
      const newReading = await GeminiService.generateReading(params);
      StorageService.addReading(newReading);
      setReadings(StorageService.getReadings());
      setActiveReadingId(newReading.id);
      setStats(StorageService.getStats());
      setActiveSubTab('reading');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat menyusun materi bacaan.';
      console.error('Generation failed:', msg);
      setGenerationError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // 1-Click Instant Quick Generation
  const handleQuickGenerate = async () => {
    const currentLvl = activeReading?.level || 'A2';
    const fallbackList = FALLBACK_TOPICS_BY_LEVEL[currentLvl] || FALLBACK_TOPICS_BY_LEVEL['A2'];
    const randomTopic = fallbackList[Math.floor(Math.random() * fallbackList.length)];
    const chosenTopic = `${randomTopic.title_id} (${randomTopic.title_ar}): ${randomTopic.topic_prompt}`;

    await handleGenerateReading({
      apiKey: settings.gemini_api_key,
      topic: chosenTopic,
      level: currentLvl,
      style: activeReading?.style || 'cerita_naratif',
      lengthPreset: '1_page',
      grammarLevel: 'auto',
      grammarLanguage: 'ar_id',
      includeTransliteration: true,
      showHarakat: true,
    });
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    StorageService.toggleFavorite(id);
    setReadings(StorageService.getReadings());
  };

  // Select reading from library
  const handleSelectReading = (id: string) => {
    setActiveReadingId(id);
    StorageService.setActiveReadingId(id);
    setActiveSubTab('reading');
  };

  // Delete reading
  const handleDeleteReading = (id: string) => {
    StorageService.deleteReading(id);
    const updated = StorageService.getReadings();
    setReadings(updated);
    if (activeReadingId === id) {
      setActiveReadingId(updated[0]?.id || '');
    }
  };

  // Update Settings
  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col selection:bg-emerald-200 selection:text-emerald-950 font-sans pb-16 relative">
      {/* Global Generating Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-60 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-emerald-100 space-y-4">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping opacity-25" />
              <div className="w-16 h-16 rounded-full border-4 border-emerald-700 border-t-transparent animate-spin flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-emerald-700 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Menyusun Narasi Baru</h3>
              <p className="text-xs text-emerald-800 font-semibold mt-1">{generatingStatusText}</p>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Memproses harakat lengkap, glosarium kata, uraian Nahwu/Shorof, dan kuis pemahaman...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* App Header */}
      <Header
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onQuickGenerate={handleQuickGenerate}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenHistoryStats={() => setIsHistoryOpen(true)}
        settings={settings}
        stats={stats}
        savedWordsCount={savedWords.length}
        isGenerating={isGenerating}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 w-full flex-1 space-y-6">
        {/* Error Notification Banner if any */}
        {generationError && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start justify-between gap-3 shadow-sm animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <p className="font-bold text-amber-900">Perhatian Penyusunan Materi</p>
                <p className="text-amber-800 leading-relaxed">{generationError}</p>
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={handleQuickGenerate}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition cursor-pointer text-[11px]"
                  >
                    Coba Lagi Sekarang
                  </button>
                  <button
                    onClick={() => setIsApiKeyModalOpen(true)}
                    className="px-3 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold rounded-lg transition cursor-pointer text-[11px]"
                  >
                    Periksa Kunci API Gemini
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setGenerationError(null)}
              className="p-1 text-amber-700 hover:bg-amber-200/60 rounded-lg transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Direct Manual Topic Input Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-sm sm:text-base text-slate-900">
                Tulis Topik Bacaan Bebas (Manual)
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 w-fit">
              100% Sesuai yang Anda Tulis
            </span>
          </div>

          <form onSubmit={handleDirectTopicSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={inlineTopic}
                onChange={(e) => setInlineTopic(e.target.value)}
                placeholder="Ketik topik apa saja: Kisah Juha, Kehidupan di Kairo, Sains, Kucing Lucu, dll..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100 rounded-xl text-sm font-medium transition text-slate-900 placeholder:text-slate-400 shadow-2xs"
              />
              {inlineTopic.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setInlineTopic('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                  title="Hapus teks"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Level Selector Pills */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5 shrink-0">
              {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setInlineLevel(lvl)}
                  className={`px-2.5 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    inlineLevel === lvl
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title={`Tingkat CEFR ${lvl}`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="submit"
                disabled={isGenerating || !inlineTopic.trim()}
                className="flex-1 md:flex-none px-4 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 active:from-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>{isGenerating ? 'Menyusun...' : 'Buat Sesuai Topik'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGeneratorOpen(true)}
                className="px-3 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                title="Buka opsi lengkap panjang halaman & tata bahasa"
              >
                Opsi Lengkap
              </button>
            </div>
          </form>
        </div>

        {activeReading ? (
          <>
            {/* Navigation Tabs (Bacaan Utama, Kaidah Nahwu-Shorof, Kamus Kosakata, Kuis Pemahaman) */}
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-1 overflow-x-auto">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveSubTab('reading')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeSubTab === 'reading'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Teks Bacaan Arab</span>
                </button>

                <button
                  onClick={() => setActiveSubTab('grammar')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeSubTab === 'grammar'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Uraian Kaidah ({activeReading.grammar_analysis?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveSubTab('vocab')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeSubTab === 'vocab'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BookMarked className="w-4 h-4" />
                  <span>Kosakata ({activeReading.vocabulary?.length || 0})</span>
                </button>

                {activeReading.comprehension_quiz && activeReading.comprehension_quiz.length > 0 && (
                  <button
                    onClick={() => setActiveSubTab('quiz')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      activeSubTab === 'quiz'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Kuis Pemahaman ({activeReading.comprehension_quiz.length})</span>
                  </button>
                )}
              </div>

              {/* Quick Actions to Generate New Text */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleQuickGenerate}
                  disabled={isGenerating}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-50 rounded-xl transition border border-amber-200/80 cursor-pointer disabled:opacity-50"
                  title="Buat narasi bacaan baru acak secara langsung"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Narasi Acak Baru</span>
                </button>

                <button
                  onClick={() => setIsGeneratorOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kustomisasi Topik</span>
                </button>
              </div>
            </div>

            {/* Active Sub Tab Content */}
            {activeSubTab === 'reading' && (
              <ReadingViewer
                reading={activeReading}
                onWordClick={handleWordClick}
                onToggleFavorite={handleToggleFavorite}
                apiKey={settings.gemini_api_key}
                fontSize={settings.font_size}
                fontFamily={settings.font_family}
                lineSpacing={settings.line_spacing || 'standard'}
                readingMode={settings.reading_mode || 'book'}
                readingTheme={settings.reading_theme || 'classic_light'}
                voiceCharacter={settings.voice_character || 'female_calm'}
                audioSpeed={settings.audio_speed || 1.0}
                autoSpeakOnClick={settings.auto_speak_on_click ?? true}
                autoNextParagraph={settings.auto_next_paragraph ?? false}
                onChangeFontSize={(sz: FontSizePreset) =>
                  handleSaveSettings({ ...settings, font_size: sz })
                }
                onChangeFontFamily={(fam: ArabicFontFamily) =>
                  handleSaveSettings({ ...settings, font_family: fam })
                }
                onChangeLineSpacing={(spacing) =>
                  handleSaveSettings({ ...settings, line_spacing: spacing })
                }
                onChangeReadingMode={(mode) =>
                  handleSaveSettings({ ...settings, reading_mode: mode })
                }
                onChangeReadingTheme={(theme) =>
                  handleSaveSettings({ ...settings, reading_theme: theme })
                }
                onChangeVoiceCharacter={(voice) =>
                  handleSaveSettings({ ...settings, voice_character: voice })
                }
                onChangeAudioSpeed={(speed) =>
                  handleSaveSettings({ ...settings, audio_speed: speed })
                }
                onToggleAutoSpeak={(val) =>
                  handleSaveSettings({ ...settings, auto_speak_on_click: val })
                }
                onToggleAutoNextParagraph={(val) =>
                  handleSaveSettings({ ...settings, auto_next_paragraph: val })
                }
                onReadingCompleted={(newStats) => {
                  setStats(newStats);
                }}
              />
            )}

            {activeSubTab === 'grammar' && (
              <GrammarSection
                grammarRules={activeReading.grammar_analysis}
                grammarLevel={activeReading.grammar_level}
                grammarLanguage={activeReading.grammar_language}
              />
            )}

            {activeSubTab === 'vocab' && (
              <VocabularySection
                vocabulary={activeReading.vocabulary}
                onWordClick={(w) => handleWordClick(w)}
                onSavedWordsChanged={refreshStorageData}
              />
            )}

            {activeSubTab === 'quiz' && activeReading.comprehension_quiz && (
              <ComprehensionQuiz questions={activeReading.comprehension_quiz} />
            )}
          </>
        ) : (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <BookOpen className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-bold text-slate-800">Belum Ada Teks Bacaan</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Mulai perjalanan membaca bahasa Arab Anda dengan membuat materi bacaan baru sesuai level CEFR yang Anda inginkan.
            </p>
            <button
              onClick={() => setIsGeneratorOpen(true)}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Buat Bacaan Pertama Anda
            </button>
          </div>
        )}
      </main>

      {/* MODALS */}
      {/* 1. Generator Modal */}
      <GeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        apiKey={settings.gemini_api_key}
        onOpenApiKeyModal={() => {
          setIsGeneratorOpen(false);
          setIsApiKeyModalOpen(true);
        }}
        onGenerate={handleGenerateReading}
        isGenerating={isGenerating}
      />

      {/* 2. API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      {/* 3. Word Analysis Modal */}
      <WordAnalysisModal
        isOpen={isWordModalOpen}
        onClose={() => setIsWordModalOpen(false)}
        wordData={selectedWord}
        contextSentence={wordContextSentence}
        apiKey={settings.gemini_api_key}
        onWordSavedChanged={refreshStorageData}
      />

      {/* 4. History & Stats Modal */}
      <HistoryAndStatsModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        readings={readings}
        onSelectReading={handleSelectReading}
        onDeleteReading={handleDeleteReading}
        stats={stats}
        savedWords={savedWords}
        recordings={recordings}
        onDataImported={refreshStorageData}
      />
    </div>
  );
}
