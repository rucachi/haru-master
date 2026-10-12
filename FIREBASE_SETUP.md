# Firebase Setup

## Project

- Project ID: `haru-master`
- Firebase Console: https://console.firebase.google.com/project/haru-master/overview
- Web App ID: `1:122479863604:web:07b333ad499052bc9b2761`
- Auth domain: `haru-master.firebaseapp.com`
- Firestore rules file: `firestore.rules`
- Firebase CLI project alias: `.firebaserc`

The public web configuration, including the Firebase API key, is maintained in `js/firebase-config.js`. Do not duplicate or edit the key in other files.

## Firebase CLI

Firebase CLI is installed globally with npm. On this Windows machine, the executable is:

```powershell
$firebase = Join-Path $env:APPDATA 'npm\firebase.cmd'
```

The Node.js LTS installation is under `C:\Program Files\nodejs`.

## Deploy Rules

From the repository root:

```powershell
$env:Path = "$env:APPDATA\npm;C:\Program Files\nodejs;$env:Path"
firebase deploy --only firestore:rules
```

Anonymous Authentication must be enabled in Firebase Console. Problem and assignment writes require an authenticated user with the `admin: true` custom claim; student review records require authentication.

## Security Note

Never commit Firebase CLI authorization codes, OAuth tokens, passwords, service-account keys, or email app passwords. Login codes are temporary and must be entered directly in the terminal.