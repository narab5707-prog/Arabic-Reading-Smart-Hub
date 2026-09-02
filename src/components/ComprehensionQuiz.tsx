import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award, ChevronRight } from 'lucide-react';
import { QuizQuestion } from '../types';

interface ComprehensionQuizProps {
  questions: QuizQuestion[];
}

export const ComprehensionQuiz: React.FC<ComprehensionQuizProps> = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!questions || questions.length === 0) {
    return null;
  }

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_index) {
        score += 1;
      }
    });
    return score;
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = calculateScore();
  const allAnswered = questions.every((_, idx) => selectedAnswers[idx] !== undefined);

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200/70 text-emerald-800">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 leading-tight">
              Kuis Pemahaman Bacaan (فهم المقروء)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Uji tingkat pemahaman Anda terhadap detail dan konteks bacaan
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 bg-emerald-100 text-emerald-900 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-emerald-300">
              <Award className="w-4 h-4 text-emerald-700" />
              Skor: {score} / {questions.length} (
              {Math.round((score / questions.length) * 100)}%)
            </div>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Ulangi
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSubmitted(true)}
            disabled={!allAnswered}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
          >
            Periksa Jawaban
          </button>
        )}
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const userAnswer = selectedAnswers[qIdx];
          const isCorrect = userAnswer === q.correct_index;

          return (
            <div
              key={q.id || qIdx}
              className={`p-4 sm:p-5 rounded-2xl border transition ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-rose-50/50 border-rose-200'
                  : 'bg-slate-50/50 border-slate-200'
              } space-y-3`}
            >
              {/* Question text */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Pertanyaan #{qIdx + 1}</span>
                  {submitted && (
                    <span className={`font-bold flex items-center gap-1 ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Benar
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" /> Belum Tepat
                        </>
                      )}
                    </span>
                  )}
                </div>

                <h4
                  className="font-amiri text-xl font-bold text-slate-900 leading-relaxed text-right dir-rtl"
                  dir="rtl"
                >
                  {q.question_ar}
                </h4>
                {q.question_id && (
                  <p className="text-xs text-slate-600 font-medium">{q.question_id}</p>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  const isThisCorrect = q.correct_index === optIdx;

                  let btnStyle = 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800';

                  if (submitted) {
                    if (isThisCorrect) {
                      btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                    } else if (isSelected && !isThisCorrect) {
                      btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                    } else {
                      btnStyle = 'bg-white/60 border-slate-200 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-xs';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelect(qIdx, optIdx)}
                      disabled={submitted}
                      className={`p-3 rounded-xl border text-right font-amiri text-base transition flex items-center justify-between gap-2 ${btnStyle}`}
                      dir="rtl"
                    >
                      <span className="leading-snug">{opt}</span>
                      <span
                        className={`text-xs font-sans px-1.5 py-0.5 rounded-full ${
                          isSelected && !submitted ? 'bg-white/20 text-white' : 'text-slate-400'
                        }`}
                        dir="ltr"
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon submission */}
              {submitted && q.explanation && (
                <div className="p-3 bg-white/80 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-slate-700 block">Penjelasan:</span>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
