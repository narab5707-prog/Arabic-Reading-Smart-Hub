// Audio Service for Interactive Language Reading Studio
// High-Fidelity Multi-Language Natural TTS (Arabic & English Dialects) & Per-Paragraph Recording

import { LanguageVersion, VoiceCharacterId } from '../types';

export interface VoiceCharacterOption {
  id: VoiceCharacterId;
  name_ar: string;
  name_en: string;
  name_id: string;
  description: string;
  icon: string;
  gender: 'female' | 'male';
  pitch: number;
  rateFactor: number;
}

export const VOICE_CHARACTERS: VoiceCharacterOption[] = [
  {
    id: 'female_calm',
    name_ar: 'صوت نسائي هادئ',
    name_en: 'Female Calm & Warm',
    name_id: 'Perempuan Tenang & Lembut',
    description: 'Intonasi santai, nyaman didengarkan untuk bacaan santai & reflektif',
    icon: '👩',
    gender: 'female',
    pitch: 1.05,
    rateFactor: 0.95,
  },
  {
    id: 'female_clear',
    name_ar: 'صوت نسائي واضح (معلمة)',
    name_en: 'Female Clear (Teacher)',
    name_id: 'Perempuan Jelas & Lugas (Guru)',
    description: 'Artikulasi makhraj & harakat tajam seperti pengajar bahasa',
    icon: '👩‍🏫',
    gender: 'female',
    pitch: 1.12,
    rateFactor: 0.92,
  },
  {
    id: 'male_calm',
    name_ar: 'صوت رجالي هادئ',
    name_en: 'Male Calm & Natural',
    name_id: 'Laki-laki Tenang & Natural',
    description: 'Suara pria berwibawa, tempo seimbang dan lembut',
    icon: '👨',
    gender: 'male',
    pitch: 0.92,
    rateFactor: 0.96,
  },
  {
    id: 'male_clear',
    name_ar: 'صوت رجالي واضح (مذيع)',
    name_en: 'Male Clear (Broadcaster)',
    name_id: 'Laki-laki Jelas (Penyiar/Pendidik)',
    description: 'Gaya penyiar berita fusha dengan artikulasi vokal tegas',
    icon: '👨‍🏫',
    gender: 'male',
    pitch: 1.0,
    rateFactor: 0.95,
  },
  {
    id: 'narrative',
    name_ar: 'صوت قصصي ودرامي',
    name_en: 'Narrative Storyteller',
    name_id: 'Naratif / Kisah & Cerita',
    description: 'Kaya penghayatan dan intonasi ekspresif untuk fabel, novel & dongeng',
    icon: '📖',
    gender: 'male',
    pitch: 0.98,
    rateFactor: 0.9,
  },
  {
    id: 'academic',
    name_ar: 'صوت أكاديمي ورسمي',
    name_en: 'Academic & Scholarly',
    name_id: 'Akademik / Formal Stabil',
    description: 'Gaya formal stabil untuk wacana sains, turats, sejarah & pemikiran',
    icon: '🎓',
    gender: 'male',
    pitch: 0.88,
    rateFactor: 0.93,
  },
  {
    id: 'warm_conversational',
    name_ar: 'صوت دافئ وحواري',
    name_en: 'Warm & Conversational',
    name_id: 'Hangat & Percakapan Santai',
    description: 'Intonasi santai dialogis untuk percakapan sehari-hari',
    icon: '☕',
    gender: 'female',
    pitch: 1.02,
    rateFactor: 0.98,
  },
  {
    id: 'formal',
    name_ar: 'صوت رسمي فصيح',
    name_en: 'Formal & Eloquent',
    name_id: 'Formal & Khidmat',
    description: 'Pelafalan baku tinggi untuk teks resmi dan sastra klasik',
    icon: '🏛️',
    gender: 'male',
    pitch: 0.95,
    rateFactor: 0.94,
  },
];

export interface LanguageVariantConfig {
  id: LanguageVersion;
  name_native: string;
  name_id: string;
  flag: string;
  speechLocale: string;
  googleTtsCode: string;
}

export const LANGUAGE_VARIANTS: LanguageVariantConfig[] = [
  {
    id: 'ar_fusha',
    name_native: 'العربية الفصحى',
    name_id: 'Bahasa Arab Fuṣḥā (Standard)',
    flag: '📚',
    speechLocale: 'ar-SA',
    googleTtsCode: 'ar',
  },
  {
    id: 'ar_saudi',
    name_native: 'لهجة سعودية (Saudi)',
    name_id: 'Dialek Saudi Arabia',
    flag: '🇸🇦',
    speechLocale: 'ar-SA',
    googleTtsCode: 'ar-SA',
  },
  {
    id: 'ar_egyptian',
    name_native: 'لهجة مصرية (Egyptian)',
    name_id: 'Dialek Mesir (Masri)',
    flag: '🇪🇬',
    speechLocale: 'ar-EG',
    googleTtsCode: 'ar-EG',
  },
  {
    id: 'ar_levantine',
    name_native: 'لهجة شامية (Levantine)',
    name_id: 'Dialek Syam (Levantine)',
    flag: '🇸🇾',
    speechLocale: 'ar-LB',
    googleTtsCode: 'ar-LB',
  },
  {
    id: 'ar_gulf',
    name_native: 'لهجة خليجية (Gulf)',
    name_id: 'Dialek Teluk (Khaleeji)',
    flag: '🌴',
    speechLocale: 'ar-AE',
    googleTtsCode: 'ar-AE',
  },
  {
    id: 'en_british',
    name_native: 'British English',
    name_id: 'Bahasa Inggris British',
    flag: '🇬🇧',
    speechLocale: 'en-GB',
    googleTtsCode: 'en-GB',
  },
  {
    id: 'en_american',
    name_native: 'American English',
    name_id: 'Bahasa Inggris American',
    flag: '🇺🇸',
    speechLocale: 'en-US',
    googleTtsCode: 'en-US',
  },
];

export interface SpeakOptions {
  rate?: number;
  voiceCharacter?: VoiceCharacterId;
  languageVersion?: LanguageVersion;
  onStart?: () => void;
  onEnd?: () => void;
  onBoundary?: (charIndex: number, charLength?: number) => void;
  onProgress?: (progressRatio: number) => void;
}

export class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private animationFrameId: number | null = null;
  private stream: MediaStream | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeakingFlag = false;
  private isPausedFlag = false;

  /**
   * Universal Speech synthesizer supporting both Arabic & English varieties,
   * natural voice profiles, playback rates, and live boundary / progress events.
   */
  public async speak(text: string, options: SpeakOptions = {}): Promise<void> {
    const cleanText = text.trim();
    if (!cleanText) return;

    this.stopSpeaking();
    this.isSpeakingFlag = true;
    this.isPausedFlag = false;

    const rate = options.rate || 1.0;
    const voiceId = options.voiceCharacter || 'female_clear';
    const langVer = options.languageVersion || 'ar_fusha';
    const character = VOICE_CHARACTERS.find((v) => v.id === voiceId) || VOICE_CHARACTERS[1];
    const langConfig = LANGUAGE_VARIANTS.find((l) => l.id === langVer) || LANGUAGE_VARIANTS[0];

    if (options.onStart) {
      options.onStart();
    }

    try {
      // Primary: High-fidelity natural TTS proxy with authentic Arabic and regional phonetics
      await this.playNaturalAudio(cleanText, rate * character.rateFactor, character, langConfig, options);
    } catch (err) {
      console.warn('Natural TTS audio proxy failed, attempting Web Speech API fallback:', err);
      try {
        if ('speechSynthesis' in window) {
          await this.speakWebSpeech(cleanText, rate * character.rateFactor, character, langConfig, options);
        } else {
          throw new Error('Web Speech API is not available on this browser.');
        }
      } catch (fallbackErr) {
        console.error('All TTS methods failed:', fallbackErr);
      }
    } finally {
      this.isSpeakingFlag = false;
      this.isPausedFlag = false;
      if (options.onEnd) {
        options.onEnd();
      }
    }
  }

  /**
   * Backwards compatible alias for speaking Arabic
   */
  public async speakArabic(text: string, options: SpeakOptions = {}): Promise<void> {
    return this.speak(text, {
      ...options,
      languageVersion: options.languageVersion || 'ar_fusha',
    });
  }

  private playNaturalAudio(
    text: string,
    rate: number = 1.0,
    character: VoiceCharacterOption,
    langConfig: LanguageVariantConfig,
    options: SpeakOptions = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = `/api/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(
        langConfig.googleTtsCode
      )}&voice=${encodeURIComponent(character.id)}`;
      const audio = new Audio(url);
      audio.playbackRate = Math.max(0.65, Math.min(1.6, rate));
      this.currentAudio = audio;

      audio.ontimeupdate = () => {
        if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
          const ratio = Math.min(1, Math.max(0, audio.currentTime / audio.duration));
          if (options.onProgress) {
            options.onProgress(ratio);
          }
          if (options.onBoundary) {
            const charIdx = Math.floor(ratio * text.length);
            options.onBoundary(charIdx, 6);
          }
        }
      };

      audio.onended = () => {
        this.currentAudio = null;
        resolve();
      };

      audio.onerror = (e) => {
        this.currentAudio = null;
        reject(e);
      };

      audio.play().catch((playErr) => {
        this.currentAudio = null;
        reject(playErr);
      });
    });
  }

  private speakWebSpeech(
    text: string,
    rate: number = 0.95,
    character: VoiceCharacterOption,
    langConfig: LanguageVariantConfig,
    options: SpeakOptions = {}
  ): Promise<void> {
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langConfig.speechLocale;
      utterance.rate = Math.max(0.6, Math.min(1.5, rate));
      utterance.pitch = character.pitch;

      const voices = window.speechSynthesis.getVoices();
      const isEnglish = langConfig.id.startsWith('en');

      let matchedVoice: SpeechSynthesisVoice | undefined;

      if (isEnglish) {
        const isBritish = langConfig.id === 'en_british';
        const targetLocale = isBritish ? 'en-gb' : 'en-us';
        const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));

        // Match dialect and gender
        matchedVoice = enVoices.find((v) => {
          const l = v.lang.toLowerCase();
          const n = v.name.toLowerCase();
          const matchesLocale = isBritish ? l.includes('gb') || l.includes('uk') : l.includes('us');
          const matchesGender = character.gender === 'female' ? n.includes('female') || n.includes('zira') || n.includes('samantha') : n.includes('male') || n.includes('david') || n.includes('george');
          return matchesLocale && matchesGender;
        });

        if (!matchedVoice) {
          matchedVoice = enVoices.find((v) => v.lang.toLowerCase().includes(targetLocale));
        }
        if (!matchedVoice && enVoices.length > 0) {
          matchedVoice = enVoices[0];
        }
      } else {
        const arabicVoices = voices.filter(
          (v) =>
            v.lang.startsWith('ar') ||
            v.name.toLowerCase().includes('arabic') ||
            v.name.toLowerCase().includes('maged') ||
            v.name.toLowerCase().includes('tarik') ||
            v.name.toLowerCase().includes('laila') ||
            v.name.toLowerCase().includes('shakir') ||
            v.name.toLowerCase().includes('hamed')
        );

        matchedVoice = arabicVoices.find((v) => {
          const n = v.name.toLowerCase();
          if (character.gender === 'female') {
            return n.includes('female') || n.includes('laila') || n.includes('zariyah') || n.includes('zeina') || n.includes('salma');
          }
          return n.includes('male') || n.includes('tarik') || n.includes('maged') || n.includes('hamed') || n.includes('naayf');
        });

        if (!matchedVoice && arabicVoices.length > 0) {
          matchedVoice = arabicVoices[0];
        }
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      // Live boundary tracking for word & sentence highlighting
      utterance.onboundary = (event) => {
        if (options.onBoundary) {
          options.onBoundary(event.charIndex, event.charLength || 1);
        }
      };

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('TTS utterance error:', e);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  public pauseSpeaking(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.isPausedFlag = true;
    } else if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      this.isPausedFlag = true;
    }
  }

  public resumeSpeaking(): void {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play().catch(() => {});
      this.isPausedFlag = false;
    } else if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.isPausedFlag = false;
    }
  }

  public stopSpeaking(): void {
    this.isSpeakingFlag = false;
    this.isPausedFlag = false;
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingFlag || Boolean(this.currentAudio && !this.currentAudio.paused) || Boolean('speechSynthesis' in window && window.speechSynthesis.speaking);
  }

  public isPaused(): boolean {
    return this.isPausedFlag || Boolean(this.currentAudio && this.currentAudio.paused && this.currentAudio.currentTime > 0) || Boolean('speechSynthesis' in window && window.speechSynthesis.paused);
  }

  // Voice Recording with MediaRecorder & Audio Visualizer per paragraph
  public async startRecording(
    onVolumeChange?: (volume: number) => void
  ): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 128;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (this.analyser && this.dataArray && onVolumeChange) {
          this.analyser.getByteFrequencyData(this.dataArray);
          let sum = 0;
          for (let i = 0; i < this.dataArray.length; i++) {
            sum += this.dataArray[i];
          }
          const average = sum / this.dataArray.length;
          const normalized = Math.min(100, Math.round((average / 128) * 100));
          onVolumeChange(normalized);
          this.animationFrameId = requestAnimationFrame(updateVolume);
        }
      };
      updateVolume();

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/ogg';

      this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100);
      return true;
    } catch (err) {
      console.error('Failed to start recording:', err);
      return false;
    }
  }

  public pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  public resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  public stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close().catch(() => {});
      }

      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        this.cleanupStreams();
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        this.cleanupStreams();
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  private cleanupStreams(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.analyser = null;
  }

  public static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export const audioService = new AudioService();
