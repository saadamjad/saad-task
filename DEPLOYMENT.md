# Deployment Guide

This document describes practical release steps for Android and iOS, including signing setup and store submission.

## 1) Android Release (Signed APK / AAB)

### Create signing key

```bash
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore release.keystore \
  -alias saad-task-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

### Configure GitHub Secrets (per Environment)

Store signing secrets on GitHub Environments **`development`** and **`production`** (or repo secrets if you prefer):

| Secret | Used by |
|--------|---------|
| `ANDROID_SIGNING_KEY_BASE64` | Dev + Prod workflows (base64-encoded keystore file) |
| `ANDROID_KEY_ALIAS` | Dev + Prod |
| `ANDROID_STORE_PASSWORD` | Dev + Prod |
| `ANDROID_KEY_PASSWORD` | Dev + Prod |

**Production only** — Google Play uploads:

| Secret | Used by |
|--------|---------|
| `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` | Full JSON for a Play Console–linked service account with permission to create releases (JSON pasted as one secret). |

Create the service account in Google Cloud, grant it access under Play Console → Setup → API access, then enable the Google Play Android Developer API.

### Build locally

```bash
cd android
export ORG_GRADLE_PROJECT_MYAPP_UPLOAD_STORE_FILE=release.keystore
export ORG_GRADLE_PROJECT_MYAPP_UPLOAD_KEY_ALIAS=saad-task-key
export ORG_GRADLE_PROJECT_MYAPP_UPLOAD_STORE_PASSWORD=your_store_password
export ORG_GRADLE_PROJECT_MYAPP_UPLOAD_KEY_PASSWORD=your_key_password
./gradlew assembleRelease
```

Output:

- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab` (`./gradlew bundleRelease`)

CI sets `CI_VERSION_CODE` / `CI_VERSION_NAME` so each Play upload gets a new `versionCode`.

### Submit to Google Play (manual alternative)

1. Open Google Play Console → your app.
2. Use Testing → Open/Closed testing (**Beta** track matches the production workflow default).
3. Upload the signed AAB and roll out.

## 2) iOS Release (Signed IPA)

### Apple prerequisites

- Apple Developer membership
- App Identifier (bundle ID)
- Distribution certificate
- App Store provisioning profile
- App Store Connect app entry

### Configure GitHub Secrets (signing)

Per **`development`** / **`production`** environment:

| Secret | Purpose |
|--------|---------|
| `IOS_DISTRIBUTION_CERT_BASE64` | `.p12` distribution cert, base64 |
| `IOS_P12_PASSWORD` | Certificate password |
| `IOS_PROVISIONING_PROFILE_BASE64` | App Store provisioning profile |
| `IOS_TEAM_ID` | Apple Team ID (also substituted into `ExportOptions.plist` in CI) |

### App Store Connect API (TestFlight upload — production workflow only)

Add these to the **`production`** environment (create an App Store Connect API key with App Manager or Admin):

| Secret | Purpose |
|--------|---------|
| `APP_STORE_CONNECT_ISSUER_ID` | Issuer UUID from App Store Connect → Users and Access → Integrations → Keys |
| `APP_STORE_CONNECT_API_KEY_ID` | Key ID |
| `APP_STORE_CONNECT_API_PRIVATE_KEY` | Full `.p8` key contents |

### Local archive and export

```bash
cd ios
pod install
cd ..
xcodebuild -workspace ios/SaadTask.xcworkspace \
  -scheme SaadTask \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  -archivePath ios/build/SaadTask.xcarchive archive

xcodebuild -exportArchive \
  -archivePath ios/build/SaadTask.xcarchive \
  -exportOptionsPlist ios/ExportOptions.plist \
  -exportPath ios/build
```

Replace `REPLACE_WITH_TEAM_ID` in `ios/ExportOptions.plist` with your team ID (CI does this automatically).

Output:

- `ios/build/*.ipa`

### Submit to App Store Connect

1. Upload IPA using Transporter or the production GitHub workflow (TestFlight).
2. In App Store Connect → TestFlight, wait for processing.
3. Add testers or promote to App Store review as needed.

If `exportArchive` fails with manual signing, ensure `ExportOptions.plist` includes a `provisioningProfiles` dictionary mapping your bundle ID to the profile name (Apple requirement for manual exports).

## 3) CI/CD Workflow Map

| Workflow | Trigger | Environment | Output |
|----------|---------|-------------|--------|
| `ci.yml` | PR + push to `main` / `master` | — | Lint, typecheck, test |
| `android-release-development.yml` | Push to **`development`**, or manual | `development` | Signed APK artifact |
| `android-release-production.yml` | Push to **`master`**, or manual | `production` | Signed AAB artifact + **Google Play `beta`** track |
| `ios-release-development.yml` | Push to **`development`**, or manual | `development` | Signed IPA artifact (no TestFlight) |
| `ios-release-production.yml` | Push to **`master`**, or manual | `production` | IPA artifact + **TestFlight** upload |

**Branches:** `development` = internal QA builds; `master` = store-facing pipelines.

**Google Play track:** The production Android workflow uses `track: beta`. To use internal testing only, change the `track` input in `android-release-production.yml` to `internal`.

**GitHub Environments:** Repository Settings → Environments → create `development` and `production`. Attach the secrets above per environment so dev/prod signing can differ.

## 4) Production Readiness Checklist

- [ ] Version/bundle number incremented (CI bumps Android `versionCode` automatically)
- [ ] Changelog/release notes prepared
- [ ] Tests and lint passing (`ci.yml`)
- [ ] Signing secrets valid and rotated if needed
- [ ] Play Console app created and service account linked (Android prod)
- [ ] App Store Connect API key created (iOS prod / TestFlight)
- [ ] Privacy policy URL and data safety forms updated where required
