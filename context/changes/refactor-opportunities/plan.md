# Refactor Opportunities Plan

Selected option: **C1: break the `auth.js` <-> `notes.js` store cycle**.

Decision note: C1 is chosen over C4 first because it is the smallest reversible structural move. C4 is important, but it changes route timing semantics and should follow once the auth/notes dependency direction is cleaner.

## Goal

Change the notes lifecycle boundary so `notes.js` no longer imports `auth.js`.

Current shape:

- `auth.js` imports `notes.js` and calls `notes.init()` / `notes.cleanNotes()`.
- `notes.js` imports `auth.js` and reads `auth.user.id`.

Target shape for this plan:

- `auth.js` remains the current lifecycle caller for now.
- `auth.js` passes the authenticated user id into `notes.init(userId)`.
- `notes.js` receives identity as input and no longer imports `auth.js`.

This plan does **not** move redirects out of `auth.init()` yet and does **not** redesign auth readiness. Those are follow-up candidates from C2/C4.

## Scope

Files expected to change during implementation:

- `src/stores/auth.js`
- `src/stores/notes.js`
- test/config files if we add a minimal test harness
- `package.json` / `package-lock.json` only if the implementation phase chooses to add Vitest

Files intentionally out of scope:

- `src/router/index.js`
- `src/main.js`
- `src/App.vue`
- UI components
- Firebase deployment/rules files

## What We're Not Doing

- No auth-ready state yet.
- No router guard rewrite.
- No removal of router injection from Pinia.
- No Firestore ref ownership rewrite.
- No edit-flow loading/not-found redesign.
- No Firebase config or rules migration.

## Phase 1: Guard Current Behavior Before Refactor

Purpose: add a small safety net before touching the cycle.

Preferred implementation:

- Add a minimal store-level test harness with Vitest.
- Characterize the current auth-to-notes behavior:
  - Firebase user present sets `auth.user.id`.
  - Firebase user present starts notes loading.
  - Firebase user absent clears user.
  - Firebase user absent calls `notes.cleanNotes()`.
- Characterize the user-scoped Firestore path behavior:
  - notes initialization uses the selected user id to build `users/{uid}/notes`.

If adding a test harness is too large for the first implementation slice, fallback verification must include:

- `npm run build`
- `ast-grep` confirmation that `notes.js` still imports `auth.js` before Phase 2
- a short manual checklist documenting current login/logout notes lifecycle

Verification:

- `npm run build`
- New tests pass if a test harness is added
- No production behavior changes

Commit boundary:

- Commit 1: test harness / characterization only

## Phase 2: Parameterize Notes Initialization

Purpose: break the direct `notes.js -> auth.js` dependency without changing external behavior.

Implementation sketch:

- Change `notes.init()` to `notes.init(userId)`.
- In `auth.init()`, call `notes.init(user.uid)` after setting `this.user.id`.
- In `notes.js`, remove `useAuthStore` import.
- In `notes.init(userId)`, use the passed `userId` to build:
  - `collection(db, "users", userId, "notes")`
- Keep `notes.cleanNotes()`, `getNotes()`, CRUD methods and router redirects otherwise unchanged.

Guardrail:

- Do not introduce `auth.ready` in this phase.
- Do not move redirects out of `auth.init()`.
- Do not move `notesCollectionRef` into Pinia state yet.

Verification:

- `npm run build`
- Characterization tests from Phase 1 pass or are updated only where they asserted internal coupling rather than behavior
- `ast-grep` confirms `src/stores/notes.js` no longer imports `useAuthStore`
- `ast-grep` confirms `notes.init(...)` has an argument at the call site in `src/stores/auth.js`

Commit boundary:

- Commit 2: parameterize `notes.init(userId)` and remove reverse store import

## Phase 3: Minimal Failure Guard For Missing User Id

Purpose: make the new boundary explicit enough that future callers cannot silently initialize notes without identity.

Implementation sketch:

- Add a small guard at the start of `notes.init(userId)`.
- Preferred behavior for this small app: fail loudly in development and avoid creating a Firestore path with an empty/undefined id.
- Exact behavior should be chosen during implementation after checking existing UI flows:
  - either throw an explicit error,
  - or return early and leave notes unloaded.

Verification:

- `npm run build`
- Tests cover missing/empty `userId` if test harness exists
- Manual review confirms no current caller passes an empty id

Commit boundary:

- Commit 3: explicit missing-user-id boundary guard

## Phase 4: Plan Review Before Implementation

Before implementing Phase 1, review this plan against four properties:

- Characterization before touching lifecycle code.
- Each phase is independently revertible.
- Each phase has automatic verification.
- Mechanism lands before broader enforcement.

Known residual risks:

- Without a real test harness, build-only verification cannot prove Firebase runtime behavior.
- Firebase Auth and Firestore behavior are mocked/indirect in any unit-level test.
- C4/C2 timing risk remains after C1 and should be planned separately.

## Handoff

Implementation command for the next step:

```text
/10x-implement refactor-opportunities phase 1
```

In this environment, the manual equivalent is: implement Phase 1 only, verify it, and stop before Phase 2 unless explicitly continued.

