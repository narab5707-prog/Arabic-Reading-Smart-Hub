import React, { useState } from 'react';
import {
  History,
  BarChart3,
  Bookmark,
  Mic,
  Download,
  Upload,
  Trash2,
  Play,
  Pause,
  X,
  BookOpen,
  Calendar,
  Flame,
  Volume2,
  CheckCircle2,
  Sparkles,
  Award,
} from 'lucide-react';
import { AudioRecordingItem, ReadingItem, UserStats, WordData } from '../types';
import { StorageService } from '../services/storageService';
import { audioService } from '../services/audioService';

interface HistoryAndStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  readings: ReadingItem[];
  onSelectReading: (id: string) => void;
  onDeleteReading: (id: string) => void;
  stats: UserStats;
  savedWords: WordData[];
  recordings: AudioRecordingItem[];
  onDataImported: () => void;
}

export const HistoryAndStatsModal: React.FC<HistoryAndStatsModalProps> = ({
  isOpen,
  onClose,
  readings,
  onSelectReading,
  onDeleteReading,
  stats,
  savedWords,
  recordings,
  onDataImported,
}) => {
  const [activeTab, setActiveTab] = useState<'readings' | 'stats' | 'vocab' | 'audio'>('readings');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const filteredReadings = readings.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.title_ar.toLowerCase().includes(q) ||
      r.title_id.toLowerCase().includes(q) ||
      r.topic.toLowerCase().includes(q) ||
      r.level.toLowerCase().includes(q)
    );
  });

  const handlePlayAudio = (id: string, audioUrl: string) => {
    if (playingAudioId === id && audioElement) {
      audioElement.pause();
      setPlayingAudioId(null);
      return;
    }

    if (audioElement) {
      audioElement.pause();
    }

    const audio = new Audio(audioUrl);
    audio.onended = () => setPlayingAudioId(null);
    audio.play();
    setAudioElement(audio);
    setPlayingAudioId(id);
  };

  const handleExport = () => {
    const jsonStr = StorageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arabic-reading-smart-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = StorageService.importData(content);
        if (success) {
          alert('Data berhasil diimpor!');
          onDataImported();
        } else {
          alert('Format data cadangan tidak sesuai.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/60 rounded-xl border border-emerald-500/30">
              <History className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Pustaka & Statistik Belajar</h3>
              <p className="text-xs text-emerald-200 mt-0.5">Riwayat bacaan, kosakata tersimpan, rekaman suara, dan progres</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50/80 px-5 text-xs font-bold overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('readings')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'readings'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Pustaka Bacaan ({readings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'stats'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Statistik & Streak</span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'vocab'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Kosakata Tersimpan ({savedWords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'audio'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Rekaman Suara ({recordings.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: READINGS LIBRARY */}
          {activeTab === 'readings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul, topik, atau level..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl text-xs"
                />
              </div>

              {filteredReadings.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
                  Tidak ada materi bacaan yang cocok.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredReadings.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white hover:bg-slate-50/80 border border-slate-200/80 rounded-2xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div
                        onClick={() => {
                          onSelectReading(item.id);
                          onClose();
                        }}
                        className="space-y-1 flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                            {item.level}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(item.created_at).toLocaleDateString('id-ID')}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            • {item.actual_word_count || item.target_word_count || 250} kata
                          </span>
                        </div>
                        <h4 className="font-amiri text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition dir-rtl text-right sm:text-left" dir="rtl">
                          {item.title_ar}
                        </h4>
                        <p className="text-xs font-semibold text-slate-700">{item.title_id}</p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => {
                            onSelectReading(item.id);
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition"
                        >
                          Buka Bacaan
                        </button>
                        <button
                          onClick={() => onDeleteReading(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus bacaan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STATS & STREAK */}
          {activeTab === 'stats' && (
            <div className="space-y-5">
              {/* Top Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-center space-y-1">
                  <div className="flex items-center justify-center gap-1 text-emerald-700">
                    <Flame className="w-5 h-5 text-amber-500" />
                    <span className="text-2xl font-bold font-mono">{stats.current_streak_days}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                    Hari Streak
                  </span>
                </div>

                <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl text-center space-y-1">
                  <div className="text-2xl font-bold font-mono text-teal-800">
                    {stats.total_words_read.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-900">
                    Total Kata Dibaca
                  </span>
                </div>

                <div className="p-4 bg-sky-50/70 border border-sky-200/80 rounded-2xl text-center space-y-1">
                  <div className="text-2xl font-bold font-mono text-sky-800">
                    {stats.total_readings_completed}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-900">
                    Sesi Bacaan
                  </span>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-center space-y-1">
                  <div className="text-2xl font-bold font-mono text-amber-800">
                    {Math.round(stats.total_recording_seconds / 60)} m
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                    Durasi Rekam
                  </span>
                </div>
              </div>

              {/* CEFR Level distribution */}
              <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Distribusi Level Latihan (CEFR)
                </h4>
                <div className="grid grid-cols-6 gap-2 text-center">
                  {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const).map((lvl) => (
                    <div key={lvl} className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
                      <span className="text-xs font-bold text-emerald-800">{lvl}</span>
                      <p className="text-sm font-bold font-mono text-slate-900">
                        {stats.level_counts?.[lvl] || 0}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SAVED VOCAB */}
          {activeTab === 'vocab' && (
            <div className="space-y-3">
              {savedWords.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
                  Belum ada kosakata yang disimpan ke Flashcard.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {savedWords.map((w, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <h4 className="font-amiri text-xl font-bold text-emerald-950">{w.word_ar}</h4>
                        <p className="text-xs font-bold text-slate-800">{w.word_id}</p>
                        {w.root && (
                          <span className="text-[10px] text-slate-500 font-mono">
                            Akar: {w.root} | Wazan: {w.wazan || '-'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => audioService.speakArabic(w.word_ar)}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            StorageService.removeSavedWord(w.word_clean || w.word_ar);
                            onDataImported();
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AUDIO RECORDINGS */}
          {activeTab === 'audio' && (
            <div className="space-y-3">
              {recordings.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs">
                  Belum ada rekaman suara tersimpan.
                </div>
              ) : (
                <div className="space-y-2">
                  {recordings.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900">{rec.reading_title}</h4>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {new Date(rec.created_at).toLocaleString('id-ID')} • Durasi: {rec.duration_seconds} detik
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePlayAudio(rec.id, rec.audio_url)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          {playingAudioId === rec.id ? (
                            <>
                              <Pause className="w-3.5 h-3.5" /> Jeda
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" /> Putar
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            StorageService.deleteRecording(rec.id);
                            onDataImported();
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Backup & Export */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              Ekspor Cadangan (JSON)
            </button>
            <label className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-emerald-700" />
              Impor Cadangan
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 font-bold text-slate-700 hover:bg-slate-200/70 rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
