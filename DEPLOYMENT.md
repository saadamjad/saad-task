# Deployment Guide

This document supports **Module 3** of the assessment: configuring signing, CI/CD secrets, and submitting builds to **Google Play** and **Apple App Store / TestFlight**. It assumes you already have developer accounts for both platforms.

---

## CI/CD summary

| Goal | Workflow | Notes |
|------|----------|--------|
| PR/main quality gate | `ci.yml` | Runs `yarn typecheck`, `yarn lint`, `yarn test --watch=false` |
| Signed Android APK (QA) | `android-release-development.yml` | Uses GitHub Environment **`development`** |
| Signed Android AAB + Play Beta | `android-release-production.yml` | Uses **`production`** + Play API JSON secret |
| Signed iOS IPA (QA) | `ios-release-development.yml` | Uses **`development`** |
| Signed iOS IPA + TestFlight | `ios-release-production.yml` | Uses **`production`** + App Store Connect API key secrets |

Triggers include **`workflow_dispatch`** (manual) and branch pushes (`development` / `master`) per workflow file.

---

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

Keep the keystore file **off** git (already ignored via `*.keystore` patterns except debug).

### Configure GitHub Secrets (per Environment)

Store signing secrets on GitHub Environments **`development`** and **`production`** (recommended), or repository secrets:

| Secret | Used by |
|--------|---------|
| `ANDROID_SIGNING_KEY_BASE64` | Dev + Prod workflows (base64-encoded keystore file) |
| `ANDROID_KEY_ALIAS` | Dev + Prod |
| `ANDROID_STORE_PASSWORD` | Dev + Prod |
| `ANDROID_KEY_PASSWORD` | Dev + Prod |

**Production only** — Google Play uploads via API:

| Secret | Purpose |
|--------|---------|
| `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` | Full JSON for a Play Console–linked service account with permission to create releases (paste as one secret). |

Create the service account in Google Cloud, grant access under **Play Console → Setup → API access**, and enable the **Google Play Android Developer API**.

### Build locally

```bash
cd android
export ORG_GRADLE_PROJECT_MYAPP_UPLOAD_STORE_FILE=release.keystore
export ORG_GRADLE_PROJECT_MYAPP_UPLOAD_KEY_ALIAS=saad-task-key
export ORG_GRADLE_PROJECT_MYAPP_UPLOAD_STORE_PASSWORD=your_store_password
export ORG_GRADLE_PROJECT_MYAPP_UPLOAD_KEY_PASSWORD=your_key_password
./gradlew assembleRelease
```

Outputs:

- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `./gradlew bundleRelease` → `android/app/build/outputs/bundle/release/app-release.aab`

CI passes Gradle properties `CI_VERSION_CODE` / `CI_VERSION_NAME` so Play receives monotonic **versionCode** values.

### Google Play submission (manual path)

1. **Play Console** → your app → **Testing** (internal / open / closed) or **Production**.
2. Create a release, upload the **AAB** (preferred over APK for Play).
3. Complete release notes, content rating, data safety, and roll out.

---

## 2) iOS Release (Signed IPA)

### Apple prerequisites

- Paid **Apple Developer Program** membership
- **App ID** (bundle identifier) matching Xcode
- **Distribution** signing certificate (`.p12`)
- **App Store** provisioning profile for that App ID
- **App Store Connect** app record for the bundle ID

### Configure GitHub Secrets (signing)

Per **`development`** / **`production`** environment:

| Secret | Purpose |
|--------|---------|
| `IOS_DISTRIBUTION_CERT_BASE64` | Distribution `.p12`, base64-encoded |
| `IOS_P12_PASSWORD` | Certificate password |
| `IOS_PROVISIONING_PROFILE_BASE64` | App Store provisioning profile |
| `IOS_TEAM_ID` | Team ID (substituted into `ios/ExportOptions.plist` in CI) |

### App Store Connect API (TestFlight upload — production iOS workflow)

Create an API key in **App Store Connect → Users and Access → Integrations → App Store Connect API** (role **App Manager** or **Admin**). Add to **`production`**:

| Secret | Purpose |
|--------|---------|
| `APP_STORE_CONNECT_ISSUER_ID` | Issuer UUID |
| `APP_STORE_CONNECT_API_KEY_ID` | Key ID |
| `APP_STORE_CONNECT_API_PRIVATE_KEY` | Full `.p8` contents |

### Local archive and export

```bash
cd ios
bundle exec pod install
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

Replace `REPLACE_WITH_TEAM_ID` in `ios/ExportOptions.plist` with your Team ID (CI does this via `sed`).

Output: `ios/build/*.ipa`

### App Store / TestFlight submission

1. Upload the IPA via **Transporter**, **Xcode Organizer**, or the **`ios-release-production.yml`** workflow (TestFlight).
2. **App Store Connect → TestFlight**: wait for processing; fix missing compliance if prompted.
3. Add internal/external testers or submit the build to **App Review** with metadata, privacy policy URL, and export compliance.

If `exportArchive` fails with **manual signing**, add the **`provisioningProfiles`** dictionary to `ExportOptions.plist` mapping your bundle ID to the profile name (Apple requirement for manual exports).

---

## 3) Branch / environment model

| Branch | Typical use |
|--------|----------------|
| `development` | Internal QA builds (artifacts only or internal testers) |
| `master` | Store-bound pipelines (Play Beta / TestFlight as configured) |

**GitHub Environments:** **Settings → Environments** — create `development` and `production`, protect if needed, attach secrets per environment.

---

## 4) Production readiness checklist

- [ ] **CI green:** `ci.yml` passes on default branch
- [ ] **Versioning:** Android `versionCode` bumps each Play upload (CI sets via Gradle props); iOS **CFBundleShortVersionString** / **CFBundleVersion** updated in Xcode when shipping
- [ ] **Secrets:** Rotate signing credentials if exposed
- [ ] **Play:** Service account linked; tracks (beta/internal/production) chosen deliberately
- [ ] **App Store:** API key stored securely; agreements / banking / export compliance completed in ASC
- [ ] **Privacy:** URLs and **App Privacy** / **Data safety** forms aligned with app behavior
