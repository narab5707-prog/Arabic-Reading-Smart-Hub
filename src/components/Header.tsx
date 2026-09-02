import React from 'react';
import {
  BookOpen,
  Sparkles,
  Key,
  BarChart3,
  Flame,
  Bookmark,
  Languages,
  Layers,
  Settings,
  Zap,
} from 'lucide-react';
import { UserSettings, UserStats } from '../types';

interface HeaderProps {
  onOpenGenerator: () => void;
  onQuickGenerate: () => void;
  onOpenApiKeyModal: () => void;
  onOpenHistoryStats: () => void;
  settings: UserSettings;
  stats: UserStats;
  savedWordsCount: number;
  isGenerating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGenerator,
  onQuickGenerate,
  onOpenApiKeyModal,
  onOpenHistoryStats,
  settings,
  stats,
  savedWordsCount,
  isGenerating = false,
}) => {
  const hasApiKey = Boolean(settings.gemini_api_key?.trim());

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 backdrop-blur-md bg-white/95 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3 sm:gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-900 text-white flex items-center justify-center shadow-md shadow-emerald-900/20 border border-emerald-600/30 shrink-0">
            <BookOpen className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg text-slate-900 leading-none">
                Arabic Reading Smart Hub
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                AI CEFR
              </span>
            </div>
            <p className="text-[11px] font-amiri font-semibold text-emerald-800 leading-tight mt-0.5 dir-rtl" dir="rtl">
              المركز الذكي لتطوير مهارات القراءة العربية
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Streak Badge */}
          <button
            onClick={onOpenHistoryStats}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold transition hover:bg-amber-100/80 cursor-pointer"
            title="Hari Streak Belajar"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{stats.current_streak_days} Hari</span>
          </button>

          {/* Saved Words Shortcut */}
          <button
            onClick={onOpenHistoryStats}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
            title="Kosakata Tersimpan"
          >
            <Bookmark className="w-3.5 h-3.5 text-emerald-700" />
            <span>{savedWordsCount} Kata</span>
          </button>

          {/* Library & Stats */}
          <button
            onClick={onOpenHistoryStats}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            title="Riwayat & Pustaka Bacaan"
          >
            <BarChart3 className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Pustaka</span>
          </button>

          {/* API Key Settings Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              hasApiKey
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:bg-emerald-100/70'
                : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 animate-pulse'
            }`}
            title="Pengaturan Gemini API Key"
          >
            <Key className="w-4 h-4" />
            <span className="hidden sm:inline">API Key</span>
            <span
              className={`w-2 h-2 rounded-full ${
                hasApiKey ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
          </button>

          {/* Quick 1-Click New Narration Button */}
          <button
            onClick={onQuickGenerate}
            disabled={isGenerating}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50 cursor-pointer"
            title="Buat narasi bacaan baru secara instan dalam 1 klik"
          >
            <Zap className={`w-3.5 h-3.5 text-amber-100 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Menyusun...' : 'Narasi Cepat'}</span>
          </button>

          {/* Primary CTA: Mulai Membaca */}
          <button
            onClick={onOpenGenerator}
            disabled={isGenerating}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white text-xs font-bold shadow-md shadow-emerald-800/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isGenerating ? 'Menyusun Bacaan...' : 'Mulai Membaca'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
