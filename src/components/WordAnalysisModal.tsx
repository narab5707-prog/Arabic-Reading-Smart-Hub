import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  X,
  Languages,
  Layers,
  Search,
  BookOpen,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Info,
  AlertTriangle,
  Scale,
  Feather,
  BookMarked,
} from 'lucide-react';
import { WordData } from '../types';
import { audioService } from '../services/audioService';
import { GeminiService } from '../services/geminiService';
import { StorageService } from '../services/storageService';

interface WordAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  wordData: WordData | null;
  contextSentence?: string;
  apiKey: string;
  onWordSavedChanged?: () => void;
}

export const WordAnalysisModal: React.FC<WordAnalysisModalProps> = ({
  isOpen,
  onClose,
  wordData,
  contextSentence,
  apiKey,
  onWordSavedChanged,
}) => {
  const [currentWord, setCurrentWord] = useState<WordData | null>(wordData);
  const [isAnalyzingDeep, setIsAnalyzingDeep] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    setCurrentWord(wordData);
  }, [wordData]);

  if (!isOpen || !currentWord) return null;

  const cleanWord = currentWord.word_clean || currentWord.word_ar.replace(/[\u064B-\u065F\u0670]/g, '');
  const isSaved = StorageService.isWordSaved(cleanWord);

  const handlePlayAudio = async () => {
    setIsPlayingAudio(true);
    try {
      await audioService.speakArabic(currentWord.word_ar || cleanWord);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const handleToggleSave = () => {
    if (isSaved) {
      StorageService.removeSavedWord(cleanWord);
    } else {
      StorageService.saveWord(currentWord);
    }
    if (onWordSavedChanged) {
      onWordSavedChanged();
    }
  };

  const handleDeepAIAnalysis = async () => {
    setIsAnalyzingDeep(true);
    try {
      const detailed = await GeminiService.analyzeSingleWord(
        currentWord.word_ar,
        contextSentence || '',
        apiKey,
        'A2',
        currentWord.is_phrase ? 'phrase' : 'word'
      );
      setCurrentWord(detailed);
      if (isSaved) {
        StorageService.saveWord(detailed);
      }
    } catch (e) {
      console.error('Deep analysis error:', e);
    } finally {
      setIsAnalyzingDeep(false);
    }
  };

  const verification = currentWord.verification_status || 'verified';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-4 max-h-[92vh]">
        {/* Top Header with Arabic Word */}
        <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Verification Badge */}
          <div className="flex items-center gap-1.5 mb-2">
            {verification === 'verified' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-700/80 text-emerald-100 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Rujukan Terverifikasi</span>
              </span>
            )}
            {verification === 'reference' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-800/80 text-teal-100 border border-teal-500/30">
                <Info className="w-3.5 h-3.5 text-teal-300" />
                <span>Rujukan Kebahasaan</span>
              </span>
            )}
            {verification === 'unverified' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-900/80 text-amber-200 border border-amber-500/30">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                <span>Perlu Verifikasi Lanjutan</span>
              </span>
            )}
          </div>

          {/* Main Arabic Word */}
          <div className="text-center space-y-1.5 pt-1">
            <div className="inline-block p-1 bg-emerald-800/40 rounded-2xl backdrop-blur-xs border border-emerald-600/40 px-6 py-2.5 shadow-inner">
              <h2 className="text-4xl font-amiri font-bold text-amber-300 tracking-wide leading-relaxed">
                {currentWord.word_ar}
              </h2>
            </div>
            {currentWord.transliteration && (
              <p className="text-xs text-emerald-200 font-mono tracking-wider italic">
                [{currentWord.transliteration}]
              </p>
            )}
          </div>

          {/* Audio & Bookmark Action Buttons */}
          <div className="flex items-center justify-center gap-2.5 pt-4">
            <button
              onClick={handlePlayAudio}
              disabled={isPlayingAudio}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-400 text-emerald-950 font-bold scale-105 ring-2 ring-amber-300'
                  : 'bg-white/20 hover:bg-white/30 text-white border border-white/25'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              <span>{isPlayingAudio ? 'Memutar Audio...' : 'Dengarkan Suara (Natural)'}</span>
            </button>

            <button
              onClick={handleToggleSave}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer ${
                isSaved
                  ? 'bg-amber-400 text-emerald-950 font-bold shadow-md shadow-amber-400/20'
                  : 'bg-white/20 hover:bg-white/30 text-white border border-white/25'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-emerald-950" />
                  <span>Tersimpan di Mu'jam</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Simpan ke Mu'jam</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-slate-800 text-xs">
          {/* 1. Makna Konteks vs Makna Dasar */}
          <div className="space-y-2">
            <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-900 tracking-wider flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>Arti dalam Konteks Kalimat</span>
              </span>
              <p className="text-sm font-bold text-emerald-950 leading-snug">
                {currentWord.word_id}
              </p>
              {currentWord.meaning_detail && (
                <p className="text-[11px] text-emerald-800 pt-0.5 leading-relaxed">
                  {currentWord.meaning_detail}
                </p>
              )}
            </div>

            {currentWord.meaning_basic && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Makna Leksikal / Dasar Kamus
                </span>
                <p className="text-xs text-slate-700 font-medium mt-0.5">
                  {currentWord.meaning_basic}
                </p>
              </div>
            )}
          </div>

          {/* 2. Sharaf (Morfologi) & Nahwu (Sintaksis) Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Sharaf Card */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-600" />
                <span>Struktur Sharaf</span>
              </span>
              <div>
                <span className="text-[10px] text-slate-400 block">Jenis Kata (PoS)</span>
                <span className="font-bold text-slate-800 text-xs">{currentWord.pos || 'Isim'}</span>
              </div>
              {currentWord.root && currentWord.root !== '-' && (
                <div>
                  <span className="text-[10px] text-slate-400 block">Akar Kata (جذر)</span>
                  <span className="font-amiri font-bold text-emerald-900 text-sm">{currentWord.root}</span>
                </div>
              )}
              {currentWord.wazan && currentWord.wazan !== '-' && (
                <div>
                  <span className="text-[10px] text-slate-400 block">Wazan (وزن)</span>
                  <span className="font-amiri font-bold text-teal-900 text-sm">{currentWord.wazan}</span>
                </div>
              )}
              {currentWord.sarf_analysis && (
                <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60 leading-relaxed">
                  {currentWord.sarf_analysis}
                </p>
              )}
            </div>

            {/* Nahwu Card */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-slate-600" />
                <span>Jabatan Nahwu</span>
              </span>
              <div>
                <span className="text-[10px] text-slate-400 block">Fungsi Kalimat</span>
                <span className="font-bold text-slate-800 text-xs">
                  {currentWord.nahwu_function || currentWord.nahwu_note || 'Fungsi Sintaksis'}
                </span>
              </div>
              {currentWord.grammar_rule && (
                <div>
                  <span className="text-[10px] text-slate-400 block">Kaidah Terkait</span>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                    {currentWord.grammar_rule}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 3. Uslūb Alternatif & Nuansa Semantik */}
          {currentWord.uslub_alternative && (
            <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider flex items-center gap-1">
                  <Feather className="w-3.5 h-3.5 text-amber-700" />
                  <span>Uslūb Alternatif dalam Fuṣḥā</span>
                </span>
                <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  {currentWord.uslub_alternative.formality_level || 'Formal Fuṣḥā'}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-amber-200/60">
                <span className="text-[10px] text-slate-400 block">Bentuk Pengungkapan Lain:</span>
                <p className="font-amiri font-bold text-base text-amber-950 text-right dir-rtl leading-relaxed">
                  {currentWord.uslub_alternative.alternative_ar}
                </p>
              </div>

              {currentWord.uslub_alternative.nuance_difference && (
                <div className="text-[11px] text-amber-950 leading-relaxed space-y-0.5">
                  <span className="font-bold block">💡 Perbedaan Nuansa Semantik:</span>
                  <p className="text-amber-900">{currentWord.uslub_alternative.nuance_difference}</p>
                </div>
              )}
            </div>
          )}

          {/* 4. Sumber Rujukan Otoritatif */}
          <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider flex items-center gap-1">
              <BookMarked className="w-3.5 h-3.5 text-emerald-700" />
              <span>Sumber Rujukan Otoritatif</span>
            </span>

            {currentWord.sources && currentWord.sources.length > 0 ? (
              <div className="space-y-1.5">
                {currentWord.sources.map((src, idx) => (
                  <div key={idx} className="flex items-start justify-between p-2 bg-white rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="font-bold text-slate-800 font-amiri text-sm">{src.name}</span>
                      <p className="text-[11px] text-slate-500">{src.usage}</p>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      {src.category === 'lexical' ? 'Kamus Leksikal' : src.category === 'nahwu' ? 'Tata Bahasa' : 'Morfologi'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic">
                Rujukan: المعجم الوسيط (Leksikal) & النحو الواضح (Sintaksis).
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleDeepAIAnalysis}
            disabled={isAnalyzingDeep}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isAnalyzingDeep ? 'animate-spin' : ''}`} />
            <span>{isAnalyzingDeep ? 'Menganalisis Lebih Dalam...' : 'Analisis Mendalam'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
