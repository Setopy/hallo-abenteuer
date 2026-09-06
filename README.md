# Hallo! Abenteuer

A colourful, grown-up-supported German tutorial for young beginners, designed around an eight-year-old's everyday world.

## What is included — storybook edition

- 12 illustrated neighbourhood places, each with three short stories (36 total).
- 12 original colourful gouache scenes, delivered efficiently as three compressed image sheets through accessible SVG viewports, plus the original fox welcome illustration.
- 36 story-specific introductions and picture-based vocabulary exploration with German audio.
- 144 conversational phrase examples with English meanings and German device-voice audio at normal or slower speed.
- A direct picture-story → speaking-role → real-life-play path. Detective games and sentence puzzles remain optional practice.
- Props, a practical activity and a changed-detail challenge for every story. Completion requires the family to acknowledge trying the off-screen activity.
- A speaking scrapbook with distinct, grown-up-observed skills. It asks the adult to observe changed-detail speaking on two days; it does not automatically evaluate pronunciation.
- Existing local progress and older backups remain compatible. New backups include speaking observations and merge them without dropping prior progress.
- No lost streaks, ads, public profiles, recording or learner leaderboard.
- Parent speaking checkpoints, evidence-linked guidance, and progress backup/merge.

## Learning target

Begin with 36 weeks, approximately nine months, at four hours/week including live interaction and off-screen activities. Review at 9–12 months rather than promise fluency. A practical target is a supported 3–5 minute exchange on familiar topics, with pauses, repetition and repair phrases. These timing and task goals are design estimates, not child-specific research predictions or certification criteria.

Goethe's adult A1 guidance (80–200 45-minute teaching units) is a broad comparator only. Cambridge's short-session advice for young English learners is adapted here to German. Home practice does not equal guided teaching hour-for-hour. The parent section explains these limits and links sources. A proficient German speaker or child-friendly tutor is important for feedback and genuine conversational progress.

The curriculum is an original starting framework, not an accredited or complete A1 course. Story completion does not assess pronunciation or proficiency. Listening games cannot replace real conversation.

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

Automated tests cover curriculum completeness, quiz choice uniqueness, sentence puzzles, progress validation, repeat completion, backup merging and German voice selection. TypeScript and both production targets are checked. Browser interaction and human listening are separate, unperformed checks. WebMCP registration, progress reading, valid mission opening and invalid-input rejection were verified in the supported browser tool context; no discoveries were awarded by opening a mission. That verification predates the storybook redesign; the registration behavior is retained.

## Assets and sources

Original generated storybook fox illustration and twelve new picture-book scenes. The three full-scene sheets are displayed using SVG viewports; no illustration is drawn in CSS or SVG. Lesson content is original. Parent source links include Goethe-Institut, Cambridge English and Council of Europe, checked 5 September 2026. This independent project is not affiliated with those organisations.
