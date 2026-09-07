'use client';
import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload,
  signOut,
  type Auth,
} from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { emailAuth } from './email-auth';
const legacy = '/signin-with-chatgpt?return_to=%2F';
export default function AdultSignIn({
  onAuthenticated,
}: {
  onAuthenticated: () => void;
}) {
  const [auth, setAuth] = useState<Auth | null>(null),
    [loading, setLoading] = useState(true),
    [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin'),
    [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(''),
    [verify, setVerify] = useState(false);
  useEffect(() => {
    emailAuth()
      .then((a) => {
        setAuth(a);
        setVerify(!!a?.currentUser && !a.currentUser.emailVerified);
      })
      .catch(() =>
        setMessage(
          'Sign-in could not be loaded. Please refresh and try again.',
        ),
      )
      .finally(() => setLoading(false));
  }, []);
  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!auth) return;
    setBusy(true);
    setMessage('');
    try {
      if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email.trim());
        setMessage(
          'If this email has an account, a password-reset message will arrive. Check your inbox and spam folder.',
        );
        return;
      }
      const result =
        mode === 'signup'
          ? await createUserWithEmailAndPassword(auth, email.trim(), password)
          : await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword('');
      if (!result.user.emailVerified) {
        setVerify(true);
        if (mode === 'signup') {
          try {
            await sendEmailVerification(result.user);
            setMessage(
              'We sent a verification link. Open it, then return here.',
            );
          } catch {
            setMessage(
              'Your account was created. Use Resend verification email to verify your address.',
            );
          }
        } else setMessage('Please verify your email, then return here.');
        return;
      }
      onAuthenticated();
    } catch (error) {
      const code = (error as { code?: string }).code;
      setMessage(
        code === 'auth/too-many-requests'
          ? 'Please wait a little before trying again.'
          : code === 'auth/weak-password'
            ? 'Choose a stronger password with at least 8 characters.'
            : mode === 'reset'
              ? 'We could not send a password-reset message. Check the email address and try again later.'
              : mode === 'signup'
                ? 'We could not create this account. Check the email and password, or try Sign in / Forgot password.'
                : 'We could not sign you in. Check the email and password, or reset your password.',
      );
    } finally {
      setBusy(false);
    }
  }
  async function confirmed() {
    if (!auth?.currentUser) return;
    setBusy(true);
    try {
      await reload(auth.currentUser);
      await auth.currentUser.getIdToken(true);
      if (auth.currentUser.emailVerified) onAuthenticated();
      else
        setMessage(
          'The email has not been verified yet. Open the link in your inbox first.',
        );
    } catch {
      setMessage('We could not check your email yet. Please try again.');
    } finally {
      setBusy(false);
    }
  }
  if (loading) return <output>Loading adult sign-in…</output>;
  if (!auth)
    return (
      <>
        <p>Grown-ups, sign in to open your family’s picture books.</p>
        <a className="primary" href={legacy} target="_top">
          Continue with ChatGPT
        </a>
        {message && <output className="adult-message">{message}</output>}
      </>
    );
  if (verify)
    return (
      <>
        <h2>Check your email</h2>
        <p>
          Open the verification link sent to {auth.currentUser?.email}, then
          come back here. This confirms that the family account belongs to you.
        </p>
        {message && <output className="adult-message">{message}</output>}
        <button className="primary" disabled={busy} onClick={confirmed}>
          I’ve verified my email
        </button>
        <button
          className="back"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              if (auth.currentUser)
                await sendEmailVerification(auth.currentUser);
              setMessage('Verification email sent. Please check your inbox.');
            } catch {
              setMessage(
                'We could not send another message yet. Please wait and try again.',
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          Resend verification email
        </button>
        <button
          className="back"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await signOut(auth);
              setVerify(false);
              setMessage('');
            } catch {
              setMessage('We could not sign you out. Please try again.');
            } finally {
              setBusy(false);
            }
          }}
        >
          Use another account
        </button>
      </>
    );
  return (
    <>
      <p className="eyebrow">FOR PARENTS AND GROWN-UPS</p>
      <h2>
        {mode === 'signup'
          ? 'Create your family account'
          : mode === 'reset'
            ? 'Reset your password'
            : 'Sign in to your family'}
      </h2>
      <p>Use your usual email address. A ChatGPT account is not required.</p>
      <form onSubmit={submit}>
        <label htmlFor="adult-email">Your email address</label>
        <Input
          id="adult-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {mode !== 'reset' && (
          <>
            <label htmlFor="adult-password">Password</label>
            <Input
              id="adult-password"
              type="password"
              autoComplete={
                mode === 'signup' ? 'new-password' : 'current-password'
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={mode === 'signup' ? 8 : undefined}
              maxLength={128}
              required
            />
            {mode === 'signup' && (
              <p className="small">
                Use at least 8 characters. Use the adult’s email, not the
                child’s.
              </p>
            )}
          </>
        )}
        {message && <output className="adult-message">{message}</output>}
        <button type="submit" className="primary" disabled={busy}>
          {busy
            ? 'Please wait…'
            : mode === 'signup'
              ? 'Create account'
              : mode === 'reset'
                ? 'Send reset email'
                : 'Sign in'}
        </button>
      </form>
      <div className="actions">
        <button
          className="back"
          disabled={busy}
          onClick={() => {
            setMode(mode === 'signup' ? 'signin' : 'signup');
            setMessage('');
          }}
        >
          {mode === 'signup'
            ? 'Already have an account? Sign in'
            : 'New here? Create an account'}
        </button>
        <button
          className="back"
          disabled={busy}
          onClick={() => {
            setMode(mode === 'reset' ? 'signin' : 'reset');
            setMessage('');
          }}
        >
          {mode === 'reset' ? 'Back to sign in' : 'Forgot password?'}
        </button>
      </div>
      <p className="small">
        Email sign-in and password recovery are handled by Firebase. Children
        use nicknames and apostle avatars within the adult’s account.
      </p>
      <details className="apostle-note">
        <summary>Already have a family here through ChatGPT?</summary>
        <p>
          Continue with your existing sign-in to reach those profiles. An email
          account is separate; you can transfer progress using a backup in For
          grown-ups.
        </p>
        <a href={legacy} target="_top">
          Continue with ChatGPT ↗
        </a>
      </details>
    </>
  );
}
