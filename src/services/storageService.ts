import {
  AudioRecordingItem,
  ParagraphProgress,
  ParagraphRecording,
  ReadingItem,
  UserSettings,
  UserStats,
  WordData,
} from '../types';
import { SAMPLE_READINGS } from '../data/sampleReadings';

const STORAGE_KEYS = {
  SETTINGS: 'arabic_hub_settings',
  READINGS: 'arabic_hub_readings',
  ACTIVE_READING_ID: 'arabic_hub_active_reading_id',
  RECORDINGS: 'arabic_hub_recordings',
  SAVED_WORDS: 'arabic_hub_saved_words',
  STATS: 'arabic_hub_stats',
  PARAGRAPH_RECORDINGS_PREFIX: 'arabic_hub_p_rec_',
  PARAGRAPH_PROGRESS_PREFIX: 'arabic_hub_p_prog_',
};

export const DEFAULT_SETTINGS: UserSettings = {
  gemini_api_key: '',
  preferred_model: 'gemini-3.7-flash',
  font_family: 'amiri',
  font_size: 'lg',
  line_spacing: 'relaxed',
  reading_mode: 'book',
  reading_theme: 'classic_light',
  default_harakat: true,
  default_transliteration: true,
  auto_speak_on_click: true,
  auto_next_paragraph: false,
  voice_character: 'female_clear',
  audio_speed: 1.0,
};

export const DEFAULT_STATS: UserStats = {
  total_words_read: 0,
  total_readings_completed: 0,
  total_recording_seconds: 0,
  total_flashcards_mastered: 0,
  last_practice_date: '',
  current_streak_days: 1,
  daily_completed_history: [],
  level_counts: {
    A1: 0,
    A2: 0,
    B1: 0,
    B2: 0,
    C1: 0,
    C2: 0,
  },
};

export class StorageService {
  // Settings
  public static getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    return DEFAULT_SETTINGS;
  }

  public static saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  // Readings
  public static getReadings(): ReadingItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.READINGS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load readings:', e);
    }
    // Default seed with samples
    this.saveReadings(SAMPLE_READINGS);
    return SAMPLE_READINGS;
  }

  public static saveReadings(readings: ReadingItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.READINGS, JSON.stringify(readings));
    } catch (e) {
      console.error('Failed to save readings:', e);
    }
  }

  public static addReading(reading: ReadingItem): void {
    const list = this.getReadings();
    const updated = [reading, ...list.filter((r) => r.id !== reading.id)];
    this.saveReadings(updated);
    this.setActiveReadingId(reading.id);
  }

  public static deleteReading(id: string): void {
    const list = this.getReadings();
    const updated = list.filter((r) => r.id !== id);
    this.saveReadings(updated);
  }

  public static toggleFavorite(id: string): boolean {
    const list = this.getReadings();
    let isFav = false;
    const updated = list.map((r) => {
      if (r.id === id) {
        isFav = !r.is_favorite;
        return { ...r, is_favorite: isFav };
      }
      return r;
    });
    this.saveReadings(updated);
    return isFav;
  }

  // Mark reading as completed in daily progress
  public static completeReadingSession(reading: ReadingItem, recorded: boolean = false): UserStats {
    const list = this.getReadings();
    const nowIso = new Date().toISOString();
    const updated = list.map((r) => {
      if (r.id === reading.id) {
        return {
          ...r,
          read_count: (r.read_count || 0) + 1,
          completed_at: nowIso,
        };
      }
      return r;
    });
    this.saveReadings(updated);

    const stats = this.getStats();
    const wordsToAdd = reading.actual_word_count || reading.target_word_count || 250;
    stats.total_words_read += wordsToAdd;
    stats.total_readings_completed += 1;
    stats.level_counts[reading.level] = (stats.level_counts[reading.level] || 0) + 1;

    // Daily history entry
    if (!stats.daily_completed_history) {
      stats.daily_completed_history = [];
    }
    stats.daily_completed_history.unshift({
      date: nowIso,
      reading_id: reading.id,
      reading_title: reading.title_id || reading.title_ar,
      words_count: wordsToAdd,
      recorded,
    });
    // Keep max 50 history entries
    stats.daily_completed_history = stats.daily_completed_history.slice(0, 50);

    // Streak calculation
    const today = new Date().toISOString().split('T')[0];
    if (stats.last_practice_date !== today) {
      if (stats.last_practice_date) {
        const lastDate = new Date(stats.last_practice_date);
        const currDate = new Date(today);
        const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          stats.current_streak_days += 1;
        } else if (diffDays > 1) {
          stats.current_streak_days = 1;
        }
      } else {
        stats.current_streak_days = 1;
      }
      stats.last_practice_date = today;
    }

    this.saveStats(stats);
    return stats;
  }

  // Active Reading
  public static getActiveReadingId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_READING_ID);
  }

  public static setActiveReadingId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_READING_ID, id);
  }

  // Saved Words / Flashcards
  public static getSavedWords(): WordData[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_WORDS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load saved words:', e);
    }
    return [];
  }

  public static saveWord(word: WordData): void {
    const words = this.getSavedWords();
    const clean = word.word_clean || word.word_ar.replace(/[\u064B-\u065F\u0670]/g, '');
    if (!words.some((w) => (w.word_clean || w.word_ar) === clean)) {
      const updated = [{ ...word, word_clean: clean }, ...words];
      localStorage.setItem(STORAGE_KEYS.SAVED_WORDS, JSON.stringify(updated));
    }
  }

  public static removeSavedWord(wordClean: string): void {
    const words = this.getSavedWords();
    const updated = words.filter((w) => (w.word_clean || w.word_ar) !== wordClean);
    localStorage.setItem(STORAGE_KEYS.SAVED_WORDS, JSON.stringify(updated));
  }

  public static isWordSaved(wordClean: string): boolean {
    const words = this.getSavedWords();
    return words.some((w) => (w.word_clean || w.word_ar) === wordClean);
  }

  // Recordings
  public static getRecordings(): AudioRecordingItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECORDINGS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load recordings:', e);
    }
    return [];
  }

  public static saveRecording(recording: AudioRecordingItem): void {
    const list = this.getRecordings();
    const updated = [recording, ...list.filter((r) => r.id !== recording.id)].slice(0, 20);
    try {
      localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(updated));
      this.incrementAudioStats(recording.duration_seconds);
    } catch (e) {
      console.warn('Storage quota exceeded, removing oldest recordings:', e);
      const reduced = updated.slice(0, 5);
      localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(reduced));
    }
  }

  public static deleteRecording(id: string): void {
    const list = this.getRecordings();
    const updated = list.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(updated));
  }

  // Paragraph Recordings per reading & paragraph
  public static getParagraphRecordings(readingId: string): Record<number, ParagraphRecording> {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.PARAGRAPH_RECORDINGS_PREFIX}${readingId}`);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load paragraph recordings:', e);
    }
    return {};
  }

  public static saveParagraphRecording(recording: ParagraphRecording): void {
    try {
      const current = this.getParagraphRecordings(recording.reading_id);
      current[recording.paragraph_id] = recording;
      localStorage.setItem(
        `${STORAGE_KEYS.PARAGRAPH_RECORDINGS_PREFIX}${recording.reading_id}`,
        JSON.stringify(current)
      );
      this.incrementAudioStats(recording.duration_seconds);
    } catch (e) {
      console.warn('Failed to save paragraph recording:', e);
    }
  }

  public static deleteParagraphRecording(readingId: string, paragraphId: number): void {
    try {
      const current = this.getParagraphRecordings(readingId);
      delete current[paragraphId];
      localStorage.setItem(
        `${STORAGE_KEYS.PARAGRAPH_RECORDINGS_PREFIX}${readingId}`,
        JSON.stringify(current)
      );
    } catch (e) {
      console.error('Failed to delete paragraph recording:', e);
    }
  }

  // Paragraph Reading Progress
  public static getParagraphProgress(readingId: string): Record<number, ParagraphProgress> {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.PARAGRAPH_PROGRESS_PREFIX}${readingId}`);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load paragraph progress:', e);
    }
    return {};
  }

  public static saveParagraphProgress(
    readingId: string,
    progress: Record<number, ParagraphProgress>
  ): void {
    try {
      localStorage.setItem(
        `${STORAGE_KEYS.PARAGRAPH_PROGRESS_PREFIX}${readingId}`,
        JSON.stringify(progress)
      );
    } catch (e) {
      console.error('Failed to save paragraph progress:', e);
    }
  }

  public static updateParagraphProgress(
    readingId: string,
    paragraphId: number,
    update: Partial<ParagraphProgress>
  ): Record<number, ParagraphProgress> {
    const current = this.getParagraphProgress(readingId);
    const existing = current[paragraphId] || {
      paragraph_id: paragraphId,
      status: 'unread',
      audio_listened: false,
      recording_completed: false,
    };
    current[paragraphId] = { ...existing, ...update };
    this.saveParagraphProgress(readingId, current);
    return current;
  }

  // User Stats & Streak
  public static getStats(): UserStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (data) {
        return { ...DEFAULT_STATS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.error('Failed to load stats:', e);
    }
    return DEFAULT_STATS;
  }

  public static saveStats(stats: UserStats): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save stats:', e);
    }
  }

  private static incrementAudioStats(durationSeconds: number): void {
    const stats = this.getStats();
    stats.total_recording_seconds += Math.round(durationSeconds);
    this.saveStats(stats);
  }

  // Export / Import
  public static exportAllData(): string {
    const exportObj = {
      version: '2.0',
      exported_at: new Date().toISOString(),
      settings: this.getSettings(),
      readings: this.getReadings(),
      saved_words: this.getSavedWords(),
      recordings: this.getRecordings(),
      stats: this.getStats(),
    };
    return JSON.stringify(exportObj, null, 2);
  }

  public static importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.readings && Array.isArray(data.readings)) {
        this.saveReadings(data.readings);
      }
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      if (data.saved_words) {
        localStorage.setItem(STORAGE_KEYS.SAVED_WORDS, JSON.stringify(data.saved_words));
      }
      if (data.stats) {
        this.saveStats(data.stats);
      }
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }
}
