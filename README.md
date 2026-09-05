# Hallo! Abenteuer

A colourful, grown-up-supported German tutorial for young beginners, designed around an eight-year-old's everyday world.

## What is included

- 12 themed adventures and 36 complete mini-missions.
- 144 phrase examples with English meanings, including intentional review/repetition.
- German device-voice audio at normal or slower speed.
- Listen-and-copy cards, four-question detective games, sentence-building puzzles, and two-turn speaking practice in each mission.
- An off-screen mission and a phrase variation for every lesson.
- Discovery stamps for practice, with no lost streaks, ads, public profiles, recording or learner leaderboard.
- Parent speaking checkpoints, evidence-linked guidance, and JSON progress backup/merge.

## Learning target

Begin with 36 weeks, approximately nine months, at four hours/week including live interaction and off-screen activities. Review at 9–12 months rather than promise fluency. A practical target is a supported 3–5 minute exchange on familiar topics, with pauses, repetition and repair phrases. These timing and task goals are design estimates, not child-specific research predictions or certification criteria.

Goethe's adult A1 guidance (80–200 45-minute teaching units) is a broad comparator only. Cambridge's short-session advice for young English learners is adapted here to German. Home practice does not equal guided teaching hour-for-hour. The parent section explains these limits and links sources. A proficient German speaker or child-friendly tutor is important for feedback and genuine conversational progress.

The curriculum is an original starting framework, not an accredited or complete A1 course. Discovery stamps do not assess pronunciation or proficiency. Listening games cannot replace real conversation.

## Development

Node.js 22 and pnpm 11.19.0:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm run typecheck
pnpm test
pnpm run build:pages
```

`dist-pages/` is a static, repository-subpath-compatible site. GitHub Actions checks and publishes pushes to main after Pages is enabled with GitHub Actions as its source. The original Sites target uses `pnpm dev` and `pnpm build`.

## Privacy and audio

Progress stays in local browser storage. The site collects no names or voice recordings. Fictional names can be used in all role-play. Device speech engines may use their own online services. German voice availability and quality depend on the operating system. The site requires internet and does not promise offline operation.

## Validation

Automated tests cover curriculum completeness, quiz choice uniqueness, sentence puzzles, progress validation, repeat completion, backup merging and German voice selection. TypeScript and both production targets are checked. Browser interaction and human listening are separate, unperformed checks. WebMCP tools are feature-detected; a supported runtime validation context was unavailable.

## Assets and sources

Original generated storybook fox illustration. Lesson content is original. Parent source links include Goethe-Institut, Cambridge English and Council of Europe, checked 5 September 2026. This independent project is not affiliated with those organisations.
