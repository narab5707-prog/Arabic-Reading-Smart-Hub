import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Square,
  Mic,
  Trash2,
  Download,
  Languages,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Headphones,
  Check,
  Disc,
} from 'lucide-react';
import {
  ArabicFontFamily,
  FontSizePreset,
  LanguageVersion,
  LineSpacingPreset,
  ParagraphData,
  ParagraphProgress,
  ParagraphRecording,
  ParagraphStatus,
  ReadingTheme,
  VoiceCharacterId,
  WordData,
} from '../types';
import { audioService, AudioService, LANGUAGE_VARIANTS, VOICE_CHARACTERS } from '../services/audioService';

interface ParagraphFocusUnitProps {
  paragraph: ParagraphData;
  index: number;
  totalParagraphs: number;
  isActive: boolean;
  onFocus: () => void;
  // Visual Configurations
  fontFamily: ArabicFontFamily;
  fontSize: FontSizePreset;
  lineSpacing: LineSpacingPreset;
  readingTheme: ReadingTheme;
  showHarakat: boolean;
  showTransliteration: boolean;
  showTranslation: boolean;
  // Audio & Voice Configurations
  voiceCharacter: VoiceCharacterId;
  audioSpeed: number;
  languageVersion: LanguageVersion;
  autoSpeakOnClick: boolean;
  autoNextParagraph: boolean;
  // Callbacks
  onWordClick: (word: WordData, contextSentence?: string) => void;
  onAudioEnded?: () => void;
  // Recording & Progress Props
  recording?: ParagraphRecording;
  progress?: ParagraphProgress;
  onSaveRecording: (recording: ParagraphRecording) => void;
  onDeleteRecording: (paragraphId: number) => void;
  onUpdateProgress: (paragraphId: number, update: Partial<ParagraphProgress>) => void;
  readingId: string;
}

export const ParagraphFocusUnit: React.FC<ParagraphFocusUnitProps> = ({
  paragraph,
  index,
  totalParagraphs,
  isActive,
  onFocus,
  fontFamily,
  fontSize,
  lineSpacing,
  readingTheme,
  showHarakat,
  showTransliteration,
  showTranslation,
  voiceCharacter,
  audioSpeed,
  languageVersion,
  autoSpeakOnClick,
  autoNextParagraph,
  onWordClick,
  onAudioEnded,
  recording,
  progress,
  onSaveRecording,
  onDeleteRecording,
  onUpdateProgress,
  readingId,
}) => {
  // TTS State for this paragraph
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [isTTSPaused, setIsTTSPaused] = useState(false);
  const [highlightedCharIndex, setHighlightedCharIndex] = useState<number | null>(null);
  const [highlightedCharLength, setHighlightedCharLength] = useState<number>(0);
  const [ttsProgress, setTtsProgress] = useState<number>(0);

  // Recording State for this paragraph
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [userAudioBlob, setUserAudioBlob] = useState<Blob | null>(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);

  // Local speed selector override
  const [localSpeed, setLocalSpeed] = useState<number>(audioSpeed);

  // Toggle internal translation collapse
  const [isLocalTranslationOpen, setIsLocalTranslationOpen] = useState(showTranslation);

  const recordingTimerRef = useRef<number | null>(null);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Keep local speed in sync with global settings
  useEffect(() => {
    setLocalSpeed(audioSpeed);
  }, [audioSpeed]);

  useEffect(() => {
    setIsLocalTranslationOpen(showTranslation);
  }, [showTranslation]);

  // Handle Recording Timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  // Clean user audio player on unmount
  useEffect(() => {
    return () => {
      if (userAudioPlayerRef.current) {
        userAudioPlayerRef.current.pause();
        userAudioPlayerRef.current = null;
      }
    };
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Font family class
  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'scheherazade':
        return 'font-scheherazade';
      case 'cairo':
        return 'font-cairo';
      case 'tajawal':
        return 'font-tajawal';
      case 'amiri':
      default:
        return 'font-amiri';
    }
  };

  // Font size class
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-xl leading-loose';
      case 'md':
        return 'text-2xl leading-loose';
      case 'lg':
        return 'text-3xl leading-loose';
      case 'xl':
        return 'text-4xl leading-loose';
      case '2xl':
        return 'text-5xl leading-loose';
      default:
        return 'text-3xl leading-loose';
    }
  };

  // Line spacing class
  const getLineSpacingClass = () => {
    switch (lineSpacing) {
      case 'compact':
        return 'leading-normal';
      case 'standard':
        return 'leading-relaxed';
      case 'relaxed':
        return 'leading-loose';
      case 'loose':
        return 'leading-[2.5]';
      default:
        return 'leading-loose';
    }
  };

  // Theme-based focus styling
  const getFocusContainerClass = () => {
    const isDark = readingTheme === 'dark' || readingTheme === 'deep_dark';
    const isWarm = readingTheme === 'warm_paper';
    const isGreen = readingTheme === 'soft_green';
    const isBlue = readingTheme === 'soft_blue';
    const isHighContrast = readingTheme === 'high_contrast';

    if (isActive) {
      if (isDark) {
        return 'bg-slate-800/90 border-emerald-500/80 shadow-2xl shadow-emerald-950/40 ring-2 ring-emerald-500/30 opacity-100 scale-[1.005]';
      }
      if (isWarm) {
        return 'bg-[#f7f0e4] border-amber-600/70 shadow-xl shadow-amber-900/10 ring-2 ring-amber-600/30 opacity-100 scale-[1.005]';
      }
      if (isGreen) {
        return 'bg-white/95 border-emerald-600 shadow-xl shadow-emerald-900/10 ring-2 ring-emerald-500/30 opacity-100 scale-[1.005]';
      }
      if (isBlue) {
        return 'bg-white/95 border-sky-600 shadow-xl shadow-sky-900/10 ring-2 ring-sky-500/30 opacity-100 scale-[1.005]';
      }
      if (isHighContrast) {
        return 'bg-black text-white border-2 border-yellow-400 ring-2 ring-yellow-400 opacity-100';
      }
      // Classic Light
      return 'bg-white border-emerald-600 shadow-xl shadow-emerald-900/10 ring-2 ring-emerald-500/20 opacity-100 scale-[1.005]';
    }

    // INACTIVE (DIMMED & SUBTLY BLURRED)
    if (isDark) {
      return 'bg-slate-900/40 border-slate-800/80 opacity-40 filter blur-[0.6px] hover:opacity-80 hover:blur-none hover:border-slate-700';
    }
    if (isWarm) {
      return 'bg-[#f3ebe0]/60 border-stone-300/60 opacity-45 filter blur-[0.6px] hover:opacity-85 hover:blur-none hover:border-amber-400/60';
    }
    if (isHighContrast) {
      return 'bg-black/40 border-slate-700 opacity-40 hover:opacity-80';
    }
    // Classic Light Inactive
    return 'bg-slate-50/70 border-slate-200/80 opacity-45 filter blur-[0.6px] hover:opacity-85 hover:blur-none hover:border-emerald-300';
  };

  // Full Paragraph TTS playback
  const handlePlayParagraphTTS = async () => {
    onFocus();
    const textToSpeak = showHarakat
      ? paragraph.ar_harakat || paragraph.arabic_harakat || ''
      : paragraph.ar_gundul || paragraph.arabic_gundul || '';
    if (!textToSpeak) return;

    if (isTTSPaused) {
      audioService.resumeSpeaking();
      setIsTTSPaused(false);
      setIsTTSPlaying(true);
      return;
    }

    setIsTTSPlaying(true);
    setIsTTSPaused(false);
    setHighlightedCharIndex(0);
    setTtsProgress(0);

    onUpdateProgress(paragraph.id, {
      status: 'reading',
      audio_listened: true,
    });

    try {
      await audioService.speak(textToSpeak, {
        rate: localSpeed,
        voiceCharacter,
        languageVersion,
        onStart: () => {
          setIsTTSPlaying(true);
          setIsTTSPaused(false);
        },
        onBoundary: (charIdx, charLen) => {
          setHighlightedCharIndex(charIdx);
          setHighlightedCharLength(charLen || 1);
        },
        onProgress: (ratio) => {
          setTtsProgress(Math.round(ratio * 100));
        },
        onEnd: () => {
          setIsTTSPlaying(false);
          setIsTTSPaused(false);
          setHighlightedCharIndex(null);
          setTtsProgress(100);
          onUpdateProgress(paragraph.id, {
            status: 'completed',
            audio_listened: true,
          });
          if (onAudioEnded) {
            onAudioEnded();
          }
        },
      });
    } catch (e) {
      console.error('TTS playback error:', e);
      setIsTTSPlaying(false);
      setIsTTSPaused(false);
    }
  };

  const handlePauseParagraphTTS = () => {
    audioService.pauseSpeaking();
    setIsTTSPaused(true);
    setIsTTSPlaying(false);
  };

  const handleStopParagraphTTS = () => {
    audioService.stopSpeaking();
    setIsTTSPlaying(false);
    setIsTTSPaused(false);
    setHighlightedCharIndex(null);
    setTtsProgress(0);
  };

  const handleReplayParagraphTTS = () => {
    handleStopParagraphTTS();
    setTimeout(() => {
      handlePlayParagraphTTS();
    }, 100);
  };

  // Recording Handlers per Paragraph
  const handleStartRecording = async () => {
    onFocus();
    setUserAudioBlob(null);
    setRecordingSeconds(0);
    setIsRecording(true);

    const success = await audioService.startRecording((vol) => {
      setVolumeLevel(vol);
    });

    if (!success) {
      setIsRecording(false);
      alert('Tidak dapat mengakses mikrofon. Mohon periksa izin mic pada peramban.');
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setVolumeLevel(0);

    const blob = await audioService.stopRecording();
    if (blob) {
      setUserAudioBlob(blob);
      try {
        const base64Audio = await AudioService.blobToBase64(blob);
        const newRec: ParagraphRecording = {
          id: `${readingId}_p_${paragraph.id}`,
          reading_id: readingId,
          paragraph_id: paragraph.id,
          audio_url: base64Audio,
          duration_seconds: recordingSeconds,
          created_at: new Date().toISOString(),
        };
        onSaveRecording(newRec);
        onUpdateProgress(paragraph.id, {
          recording_completed: true,
          status: 'completed',
        });
      } catch (err) {
        console.error('Failed to save paragraph recording:', err);
      }
    }
  };

  // Play user recorded audio
  const handleTogglePlayUserAudio = () => {
    const audioSrc = recording?.audio_url;
    if (!audioSrc) return;

    if (!userAudioPlayerRef.current) {
      userAudioPlayerRef.current = new Audio(audioSrc);
      userAudioPlayerRef.current.onended = () => setIsPlayingUserAudio(false);
    }

    if (isPlayingUserAudio) {
      userAudioPlayerRef.current.pause();
      setIsPlayingUserAudio(false);
    } else {
      userAudioPlayerRef.current.play();
      setIsPlayingUserAudio(true);
    }
  };

  const handleDeleteUserRecording = () => {
    if (confirm(`Hapus rekaman untuk Paragraf ${index + 1}?`)) {
      if (userAudioPlayerRef.current) {
        userAudioPlayerRef.current.pause();
        userAudioPlayerRef.current = null;
      }
      setIsPlayingUserAudio(false);
      onDeleteRecording(paragraph.id);
      onUpdateProgress(paragraph.id, { recording_completed: false });
    }
  };

  const currentStatus: ParagraphStatus = progress?.status || (isActive ? 'reading' : 'unread');
  const hasAudioListened = Boolean(progress?.audio_listened);
  const hasRecording = Boolean(recording?.audio_url || progress?.recording_completed);

  // Status badge style helper
  const getStatusBadge = () => {
    if (currentStatus === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>● Sudah Dibaca</span>
        </span>
      );
    }
    if (isActive || currentStatus === 'reading') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
          <Disc className="w-3 h-3 text-amber-600 animate-spin" />
          <span>◐ Sedang Fokus</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
        <span>○ Belum Dibaca</span>
      </span>
    );
  };

  const arabicText = showHarakat
    ? paragraph.ar_harakat || paragraph.arabic_harakat || ''
    : paragraph.ar_gundul || paragraph.arabic_gundul || '';

  const translationText = paragraph.id_translation || paragraph.indonesian_text || '';

  // Split text into tokens with char offsets so each word can be highlighted during playback
  const rawWords = arabicText.split(/(\s+)/);
  let runningOffset = 0;
  const tokens = rawWords.map((chunk, i) => {
    const start = runningOffset;
    runningOffset += chunk.length;
    const end = runningOffset;
    return { chunk, start, end, index: i, isSpace: /^\s+$/.test(chunk) };
  });

  return (
    <article
      id={`paragraph-unit-${paragraph.id}`}
      onClick={onFocus}
      className={`rounded-3xl border p-5 sm:p-6 transition-all duration-300 ease-in-out cursor-pointer relative space-y-4 ${getFocusContainerClass()}`}
    >
      {/* Top Header: Paragraph Number, Quick Audio Button, Status, Badges & Focus Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition ${
              isActive
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {index + 1}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Paragraf {index + 1} <span className="text-slate-400">/ {totalParagraphs}</span>
          </span>

          {/* Quick Header Audio Play Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isTTSPlaying) {
                handlePauseParagraphTTS();
              } else {
                handlePlayParagraphTTS();
              }
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
              isTTSPlaying
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/40 animate-pulse'
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
            }`}
            title="Dengarkan pelafalan paragraf ini otomatis"
          >
            {isTTSPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Jeda</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isTTSPaused ? 'Lanjut' : 'Suara'}</span>
              </>
            )}
          </button>

          {/* Status Indicator */}
          {getStatusBadge()}
        </div>

        {/* Feature Badges (Audio Listened, Recorded) */}
        <div className="flex items-center gap-1.5">
          {hasAudioListened && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 rounded-lg"
              title="Paragraf ini sudah didengarkan audionya"
            >
              <Headphones className="w-3 h-3 text-teal-600" />
              <span>Audio ✓</span>
            </span>
          )}

          {hasRecording && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 rounded-lg"
              title="Rekaman suara Anda tersimpan untuk paragraf ini"
            >
              <Mic className="w-3 h-3 text-purple-600" />
              <span>Rekaman ✓</span>
            </span>
          )}

          {/* Mark status toggle button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const nextStatus: ParagraphStatus =
                currentStatus === 'completed' ? 'unread' : 'completed';
              onUpdateProgress(paragraph.id, { status: nextStatus });
            }}
            className="p-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-500 transition text-[11px] flex items-center gap-1 cursor-pointer"
            title="Ubah status selesai membaca"
          >
            <Check className={`w-3.5 h-3.5 ${currentStatus === 'completed' ? 'text-emerald-600 font-bold' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Arabic Text Body (Clickable Words) */}
      <div className="relative py-1">
        <p
          className={`dir-rtl text-right select-text ${getFontFamilyClass()} ${getFontSizeClass()} ${getLineSpacingClass()} tracking-wide`}
          dir="rtl"
        >
          {tokens.map((token) => {
            if (token.isSpace) {
              return <span key={token.index}>{token.chunk}</span>;
            }

            const cleanWord = token.chunk
              .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
              .replace(/[.,،؟:!]/g, '');

            const isHighlighted =
              isTTSPlaying &&
              highlightedCharIndex !== null &&
              highlightedCharIndex >= token.start &&
              highlightedCharIndex <= token.end;

            return (
              <span
                key={token.index}
                onClick={(e) => {
                  e.stopPropagation();
                  onFocus();
                  if (autoSpeakOnClick) {
                    audioService.speak(token.chunk, {
                      rate: localSpeed,
                      voiceCharacter,
                      languageVersion,
                    });
                  }
                  onWordClick(
                    {
                      word_ar: token.chunk,
                      word_clean: cleanWord,
                      meaning_id: '',
                      word_type: 'isim',
                    },
                    arabicText
                  );
                }}
                className={`inline-block px-1 py-0.5 rounded-lg transition-all duration-150 cursor-pointer ${
                  isHighlighted
                    ? 'bg-amber-300 text-slate-950 font-bold dark:bg-amber-400 dark:text-black ring-2 ring-amber-400/60 scale-105 shadow-sm'
                    : 'hover:bg-emerald-200/60 dark:hover:bg-emerald-800/60 hover:text-emerald-950 dark:hover:text-emerald-100'
                }`}
                title="Klik untuk arti kata & analisa nahwu"
              >
                {token.chunk}
              </span>
            );
          })}
        </p>

        {/* Transliteration if enabled */}
        {showTransliteration && paragraph.transliteration && (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans italic pt-2 border-t border-dashed border-slate-200 dark:border-slate-700/60">
            {paragraph.transliteration}
          </p>
        )}
      </div>

      {/* Translation Dropdown / Section */}
      {translationText && (
        <div className="pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLocalTranslationOpen(!isLocalTranslationOpen);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>Terjemahan Bahasa Indonesia</span>
            {isLocalTranslationOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {isLocalTranslationOpen && (
            <div className="mt-2 p-3.5 bg-slate-50/90 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed animate-fade-in">
              {translationText}
            </div>
          )}
        </div>
      )}

      {/* PARAGRAPH AUDIO & RECORDING CONTROLS (Only fully interactive when Active or on direct button clicks) */}
      <div
        className={`pt-3 border-t border-slate-200/70 dark:border-slate-700/70 space-y-3 transition-opacity duration-200 ${
          isActive ? 'opacity-100' : 'opacity-85'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Row 1: Audio Playback Bar */}
        <div className="bg-slate-100/90 dark:bg-slate-900/80 p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          {/* TTS Player Controls */}
          <div className="flex items-center gap-1.5">
            {!isTTSPlaying ? (
              <button
                type="button"
                onClick={handlePlayParagraphTTS}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                title="Dengarkan seluruh paragraf ini"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isTTSPaused ? 'Lanjutkan' : 'Dengarkan Paragraf'}</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handlePauseParagraphTTS}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  title="Jeda audio"
                >
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>Jeda</span>
                </button>

                <button
                  type="button"
                  onClick={handleStopParagraphTTS}
                  className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-xl transition cursor-pointer"
                  title="Hentikan audio"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleReplayParagraphTTS}
              className="p-1.5 bg-slate-200/80 hover:bg-slate-300 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-xl transition cursor-pointer"
              title="Putar ulang paragraf dari awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Selector & Audio Progress */}
          <div className="flex items-center gap-2">
            {isTTSPlaying && (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>Memutar Audio</span>
              </div>
            )}

            {/* Speed Selector Pills */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
              {[0.75, 1.0, 1.25, 1.5].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setLocalSpeed(spd)}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition cursor-pointer ${
                    localSpeed === spd
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Paragraph Voice Recording Studio */}
        <div className="bg-slate-900 text-white p-3 sm:p-3.5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Recording Info & Trigger */}
          <div className="flex items-center gap-2.5">
            {!isRecording ? (
              <button
                type="button"
                onClick={handleStartRecording}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition cursor-pointer"
                title="Rekam suara latihan baca untuk paragraf ini"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{recording?.audio_url ? 'Rekam Ulang Paragraf' : 'Rekam Suara Saya'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopRecording}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-950/40 animate-pulse transition cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>Selesai Rekam ({formatTime(recordingSeconds)})</span>
              </button>
            )}

            {isRecording && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-emerald-400 rounded-full transition-all duration-75"
                    style={{
                      height: `${Math.max(6, Math.min(22, (volumeLevel + (i % 3) * 15)))}px`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Saved User Recording Controls */}
          {recording?.audio_url && !isRecording && (
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700">
              <span className="text-[11px] text-slate-300 font-semibold hidden sm:inline">
                Rekaman Anda ({formatTime(recording.duration_seconds)}):
              </span>

              <button
                type="button"
                onClick={handleTogglePlayUserAudio}
                className="p-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition cursor-pointer"
                title="Putar rekaman suara Anda"
              >
                {isPlayingUserAudio ? (
                  <Pause className="w-3 h-3 fill-white" />
                ) : (
                  <Play className="w-3 h-3 fill-white" />
                )}
              </button>

              <button
                type="button"
                onClick={handleDeleteUserRecording}
                className="p-1.5 bg-slate-700 hover:bg-rose-700 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
                title="Hapus rekaman ini"
              >
                <Trash2 className="w-3 h-3" />
              </button>

              <a
                href={recording.audio_url}
                download={`rekaman_paragraf_${index + 1}_${Date.now()}.webm`}
                className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
                title="Unduh rekaman"
              >
                <Download className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
