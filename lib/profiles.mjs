import { validProgress } from './learning.mjs';
export const avatars = [
  { id: 'fox', symbol: '🦊', name: 'Fox' },
  { id: 'cat', symbol: '🐱', name: 'Cat' },
  { id: 'panda', symbol: '🐼', name: 'Panda' },
  { id: 'rabbit', symbol: '🐰', name: 'Rabbit' },
  { id: 'lion', symbol: '🦁', name: 'Lion' },
  { id: 'frog', symbol: '🐸', name: 'Frog' },
];
export function validNickname(name) {
  return (
    typeof name === 'string' &&
    name === name.trim() &&
    [...name].length >= 1 &&
    [...name].length <= 20 &&
    !/[\u0000-\u001f\u007f]/.test(name)
  );
}
export function validProfileInput(input) {
  return (
    input &&
    validNickname(input.nickname) &&
    avatars.some((a) => a.id === input.avatar)
  );
}
export function validProgressUpdate(input) {
  return (
    input &&
    Number.isSafeInteger(input.revision) &&
    input.revision >= 0 &&
    validProgress(input.progress)
  );
}
export function sameOriginWrite(request) {
  return (
    request.headers.get('origin') === new URL(request.url).origin &&
    request.headers.get('content-type')?.split(';')[0] === 'application/json'
  );
}
