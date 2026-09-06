'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { chooseGermanVoice, chooseEnglishVoice } from '@/lib/learning.mjs';
export function useAudio() {
  const [status, setStatus] = useState(''),
    [playing, setPlaying] = useState(''),
    [playingLanguage, setPlayingLanguage] = useState<'de' | 'en'>('de'),
    [slow, setSlow] = useState(true);
  const generation = useRef(0),
    utterance = useRef<SpeechSynthesisUtterance | null>(null),
    timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stop = useCallback(() => {
    generation.current++;
    if (timeout.current) clearTimeout(timeout.current);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window)
      window.speechSynthesis.cancel();
    setPlaying('');
  }, []);
  useEffect(() => {
    const hidden = () => {
      if (document.hidden) stop();
    };
    document.addEventListener('visibilitychange', hidden);
    return () => {
      generation.current++;
      if (timeout.current) clearTimeout(timeout.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      document.removeEventListener('visibilitychange', hidden);
    };
  }, [stop]);
  function speak(text: string, language: 'de' | 'en' = 'de') {
    stop();
    setStatus('');
    if (!('speechSynthesis' in window)) {
      setStatus(
        'This browser cannot play speech. Ask a grown-up to try another browser.',
      );
      return;
    }
    const voice = (language === 'de' ? chooseGermanVoice : chooseEnglishVoice)(
      window.speechSynthesis.getVoices(),
    );
    const languageName = language === 'de' ? 'German' : 'English';
    if (!voice) {
      setStatus(
        `Ask a grown-up to add a ${languageName} voice in the device’s speech settings, then try Listen again.`,
      );
      return;
    }
    const id = generation.current;
    const parts = text.match(/[^.!?]+[.!?]*/g) || [text];
    function play(i: number) {
      if (id !== generation.current) return;
      if (i === parts.length) {
        setPlaying('');
        return;
      }
      const u = new SpeechSynthesisUtterance(parts[i]);
      utterance.current = u;
      u.voice = voice;
      u.lang = language === 'de' ? 'de-DE' : 'en-GB';
      setPlayingLanguage(language);
      u.rate = slow ? 0.78 : 1;
      setPlaying(text);
      timeout.current = setTimeout(() => {
        if (generation.current === id) {
          stop();
          setStatus(
            `Audio did not start. Ask a grown-up to check the sound and ${languageName} voice.`,
          );
        }
      }, 10000);
      u.onstart = () => {
        if (timeout.current) clearTimeout(timeout.current);
      };
      u.onend = () => {
        if (timeout.current) clearTimeout(timeout.current);
        play(i + 1);
      };
      u.onerror = (e) => {
        if (
          generation.current === id &&
          !['canceled', 'interrupted'].includes(e.error)
        ) {
          if (timeout.current) clearTimeout(timeout.current);
          setPlaying('');
          setStatus(
            'The voice could not play. Please try again or ask a grown-up.',
          );
        }
      };
      window.speechSynthesis.speak(u);
    }
    play(0);
  }
  return { status, playing, playingLanguage, slow, setSlow, speak, stop };
}
