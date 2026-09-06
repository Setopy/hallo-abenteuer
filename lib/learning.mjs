export const emptyProgress = { version: 1, completed: {}, checks: [] };
export function shuffled(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function validProgress(value) {
  return (
    value?.version === 1 &&
    value.completed &&
    typeof value.completed === 'object' &&
    !Array.isArray(value.completed) &&
    Object.entries(value.completed).every(
      ([id, date]) =>
        /^\d+$/.test(id) &&
        Number(id) >= 1 &&
        Number(id) <= 36 &&
        typeof date === 'string' &&
        Number.isFinite(Date.parse(date)),
    ) &&
    Array.isArray(value.checks) &&
    value.checks.every((id) => Number.isInteger(id) && id >= 0 && id < 9) &&
    (value.canDo === undefined ||
      (Array.isArray(value.canDo) &&
        value.canDo.every(
          (id) => Number.isInteger(id) && id >= 1 && id <= 36,
        ))) &&
    (value.gospel === undefined ||
      (Array.isArray(value.gospel) &&
        value.gospel.every((id) => Number.isInteger(id) && id >= 1 && id <= 6)))
  );
}
export function markComplete(progress, id, now = new Date().toISOString()) {
  if (!Number.isInteger(id) || id < 1 || id > 36) throw Error('Invalid lesson');
  return { ...progress, completed: { ...progress.completed, [id]: now } };
}
export function mergeProgress(current, incoming) {
  if (!validProgress(incoming)) throw Error('Invalid backup');
  const completed = { ...current.completed };
  for (const [id, date] of Object.entries(incoming.completed))
    if (!completed[id] || Date.parse(date) > Date.parse(completed[id]))
      completed[id] = date;
  return {
    version: 1,
    completed,
    checks: [...new Set([...current.checks, ...incoming.checks])],
    canDo: [...new Set([...(current.canDo || []), ...(incoming.canDo || [])])],
    gospel: [
      ...new Set([...(current.gospel || []), ...(incoming.gospel || [])]),
    ],
  };
}
export function nextLesson(progress) {
  for (let id = 1; id <= 36; id++) if (!progress.completed[id]) return id;
  return 1;
}
export function isBuilt(tokens, selected) {
  return (
    selected.length === tokens.length &&
    selected.map((i) => tokens[i]).join(' ') === tokens.join(' ')
  );
}
export function chooseGermanVoice(voices) {
  return (
    voices.find((v) => v.lang === 'de-DE') ||
    voices.find((v) => v.lang.startsWith('de'))
  );
}

export function chooseEnglishVoice(voices) {
  return (
    voices.find((v) => v.lang === 'en-GB') ||
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang.startsWith('en'))
  );
}
