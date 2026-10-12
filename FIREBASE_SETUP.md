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

## When You Forget the Credentials

You do not need to remember or store a Firebase CLI authorization code. It is temporary. Start a new login whenever needed:

```powershell
firebase login
```

If the browser login flow cannot open automatically, use the no-localhost flow and follow the URL shown in the terminal:

```powershell
firebase login --no-localhost
```

The public web configuration can be recovered from Firebase instead of memorized:

```powershell
firebase apps:list --project haru-master
firebase apps:sdkconfig WEB 1:122479863604:web:07b333ad499052bc9b2761 --project haru-master
```

For a lost admin password or app password, reset or revoke it at the provider. Never place the replacement password in this repository. For CI deployment, store it in the CI provider's encrypted secrets store, not in a file.

## Security Note

Never commit Firebase CLI authorization codes, OAuth tokens, passwords, service-account keys, or email app passwords. Login codes are temporary and must be entered directly in the terminal.