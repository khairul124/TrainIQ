/**
 * Universal Voice System (Text-to-Speech & Speech-to-Text)
 * Uses native Web Speech API (SpeechSynthesis + SpeechRecognition)
 * Works 100% free, offline, and in all modern browsers.
 */

export class VoiceSystem {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static recognition: any = null;

  /**
   * Speak text out loud (Text-to-Speech)
   */
  static speak(text: string, onEnd?: () => void): void {
    if (!this.synth) return;

    // Clean markdown formatting before speaking
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[\r\n]+/g, '. ');

    this.synth.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Auto detect Bangla vs English
    const isBangla = /[\u0980-\u09FF]/.test(text);
    utterance.lang = isBangla ? 'bn-BD' : 'en-US';
    utterance.rate = 0.95; // Natural speaking pace
    utterance.pitch = 1.0;

    // Pick best available voice
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find(v => v.lang.includes(isBangla ? 'bn' : 'en'));
    if (matchingVoice) utterance.voice = matchingVoice;

    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => this.synth?.cancel();

    this.synth.speak(utterance);
  }

  /**
   * Stop current Speech Synthesis
   */
  static stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Check if speech synthesis is currently active
   */
  static isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }

  /**
   * Start Voice Dictation (Speech-to-Text)
   */
  static startListening(
    onResult: (transcript: string) => void,
    onError?: (err: string) => void,
    onEnd?: () => void
  ): any {
    if (typeof window === 'undefined') return null;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onError) onError("Speech Recognition is not supported in this browser.");
      return null;
    }

    try {
      if (this.recognition) {
        this.recognition.abort();
      }

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        onResult(transcript);
      };

      rec.onerror = (event: any) => {
        if (onError) onError(event.error);
      };

      rec.onend = () => {
        if (onEnd) onEnd();
      };

      rec.start();
      this.recognition = rec;
      return rec;
    } catch (e: any) {
      if (onError) onError(e.message || "Failed to start microphone.");
      return null;
    }
  }

  /**
   * Stop Speech Recognition
   */
  static stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
  }
}
