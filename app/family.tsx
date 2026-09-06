'use client';
import { useEffect, useRef, useState } from 'react';
import Home, { Saved } from './storybook-app';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { avatars, validProfileInput } from '@/lib/profiles.mjs';
import { validProgress, mergeProgress } from '@/lib/learning.mjs';
import { ArrowRight, Plus, Users, LogOut } from 'lucide-react';
type Profile = {
  id: string;
  nickname: string;
  avatar: string;
  progress: Saved;
  revision: number;
};
type ApiResult = {
  error?: string;
  profiles: Profile[];
  profile: Profile;
  revision: number;
};
const signIn = '/signin-with-chatgpt?return_to=%2F';
export default function Family() {
  const [profiles, setProfiles] = useState<Profile[]>([]),
    [loading, setLoading] = useState(true),
    [signed, setSigned] = useState(false),
    [active, setActive] = useState<string | null>(null),
    [adding, setAdding] = useState(false),
    [nickname, setNickname] = useState(''),
    [avatar, setAvatar] = useState('fox'),
    [error, setError] = useState(''),
    [creating, setCreating] = useState(false),
    [saveState, setSaveState] = useState('Saved'),
    [legacy, setLegacy] = useState<Saved | null>(null);
  const records = useRef<Profile[]>([]),
    pending = useRef(new Map<string, Saved>()),
    running = useRef(false),
    failed = useRef(false),
    conflicts = useRef(0);
  function install(items: Profile[]) {
    records.current = items;
    setProfiles(items);
  }
  async function load() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/family', { cache: 'no-store' });
      if (response.status === 401) {
        setSigned(false);
        return;
      }
      const data = (await response.json()) as ApiResult;
      if (!response.ok) throw Error(data.error || 'Please try again.');
      install(data.profiles);
      setSigned(true);
      setAdding(data.profiles.length === 0);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Profiles could not be loaded.',
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
    try {
      const raw = localStorage.getItem('hallo-progress-v1');
      if (raw) {
        const data = JSON.parse(raw);
        if (
          validProgress(data) &&
          (Object.keys(data.completed).length ||
            data.checks.length ||
            data.canDo?.length)
        )
          setLegacy(data);
      }
    } catch {}
  }, []);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (running.current || pending.current.size) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);
  async function drain() {
    if (running.current) return;
    running.current = true;
    failed.current = false;
    setSaveState('Saving…');
    setError('');
    try {
      while (pending.current.size) {
        const [id, progress] = pending.current.entries().next().value!;
        pending.current.delete(id);
        const current = records.current.find((p) => p.id === id)!;
        try {
          const response = await fetch(
            '/api/family/' + encodeURIComponent(id),
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ progress, revision: current.revision }),
            },
          );
          const data = (await response.json()) as ApiResult;
          if (
            response.status === 409 &&
            data.profile &&
            conflicts.current < 3
          ) {
            conflicts.current++;
            const combined = mergeProgress(
              data.profile.progress,
              pending.current.get(id) || progress,
            );
            install(
              records.current.map((p) =>
                p.id === id
                  ? {
                      ...p,
                      progress: combined,
                      revision: data.profile.revision,
                    }
                  : p,
              ),
            );
            pending.current.set(id, combined);
            continue;
          }
          if (!response.ok)
            throw Error(data.error || 'Progress could not be saved.');
          install(
            records.current.map((p) =>
              p.id === id ? { ...p, revision: data.revision } : p,
            ),
          );
        } catch (e) {
          if (!pending.current.has(id)) pending.current.set(id, progress);
          throw e;
        }
      }
      setSaveState(
        conflicts.current
          ? 'Saved · combined with changes from another device'
          : 'Saved to your family account',
      );
      conflicts.current = 0;
    } catch (e) {
      failed.current = true;
      setSaveState('Not saved yet');
      setError(
        e instanceof Error
          ? e.message
          : 'Please check the connection and retry.',
      );
    } finally {
      running.current = false;
    }
  }
  function changeProgress(id: string, change: Saved | ((s: Saved) => Saved)) {
    const child = records.current.find((p) => p.id === id);
    if (!child) return;
    const progress =
      typeof change === 'function' ? change(child.progress) : change;
    install(records.current.map((p) => (p.id === id ? { ...p, progress } : p)));
    pending.current.set(id, progress);
    if (!failed.current) void drain();
  }
  async function create(e: React.FormEvent) {
    e.preventDefault();
    const input = { nickname: nickname.trim(), avatar };
    if (!validProfileInput(input)) {
      setError('Choose a nickname of 1–20 characters.');
      return;
    }
    setCreating(true);
    setError('');
    try {
      const response = await fetch('/api/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = (await response.json()) as ApiResult;
      if (!response.ok) throw Error(data.error || 'Please try again.');
      install([...records.current, data.profile]);
      setActive(data.profile.id);
      setAdding(false);
      setNickname('');
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Your profile could not be created.',
      );
    } finally {
      setCreating(false);
    }
  }
  const child = profiles.find((p) => p.id === active),
    busy = saveState === 'Saving…' || saveState === 'Not saved yet';
  const avatarFor = (id: string) =>
    avatars.find((a) => a.id === id)?.symbol || '🦊';
  if (loading)
    return (
      <main className="family-shell">
        <p role="status">Opening your family’s picture book…</p>
      </main>
    );
  if (child)
    return (
      <>
        <div className="family-toolbar">
          <span className="child-identity">
            <span aria-hidden>{avatarFor(child.avatar)}</span>
            <b>{child.nickname}’s picture book</b>
          </span>
          <span className="sync-state" role="status">
            {saveState}
          </span>
          <button
            className="secondary"
            disabled={busy}
            onClick={() => {
              setActive(null);
              setError('');
            }}
          >
            <Users size={18} /> Change child
          </button>
        </div>
        {error && (
          <div className="family-error" role="alert">
            {error}
            <button
              className="secondary"
              onClick={() => {
                conflicts.current = 0;
                void drain();
              }}
            >
              Retry saving
            </button>
            <span>
              Keep this page open until your progress is saved. You can also
              download a backup in For grown-ups.
            </span>
          </div>
        )}
        {legacy && (
          <details className="legacy-import">
            <summary>
              Grown-up: earlier progress was found on this browser
            </summary>
            <p>
              Only add it if it belongs to {child.nickname}. The earlier copy
              stays on this browser.
            </p>
            <button
              className="secondary"
              disabled={busy}
              onClick={() => {
                changeProgress(child.id, (s) => mergeProgress(s, legacy));
                setLegacy(null);
              }}
            >
              Add earlier progress to {child.nickname}
            </button>
            <button className="back" onClick={() => setLegacy(null)}>
              Not this child
            </button>
          </details>
        )}
        <Home
          key={child.id}
          saved={child.progress}
          setSaved={(change) => changeProgress(child.id, change)}
        />
      </>
    );
  return (
    <main className="family-shell">
      <a href="./" className="brand">
        hallo<span>!</span>
        <small>Our German picture book</small>
      </a>
      <div className="family-book">
        <img
          className="family-art"
          src="./fox-adventure.webp"
          alt="Fino the fox welcomes your family"
          width="1536"
          height="1024"
        />
        <section className="family-panel">
          {error && (
            <div role="alert" className="family-error">
              {error}
            </div>
          )}
          {!signed ? (
            <>
              <p className="eyebrow">A LITTLE HELP FROM A GROWN-UP</p>
              <h1>A picture book for every child.</h1>
              <p>
                Grown-ups, sign in with your own ChatGPT account. Then each
                child can choose a nickname and an animal friend.
              </p>
              <a className="primary" href={signIn} target="_top">
                Adult sign in / create account <ArrowRight size={18} />
              </a>
              <p className="small">
                Only the adult signs in to ChatGPT. Children use their profiles
                here. Their progress follows your account to your other devices.
              </p>
              {error && (
                <button className="secondary" onClick={load}>
                  Try loading again
                </button>
              )}
            </>
          ) : adding ? (
            <>
              <p className="eyebrow">YOUR VERY OWN PICTURE BOOK</p>
              <h1>Let’s make your profile.</h1>
              <form onSubmit={create}>
                <label className="nickname-label" htmlFor="child-nickname">
                  What nickname shall we use?
                </label>
                <Input
                  id="child-nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={40}
                  placeholder="For example, Sunny"
                  autoComplete="off"
                  required
                  aria-describedby="nickname-help"
                />
                <p id="nickname-help" className="small">
                  A pretend name is great. Up to 20 characters.
                </p>
                <p id="avatar-label">
                  <b>Choose your animal friend</b>
                </p>
                <RadioGroup
                  value={avatar}
                  onValueChange={(v) => setAvatar(String(v))}
                  aria-labelledby="avatar-label"
                  className="avatar-grid"
                >
                  {avatars.map((a) => (
                    <label
                      className={
                        'avatar-choice ' + (a.id === avatar ? 'chosen' : '')
                      }
                      key={a.id}
                    >
                      <span aria-hidden>{a.symbol}</span>
                      <b>{a.name}</b>
                      <RadioGroupItem value={a.id} aria-label={a.name} />
                    </label>
                  ))}
                </RadioGroup>
                <button
                  className="primary"
                  disabled={creating || !nickname.trim()}
                  type="submit"
                >
                  {creating
                    ? 'Making your profile…'
                    : 'That’s me! Let’s explore'}{' '}
                  <ArrowRight size={18} />
                </button>
                {profiles.length > 0 && (
                  <button
                    className="back"
                    type="button"
                    disabled={creating}
                    onClick={() => setAdding(false)}
                  >
                    Back to our family
                  </button>
                )}
              </form>
            </>
          ) : (
            <>
              <p className="eyebrow">WELCOME BACK</p>
              <h1>Who’s exploring today?</h1>
              <p>Tap your animal friend to open your own stories.</p>
              <div className="child-grid">
                {profiles.map((p) => (
                  <button
                    className="child-card"
                    key={p.id}
                    onClick={() => {
                      setActive(p.id);
                      setSaveState('Saved to your family account');
                    }}
                  >
                    <span aria-hidden>{avatarFor(p.avatar)}</span>
                    <b>{p.nickname}</b>
                    <small>
                      {Object.keys(p.progress.completed).length} stories
                      explored
                    </small>
                  </button>
                ))}
              </div>
              <button
                className="secondary"
                onClick={() => {
                  setAdding(true);
                  setError('');
                }}
              >
                <Plus size={18} /> Add another child
              </button>
            </>
          )}
          {signed && (
            <a
              className="adult-signout"
              href="/signout-with-chatgpt?return_to=%2F"
              target="_top"
            >
              <LogOut size={16} /> Grown-up: sign out of this family
            </a>
          )}
        </section>
      </div>
      <p className="family-footnote">
        Child profiles are shared within this adult account. They do not have
        separate passwords. Use the same adult account on another device to find
        them.
      </p>
    </main>
  );
}
