import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../app/globals.css';
import { validProgress } from '../lib/learning.mjs';
const site = 'https://hallo-abenteuer-setopy.setopyy.chatgpt.site/';
function Bridge() {
  const [old, setOld] = useState<string | null>(null);
  useEffect(() => {
    try {
      const text = localStorage.getItem('hallo-progress-v1');
      if (text && validProgress(JSON.parse(text))) {
        const p = JSON.parse(text);
        if (
          Object.keys(p.completed).length ||
          p.checks.length ||
          p.canDo?.length
        ) {
          setOld(text);
          return;
        }
      }
    } catch {}
    window.location.replace(site);
  }, []);
  function backup() {
    const url = URL.createObjectURL(
      new Blob([old!], { type: 'application/json' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hallo-earlier-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <main className="family-shell">
      <h1>Your picture book now has child profiles.</h1>
      <p>
        Sign in with an adult account to keep each child’s progress across
        devices.
      </p>
      {old && (
        <>
          <p>
            Your earlier progress is still in this browser. Download it, then
            restore it into the right child’s profile under For grown-ups.
          </p>
          <button className="secondary" onClick={backup}>
            Download earlier progress
          </button>
        </>
      )}
      <p>
        <a className="primary" href={site}>
          Open our family picture book →
        </a>
      </p>
    </main>
  );
}
createRoot(document.getElementById('root')!).render(<Bridge />);
