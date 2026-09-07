# ZionPro Lernraum

A colourful, grown-up-supported German tutorial for young beginners, designed around an eight-year-old's everyday world.

## What is included — storybook edition

- 12 illustrated neighbourhood places, each with three short stories (36 total).
- 12 original colourful gouache scenes, delivered efficiently as three compressed image sheets through accessible SVG viewports, plus the original fox welcome illustration.
- 36 story-specific introductions and picture-based vocabulary exploration with German audio.
- 144 conversational phrase examples with English meanings and German device-voice audio at normal or slower speed.
- A direct picture-story → speaking-role → real-life-play path. Detective games and sentence puzzles remain optional practice.
- Props, a practical activity and a changed-detail challenge for every story. Completion requires the family to acknowledge trying the off-screen activity.
- A speaking scrapbook with distinct, grown-up-observed skills. It asks the adult to observe changed-detail speaking on two days; it does not automatically evaluate pronunciation.
- Adult-managed family accounts support Firebase email/password sign-in with verified email addresses. Existing Sites sign-in with ChatGPT remains available for earlier families. Children choose a nickname and one of twelve illustrated apostle avatars; they do not sign in to ChatGPT themselves.
- Child progress is stored in D1 under the adult owner. Every read/write checks ownership. Revision checks prevent silent concurrent overwrites; simultaneous additions merge.
- Existing local progress can be explicitly imported into the selected child profile. Older backups remain compatible. New backups include speaking observations.
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

`dist-pages/` is a static handoff to the canonical Sites account experience. It offers export of earlier GitHub-origin progress before moving. GitHub Pages cannot host the authenticated database service. GitHub Actions checks and publishes pushes to main after Pages is enabled with GitHub Actions as its source. The original Sites target uses `pnpm dev` and `pnpm build`.

## Privacy and audio

Profiles store a nickname, preset avatar and learning progress, linked to the adult’s platform user ID in D1. No child email, date of birth or voice recording is requested. Nicknames should be pretend names. The account is shared by its children; profiles are not password-isolated from siblings. Adult email authentication is handled by Firebase; passwords are never stored in the app database. Existing ChatGPT accounts remain separate from Firebase accounts. The server verifies Firebase signatures, project audience, issuer, expiry and verified-email claims, then scopes each family to the project and adult UID. Fictional names can be used in all role-play. Device speech engines may use their own online services. German voice availability and quality depend on the operating system. The site requires internet and does not promise offline operation.

## Validation

Automated tests cover curriculum completeness, quiz choice uniqueness, sentence puzzles, progress validation, repeat completion, backup merging and German voice selection. TypeScript and both production targets are checked. Browser interaction and human listening are separate, unperformed checks. Local API integration checks cover unauthenticated requests, profile creation, separate child progress, stale revision conflicts, cross-origin rejection and another owner’s profile protection. WebMCP registration, progress reading, valid mission opening and invalid-input rejection were verified in the supported browser tool context; no discoveries were awarded by opening a mission. That verification predates the storybook redesign; the registration behavior is retained.

## Assets and sources

Original generated storybook fox illustration and twelve new picture-book scenes. The three full-scene sheets are displayed using SVG viewports; no illustration is drawn in CSS or SVG. Lesson content is original. Parent source links include Goethe-Institut, Cambridge English and Council of Europe, checked 5 September 2026. This independent project is not affiliated with those organisations.

## Database

Generate schema migrations with `pnpm exec drizzle-kit generate`. The Sites deployment applies the generated Drizzle migration before publishing. Do not rewrite applied migrations. Only profile selection and pending saves are held in memory; the database is the progress source of truth. Wait for Saved before leaving a device.

## Bilingual Gospel edition

All 36 neighbourhood story introductions have German and English text and language-matched audio. Six additional Gospel retellings have bilingual narration, speaking questions and family activities, with an optional `gospel` progress list preserved in backups and cross-device saves. The original 36-week neighbourhood curriculum is unchanged; Gospel stories are supplementary shared reading.

Apostle avatars follow the twelve after Matthias joins in Acts 1:26. The collection distinguishes James son of Zebedee and James son of Alphaeus; Thaddaeus is also called Jude/Judas son of James. Revelation 21:12–14 places the tribes’ names on gates and apostles’ names on foundations. The exact names are not enumerated there. Illustrations are imagined, not authentic likenesses. Existing animal profiles are prompted to choose an apostle without losing progress. The owner-checked profile PATCH updates nickname/avatar independently of learning-progress revisions.

Gospel sources: Mark 10:13–16; John 6:1–13; Mark 4:35–41; Luke 19:1–10; Luke 2:41–52; John 21:1–14. Original simplified retellings and original teaching questions, not verbatim Bible translations. Each story links to the passage for adult reading. Source passages checked 6 September 2026.

## Email authentication configuration

Set FIREBASE_PROJECT_ID, FIREBASE_API_KEY and FIREBASE_AUTH_DOMAIN in Sites runtime settings. These identify the Firebase web client; no service-account private key is required. Enable Firebase Email/Password and authorize the app domain. Without complete configuration, the earlier ChatGPT sign-in remains available. Firebase Spark quotas apply. Automated signed-token tests cover valid identity, wrong signatures, wrong issuer/audience, invalid dates, unverified email and invalid UIDs. Actual inbox delivery and a real cross-device parent session require a user-owned test account.
