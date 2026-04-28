# Saad Task - GeeksforGeeks Feed App

Production-focused **React Native CLI** application built with **TypeScript**, fulfilling the assessment modules below.

---

## Submission (reviewers)

- Repository must be **private** on GitHub.
- Invite **`jimishio`** as a collaborator before the deadline.
- Reply to **`jim@shlenpower.com`** (Cc **`hr@shlenpower.com`**) with the repository link.

> **Note:** If the repo was created public earlier, change it under GitHub → **Settings → Danger Zone → Change visibility → Private**, then add the collaborator.

---

## Requirements checklist

### Technical (global)

| Requirement | Implementation |
|-------------|----------------|
| TypeScript | Strict TS (`yarn typecheck`); avoid loose `any` |
| React Native CLI (not Expo) | `react-native` CLI (`package.json` scripts) |
| iOS 15+ | `IPHONEOS_DEPLOYMENT_TARGET = 15.1` in Xcode project |
| Android API 31+ | `minSdkVersion = 31` in Android Gradle |
| State management | **Redux Toolkit** — predictable updates for feed + saved lists + listener middleware for persistence |
| Navigation | **React Navigation v6** with typed param lists (`src/types/navigation.ts`) |
| Reviewer quick start | Section **Quick Start** below — **under 5 minutes** with Yarn + CocoaPods |

**Why Redux Toolkit:** Serializable actions, DevTools-friendly debugging, colocated slice logic (`feedSlice`, `savedSlice`, `authGateSlice`), and middleware that persists offline saves after mutations—easier to reason about than ad hoc callbacks as features grow.

### Module 1 — GeeksForGeeks article feed (35 pts)

| Requirement | Where |
|-------------|--------|
| Latest articles from GFG RSS | Primary URL `https://www.geeksforgeeks.org/feed/` (`src/utils/rss/endpoints.ts`) with resilient fallback |
| Cards: title, category, read time | `ArticleCard` + `rssChannel` / `readTime` |
| Infinite scroll + skeleton loaders | `FlashList` + `ArticleCardSkeleton` (`FeedScreen`) |
| Save offline toggle per card | `toggleSavedArticle` + AsyncStorage via listener middleware |
| Tap opens WebView + toolbar (Back, Share, Browser) | `ArticleWebViewScreen` |

### Module 2 — Native biometric gate (30 pts)

| Requirement | Where |
|-------------|--------|
| Face ID / fingerprint | `react-native-biometrics` (`services/security/biometricService.ts`, `authGateSlice`) |
| PIN fallback when biometrics unavailable | `SavedGateScreen` + PIN setup / verify flows |
| PIN stored securely (Keychain / Keystore) | `react-native-keychain` (`services/security/pinSecurity.ts`) |

Place **screenshots or screen recordings** on physical devices under **`docs/evidence/`** (see checklist file there).

### Module 3 — CI/CD & store readiness (35 pts)

| Requirement | Where |
|-------------|--------|
| Workflow: lint + tests | `.github/workflows/ci.yml` (`yarn lint`, `yarn typecheck`, `yarn test`) |
| Signed APK | `.github/workflows/android-release-development.yml` / `-production.yml` |
| Signed IPA | `.github/workflows/ios-release-development.yml` / `-production.yml` |
| ≥ 3 meaningful Jest tests | `__tests__/feedSlice.test.ts`, `savedSlice.test.ts`, `authGateSlice.test.ts`, `readTime.test.ts` |
| `DEPLOYMENT.md` — signing & App Store / Play submission | Repository root |

---

## Quick Start (under 5 minutes)

**Prerequisites:** Node **18+** (20 LTS recommended), **Yarn**, Xcode **15+** (macOS), **Android Studio** + JDK **17**, CocoaPods (`sudo gem install cocoapods`).

```bash
git clone <YOUR_REPO_URL> && cd saad-task
yarn install --frozen-lockfile
cd ios && bundle exec pod install && cd ..
```

Terminal A:

```bash
yarn start
```

Terminal B — **iOS Simulator:**

```bash
yarn ios
```

Terminal B — **Android Emulator** (AVD running):

```bash
yarn android
```

---

## Scripts

| Script | Purpose |
|--------|---------|
| `yarn start` | Metro bundler |
| `yarn ios` | Run iOS |
| `yarn android` | Run Android |
| `yarn lint` | ESLint |
| `yarn typecheck` | TypeScript `--noEmit` |
| `yarn test` | Jest (non-watch CI usage: `yarn test --watch=false`) |

---

## Architecture

Feature-oriented layout under `src/`:

- `features/feed` — RSS feed UI (`FlashList`, cards, skeletons)
- `features/saved` — biometric gate + saved articles list
- `features/article` — WebView reader + toolbar
- `navigation` — typed stacks/tabs (`AppNavigator.tsx`)
- `store` — Redux slices + persistence listener
- `services` — RSS fetch/parsing, AsyncStorage, PIN/biometrics
- `utils/rss` — RSS/sitemap parsing helpers

---

## CI/CD overview

| Workflow | Purpose |
|----------|---------|
| `ci.yml` | Lint, typecheck, test on PR/push to `main`/`master` |
| `android-release-*.yml` | Signed release APK/AAB (GitHub Environments for secrets) |
| `ios-release-*.yml` | Signed IPA; production uploads to **TestFlight** when API secrets are set |

Details and signing setup: **`DEPLOYMENT.md`**.

---

## Evidence (physical device)

See **`docs/evidence/README.md`** for required screenshots or recordings (both platforms, biometric + PIN flows as applicable).
