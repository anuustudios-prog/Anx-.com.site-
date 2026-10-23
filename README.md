# ANX Studio — Firebase starter

A multi-page HTML/CSS/Vanilla JS starter for a digital-services agency. Every HTML page links its own CSS file. JavaScript uses ES modules and Firebase Web SDK 10.14.1.

## Included
- Premium dark landing page and service category pages
- Firebase client registration/login and client-only order list
- Client project submission
- Admin sign-in using Firebase Auth plus an `admins/{uid}` role document
- Admin tool uploads to Firebase Storage and metadata in `my_tools`
- Cyber tools catalog
- Admin order list with editor assignment/status UI
- Firestore and Storage rules starter files

## Setup
1. Create a Firebase project and register a Web app.
2. Enable **Authentication → Email/Password** and create your admin accounts there.
3. Copy your web-app config into `assets/js/firebase-config.js`. The config is public app configuration; never put service-account credentials or private keys in browser code.
4. Create Firestore and Storage. Deploy `firestore.rules` and `storage.rules` from Firebase Console or Firebase CLI.
5. Create an admin role document with the Firebase Admin SDK (trusted environment only): `admins/{AUTH_UID}` with `{ role: "admin", email: "admin@example.com" }`. Do not allow browser clients to create admin role documents.
6. Serve the folder using a local web server (for example VS Code Live Server) or Firebase Hosting. ES modules usually do not work when opening pages directly as `file://`.
7. Test client registration, client order creation, admin tool uploads, and admin order assignment.

## Important security notes — do not skip
- **Do not store editor passwords in Firestore.** The requested schema with `{password: "123"}` and browser-side ID/password checks is not safe: credentials can be read from network requests, client code, or a permissive Firestore rule. This starter intentionally leaves editor sign-in and editor provisioning disabled instead of pretending that a client-side password check is secure.
- Production-ready editor flow: use a callable/HTTPS Firebase Cloud Function with the Firebase Admin SDK to provision Firebase Authentication users or issue custom tokens after validating editor credentials server-side. Store only editor profile metadata (editor ID, name, role, auth UID) in Firestore. Prefer Firebase Auth for editor sessions and role-based custom claims or server-controlled role docs.
- The editor dashboard was not included as an operational page because no secure editor identity/session can be established without the server-side flow. Add it after implementing the Cloud Function and enforce authorization in Firestore rules.
- Admin UI checks are only for navigation/UX. **Firestore and Storage rules are the actual security boundary.** Review and test rules with the Firebase Emulator Suite before production.
- `clientEmail` is included for the requested display/query pattern, but rules also bind each order to `clientUid`. Queries should be scoped to the current user. Do not rely on email alone as authorization.
- Public tool downloads are intentionally readable to all visitors in this starter. If paid products are planned, do not publish unrestricted Storage download URLs; implement purchase authorization and short-lived downloads.
- File extensions and browser `accept` filters are not security checks. Validate uploads server-side, scan files, and restrict executable uploads before real use.

## Data model notes
- `users/{uid}`: `{ uid, name, email, role: "client" }`
- `admins/{uid}`: `{ email, role: "admin" }`
- `editors/{editorId}`: metadata only; **no password field**
- `orders/{orderId}`: client identity, title/category/description/budget/status/assignment/delivery
- `my_tools/{toolId}`: name, description, price, imageUrl, downloadUrl, category, createdAt

Firebase may prompt you to create a composite index for queries that combine filters and ordering. Follow the index-creation link in the browser console.
