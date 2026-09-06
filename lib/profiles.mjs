import { validProgress } from './learning.mjs';
export const avatars = [
  {
    id: 'peter',
    name: 'Peter',
    de: 'Petrus',
    index: 0,
  },
  {
    id: 'andrew',
    name: 'Andrew',
    de: 'Andreas',
    index: 1,
  },
  {
    id: 'james-zebedee',
    name: 'James, son of Zebedee',
    de: 'Jakobus, Sohn des Zebedäus',
    index: 2,
  },
  {
    id: 'john',
    name: 'John',
    de: 'Johannes',
    index: 3,
  },
  {
    id: 'philip',
    name: 'Philip',
    de: 'Philippus',
    index: 4,
  },
  {
    id: 'bartholomew',
    name: 'Bartholomew',
    de: 'Bartholomäus',
    index: 5,
  },
  {
    id: 'matthew',
    name: 'Matthew',
    de: 'Matthäus',
    index: 6,
  },
  {
    id: 'thomas',
    name: 'Thomas',
    de: 'Thomas',
    index: 7,
  },
  {
    id: 'james-alphaeus',
    name: 'James, son of Alphaeus',
    de: 'Jakobus, Sohn des Alphäus',
    index: 8,
  },
  {
    id: 'thaddaeus',
    name: 'Thaddaeus (Jude)',
    de: 'Thaddäus (Judas)',
    index: 9,
  },
  {
    id: 'simon',
    name: 'Simon the Zealot',
    de: 'Simon der Zelot',
    index: 10,
  },
  {
    id: 'matthias',
    name: 'Matthias',
    de: 'Matthias',
    index: 11,
  },
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
