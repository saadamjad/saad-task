# Saad Task - GeeksForGeeks Feed App

Production-focused React Native CLI application built with TypeScript.

## Project Overview

This app delivers:
- RSS feed reader for GeeksForGeeks articles
- Infinite-scroll feed with read-time and category metadata
- Offline save/unsave using AsyncStorage
- In-app WebView with toolbar actions (Back / Share / Browser)
- Saved tab protected by biometric auth with PIN fallback
- CI workflows for lint, test, and separate dev/prod Android + iOS release pipelines

## Tech Stack

- React Native CLI `0.78.2` (no Expo)
- TypeScript strict mode
- Redux Toolkit
- React Navigation v6 (fully typed routes)
- FlashList for performant list rendering
- AsyncStorage + Keychain + Biometrics
- Jest for unit tests

## Requirements

- Node.js `>= 18` (recommended: 20 LTS)
- Xcode 15+ with CocoaPods
- Android Studio + Android SDK 35
- Java 17

## Quick Start (under 5 minutes)

```bash
yarn install --frozen-lockfile
cd ios && pod install && cd ..
yarn start
```

In a new terminal:

```bash
yarn ios
```

Or for Android:

```bash
yarn android
```

## Scripts

- `yarn start` - start Metro
- `yarn ios` - run iOS app
- `yarn android` - run Android app
- `yarn lint` - lint codebase
- `yarn typecheck` - strict TypeScript checks
- `yarn test` - unit tests

## Architecture

Feature-oriented structure using `src/` absolute imports:

- `src/features/feed` - RSS feed screens and reusable feed components
- `src/features/saved` - secure saved-articles flow
- `src/navigation` - typed tab/stack navigator setup
- `src/store` - Redux store and slices
- `src/services` - API, security, and persistence wrappers
- `src/types` - central domain/navigation typing

## Environment Setup Notes

- iOS deployment target is `15.1+`
- Android minimum SDK is `31+`
- Face ID usage message is configured in `Info.plist`
- Biometric permission is configured in Android manifest
- Feed loader tries RSS first, then sitemap if the server returns non-XML; errors are surfaced for retry in the UI

## CI/CD

Workflows are in `.github/workflows`:

- `ci.yml` — lint, typecheck, test (Yarn + `yarn.lock`)
- `android-release-development.yml` — signed APK on **`development`** branch or manual (`environment: development`)
- `android-release-production.yml` — signed AAB + **Google Play Beta** on **`master`** or manual (`environment: production`)
- `ios-release-development.yml` — signed IPA artifact on **`development`** / manual (`environment: development`)
- `ios-release-production.yml` — signed IPA + **TestFlight** on **`master`** / manual (`environment: production`)

Create GitHub Environments `development` and `production` and attach signing (and store API) secrets per environment. See `DEPLOYMENT.md`.

## Evidence

Add screenshots and recording files under `docs/evidence/`:

- iOS biometric success
- iOS PIN fallback
- Android biometric success
- Android PIN fallback
