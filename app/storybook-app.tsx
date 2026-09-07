'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Volume2,
  Map,
  Star,
  Heart,
  Check,
  Square,
  RotateCcw,
  Download,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { lessons, worlds, sources, Lesson } from './lessons';
import {
  emptyProgress,
  validProgress,
  markComplete,
  mergeProgress,
  nextLesson,
  shuffled,
  isBuilt,
} from '@/lib/learning.mjs';
import {
  places,
  storyOpenings,
  storyOpeningsDe,
  pictureWords,
} from './storybook';
import { useAudio } from './use-audio';
import Bilingual from './bilingual';
import GospelReader from './gospel-reader';
export type Saved = {
  version: number;
  completed: Record<string, string>;
  checks: number[];
  canDo?: number[];
  gospel?: number[];
};
const stages = [
  'Picture story',
  'Word play',
  'Build a sentence',
  'My speaking role',
  'Out into the world',
];
const checks = [
  'Greet someone, give a pretend name and ask theirs.',
  'Answer a colour or counting question when the objects change.',
  'Talk about a pet or family member and ask one question.',
  'Ask for a snack or drink and respond to a different offer.',
  'Ask for help, repetition or slower speech when needed.',
  'Invite someone to play and reply to an invitation.',
  'Say a simple plan and describe the weather or what to wear.',
  'Talk about an animal or a birthday using familiar phrases.',
  'Keep a 3–5 minute supported chat going across familiar topics, with pauses and repair phrases.',
];
function Scene({
  world,
  className = '',
  decorative = false,
}: {
  world: number;
  className?: string;
  decorative?: boolean;
}) {
  const quadrant = world % 4;
  return (
    <svg
      className={className}
      viewBox={`${(quadrant % 2) * 768} ${Math.floor(quadrant / 2) * 512} 768 512`}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : places[world].alt}
      aria-hidden={decorative || undefined}
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      <image
        href={`./scenes/sheet-${Math.floor(world / 4) + 1}.webp`}
        x="0"
        y="0"
        width="1536"
        height="1024"
      />
    </svg>
  );
}
export default function Home({
  saved,
  setSaved,
}: {
  saved: Saved;
  setSaved: (change: Saved | ((s: Saved) => Saved)) => void;
}) {
  const [tab, setTab] = useState('learn'),
    [notice, setNotice] = useState(''),
    [world, setWorld] = useState<number | null>(null),
    [lesson, setLesson] = useState<Lesson | null>(null),
    [step, setStep] = useState(0),
    [quiz, setQuiz] = useState(0),
    [order, setOrder] = useState<number[]>([0, 1, 2, 3]),
    [options, setOptions] = useState<number[]>([0, 1, 2, 3]),
    [feedback, setFeedback] = useState(''),
    [correct, setCorrect] = useState(false),
    [selection, setSelection] = useState<number[]>([]),
    [wordOrder, setWordOrder] = useState<number[]>([]),
    [built, setBuilt] = useState(false),
    [turn, setTurn] = useState(0),
    [reveal, setReveal] = useState(false),
    [said, setSaid] = useState(false),
    [done, setDone] = useState(false),
    [outside, setOutside] = useState(false);
  const audio = useAudio(),
    heading = useRef<HTMLHeadingElement>(null),
    file = useRef<HTMLInputElement>(null);
  useEffect(() => {
    audio.stop();
    setFeedback('');
    if (lesson) heading.current?.focus();
  }, [tab, lesson, step, quiz, turn, done]);
  const count = Object.keys(saved.completed).length;
  function start(id: number) {
    const chosen = lessons.find((l) => l.id === id);
    if (!chosen) return;
    setLesson(chosen);
    setStep(0);
    setQuiz(0);
    setOrder(shuffled([0, 1, 2, 3]));
    setOptions(shuffled([0, 1, 2, 3]));
    setFeedback('');
    setCorrect(false);
    setSelection([]);
    setWordOrder(shuffled(chosen.phrases[1].de.split(' ').map((_, i) => i)));
    setBuilt(false);
    setTurn(0);
    setReveal(false);
    setSaid(false);
    setDone(false);
    setOutside(false);
    setTab('learn');
  }
  function nextStep() {
    setStep((s) => s + 1);
    setFeedback('');
  }
  function checkOption(index: number) {
    if (correct) return;
    if (index === order[quiz]) {
      setCorrect(true);
      setFeedback('You found it! Say it out loud once.');
    } else setFeedback('Good try! Listen again, then choose another one.');
  }
  function advanceQuiz() {
    if (quiz === 3) nextStep();
    else {
      setQuiz((q) => q + 1);
      setOptions(shuffled([0, 1, 2, 3]));
      setCorrect(false);
      setFeedback('');
    }
  }
  function finish() {
    if (!lesson || !outside) return;
    setSaved((s) => markComplete(s, lesson.id));
    setDone(true);
  }
  function listen(text: string, label = 'Listen') {
    return (
      <button
        className="listen"
        aria-label={label + ' in German'}
        onClick={() =>
          audio.playing === text ? audio.stop() : audio.speak(text)
        }
      >
        {audio.playing === text ? <Square size={18} /> : <Volume2 size={20} />}{' '}
        {audio.playing === text ? 'Stop' : label}
      </button>
    );
  }
  function backup() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(saved, null, 2)], { type: 'application/json' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hallo-discoveries.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  async function restore(f?: File) {
    if (!f) return;
    try {
      if (f.size > 100000) throw Error();
      const data = JSON.parse(await f.text());
      if (!validProgress(data)) throw Error();
      setSaved((s) => mergeProgress(s, data));
      setNotice('Your backup has been added to this child’s progress.');
    } catch {
      setNotice(
        'That is not a valid ZionPro Lernraum backup. Your discoveries are unchanged.',
      );
    }
    if (file.current) file.current.value = '';
  }
  useEffect(() => {
    const ctx = (document as any).modelContext;
    if (!ctx?.registerTool) return;
    const abort = new AbortController();
    const tools = [
      {
        name: 'read_german_learning_progress',
        description:
          'Read completed practice missions; these do not measure speaking fluency.',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true },
        execute: () => ({
          completed: Object.keys(saved.completed).map(Number),
          total: 36,
        }),
      },
      {
        name: 'start_german_mission',
        description: 'Open a German practice mission without completing it.',
        inputSchema: {
          type: 'object',
          properties: { id: { type: 'integer', minimum: 1, maximum: 36 } },
          required: ['id'],
          additionalProperties: false,
        },
        execute: (input: any) => {
          if (!Number.isInteger(input?.id) || input.id < 1 || input.id > 36)
            throw Error('Choose a mission from 1 to 36');
          start(input.id);
          return { started: input.id };
        },
      },
    ];
    for (const tool of tools)
      try {
        Promise.resolve(ctx.registerTool(tool, { signal: abort.signal })).catch(
          () => {},
        );
      } catch {}
    return () => abort.abort();
  }, [saved]);
  return (
    <main>
      <a href="#content" className="skip">
        Skip to adventures
      </a>
      <header>
        <a href="./" className="brand">
          Zion<span>Pro</span>
          <small>Lernraum · German for young explorers</small>
        </a>
        <div className="header-badges">
          <span className="pill">GERMAN FOR LITTLE EXPLORERS</span>
          <span className="stars">
            <Star size={18} fill="currentColor" />
            Storybook edition
          </span>
        </div>
      </header>
      <div className="shell">
        <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
          <TabsList className="nav">
            <TabsTrigger value="learn">
              <Map />
              Our neighbourhood
            </TabsTrigger>
            <TabsTrigger value="gospel">
              <BookOpen /> Jesus’ life
            </TabsTrigger>
            <TabsTrigger value="stars">
              <Star />
              What I can say
            </TabsTrigger>
            <TabsTrigger value="grownups">
              <Heart />
              For grown-ups
            </TabsTrigger>
          </TabsList>
          {notice && (
            <div className="notice" role="status">
              {notice}
              <button
                onClick={() => setNotice('')}
                aria-label="Dismiss message"
              >
                ×
              </button>
            </div>
          )}
          <div id="content" />
          <TabsContent value="learn">
            {!lesson ? (
              <>
                {world === null ? (
                  <>
                    <section className="bookwelcome">
                      <img
                        src="./fox-adventure.webp"
                        width="1536"
                        height="1024"
                        alt="Fino the fox welcomes you to our colourful neighbourhood"
                      />
                      <div>
                        <p className="eyebrow">OPEN YOUR GERMAN PICTURE BOOK</p>
                        <h1>Where shall we go today?</h1>
                        <p>
                          Meet a friend. Hear their story. Join the
                          conversation.
                        </p>
                        <button
                          className="primary"
                          onClick={() => start(nextLesson(saved))}
                        >
                          {count ? 'Continue our story' : 'Meet a new friend'}{' '}
                          <ArrowRight size={20} />
                        </button>
                        <p className="small">
                          One short story together · then play it away from the
                          screen
                        </p>
                      </div>
                    </section>
                    <div className="sectionhead">
                      <div>
                        <p className="eyebrow">12 PLACES TO EXPLORE</p>
                        <h2>Choose a place to visit</h2>
                      </div>
                      <span className="small">
                        All adventures are open. Go at your pace.
                      </span>
                    </div>
                    <div className="worldgrid">
                      {worlds.map((w, i) => {
                        const n = lessons.filter(
                          (l) => l.world === i && saved.completed[l.id],
                        ).length;
                        return (
                          <button
                            className={'world color' + (i % 4)}
                            key={w.title}
                            onClick={() => setWorld(i)}
                          >
                            <Scene className="place-art" world={i} />
                            <div className="worldtop">
                              <span className="emoji" aria-hidden>
                                {w.icon}
                              </span>
                              <span>{String(i + 1).padStart(2, '0')}</span>
                            </div>
                            <h3>{places[i].name}</h3>
                            <p>{w.subtitle}</p>
                            <div className="worldfoot">
                              <span>
                                {n
                                  ? `${n}/3 stories explored`
                                  : '3 little stories'}
                              </span>
                              <ArrowRight size={19} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <section className="playnote">
                      <Sparkles />
                      <p>
                        <b>Bring a toy. Bring your imagination.</b> Every place
                        has a story you can act out together.
                      </p>
                    </section>
                  </>
                ) : (
                  <>
                    <button className="back" onClick={() => setWorld(null)}>
                      <ArrowLeft size={17} />
                      All adventures
                    </button>
                    <section className={'worldheading color' + (world % 4)}>
                      <Scene className="place-banner" world={world} />
                      <div>
                        <p className="eyebrow">ADVENTURE {world + 1}</p>
                        <h1>{places[world].name}</h1>
                        <p>{worlds[world].subtitle}</p>
                      </div>
                    </section>
                    <div className="missiongrid">
                      {lessons
                        .filter((l) => l.world === world)
                        .map((l, i) => (
                          <article className="panel missioncard" key={l.id}>
                            <Scene
                              className="chapter-art"
                              world={l.world}
                              decorative
                            />
                            <span className="pill">STORY {i + 1}</span>
                            <h2>{l.title}</h2>
                            <p lang="de">{l.phrases[1].de}</p>
                            <p className="small">
                              Picture story → speaking role → real-life play
                            </p>
                            <button
                              className="primary"
                              onClick={() => start(l.id)}
                            >
                              {saved.completed[l.id]
                                ? 'Play again'
                                : 'Let’s explore'}{' '}
                              <ArrowRight size={18} />
                            </button>
                            {saved.completed[l.id] && (
                              <span className="earned">
                                <Check size={16} />
                                Story explored
                              </span>
                            )}
                          </article>
                        ))}
                    </div>
                  </>
                )}
              </>
            ) : done ? (
              <section className="celebrate panel">
                <Scene className="finish-art" world={lesson.world} />
                <p className="eyebrow">YOU TRIED SOMETHING NEW!</p>
                <h1 ref={heading} tabIndex={-1}>
                  Wunderbar!
                </h1>
                <p>
                  Wonderful! You explored <b>{lesson.title}</b>.
                </p>
                <div className="stamp">
                  <BookOpen /> Your story is ready to tell again
                </div>
                <p>Now take your German off the screen.</p>
                <blockquote>{lesson.mission}</blockquote>
                <p className="small">
                  Trying a story is practice. Your grown-up can record what you
                  can say in “What I can say”.
                </p>
                <div className="actions">
                  <button
                    className="primary"
                    onClick={() => {
                      setLesson(null);
                      setWorld(lesson.world);
                    }}
                  >
                    Back to my adventure <Map size={18} />
                  </button>
                  <button
                    className="secondary"
                    onClick={() => start(lesson.id)}
                  >
                    Play again
                  </button>
                </div>
              </section>
            ) : (
              <>
                <div className="lessonbar">
                  <button
                    className="back"
                    onClick={() => {
                      setLesson(null);
                      setWorld(lesson.world);
                    }}
                  >
                    <ArrowLeft size={17} />
                    Take a break
                  </button>
                  <span>
                    Story {lesson.id} · {lesson.title}
                  </span>
                  <label className="speed">
                    <Switch
                      checked={audio.slow}
                      onCheckedChange={(value) => {
                        audio.stop();
                        audio.setSlow(value);
                      }}
                      aria-label="Slow German audio"
                    />
                    Slow voice
                  </label>
                </div>
                <div className="steptrack" aria-label="Story chapters">
                  {[0, 3, 4].map((value, index) => (
                    <span
                      key={value}
                      className={step === value ? 'current' : ''}
                      aria-current={step === value ? 'step' : undefined}
                    >
                      <b>{index + 1}</b>
                      {stages[value]}
                    </span>
                  ))}
                  {(step === 1 || step === 2) && (
                    <span className="current">Optional word practice</span>
                  )}
                </div>
                <Progress
                  aria-label="Story progress"
                  value={step === 0 ? 0 : step < 3 ? 20 : step === 3 ? 50 : 80}
                />
                <div className="lessonlayout">
                  <section className="panel lessonpanel">
                    {(step === 1 || step === 2) && (
                      <button className="back" onClick={() => setStep(3)}>
                        Go to my speaking role <ArrowRight size={17} />
                      </button>
                    )}
                    <p className="eyebrow">
                      {stages[step]}{' '}
                      {step === 0
                        ? '· read together'
                        : step === 1
                          ? `· ${quiz + 1}/4`
                          : ''}
                    </p>
                    {step === 0 ? (
                      <>
                        <h2 ref={heading} tabIndex={-1}>
                          {lesson.title}
                        </h2>
                        <figure className="story-scene">
                          <Scene world={lesson.world} />
                          <figcaption>
                            <Bilingual
                              de={storyOpeningsDe[lesson.id - 1]}
                              en={storyOpenings[lesson.id - 1]}
                              audio={audio}
                            />
                          </figcaption>
                        </figure>
                        <details className="picture-hunt">
                          <summary>Look, point and listen</summary>
                          <p>
                            Find these in the picture. Point, hear the German,
                            then say it together.
                          </p>
                          <div className="picture-words">
                            {pictureWords[lesson.world].map((word) => (
                              <div key={word.de}>
                                <strong lang="de">{word.de}</strong>
                                <span>{word.en}</span>
                                {listen(word.de, 'Hear word')}
                              </div>
                            ))}
                          </div>
                        </details>
                        <div className="story-task">
                          <b>Our little adventure</b>
                          <p>{lesson.mission}</p>
                        </div>
                        <p className="instruction">
                          Two pretend friends are talking. Tap each line to
                          listen. You can change their names.
                        </p>
                        <div className="story-dialogue">
                          {lesson.phrases.map((phrase, index) => (
                            <div
                              className={'story-line voice' + (index % 2)}
                              key={phrase.de}
                            >
                              <span className="speaker-portrait" aria-hidden>
                                {index % 2 ? '🧒' : '🦊'}
                              </span>
                              <div>
                                <b>
                                  {index % 2
                                    ? 'Your character'
                                    : 'Fino plays a friend'}
                                </b>
                                <h3 lang="de">{phrase.de}</h3>
                                <p>{phrase.en}</p>
                                {listen(phrase.de, 'Hear this line')}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="actions">
                          <button
                            className="primary"
                            onClick={() => setStep(3)}
                          >
                            I’ll be the other friend <ArrowRight size={18} />
                          </button>
                          <button
                            className="secondary"
                            onClick={() => setStep(1)}
                          >
                            Practise with word games first
                          </button>
                        </div>
                      </>
                    ) : step === 1 ? (
                      <>
                        <h2 ref={heading} tabIndex={-1}>
                          {quiz % 2
                            ? 'Use your detective ears!'
                            : 'Find the German words.'}
                        </h2>
                        {quiz % 2 ? (
                          <div className="audio-question">
                            {listen(
                              lesson.phrases[order[quiz]].de,
                              'Hear the mystery phrase',
                            )}
                            <details>
                              <summary>Need a clue?</summary>
                              <p>{lesson.phrases[order[quiz]].en}</p>
                            </details>
                          </div>
                        ) : (
                          <p className="quizprompt">
                            {lesson.phrases[order[quiz]].en}
                          </p>
                        )}
                        <div className="choices">
                          {options.map((index) => (
                            <button
                              className={
                                correct && index === order[quiz] ? 'right' : ''
                              }
                              key={index}
                              disabled={correct}
                              onClick={() => checkOption(index)}
                              lang="de"
                            >
                              {lesson.phrases[index].de}
                              {correct && index === order[quiz] && (
                                <Check size={20} />
                              )}
                            </button>
                          ))}
                        </div>
                        {feedback && (
                          <p
                            className={correct ? 'feedback good' : 'feedback'}
                            role="status"
                          >
                            {feedback}
                          </p>
                        )}
                        {correct && (
                          <button className="primary" onClick={advanceQuiz}>
                            {quiz === 3
                              ? 'Build a sentence'
                              : 'Next detective clue'}{' '}
                            <ArrowRight size={18} />
                          </button>
                        )}
                      </>
                    ) : step === 2 ? (
                      <>
                        <h2 ref={heading} tabIndex={-1}>
                          Put the words in order.
                        </h2>
                        <p className="quizprompt">{lesson.phrases[1].en}</p>
                        {listen(lesson.phrases[1].de, 'Hear a hint')}
                        <div
                          className="sentence"
                          aria-label="Your sentence"
                          lang="de"
                        >
                          {selection.length ? (
                            selection.map((index, pos) => (
                              <button
                                key={pos}
                                aria-label={
                                  'Remove ' +
                                  lesson.phrases[1].de.split(' ')[index]
                                }
                                disabled={built}
                                onClick={() =>
                                  setSelection((s) =>
                                    s.filter((_, i) => i !== pos),
                                  )
                                }
                              >
                                {lesson.phrases[1].de.split(' ')[index]}
                              </button>
                            ))
                          ) : (
                            <span>Tap the word that comes first…</span>
                          )}
                        </div>
                        <div className="wordbank">
                          {wordOrder.map((index) => (
                            <button
                              key={index}
                              disabled={selection.includes(index) || built}
                              onClick={() => setSelection((s) => [...s, index])}
                              lang="de"
                            >
                              {lesson.phrases[1].de.split(' ')[index]}
                            </button>
                          ))}
                        </div>
                        <p className="small">
                          Tap a word in your sentence to take it out.
                        </p>
                        {feedback && (
                          <p className="feedback" role="status">
                            {feedback}
                          </p>
                        )}
                        <div className="actions">
                          {built ? (
                            <button className="primary" onClick={nextStep}>
                              Time for a real chat! <ArrowRight size={18} />
                            </button>
                          ) : (
                            <>
                              <button
                                className="primary"
                                disabled={selection.length !== wordOrder.length}
                                onClick={() => {
                                  if (
                                    isBuilt(
                                      lesson.phrases[1].de.split(' '),
                                      selection,
                                    )
                                  ) {
                                    setBuilt(true);
                                    setFeedback(
                                      'That’s it! Read your sentence out loud.',
                                    );
                                  } else
                                    setFeedback(
                                      'Nearly! Hear the hint and move the words around.',
                                    );
                                }}
                              >
                                Check my sentence <Check size={18} />
                              </button>
                              <button
                                className="secondary"
                                onClick={() => {
                                  setSelection([]);
                                  setFeedback('');
                                }}
                              >
                                <RotateCcw size={17} />
                                Try again
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    ) : step === 3 ? (
                      <>
                        <Scene
                          className="conversation-art"
                          world={lesson.world}
                        />
                        <h2 ref={heading} tabIndex={-1}>
                          You’re in the story!
                        </h2>
                        <p>
                          You play the other friend. Your grown-up or a toy
                          plays Fino. Listen to Fino, then answer before you
                          peek.
                        </p>
                        <div className="chatbubble partner">
                          <b>YOUR PARTNER SAYS</b>
                          <h3 lang="de">{lesson.phrases[turn * 2].de}</h3>
                          <p>{lesson.phrases[turn * 2].en}</p>
                          {listen(
                            lesson.phrases[turn * 2].de,
                            'Listen to your partner',
                          )}
                        </div>
                        <div className="chatbubble you">
                          <b>YOU SAY…</b>
                          {reveal ? (
                            <>
                              <h3 lang="de">
                                {lesson.phrases[turn * 2 + 1].de}
                              </h3>
                              <p>{lesson.phrases[turn * 2 + 1].en}</p>
                              {listen(
                                lesson.phrases[turn * 2 + 1].de,
                                'Hear an example',
                              )}
                            </>
                          ) : (
                            <button
                              className="secondary"
                              onClick={() => setReveal(true)}
                            >
                              Show me an example
                            </button>
                          )}
                        </div>
                        <label className="saycheck">
                          <input
                            type="checkbox"
                            checked={said}
                            onChange={(e) => setSaid(e.target.checked)}
                          />
                          I tried my answer out loud.
                        </label>
                        <p className="small">
                          No microphone. No recording. Your grown-up can help
                          you practise.
                        </p>
                        <div className="actions">
                          <button
                            className="primary"
                            disabled={!said}
                            onClick={() =>
                              turn === 0
                                ? (setTurn(1), setReveal(false), setSaid(false))
                                : setStep(4)
                            }
                          >
                            {turn === 0
                              ? 'Keep chatting'
                              : 'Take our story into real life'}{' '}
                            <Star size={18} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h2 ref={heading} tabIndex={-1}>
                          Now make the story yours.
                        </h2>
                        <Scene
                          className="conversation-art"
                          world={lesson.world}
                        />
                        <div className="takeaway">
                          <p className="eyebrow">
                            LEAVE THE SCREEN · BRING A GROWN-UP
                          </p>
                          <h3>Set the scene</h3>
                          <p>{places[lesson.world].props}</p>
                          <h3>Try it together</h3>
                          <p>{lesson.mission}</p>
                          <h3>A little surprise</h3>
                          <p>{lesson.swap}</p>
                          <p>
                            Swap speaking roles. Try again tomorrow with the
                            words hidden.
                          </p>
                        </div>
                        <label className="saycheck">
                          <input
                            type="checkbox"
                            checked={outside}
                            onChange={(e) => setOutside(e.target.checked)}
                          />{' '}
                          We tried our real-life play together.
                        </label>
                        <div className="actions">
                          <button
                            className="primary"
                            disabled={!outside}
                            onClick={finish}
                          >
                            Save our story <BookOpen size={18} />
                          </button>
                          <button
                            className="secondary"
                            onClick={() => setStep(0)}
                          >
                            Read the story again
                          </button>
                        </div>
                        <p className="small">
                          You can leave this page open and come back after
                          playing.
                        </p>
                      </>
                    )}
                  </section>
                  <aside>
                    <Scene
                      className="side-art"
                      world={lesson.world}
                      decorative
                    />
                    <section className="tipcard">
                      <span aria-hidden>💡</span>
                      <h3>A little helping hand</h3>
                      <p>{lesson.tip}</p>
                    </section>
                    <section className="tipcard green">
                      <span aria-hidden>🎲</span>
                      <h3>Change one thing</h3>
                      <p>{lesson.swap}</p>
                    </section>
                    <section className="tipcard peach">
                      <span aria-hidden>🏃</span>
                      <h3>Try it in real life</h3>
                      <p>{lesson.mission}</p>
                    </section>
                  </aside>
                </div>
              </>
            )}
          </TabsContent>
          <TabsContent value="gospel">
            <GospelReader saved={saved} setSaved={setSaved} audio={audio} />
          </TabsContent>
          <TabsContent value="stars">
            <section className="discoveryhead">
              <div>
                <p className="eyebrow">OUR SPEAKING SCRAPBOOK</p>
                <h1>
                  {count
                    ? 'Look what I can say!'
                    : 'Your adventure is just beginning.'}
                </h1>
                <p>
                  Exploring a story and using German in conversation are
                  different steps. A grown-up can tick a speaking skill after
                  hearing it on two different days, with a changed detail and
                  the words hidden.
                </p>
              </div>
              <div className="bigstar">
                <Star size={46} fill="currentColor" />
                <strong>{saved.canDo?.length || 0} skills</strong>
              </div>
            </section>
            <div className="scrapbook-grid">
              {lessons.map((l) => (
                <article className="speaking-card" key={l.id}>
                  <Scene world={l.world} decorative />
                  <div>
                    <p className="eyebrow">
                      {saved.completed[l.id]
                        ? 'STORY EXPLORED'
                        : 'A STORY TO TRY'}
                    </p>
                    <h2>{l.title}</h2>
                    <p>{l.mission}</p>
                    <details>
                      <summary>Grown-up: check this in a new situation</summary>
                      <p>
                        {l.swap} Hide the text. Listen on two separate days. A
                        short answer and a request for help are okay.
                      </p>
                      <label className="saycheck">
                        <input
                          type="checkbox"
                          checked={saved.canDo?.includes(l.id) || false}
                          onChange={() =>
                            setSaved((s) => ({
                              ...s,
                              canDo: s.canDo?.includes(l.id)
                                ? s.canDo.filter((id) => id !== l.id)
                                : [...(s.canDo || []), l.id],
                            }))
                          }
                        />{' '}
                        I have heard the child use this with a changed detail on
                        two days.
                      </label>
                    </details>
                    <span className="skill-state">
                      {saved.canDo?.includes(l.id)
                        ? '✓ Grown-up observed this skill'
                        : 'Still growing — keep talking together'}
                    </span>
                    <button className="secondary" onClick={() => start(l.id)}>
                      Visit this story
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="grownups">
            <section className="panel parentintro">
              <p className="eyebrow">A REALISTIC PLAN FOR AN EIGHT-YEAR-OLD</p>
              <h1>
                Little practice.
                <br />
                Lots of real connection.
              </h1>
              <p>
                <b>
                  Start with a 36-week plan—roughly nine months—then review.
                </b>{' '}
                Aim for comfortable, short exchanges about familiar topics with
                a supportive German speaker. This is a planning estimate, not a
                guarantee of fluency or an A1 certificate.
              </p>
              <div className="schedule">
                <div>
                  <strong>20 min × 6 days</strong>
                  <p>
                    Two 10-minute play sessions. Repeat a mission across the
                    week.
                  </p>
                </div>
                <div>
                  <strong>10 min × 6 days</strong>
                  <p>
                    Use German off-screen during meals, play, drawing or
                    routines.
                  </p>
                </div>
                <div>
                  <strong>30 min × 2 days</strong>
                  <p>
                    Talk with a proficient German-speaking grown-up or
                    child-friendly tutor. Split into shorter turns if needed.
                  </p>
                </div>
              </div>
              <p>
                <b>Total: about 4 hours/week, or 144 hours over 36 weeks.</b>{' '}
                The website is only part of this time. Without regular real
                conversation and useful feedback, extend the timeline. A
                reasonable review window is 9–12 months, with longer being
                completely okay.
              </p>
              <details className="evidence">
                <summary>Why this timeline?</summary>
                <p>
                  Goethe-Institut gives 80–200 teaching units of 45 minutes for
                  A1: 60–150 clock hours. That guidance concerns the adult Start
                  Deutsch 1 pathway; it is a broad comparison, not a forecast
                  for an eight-year-old. Home activities and guided teaching are
                  not equivalent hours.
                </p>
                <p>
                  Cambridge recommends short, frequent and enjoyable practice
                  for young language learners (including 3–10 minute
                  activities). Its guidance concerns learning English; the
                  short-session principle is adapted here to German.
                </p>
                <p>
                  At CEFR A1, interaction still relies on a patient partner who
                  repeats, rephrases and speaks slowly. Here, “comfortable
                  beginner conversation” means responding with familiar phrases,
                  asking simple questions and asking for help—not speaking
                  freely on any subject.
                </p>
                <p>
                  The 36-week schedule and 9–12 month review window are our
                  practical design estimates based on those constraints.
                  Progress checks matter more than the calendar.
                </p>
                {sources.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                    {s.title} ↗
                  </a>
                ))}
                <p className="small">
                  Sources checked 5 September 2026. Curriculum is original and
                  independent of these organisations.
                </p>
              </details>
            </section>
            <section className="panel parentsection">
              <h2>One picture story per week. Many ways to use it.</h2>
              <div className="routine">
                <div>
                  <b>Day 1</b>
                  <p>
                    Explore the picture and hear the short conversation. Use
                    toys and gestures.
                  </p>
                </div>
                <div>
                  <b>Day 2</b>
                  <p>
                    Play detective. Revisit yesterday’s phrases before looking.
                  </p>
                </div>
                <div>
                  <b>Day 3</b>
                  <p>Build a sentence. Change one name, number or object.</p>
                </div>
                <div>
                  <b>Day 4</b>
                  <p>Role-play together. Let the child ask a question.</p>
                </div>
                <div>
                  <b>Day 5</b>
                  <p>Try the off-screen mission and an older conversation.</p>
                </div>
                <div>
                  <b>Day 6</b>
                  <p>
                    Mix this week’s phrases with a previous adventure. Then take
                    a rest day.
                  </p>
                </div>
              </div>
              <p>
                Use the screen activities in 5–10 minute bursts, with movement
                between them. The 36 missions provide 144 phrase examples with
                deliberate repetition; they are a starting curriculum, not a
                complete A1 course. Add age-appropriate stories, songs and live
                interaction as interests develop.
              </p>
            </section>
            <section className="panel parentsection">
              <h2>Check conversation, not just clicks.</h2>
              <p>
                About every four weeks, try the task below with the text hidden.
                Change one familiar detail so the answer is not purely
                memorised. Allow pauses and requests for repetition. Only tick
                it when you have observed it across two different days.
              </p>
              <div className="checklist">
                {checks.map((text, i) => (
                  <label key={text}>
                    <input
                      type="checkbox"
                      checked={saved.checks.includes(i)}
                      onChange={() =>
                        setSaved((s) => ({
                          ...s,
                          checks: s.checks.includes(i)
                            ? s.checks.filter((n) => n !== i)
                            : [...s.checks, i],
                        }))
                      }
                    />
                    <div>
                      <b>Week {(i + 1) * 4} · suggested checkpoint</b>
                      <span>{text}</span>
                    </div>
                  </label>
                ))}
              </div>
              <p>
                If a task still needs lots of prompting, repeat familiar play
                for 2–4 weeks and reduce new material. These observations are
                parent notes, not an automated proficiency assessment.
              </p>
            </section>
            <div className="parentbottom">
              <section className="panel">
                <h2>Make it warm and low-pressure.</h2>
                <p>
                  Model the correct phrase naturally instead of stopping every
                  mistake. Let the child answer with a short chunk before asking
                  for a longer sentence. Use fictional names and toy families.
                  Celebrate trying, listening and asking for help.
                </p>
                <p>
                  Pronunciation needs a human ear. The site plays German device
                  voices but does not record or assess a child’s voice. A
                  proficient speaker or tutor can help with sounds and
                  spontaneous replies.
                </p>
              </section>
              <section className="panel">
                <h2>Save discoveries</h2>
                <p>
                  Progress is saved to the selected child’s profile in the
                  adult’s account. No public profiles, microphone recording,
                  advertising or learner leaderboard. Sign in to the same adult
                  account on another device to continue. Download a backup for
                  an extra copy of this child’s progress.
                </p>
                <div className="actions">
                  <button className="secondary" onClick={backup}>
                    <Download size={18} />
                    Download backup
                  </button>
                  <button
                    className="secondary"
                    onClick={() => file.current?.click()}
                  >
                    Restore / merge
                  </button>
                </div>
                <input
                  className="sr-only"
                  ref={file}
                  type="file"
                  accept=".json,application/json"
                  aria-label="Restore discoveries backup"
                  onChange={(e) => restore(e.target.files?.[0])}
                />
                <p className="small">
                  The site needs internet. German voices come from your device
                  and may use its online speech service. Add a German voice if
                  Listen is unavailable.
                </p>
              </section>
            </div>
          </TabsContent>
        </Tabs>
        {audio.status && (
          <div className="notice" role="status">
            {audio.status}
          </div>
        )}
        {audio.playing && (
          <div className="nowplaying" role="status">
            <Volume2 size={18} />
            <span>
              {audio.playingLanguage === 'de' ? 'German' : 'English'} voice is
              playing
            </span>
            <button onClick={audio.stop}>
              <Square size={15} />
              Stop
            </button>
          </div>
        )}
        <footer>
          Made for curious minds. Learn together with a grown-up.
          <br />
          Independent learning project · Discoveries celebrate practice, not
          certified fluency.
        </footer>
      </div>
    </main>
  );
}
