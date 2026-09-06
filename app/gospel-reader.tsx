'use client';
import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Check } from 'lucide-react';
import Bilingual from './bilingual';
import { Switch } from '@/components/ui/switch';
import { gospelStories } from './gospel-stories';
import { useAudio } from './use-audio';
import type { Saved } from './storybook-app';
function GospelImage({ index, alt }: { index: number; alt: string }) {
  const i = index % 4;
  return (
    <svg
      className="gospel-image"
      viewBox={`${(i % 2) * 768} ${Math.floor(i / 2) * 512} 768 512`}
      role="img"
      aria-label={alt}
      focusable="false"
    >
      <image
        href={`./gospel/scenes-${Math.floor(index / 4) + 1}.webp`}
        width="1536"
        height="1024"
      />
    </svg>
  );
}
export default function GospelReader({
  saved,
  setSaved,
  audio,
}: {
  saved: Saved;
  setSaved: (change: Saved | ((s: Saved) => Saved)) => void;
  audio: ReturnType<typeof useAudio>;
}) {
  const [selected, setSelected] = useState<number | null>(null),
    [said, setSaid] = useState(false);
  useEffect(() => {
    audio.stop();
    setSaid(false);
  }, [selected]);
  const story = gospelStories.find((s) => s.id === selected);
  if (!story)
    return (
      <section>
        <p className="eyebrow">GESCHICHTEN AUS DEM LEBEN JESU</p>
        <h1>Stories from Jesus’ life</h1>
        <p>
          Read a little German, understand it in English, then talk about the
          story together.
        </p>
        <p className="small">
          Short, original retellings for language learning. Each story links to
          its Gospel passage. These are simplified retellings, not word-for-word
          Bible translations.
        </p>
        <div className="gospel-grid">
          {gospelStories.map((s) => (
            <button
              className="gospel-card"
              key={s.id}
              onClick={() => setSelected(s.id)}
            >
              <GospelImage index={s.id - 1} alt={s.alt} />
              <div>
                <p className="eyebrow">{s.reference}</p>
                <h2 lang="de">{s.title.de}</h2>
                <p>{s.title.en}</p>
                <span>
                  {saved.gospel?.includes(s.id)
                    ? '✓ Read and talked about together'
                    : 'Open this story →'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    );
  return (
    <article className="gospel-reader">
      <button className="back" onClick={() => setSelected(null)}>
        <ArrowLeft size={18} /> All Gospel stories
      </button>
      <label className="speed">
        <Switch
          checked={audio.slow}
          onCheckedChange={(v) => {
            audio.stop();
            audio.setSlow(v);
          }}
          aria-label="Slow reading voice"
        />{' '}
        Slow reading voice
      </label>
      <p className="eyebrow">{story.reference}</p>
      <h1 lang="de">{story.title.de}</h1>
      <h2>{story.title.en}</h2>
      <GospelImage index={story.id - 1} alt={story.alt} />
      <p className="small">
        A simple retelling ·{' '}
        <a href={story.url} target="_blank" rel="noreferrer">
          Read the Gospel passage with a grown-up ↗
        </a>
      </p>
      <div className="gospel-pages">
        {story.lines.map((line, i) => (
          <section key={line.de}>
            <span className="story-line-number">{i + 1}</span>
            <Bilingual {...line} audio={audio} />
          </section>
        ))}
      </div>
      <section className="gospel-talk">
        <h2>Let’s talk about the story</h2>
        <p>
          Try a German answer out loud. The English can help you understand the
          question. These practice questions are our own, not quotations from
          the Gospel.
        </p>
        {story.questions.map((q) => (
          <div key={q.de}>
            <Bilingual de={q.de} en={q.en} audio={audio} />
            <details>
              <summary>Hear and read an example answer</summary>
              <Bilingual de={q.answerDe} en={q.answerEn} audio={audio} />
            </details>
          </div>
        ))}
      </section>
      <section className="takeaway">
        <h2>Bring it into your day</h2>
        <Bilingual {...story.activity} audio={audio} />
        <label className="saycheck">
          <input
            type="checkbox"
            checked={said}
            onChange={(e) => setSaid(e.target.checked)}
          />{' '}
          We read the story and tried a German answer together.
        </label>
        <button
          className="primary"
          disabled={!said}
          onClick={() =>
            setSaved((s) => ({
              ...s,
              gospel: [...new Set([...(s.gospel || []), story.id])],
            }))
          }
        >
          {saved.gospel?.includes(story.id) ? (
            <Check size={18} />
          ) : (
            <BookOpen size={18} />
          )}{' '}
          {saved.gospel?.includes(story.id)
            ? 'Saved in my picture book'
            : 'Save our story'}
        </button>
        <p className="small">
          This records shared practice, not a speaking test.
        </p>
      </section>
    </article>
  );
}
