import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Download,
  Save,
  Volume2,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Award,
  CheckCheck,
} from 'lucide-react';
import { AudioRecordingItem, ReadingItem, UserStats } from '../types';
import { audioService, AudioService } from '../services/audioService';
import { StorageService } from '../services/storageService';

interface AudioRecorderProps {
  reading: ReadingItem;
  onRecordingSaved?: (item: AudioRecordingItem) => void;
  onReadingCompleted?: (stats: UserStats) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  reading,
  onRecordingSaved,
  onReadingCompleted,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCompletedSession, setIsCompletedSession] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [completedStats, setCompletedStats] = useState<UserStats | null>(null);

  const timerRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    setPermissionError(null);
    setIsSaved(false);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setSeconds(0);

    const success = await audioService.startRecording((vol) => {
      setVolumeLevel(vol);
    });

    if (success) {
      setIsRecording(true);
      setIsPaused(false);
    } else {
      setPermissionError('Tidak dapat mengakses mikrofon. Pastikan izin mikrofon telah diberikan pada peramban Anda.');
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setIsPaused(false);
    setVolumeLevel(0);

    const blob = await audioService.stopRecording();
    if (blob) {
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    }
  };

  const handleTogglePlayRecorded = () => {
    if (!audioElementRef.current && audioUrl) {
      audioElementRef.current = new Audio(audioUrl);
      audioElementRef.current.onended = () => setIsPlayingRecorded(false);
    }

    if (audioElementRef.current) {
      if (isPlayingRecorded) {
        audioElementRef.current.pause();
        setIsPlayingRecorded(false);
      } else {
        audioElementRef.current.play();
        setIsPlayingRecorded(true);
      }
    }
  };

  const handleSaveRecording = async () => {
    if (!audioBlob || isSaved) return;

    try {
      const base64Audio = await AudioService.blobToBase64(audioBlob);
      const newItem: AudioRecordingItem = {
        id: `rec-${Date.now()}`,
        reading_id: reading.id,
        reading_title: reading.title_id || reading.title_ar,
        created_at: new Date().toISOString(),
        duration_seconds: seconds,
        audio_url: base64Audio,
      };

      StorageService.saveRecording(newItem);
      setIsSaved(true);
      if (onRecordingSaved) {
        onRecordingSaved(newItem);
      }
    } catch (e) {
      console.error('Failed to save recording base64:', e);
    }
  };

  // Mark reading as completed in daily progress
  const handleFinishReading = () => {
    const stats = StorageService.completeReadingSession(reading, Boolean(audioBlob || isSaved));
    setIsCompletedSession(true);
    setCompletedStats(stats);
    if (onReadingCompleted) {
      onReadingCompleted(stats);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `rekaman-bacaan-${(reading.title_id || reading.title_ar).slice(0, 20).replace(/\s+/g, '_')}-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-4 sm:p-5 rounded-3xl border border-emerald-800/40 shadow-xl space-y-4">
      {/* Title & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-700/50 rounded-xl text-emerald-300 border border-emerald-500/30">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm leading-tight text-white flex items-center gap-2">
              <span>Studio Rekam Suara & Progres Harian</span>
              {isRecording && (
                <span className="flex items-center gap-1 text-[11px] font-mono text-rose-400 font-bold bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-800">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                  Merekam
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-400">
              Rekam suara Anda, simpan rekaman, lalu klik "Selesai Baca" untuk mencatat progres harian.
            </p>
          </div>
        </div>

        {/* Timer & Finished Badge */}
        <div className="flex items-center gap-2">
          {isCompletedSession && (
            <span className="bg-amber-400 text-emerald-950 font-bold text-xs px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-sm">
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Selesai Dibaca</span>
            </span>
          )}

          <div className="bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700 text-sm font-mono font-bold tracking-wider text-emerald-400 shadow-inner">
            {formatTime(seconds)}
          </div>
        </div>
      </div>

      {permissionError && (
        <div className="p-3 bg-rose-900/50 border border-rose-700/60 rounded-xl text-xs text-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{permissionError}</span>
        </div>
      )}

      {/* Completion Celebration Message */}
      {isCompletedSession && (
        <div className="p-3.5 bg-emerald-800/60 border border-emerald-500/40 rounded-2xl flex items-center justify-between gap-3 animate-fade-in text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-400 text-emerald-950 rounded-lg">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-emerald-100">
                Alhamdulillah! Sesi bacaan ini berhasil tersimpan ke progres harian.
              </p>
              <p className="text-[11px] text-emerald-300">
                Total Bacaan: {completedStats?.total_readings_completed} teks | Kata Dibaca: +{reading.actual_word_count || reading.target_word_count} kata | Streak: {completedStats?.current_streak_days} hari
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recording Visualizer & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
        {/* Visualizer / Waveform */}
        <div className="w-full sm:flex-1 bg-slate-950/60 rounded-2xl p-3 border border-slate-800 flex items-center gap-1.5 h-12 justify-center overflow-hidden">
          {isRecording ? (
            Array.from({ length: 24 }).map((_, i) => {
              const heightPercent = Math.max(
                15,
                Math.min(100, Math.sin(i + volumeLevel) * volumeLevel + Math.random() * 20)
              );
              return (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-emerald-500 to-teal-300 rounded-full transition-all duration-75"
                  style={{ height: `${heightPercent}%` }}
                />
              );
            })
          ) : audioUrl ? (
            <div className="text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Rekaman selesai ({formatTime(seconds)}). Siap diputar atau disimpan.</span>
            </div>
          ) : (
            <span className="text-xs text-slate-500">Tekan "Mulai Rekam" untuk merekam suara latihan baca Anda</span>
          )}
        </div>

        {/* Buttons Group (Recording + Selesai Baca) */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!isRecording ? (
            <button
              type="button"
              onClick={handleStartRecording}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-900/40 cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>{audioUrl ? 'Rekam Ulang' : 'Mulai Rekam'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopRecording}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-rose-900/40 animate-pulse cursor-pointer"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Stop Rekam</span>
            </button>
          )}

          {/* Playback Button */}
          {audioUrl && !isRecording && (
            <>
              <button
                type="button"
                onClick={handleTogglePlayRecorded}
                className="px-3.5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                title="Putar rekaman Anda"
              >
                {isPlayingRecorded ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingRecorded ? 'Jeda' : 'Putar'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveRecording}
                disabled={isSaved}
                className={`px-3.5 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-800/80 text-emerald-200 border border-emerald-700 cursor-default'
                    : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                }`}
                title="Simpan ke riwayat lokal"
              >
                <Save className="w-4 h-4" />
                <span>{isSaved ? 'Tersimpan' : 'Simpan Rekaman'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                title="Unduh file audio"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Selesai Baca Button */}
          <button
            type="button"
            onClick={handleFinishReading}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg cursor-pointer ${
              isCompletedSession
                ? 'bg-amber-400 text-emerald-950 font-bold shadow-amber-400/20'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-emerald-950 shadow-amber-900/30 font-bold'
            }`}
          >
            <CheckCheck className="w-4 h-4 text-emerald-950" />
            <span>{isCompletedSession ? 'Selesai Dibaca ✓' : 'Selesai Baca'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
