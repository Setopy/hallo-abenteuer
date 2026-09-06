'use client';
import { Volume2, Square } from 'lucide-react';
import { useAudio } from './use-audio';
export default function Bilingual({
  de,
  en,
  audio,
}: {
  de: string;
  en: string;
  audio: ReturnType<typeof useAudio>;
}) {
  return (
    <div className="bilingual">
      {(['de', 'en'] as const).map((lang) => {
        const text = lang === 'de' ? de : en,
          playing = audio.playing === text && audio.playingLanguage === lang;
        return (
          <div className={'language-block ' + lang} key={lang}>
            <b>{lang === 'de' ? 'DEUTSCH · GERMAN' : 'ENGLISH'}</b>
            <p lang={lang}>{text}</p>
            <button
              className="listen"
              onClick={() => (playing ? audio.stop() : audio.speak(text, lang))}
              aria-label={
                (playing ? 'Stop ' : 'Listen in ') +
                (lang === 'de' ? 'German' : 'English')
              }
            >
              {playing ? <Square size={17} /> : <Volume2 size={18} />}{' '}
              {playing
                ? 'Stop'
                : lang === 'de'
                  ? 'Deutsch hören'
                  : 'Listen in English'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
