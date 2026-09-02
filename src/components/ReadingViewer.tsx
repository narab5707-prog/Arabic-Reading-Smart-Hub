import React, { useState, useEffect, useMemo } from 'react';
import {
  Type,
  Maximize2,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Eye,
  EyeOff,
  Sparkles,
  BookOpen,
  Sliders,
  CheckCircle2,
  VolumeX,
  Sun,
  Moon,
  Coffee,
  Palette,
  AlignJustify,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Layers,
  Gauge,
  BookMarked,
  Contrast,
  Leaf,
  Globe,
  FastForward,
  Mic,
  Headphones,
  CheckCheck,
  Award,
} from 'lucide-react';
import {
  ArabicFontFamily,
  FontSizePreset,
  LanguageVersion,
  LineSpacingPreset,
  ParagraphData,
  ParagraphProgress,
  ParagraphRecording,
  ReadingItem,
  ReadingMode,
  ReadingTheme,
  UserStats,
  VoiceCharacterId,
  WordData,
} from '../types';
import { ParagraphFocusUnit } from './ParagraphFocusUnit';
import { AudioRecorder } from './AudioRecorder';
import { audioService, LANGUAGE_VARIANTS, VOICE_CHARACTERS } from '../services/audioService';
import { StorageService } from '../services/storageService';

interface ReadingViewerProps {
  reading: ReadingItem;
  onWordClick: (word: WordData, contextSentence?: string) => void;
  onToggleFavorite: (id: string) => void;
  apiKey: string;
  fontSize: FontSizePreset;
  fontFamily: ArabicFontFamily;
  lineSpacing: LineSpacingPreset;
  readingMode: ReadingMode;
  readingTheme: ReadingTheme;
  voiceCharacter: VoiceCharacterId;
  audioSpeed: number;
  autoSpeakOnClick: boolean;
  autoNextParagraph: boolean;
  onChangeFontSize: (size: FontSizePreset) => void;
  onChangeFontFamily: (family: ArabicFontFamily) => void;
  onChangeLineSpacing: (spacing: LineSpacingPreset) => void;
  onChangeReadingMode: (mode: ReadingMode) => void;
  onChangeReadingTheme: (theme: ReadingTheme) => void;
  onChangeVoiceCharacter: (voice: VoiceCharacterId) => void;
  onChangeAudioSpeed: (speed: number) => void;
  onToggleAutoSpeak: (val: boolean) => void;
  onToggleAutoNextParagraph: (val: boolean) => void;
  onReadingCompleted?: (stats: UserStats) => void;
}

export const ReadingViewer: React.FC<ReadingViewerProps> = ({
  reading,
  onWordClick,
  onToggleFavorite,
  apiKey,
  fontSize,
  fontFamily,
  lineSpacing,
  readingMode,
  readingTheme,
  voiceCharacter,
  audioSpeed,
  autoSpeakOnClick,
  autoNextParagraph,
  onChangeFontSize,
  onChangeFontFamily,
  onChangeLineSpacing,
  onChangeReadingMode,
  onChangeReadingTheme,
  onChangeVoiceCharacter,
  onChangeAudioSpeed,
  onToggleAutoSpeak,
  onToggleAutoNextParagraph,
  onReadingCompleted,
}) => {
  // Global reading toggles
  const [showHarakat, setShowHarakat] = useState<boolean>(reading.show_harakat_default ?? true);
  const [showTranslations, setShowTranslations] = useState<boolean>(false);
  const [showTransliteration, setShowTransliteration] = useState<boolean>(
    reading.transliteration_enabled ?? true
  );

  // Active language variety (Fusha, Saudi, Egyptian, Levantine, Gulf, British English, American English)
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageVersion>(
    reading.language_version || 'ar_fusha'
  );

  // Paragraph Focus: index of currently active focused paragraph (0 to paragraphs.length - 1)
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number>(0);

  // Per-Paragraph Recordings & Progress from local storage
  const [paragraphRecordings, setParagraphRecordings] = useState<Record<number, ParagraphRecording>>({});
  const [paragraphProgress, setParagraphProgress] = useState<Record<number, ParagraphProgress>>({});

  // Full Text Playback State
  const [isPlayingFullText, setIsPlayingFullText] = useState<boolean>(false);

  // Sync state on reading change
  useEffect(() => {
    setActiveParagraphIndex(0);
    setParagraphRecordings(StorageService.getParagraphRecordings(reading.id));
    setParagraphProgress(StorageService.getParagraphProgress(reading.id));
    if (reading.language_version) {
      setSelectedLanguage(reading.language_version);
    }
  }, [reading.id, reading.language_version]);

  // Handle saving recording for a specific paragraph
  const handleSaveParagraphRecording = (recordingItem: ParagraphRecording) => {
    StorageService.saveParagraphRecording(recordingItem);
    setParagraphRecordings(StorageService.getParagraphRecordings(reading.id));
  };

  // Handle deleting recording for a specific paragraph
  const handleDeleteParagraphRecording = (paragraphId: number) => {
    StorageService.deleteParagraphRecording(reading.id, paragraphId);
    setParagraphRecordings(StorageService.getParagraphRecordings(reading.id));
  };

  // Handle updating progress for a specific paragraph
  const handleUpdateParagraphProgress = (
    paragraphId: number,
    update: Partial<ParagraphProgress>
  ) => {
    const updated = StorageService.updateParagraphProgress(reading.id, paragraphId, update);
    setParagraphProgress(updated);
  };

  // Auto-Next transition when paragraph audio finishes
  const handleParagraphAudioEnded = (currentIndex: number) => {
    if (autoNextParagraph && currentIndex + 1 < reading.paragraphs.length) {
      const nextIndex = currentIndex + 1;
      setActiveParagraphIndex(nextIndex);
      // Smooth scroll to next paragraph
      const nextElement = document.getElementById(`paragraph-unit-${reading.paragraphs[nextIndex].id}`);
      if (nextElement) {
        nextElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Full Text TTS Playback
  const handleTogglePlayFullText = async () => {
    if (isPlayingFullText) {
      audioService.stopSpeaking();
      setIsPlayingFullText(false);
      return;
    }

    setIsPlayingFullText(true);
    const fullText = reading.paragraphs
      .map((p) => (showHarakat ? p.ar_harakat || p.arabic_harakat : p.ar_gundul || p.arabic_gundul))
      .filter(Boolean)
      .join(' . ');

    try {
      await audioService.speak(fullText, {
        rate: audioSpeed,
        voiceCharacter,
        languageVersion: selectedLanguage,
        onEnd: () => setIsPlayingFullText(false),
      });
    } catch (e) {
      console.error('Full text TTS error:', e);
    } finally {
      setIsPlayingFullText(false);
    }
  };

  // Progress metrics calculation
  const totalParagraphs = reading.paragraphs.length || 1;
  const completedCount = useMemo(() => {
    return (Object.values(paragraphProgress) as ParagraphProgress[]).filter(
      (p) => p.status === 'completed'
    ).length;
  }, [paragraphProgress]);

  const listenedAudioCount = useMemo(() => {
    return (Object.values(paragraphProgress) as ParagraphProgress[]).filter(
      (p) => p.audio_listened
    ).length;
  }, [paragraphProgress]);

  const recordingsCount = useMemo(() => {
    return Object.keys(paragraphRecordings).length;
  }, [paragraphRecordings]);

  // Theme styling definitions
  const THEME_STYLES: Record<
    ReadingTheme,
    {
      bgPage: string;
      cardBg: string;
      textPrimary: string;
      textSecondary: string;
      border: string;
      toolbarBg: string;
      badgeBg: string;
    }
  > = {
    classic_light: {
      bgPage: 'bg-[#F9F7F1]',
      cardBg: 'bg-white',
      textPrimary: 'text-[#1E293B]',
      textSecondary: 'text-[#475569]',
      border: 'border-[#E2E8F0]',
      toolbarBg: 'bg-slate-900',
      badgeBg: 'bg-emerald-100 text-emerald-950',
    },
    warm_paper: {
      bgPage: 'bg-[#F5EFEB]',
      cardBg: 'bg-[#FAF6F0]',
      textPrimary: 'text-[#3E2E20]',
      textSecondary: 'text-[#695444]',
      border: 'border-[#E0D5C7]',
      toolbarBg: 'bg-[#3E2E20]',
      badgeBg: 'bg-amber-100 text-amber-950',
    },
    dark: {
      bgPage: 'bg-[#18181B]',
      cardBg: 'bg-[#27272A]',
      textPrimary: 'text-[#F4F4F5]',
      textSecondary: 'text-[#A1A1AA]',
      border: 'border-[#3F3F46]',
      toolbarBg: 'bg-[#18181B]',
      badgeBg: 'bg-slate-800 text-emerald-400',
    },
    deep_dark: {
      bgPage: 'bg-[#09090B]',
      cardBg: 'bg-[#121216]',
      textPrimary: 'text-[#E4E4E7]',
      textSecondary: 'text-[#71717A]',
      border: 'border-[#27272A]',
      toolbarBg: 'bg-[#09090B]',
      badgeBg: 'bg-slate-900 text-emerald-400',
    },
    soft_green: {
      bgPage: 'bg-[#F0F7F4]',
      cardBg: 'bg-white',
      textPrimary: 'text-[#143628]',
      textSecondary: 'text-[#2D5A46]',
      border: 'border-[#CDE5D8]',
      toolbarBg: 'bg-[#143628]',
      badgeBg: 'bg-emerald-100 text-emerald-950',
    },
    soft_blue: {
      bgPage: 'bg-[#F0F5FA]',
      cardBg: 'bg-white',
      textPrimary: 'text-[#132A44]',
      textSecondary: 'text-[#2C4F75]',
      border: 'border-[#CCE0F5]',
      toolbarBg: 'bg-[#132A44]',
      badgeBg: 'bg-sky-100 text-sky-950',
    },
    high_contrast: {
      bgPage: 'bg-[#FFFFFF]',
      cardBg: 'bg-[#FFFFFF]',
      textPrimary: 'text-[#000000]',
      textSecondary: 'text-[#1E293B]',
      border: 'border-[#000000]',
      toolbarBg: 'bg-black',
      badgeBg: 'bg-yellow-200 text-black font-bold',
    },
  };

  const currentTheme = THEME_STYLES[readingTheme] || THEME_STYLES.classic_light;

  return (
    <div className={`space-y-6 transition-colors duration-200 ${currentTheme.bgPage} p-2 sm:p-4 rounded-3xl`}>
      {/* Top Header Card */}
      <div className={`${currentTheme.cardBg} p-5 sm:p-6 rounded-3xl border ${currentTheme.border} shadow-xs space-y-4`}>
        {/* Meta badges & Controls */}
        <div className={`flex flex-wrap items-center justify-between gap-3 border-b ${currentTheme.border} pb-3`}>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-emerald-800 text-white font-bold rounded-xl uppercase tracking-wider">
              CEFR {reading.level}
            </span>
            {reading.category && (
              <span className={`px-2.5 py-1 font-bold rounded-xl ${currentTheme.badgeBg}`}>
                {reading.category}
              </span>
            )}
            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl capitalize">
              {reading.style.replace('_', ' ')}
            </span>
            <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 font-mono rounded-xl">
              Target: <strong>{reading.target_word_count || 300}</strong> kata | Aktual:{' '}
              <strong>{reading.actual_word_count}</strong> kata
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Full Audio Playback */}
            <button
              onClick={handleTogglePlayFullText}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isPlayingFullText
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 ring-2 ring-amber-400/30'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs'
              }`}
              title="Dengarkan seluruh isi teks sekaligus"
            >
              {isPlayingFullText ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span>Hentikan Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                  <span>Putar Teks Lengkap</span>
                </>
              )}
            </button>

            {/* Favorite Button */}
            <button
              onClick={() => onToggleFavorite(reading.id)}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                reading.is_favorite
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-600'
              }`}
              title="Favoritkan bacaan ini"
            >
              {reading.is_favorite ? <BookmarkCheck className="w-4 h-4 text-amber-600" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title & Summary */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <h1
                className={`text-2xl sm:text-3xl font-amiri font-bold text-right dir-rtl leading-relaxed ${
                  readingTheme === 'dark' || readingTheme === 'deep_dark' ? 'text-amber-300' : 'text-emerald-950'
                }`}
                dir="rtl"
              >
                {reading.title_ar}
              </h1>
              <p className={`text-sm font-bold ${currentTheme.textPrimary}`}>{reading.title_id}</p>
            </div>
            <button
              onClick={() =>
                audioService.speak(reading.title_ar, {
                  rate: audioSpeed,
                  voiceCharacter,
                  languageVersion: selectedLanguage,
                })
              }
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl border border-emerald-200 transition shrink-0 cursor-pointer shadow-xs"
              title="Dengarkan pelafalan judul"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {reading.summary && (
            <p
              className={`text-xs ${currentTheme.textSecondary} leading-relaxed p-3 rounded-2xl border ${currentTheme.border} bg-slate-50/50 dark:bg-slate-800/40`}
            >
              <strong className={currentTheme.textPrimary}>Ringkasan:</strong> {reading.summary}
            </p>
          )}
        </div>

        {/* PARAGRAPH READING FOCUS SUMMARY BAR */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-3.5 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-700/50 rounded-xl text-emerald-300 border border-emerald-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-emerald-100">
                Studio Fokus Paragraf ({totalParagraphs} Paragraf)
              </p>
              <p className="text-[11px] text-emerald-300">
                {completedCount}/{totalParagraphs} Paragraf Selesai | 🎧 {listenedAudioCount}/{totalParagraphs} Audio | 🎙️ {recordingsCount}/{totalParagraphs} Rekaman
              </p>
            </div>
          </div>

          {/* Auto Next Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleAutoNextParagraph(!autoNextParagraph)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                autoNextParagraph
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Otomatis beralih ke paragraf berikutnya saat audio paragraf selesai"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Auto-Next: {autoNextParagraph ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controller Studio Bar (Themes, Modes, Fonts, Language Variety & Voice Characters) */}
      <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-3xl shadow-xl border border-slate-800 space-y-3 sticky top-3 z-30 backdrop-blur-md bg-opacity-95">
        {/* Row 1: Primary Reading Experience & Language Variety Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          {/* Left: Language Variety / Dialect Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <Globe className="w-3.5 h-3.5 text-emerald-400 ml-1.5 shrink-0" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as LanguageVersion)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-hidden py-1 px-1 cursor-pointer"
              title="Pilih ragam bahasa & dialek pelafalan"
            >
              {LANGUAGE_VARIANTS.map((v) => (
                <option key={v.id} value={v.id} className="bg-slate-800 text-white">
                  {v.flag} {v.name_native}
                </option>
              ))}
            </select>
          </div>

          {/* Center: Harakat & Translation Toggles */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Harakat Toggle */}
            <button
              onClick={() => setShowHarakat(!showHarakat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                showHarakat ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Beralih antara teks berharakat (Tashkeel) dan gundul"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{showHarakat ? 'Harakat: ON' : 'Teks Gundul'}</span>
            </button>

            {/* Translation Toggle */}
            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                showTranslations ? 'bg-teal-700 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Buka / tutup terjemahan seluruh paragraf"
            >
              {showTranslations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showTranslations ? 'Terjemahan: Buka' : 'Terjemahan: Tutup'}</span>
            </button>

            {/* Auto Speak on Word Click */}
            <button
              onClick={() => onToggleAutoSpeak(!autoSpeakOnClick)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                autoSpeakOnClick ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Bunyikan suara natural otomatis saat kata diklik"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{autoSpeakOnClick ? 'Suara Klik: ON' : 'Suara Klik: OFF'}</span>
            </button>
          </div>

          {/* Right: Theme Selector */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 overflow-x-auto">
            {[
              { id: 'classic_light', label: 'Klasik', icon: Sun },
              { id: 'warm_paper', label: 'Kertas', icon: Coffee },
              { id: 'dark', label: 'Gelap', icon: Moon },
              { id: 'soft_green', label: 'Zaitun', icon: Leaf },
              { id: 'high_contrast', label: 'Kontras', icon: Contrast },
            ].map((th) => {
              const Icon = th.icon;
              return (
                <button
                  key={th.id}
                  onClick={() => onChangeReadingTheme(th.id as ReadingTheme)}
                  className={`px-2 py-1 text-xs rounded-lg transition flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    readingTheme === th.id ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title={`Tema: ${th.label}`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{th.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Reading Modes, Font Family, Size, Spacing & Voice Characters */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Reading Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            {[
              { id: 'book', label: 'Mode Kitab' },
              { id: 'portrait', label: 'Vertikal' },
              { id: 'focus', label: '1 Paragraf' },
              { id: 'two_pages', label: '2 Halaman' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => onChangeReadingMode(m.id as ReadingMode)}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  readingMode === m.id ? 'bg-teal-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Voice Character Selector */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <UserCheck className="w-3 h-3 text-emerald-400 ml-1.5 shrink-0" />
            <select
              value={voiceCharacter}
              onChange={(e) => onChangeVoiceCharacter(e.target.value as VoiceCharacterId)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-hidden py-1 px-1 cursor-pointer"
            >
              {VOICE_CHARACTERS.map((v) => (
                <option key={v.id} value={v.id} className="bg-slate-800 text-white">
                  {v.icon} {v.name_id}
                </option>
              ))}
            </select>
          </div>

          {/* Audio Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <Gauge className="w-3 h-3 text-amber-400 ml-1 shrink-0" />
            {[0.75, 1.0, 1.25, 1.5].map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeAudioSpeed(spd)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold transition cursor-pointer ${
                  audioSpeed === spd ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Line Spacing */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <AlignJustify className="w-3 h-3 text-slate-400 ml-1" />
            {(['compact', 'normal', 'relaxed'] as LineSpacingPreset[]).map((sp) => (
              <button
                key={sp}
                onClick={() => onChangeLineSpacing(sp)}
                className={`px-2 py-0.5 rounded text-xs capitalize transition cursor-pointer ${
                  lineSpacing === sp ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title={`Spasi: ${sp}`}
              >
                {sp === 'compact' ? 'Rapat' : sp === 'normal' ? 'Normal' : 'Lebar'}
              </button>
            ))}
          </div>

          {/* Font Family & Size */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              {(['amiri', 'scheherazade', 'cairo', 'tajawal'] as ArabicFontFamily[]).map((fam) => (
                <button
                  key={fam}
                  onClick={() => onChangeFontFamily(fam)}
                  className={`px-2 py-1 text-xs rounded-lg transition cursor-pointer ${
                    fontFamily === fam ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {fam === 'amiri' ? 'Amiri' : fam === 'scheherazade' ? 'Utsmani' : fam === 'cairo' ? 'Cairo' : 'Tajawal'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              {(['sm', 'md', 'lg', 'xl', '2xl'] as FontSizePreset[]).map((sz) => (
                <button
                  key={sz}
                  onClick={() => onChangeFontSize(sz)}
                  className={`px-2 py-1 text-xs rounded-lg font-bold transition cursor-pointer ${
                    fontSize === sz ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sz === 'sm' ? 'A-' : sz === 'md' ? 'A' : sz === 'lg' ? 'A+' : sz === 'xl' ? 'A++' : 'MAX'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN PARAGRAPH FOCUS UNITS CONTAINER */}
      <div className={`${currentTheme.cardBg} p-5 sm:p-7 rounded-3xl border ${currentTheme.border} shadow-sm space-y-6`}>
        {/* Helper Note */}
        <div className="flex items-center justify-between text-xs bg-emerald-500/10 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
          <span className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Paragraph Focus Mode:</strong> Klik paragraf mana saja untuk mengaktifkan fokus (100% jelas & tajam), dengarkan audio lengkapnya, atau rekam suara latihan Anda per paragraf.
            </span>
          </span>
        </div>

        {/* Single Paragraph Navigation Controls in 'focus' mode */}
        {readingMode === 'focus' && (
          <div className="flex items-center justify-between p-3.5 bg-slate-900 text-white rounded-2xl shadow-md border border-slate-800">
            <button
              onClick={() => setActiveParagraphIndex(Math.max(0, activeParagraphIndex - 1))}
              disabled={activeParagraphIndex === 0}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Paragraf Sebelumnya</span>
            </button>
            <span className="font-mono text-xs font-bold text-emerald-400">
              Paragraf {activeParagraphIndex + 1} dari {reading.paragraphs.length}
            </span>
            <button
              onClick={() =>
                setActiveParagraphIndex(
                  Math.min(reading.paragraphs.length - 1, activeParagraphIndex + 1)
                )
              }
              disabled={activeParagraphIndex === reading.paragraphs.length - 1}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
            >
              <span>Paragraf Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Render Paragraph Focus Units */}
        <div
          className={
            readingMode === 'two_pages'
              ? 'grid grid-cols-1 md:grid-cols-2 gap-5'
              : 'space-y-6'
          }
        >
          {reading.paragraphs
            .filter((_, idx) => (readingMode === 'focus' ? idx === activeParagraphIndex : true))
            .map((p, pIdx) => {
              const actualIndex = readingMode === 'focus' ? activeParagraphIndex : pIdx;
              const isActive = actualIndex === activeParagraphIndex;

              return (
                <ParagraphFocusUnit
                  key={p.id || actualIndex}
                  paragraph={p}
                  index={actualIndex}
                  totalParagraphs={totalParagraphs}
                  isActive={isActive}
                  onFocus={() => setActiveParagraphIndex(actualIndex)}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  lineSpacing={lineSpacing}
                  readingTheme={readingTheme}
                  showHarakat={showHarakat}
                  showTransliteration={showTransliteration}
                  showTranslation={showTranslations}
                  voiceCharacter={voiceCharacter}
                  audioSpeed={audioSpeed}
                  languageVersion={selectedLanguage}
                  autoSpeakOnClick={autoSpeakOnClick}
                  autoNextParagraph={autoNextParagraph}
                  onWordClick={onWordClick}
                  onAudioEnded={() => handleParagraphAudioEnded(actualIndex)}
                  recording={paragraphRecordings[p.id]}
                  progress={paragraphProgress[p.id]}
                  onSaveRecording={handleSaveParagraphRecording}
                  onDeleteRecording={handleDeleteParagraphRecording}
                  onUpdateProgress={handleUpdateParagraphProgress}
                  readingId={reading.id}
                />
              );
            })}
        </div>
      </div>

      {/* Global Recording Studio & Selesai Baca Button */}
      <AudioRecorder reading={reading} onReadingCompleted={onReadingCompleted} />
    </div>
  );
};
