import React, { useState } from 'react';
import {
  BookMarked,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Search,
  Layers,
  RotateCw,
  Sparkles,
  Check,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { WordData } from '../types';
import { audioService } from '../services/audioService';
import { StorageService } from '../services/storageService';

interface VocabularySectionProps {
  vocabulary: WordData[];
  onWordClick: (word: WordData) => void;
  onSavedWordsChanged?: () => void;
}

export const VocabularySection: React.FC<VocabularySectionProps> = ({
  vocabulary,
  onWordClick,
  onSavedWordsChanged,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'flashcards'>('grid');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  if (!vocabulary || vocabulary.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 text-slate-500">
        <BookMarked className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-semibold">Tidak ada daftar kosakata khusus untuk teks ini.</p>
      </div>
    );
  }

  const filtered = vocabulary.filter((w) => {
    const q = searchQuery.toLowerCase();
    return (
      w.word_ar.includes(q) ||
      (w.word_clean && w.word_clean.includes(q)) ||
      w.word_id.toLowerCase().includes(q) ||
      (w.root && w.root.toLowerCase().includes(q))
    );
  });

  const handlePlayAudio = async (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    setPlayingWord(word);
    await audioService.speakArabic(word);
    setPlayingWord(null);
  };

  const handleToggleSave = (e: React.MouseEvent, word: WordData) => {
    e.stopPropagation();
    const clean = word.word_clean || word.word_ar.replace(/[\u064B-\u065F\u0670]/g, '');
    if (StorageService.isWordSaved(clean)) {
      StorageService.removeSavedWord(clean);
    } else {
      StorageService.saveWord(word);
    }
    if (onSavedWordsChanged) {
      onSavedWordsChanged();
    }
  };

  const currentCard = filtered[flashcardIndex] || filtered[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev + 1) % filtered.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200/70 text-emerald-800">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 leading-tight flex items-center gap-2">
              <span>Kamus Kosakata Kunci (المفردات اللغوية)</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {vocabulary.length} Kosakata
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik kata untuk melihat analisis mendalam morfologi & wazan
            </p>
          </div>
        </div>

        {/* View Mode & Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setFlashcardIndex(0);
              }}
              placeholder="Cari kata / arti..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl text-xs"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Mode switch */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daftar
            </button>
            <button
              onClick={() => {
                setViewMode('flashcards');
                setIsFlipped(false);
              }}
              className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                viewMode === 'flashcards'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Flashcard
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((w, idx) => {
            const clean = w.word_clean || w.word_ar.replace(/[\u064B-\u065F\u0670]/g, '');
            const isSaved = StorageService.isWordSaved(clean);

            return (
              <div
                key={idx}
                onClick={() => onWordClick(w)}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handlePlayAudio(e, w.word_ar)}
                        className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-emerald-50 text-slate-500 group-hover:text-emerald-700 transition"
                        title="Dengarkan pelafalan"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleToggleSave(e, w)}
                        className={`p-1.5 rounded-lg transition ${
                          isSaved
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-50 text-slate-400 hover:text-amber-600'
                        }`}
                        title={isSaved ? 'Hapus dari Flashcard' : 'Simpan ke Flashcard'}
                      >
                        {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {w.pos && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                        {w.pos}
                      </span>
                    )}
                  </div>

                  {/* Arabic Word */}
                  <div className="text-right mb-2">
                    <h4 className="font-amiri text-2xl font-bold text-emerald-950 group-hover:text-emerald-700 transition leading-snug">
                      {w.word_ar}
                    </h4>
                    {w.transliteration && (
                      <span className="text-[11px] font-mono text-emerald-600/80 italic block">
                        [{w.transliteration}]
                      </span>
                    )}
                  </div>

                  {/* Indonesian Translation */}
                  <p className="text-xs font-bold text-slate-900 line-clamp-2">
                    {w.word_id}
                  </p>
                </div>

                {/* Footer details: root & wazan */}
                {(w.root || w.wazan) && (
                  <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    {w.root && <span>Akar: <strong className="font-amiri text-xs text-slate-700">{w.root}</strong></span>}
                    {w.wazan && <span>Wazan: <strong>{w.wazan}</strong></span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Flashcard View */}
      {viewMode === 'flashcards' && filtered.length > 0 && currentCard && (
        <div className="max-w-md mx-auto space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="bg-white min-h-[260px] p-6 rounded-3xl border-2 border-emerald-200/80 shadow-xl cursor-pointer flex flex-col justify-between items-center text-center transition-all duration-300 hover:scale-[1.01] hover:border-emerald-400 select-none relative overflow-hidden"
          >
            <div className="w-full flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span className="bg-slate-100 px-2.5 py-1 rounded-full">
                Kartu {flashcardIndex + 1} dari {filtered.length}
              </span>
              <span className="text-emerald-600 flex items-center gap-1 text-[11px]">
                <RotateCw className="w-3 h-3" /> Klik untuk membalik
              </span>
            </div>

            {/* Front of card (Arabic) */}
            {!isFlipped ? (
              <div className="space-y-3 py-6 animate-fade-in">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Bahasa Arab
                </span>
                <h2 className="text-5xl font-amiri font-bold text-emerald-950 py-2">
                  {currentCard.word_ar}
                </h2>
                {currentCard.transliteration && (
                  <p className="text-xs font-mono text-emerald-700 italic">
                    [{currentCard.transliteration}]
                  </p>
                )}
                <div className="pt-2">
                  <button
                    onClick={(e) => handlePlayAudio(e, currentCard.word_ar)}
                    className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-full transition"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Back of card (Translation & Details) */
              <div className="space-y-3 py-4 animate-fade-in">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                  Terjemahan & Morfologi
                </span>
                <h3 className="text-xl font-bold text-slate-900">{currentCard.word_id}</h3>
                {currentCard.meaning_detail && (
                  <p className="text-xs text-slate-600 max-w-xs">{currentCard.meaning_detail}</p>
                )}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px]">
                  {currentCard.root && (
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-mono">
                      Akar: <strong className="font-amiri">{currentCard.root}</strong>
                    </span>
                  )}
                  {currentCard.wazan && (
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-mono">
                      Wazan: <strong>{currentCard.wazan}</strong>
                    </span>
                  )}
                  {currentCard.pos && (
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
                      {currentCard.pos}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="text-[10px] text-slate-400">
              {isFlipped ? 'Klik kartu untuk kembali ke teks Arab' : 'Klik kartu untuk melihat arti & kaidah'}
            </div>
          </div>

          {/* Flashcard Navigation Buttons */}
          <div className="flex items-center justify-between gap-3 px-2">
            <button
              onClick={handlePrevCard}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Sebelumnya
            </button>

            <button
              onClick={(e) => handleToggleSave(e, currentCard)}
              className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5" /> Simpan Kata
            </button>

            <button
              onClick={handleNextCard}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              Berikutnya <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
