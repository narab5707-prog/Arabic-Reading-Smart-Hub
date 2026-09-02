import React, { useState } from 'react';
import { BookOpen, Sparkles, Languages, CheckCircle2, ChevronRight, Layers, HelpCircle } from 'lucide-react';
import { GrammarRule } from '../types';

interface GrammarSectionProps {
  grammarRules: GrammarRule[];
  grammarLevel?: string;
  grammarLanguage?: string;
}

export const GrammarSection: React.FC<GrammarSectionProps> = ({
  grammarRules,
  grammarLevel,
  grammarLanguage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!grammarRules || grammarRules.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 text-slate-500">
        <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-semibold">Tidak ada uraian kaidah untuk teks ini.</p>
      </div>
    );
  }

  const categories = ['all', ...Array.from(new Set(grammarRules.map((r) => r.category || 'umum')))];

  const filteredRules =
    selectedCategory === 'all'
      ? grammarRules
      : grammarRules.filter((r) => (r.category || 'umum') === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200/70 text-emerald-800">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 leading-tight flex items-center gap-2">
              <span>Uraian Kaidah & Tata Bahasa (النحو والصرف)</span>
              {grammarLevel && (
                <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Level {grammarLevel}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Analisis struktur sintaksis, morfologi akar kata, dan kaidah kebahasaan
            </p>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat === 'all' ? 'Semua Kaidah' : cat === 'nahwu' ? 'Nahwu (Sintaksis)' : cat === 'shorof' ? 'Shorof (Morfologi)' : cat === 'balaghah' ? 'Balaghah' : 'Umum'}
            </button>
          ))}
        </div>
      </div>

      {/* Grammar Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule, idx) => (
          <div
            key={rule.id || idx}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-emerald-300 transition space-y-3.5 flex flex-col justify-between"
          >
            {/* Card Header */}
            <div className="space-y-1.5 border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  {rule.category === 'nahwu'
                    ? 'Kaidah Nahwu'
                    : rule.category === 'shorof'
                    ? 'Kaidah Shorof'
                    : 'Kaidah Bahasa'}
                </span>
                <span className="text-xs font-mono text-slate-400">#0{idx + 1}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">{rule.title}</h4>
            </div>

            {/* Arabic Rule Statement */}
            {rule.rule_ar && (
              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                  Matan / Kaidah Arab:
                </span>
                <p
                  className="font-amiri text-base font-semibold text-emerald-900 leading-relaxed dir-rtl text-right"
                  dir="rtl"
                >
                  {rule.rule_ar}
                </p>
              </div>
            )}

            {/* Indonesian Rule Explanation */}
            {rule.rule_id && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Penjelasan Kaidah:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">{rule.rule_id}</p>
              </div>
            )}

            {/* Example with Tashkeel & Transliteration */}
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/70 rounded-xl space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Contoh Kalimat dari Teks:
              </span>
              <p
                className="font-amiri text-lg font-bold text-emerald-950 leading-relaxed dir-rtl text-right"
                dir="rtl"
              >
                {rule.example_ar}
              </p>
              {rule.transliteration && (
                <p className="text-[11px] text-emerald-700 font-mono italic">
                  [{rule.transliteration}]
                </p>
              )}
              {rule.example_id && (
                <p className="text-xs text-slate-600 pt-0.5 border-t border-emerald-200/60">
                  Arti: "{rule.example_id}"
                </p>
              )}
            </div>

            {/* Practical Notes */}
            {rule.explanation && (
              <div className="text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Aplikasi Praktis:
                </span>
                <p className="leading-relaxed">{rule.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
