import React, { useState } from 'react';
import { Key, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { UserSettings } from '../types';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [apiKey, setApiKey] = useState(settings.gemini_api_key);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setTestResult({ success: false, message: 'Masukkan API Key terlebih dahulu.' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=${encodeURIComponent(trimmed)}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Katakan "OK" jika terhubung.' }] }],
        }),
      });

      if (res.ok) {
        setTestResult({
          success: true,
          message: 'Berhasil terhubung ke Google Gemini API! API Key valid.',
        });
      } else {
        const err = await res.json();
        setTestResult({
          success: false,
          message: `Gagal: ${err.error?.message || 'API Key tidak valid'}`,
        });
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Koneksi gagal.';
      setTestResult({ success: false, message: `Error: ${msg}` });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      gemini_api_key: apiKey.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/60 rounded-xl border border-emerald-500/30">
              <Key className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Pengaturan Gemini API Key</h3>
              <p className="text-xs text-emerald-200 mt-0.5">Integrasi kecerdasan buatan langsung di peramban Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Security badge */}
          <div className="flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-200/70 rounded-xl text-xs text-emerald-800">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>100% Aman & Sisi Klien:</strong> API Key Anda disimpan langsung di <code className="bg-emerald-100/80 px-1 py-0.5 rounded font-mono">localStorage</code> perangkat browser Anda dan hanya dikirimkan langsung ke endpoint resmi Google Gemini.
            </p>
          </div>

          {/* Key Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder="AIzaSy..."
                className="w-full pl-3.5 pr-11 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 rounded-xl text-sm font-mono transition text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Test connection button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={testing || !apiKey.trim()}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {testing ? 'Menguji koneksi...' : 'Uji Koneksi API'}
            </button>
            {apiKey && (
              <button
                type="button"
                onClick={() => {
                  setApiKey('');
                  setTestResult(null);
                }}
                className="px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition"
              >
                Hapus Key
              </button>
            )}
          </div>

          {/* Test Status Banner */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{testResult.message}</span>
            </div>
          )}

          {/* Guide to get free key */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800 flex items-center justify-between">
              <span>Belum memiliki API Key?</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 hover:underline"
              >
                Dapatkan Gratis di AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-500 pl-1">
              <li>Buka Google AI Studio melalui tautan di atas.</li>
              <li>Masuk dengan akun Google Anda dan klik <strong>Create API Key</strong>.</li>
              <li>Salin API Key lalu tempelkan ke kolom di atas dan klik <strong>Simpan</strong>.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-700/20 rounded-xl transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
};
