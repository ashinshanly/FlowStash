# 🍎 Publishing FlowStash to the Apple App Store

Since we are using **Expo**, the easiest way to publish is via **EAS (Expo Application Services)**. It handles the heavy lifting of code signing, certificates, and building the IPA file.

## Prerequisites
1.  **Apple Developer Program Account** ($99/year).
2.  **Expo Account** (Free).
3.  **App Icons & Splash Screen**: Ensure you have high-quality images in `assets/images`.

---

## Step 1: Install & Configure EAS

1.  **Install EAS CLI**:
    ```bash
    npm install -g eas-cli
    ```

2.  **Log in to your Expo account**:
    ```bash
    eas login
    ```

3.  **Configure your project**:
    ```bash
    eas build:configure
    ```
    *Select "ios" when prompted.*

---

## Step 2: Configure App Metadata

Open your `app.json` and ensure these fields are correct (we already updated these in the previous step):
```json
{
  "expo": {
    "name": "FlowStash",
    "slug": "flowstash",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.flowstash.app",
      "supportsTablet": true
    }
  }
}
```

---

## Step 3: Build for Production

This command will send your code to Expo's cloud to build the binary.

```bash
eas build --platform ios
```

*   **First time?** EAS will ask to handle your credentials. Type `Y` to let Expo manage your Apple Distribution Certificate and Provisioning Profile.
*   **Wait**: The build can take 15–30 minutes depending on the queue.

---

## Step 4: Submit to App Store Connect

Once the build is finished, you can upload it directly from your terminal:

```bash
eas submit --platform ios
```

1.  Select the build you just created.
2.  EAS will ask for your Apple ID password (or an App-Specific Password).
3.  It will upload the build to **TestFlight**.

---

## Step 5: Finalize in App Store Connect

1.  Go to [App Store Connect](https://appstoreconnect.apple.com/).
2.  Select **My Apps** -> **FlowStash**.
3.  Fill in the required information:
    *   **Screenshots**: You'll need 6.5" and 5.5" iPhone screenshots.
    *   **Description & Keywords**.
    *   **Privacy Policy URL**: (Required for App Store).
4.  Select the build you uploaded via EAS.
5.  Click **Submit for Review**.

---

## Important Tips 💡

*   **Version Management**: Every time you submit a new build, you **must** increment the `version` (e.g., `1.0.1`) or the `ios.buildNumber` in `app.json`.
*   **Privacy Policy**: Apple requires a URL. You can host a simple markdown file on GitHub Pages or use a free privacy policy generator.
*   **Testing**: Always use **TestFlight** to test the production build on a real device before clicking "Submit for Review".
