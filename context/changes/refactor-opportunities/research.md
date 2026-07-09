---
change_id: refactor-opportunities
source_change: auth-notes-lifecycle
created: 2026-07-09
last_updated: 2026-07-09
verification_commit: pending
tags:
  - refactor-opportunities
  - research
  - verified
---

# Refactor Opportunities Research

This research builds on `context/changes/auth-notes-lifecycle/research.md` and `context/map/repo-map.md`. It treats the prior report as collected evidence and answers: which structural problems are worth changing, toward what target shape, and in what order.

No production code was changed during this exploration.

## Candidate Classification

| ID | Problem from prior report | Classification | Rationale |
| --- | --- | --- | --- |
| C1 | Direct `auth.js` <-> `notes.js` store cycle | Candidate | Fixing it changes store boundaries and dependency direction. |
| C2 | `auth.init()` mixes auth observation, navigation and notes lifecycle | Candidate | Fixing it changes responsibility placement and lifecycle orchestration. |
| C3 | Module-level `notesCollectionRef` / `getOnSnapshot`; CRUD depends on prior init | Candidate | Fixing it changes notes store state/ref ownership and readiness contract. |
| C4 | Router guard reads `auth.user.id` synchronously before Firebase Auth is known ready | Candidate | Fixing it changes auth state model and route guard behavior. |
| C5 | Edit flow assumes note data is already loaded | Candidate | Fixing it changes UI/data readiness handling around edit route. |
| C6 | Router is injected into every store through a Pinia plugin | Candidate, secondary | Fixing it changes hidden store dependency on bootstrap wiring. |
| N1 | Missing local tests and test script | Non-candidate input | This is not a structural refactor by itself, but it drives sequencing and risk. |
| N2 | Firebase config is hard-coded and Firestore rules are absent from repo | Split: config candidate, rules unknown/non-candidate | Env/config hygiene may be code/config work; rules ownership is unknown and may live outside this repo. |

## Candidate Details

### C1: Direct `auth.js` <-> `notes.js` Store Cycle

Current shape:

- Evidence: `src/stores/auth.js:4` imports `useNotesStore`.
- Evidence: `src/stores/notes.js:4` imports `useAuthStore`.
- Evidence: `src/stores/auth.js:21` calls `notes.init()` and `src/stores/auth.js:25` calls `notes.cleanNotes()`.
- Evidence: `src/stores/notes.js:28` gets the auth store and `src/stores/notes.js:29` reads `auth.user.id`.
- Inference: auth owns note subscription timing, while notes discovers identity by reaching back into auth. This is a real bidirectional store dependency, not only a conceptual coupling.

Intentionality:

- Evidence: commit `7b580aa` (`2023-04-23`, `add auth firebase`) introduced auth but not the notes cycle.
- Evidence: commit `d983be0` (`2023-04-25`, `add multiply users`) added both `useNotesStore` in auth and `useAuthStore` in notes.
- Verdict: accidental complexity on top of a conscious product decision. Per-user notes were intentional; the cycle appears to be the quickest way to connect auth state to existing notes behavior.

Feasibility:

- Target shape: explicit identity input at the notes boundary, starting with `notes.init(userId)`.
- Incremental path: parameterize `notes.init(userId)`, have auth pass `user.uid`, then remove `useAuthStore` from `notes.js`.
- First prerequisite: characterization around current login/logout -> notes init/cleanup behavior, or at minimum a build-verified small change because no tests exist.
- Blast radius: `src/stores/auth.js`, `src/stores/notes.js`, and UI assumptions around loaded notes.

### C2: `auth.init()` Mixes Auth, Router and Notes Lifecycle

Current shape:

- Evidence: `src/stores/auth.js:14` defines `init()`.
- Evidence: `src/stores/auth.js:16` registers `onAuthStateChanged`.
- Evidence: the same callback mutates user state at `src/stores/auth.js:18` and `src/stores/auth.js:19`, redirects at `src/stores/auth.js:20` and `src/stores/auth.js:24`, starts notes at `src/stores/auth.js:21`, and cleans notes at `src/stores/auth.js:25`.
- Evidence: `src/App.vue:21` starts this from `onMounted`.
- Inference: `auth.init()` is currently an auth observer, navigation controller and data lifecycle coordinator.

Intentionality:

- Evidence: `7b580aa` introduced `onAuthStateChanged` and redirects inside `auth.init()`.
- Evidence: `d983be0` extended that same callback with notes lifecycle calls.
- Verdict: conscious limitation / foundational shortcut. In a small app, one central auth callback was likely chosen deliberately, but its responsibility breadth now amplifies risk.

Feasibility:

- Target shape: auth store tracks auth state and readiness; router handles route access; note lifecycle is called through an explicit coordinator or a clearer boundary.
- Incremental path: first add explicit `auth.ready` / `isAuthReady` without moving behavior; later move redirects to router and notes lifecycle coordination out of the auth callback.
- First prerequisite: characterize current redirect behavior and logged-in/logged-out transitions.
- Blast radius: `src/stores/auth.js`, `src/router/index.js`, `src/App.vue`, `src/main.js`, and notes lifecycle calls.

### C3: Module-Level Firestore Refs and CRUD Depend on Init

Current shape:

- Evidence: `src/stores/notes.js:8` defines module-level `notesCollectionRef`.
- Evidence: `src/stores/notes.js:9` defines module-level `getOnSnapshot`.
- Evidence: `src/stores/notes.js:31` assigns `notesCollectionRef`.
- Evidence: `src/stores/notes.js:36` assigns `getOnSnapshot` from `onSnapshot(...)`.
- Evidence: CRUD calls use `notesCollectionRef` at `src/stores/notes.js:53`, `src/stores/notes.js:57` and `src/stores/notes.js:60`.
- Inference: public note mutations are implicitly ordered after `notes.init()`, but the API does not expose or enforce that readiness contract.

Intentionality:

- Evidence: `6b8bbdf` (`2023-04-21`, `add loader`) introduced Firestore snapshot loading around a module-level collection ref.
- Evidence: `d983be0` changed a global collection ref into mutable `let notesCollectionRef` for per-user paths and added `getOnSnapshot`.
- Verdict: accidental complexity. This looks like earlier global Firestore structure adapted to per-user storage.

Feasibility:

- Target shape: notes store owns its collection/subscription readiness explicitly.
- Incremental path: add an initialized/readiness state or helper such as `noteDocRef(id)`, then move collection/subscription ownership into the store instance.
- First prerequisite: guard or characterize current behavior when CRUD is called before init.
- Blast radius: mostly `src/stores/notes.js`, with add/edit/delete callers in `AddElementForm.vue`, `EditElementForm.vue` and `PopUpDelete.vue`.

### C4: Router Guard Auth Timing

Current shape:

- Evidence: `src/router/index.js:7` imports `useAuthStore`.
- Evidence: `src/router/index.js:34` registers a global guard.
- Evidence: `src/router/index.js:37` redirects unauthenticated users based on `!auth.user.id`.
- Evidence: `src/router/index.js:42` blocks logged-in users from the login route based on `auth.user.id`.
- Evidence: Firebase auth state arrives asynchronously through `src/stores/auth.js:16`, and `auth.init()` starts from `src/App.vue:21`.
- Inference: initial navigation can be decided before Firebase Auth has settled because there is no explicit "auth pending" state.
- Unknown: exact runtime impact depends on browser persistence and Firebase callback timing.

Intentionality:

- Evidence: `65707b0` (`2023-04-11`) used `beforeEach` only for document title behavior.
- Evidence: `8677509` (`2023-04-25`, `beforeEach router`) added access control by reading current `auth.user.id`.
- Verdict: accidental complexity. No commit or doc shows an auth-ready model or intentional pending-state trade-off.

Feasibility:

- Target shape: route guard uses explicit auth readiness.
- Incremental path: add `auth.ready` and make guard wait/avoid premature redirect while pending; then remove redirect side effects from `auth.init()`.
- First prerequisite: introduce auth readiness while preserving current behavior.
- Blast radius: `src/stores/auth.js`, `src/router/index.js`, `src/App.vue`.

### C5: Edit Flow Assumes Note Data Is Loaded

Current shape:

- Evidence: `src/stores/notes.js:21` defines `getItemById` as `state.notes.find(...)`, which can return `undefined`.
- Evidence: `src/views/Edit.vue:28` immediately dereferences `.title` from `notes.getItemById(routeParam.value)`.
- Evidence: `src/components/EditElementForm.vue:61` immediately spreads `notes.getItemById(props.id)`.
- Inference: invalid ids or navigation before Firestore snapshot completion can fail in setup.

Intentionality:

- Evidence: `c8eeb20` (`2023-04-04`, `EditNote function in Pinia`) introduced edit against local Pinia notes.
- Evidence: `033952f` (`2023-04-21`, `add loader`) moved toward Firestore while preserving immediate local lookup.
- Evidence: `d983be0` moved notes loading behind auth while preserving the same assumption.
- Verdict: accidental complexity. The assumption was adequate for local/in-memory state but became fragile after async Firestore/auth.

Feasibility:

- Target shape: explicit loading/not-found UI state for edit.
- Incremental path: guard `oldTitle` and form initialization; show loading or not-found before dereferencing.
- First prerequisite: characterize current edit behavior for valid loaded note, invalid id and note-not-yet-loaded.
- Blast radius: `src/views/Edit.vue`, `src/components/EditElementForm.vue`, and possibly `notes.getItemById`.

### C6: Hidden Router Injection Into Stores

Current shape:

- Evidence: `src/main.js:8` assigns `store.router = markRaw(router)` for every Pinia store.
- Evidence: `src/stores/auth.js:20` and `src/stores/auth.js:24` rely on `this.router`.
- Inference: auth has a hidden dependency on bootstrap plugin order. Only auth appears to use this contract.

Intentionality:

- Evidence: `7b580aa` added `markRaw(router)` injection in the same commit that created auth redirects from store actions.
- Verdict: conscious foundational shortcut. It intentionally allowed store actions to navigate.

Feasibility:

- Target shape: navigation lives in router/callers, or auth imports an explicit navigation dependency.
- Incremental path: handle this as part of C2 rather than standalone; moving redirects out of `auth.init()` naturally removes the hidden dependency.
- First prerequisite: document or test current redirect behavior.
- Blast radius: low file count, but behavior-sensitive.

### N1: Missing Tests

- Evidence: `package.json:5` has `dev`, `build`, `preview`, `lint` and `format`, but no `test` script.
- Evidence: `package.json:22` has no Vitest/Jest/Cypress/Playwright/testing-library dependency.
- Evidence: local test/spec search found no project tests outside `node_modules`.
- Evidence: `src/views/Documentation.vue` lists unit tests as future work.
- Classification: non-candidate input and risk multiplier.

### N2: Firebase Config and Rules Gap

- Evidence: `src/js/firebase.js:6` hard-codes Firebase client config.
- Evidence: `firebase.json:1` only configures hosting.
- Evidence: no local `firestore.rules`, `storage.rules`, `database.rules` or `*.rules` files were found.
- Verdict: config externalization may be a small config hygiene candidate; Firestore rules are security/ops ownership unknown.
- Classification: not a top refactor opportunity for this codebase without confirming deployment ownership.

## Refactor Opportunities

### Ranked

1. **C1: Break the `auth`/`notes` Store Cycle**

   Current -> target shape: bidirectional store dependency -> explicit identity input at the notes boundary (`notes.init(userId)`), with notes no longer importing auth.

   Why this ranks first: it removes accidental complexity introduced during per-user notes, has a narrow initial diff, and unlocks cleaner work on auth readiness and notes lifecycle. The cost of change is moderate and reversible; the cost of leaving it is continuing hidden lifecycle coupling between auth and persistence.

   Blast radius: `src/stores/auth.js`, `src/stores/notes.js`, and UI assumptions around initialized notes.

   Incremental path: add a characterization/smoke check for login/logout lifecycle, change `notes.init()` to accept `userId`, call it from auth with `user.uid`, remove `useAuthStore` from `notes.js`, keep behavior otherwise unchanged.

   First prerequisite: a guard/test around current auth callback starting and cleaning notes, or at minimum a build-verified small commit because no test harness exists yet.

2. **C4 + Part of C2: Add Explicit Auth Readiness Before Changing Routing**

   Current -> target shape: route guard reads `auth.user.id` synchronously -> route guard consults explicit auth readiness and user state.

   Why this ranks second: it addresses the highest behavior risk from the prior report: redirecting before Firebase Auth has resolved. It is connected to `auth.init()` responsibility breadth, but can start with a smaller state-model change before moving redirects.

   Blast radius: `src/stores/auth.js`, `src/router/index.js`, `src/App.vue`, and redirect behavior in `auth.init()`.

   Incremental path: introduce `auth.ready` while preserving current redirect behavior, update guard to respect pending auth state, then decide in planning whether to move redirects out of `auth.init()`.

   First prerequisite: characterize current unauthenticated, authenticated and pending-auth route behavior.

3. **C3: Localize Notes Firestore Ref and Subscription Readiness**

   Current -> target shape: module-level mutable Firestore refs -> notes store owns collection/subscription readiness explicitly.

   Why this ranks third: it reduces hidden ordering requirements and clarifies CRUD failure modes. It is valuable, but safer after C1 makes the notes store receive identity explicitly.

   Blast radius: mostly `src/stores/notes.js`, with add/edit/delete callers that currently assume init has completed.

   Incremental path: add readiness/initialized state or a `noteDocRef(id)` helper, guard CRUD before init, then move collection/subscription ownership into store-local state.

   First prerequisite: characterize current `addNote`, `editNote`, `deleteNote` behavior after initialization and define expected behavior before initialization.

### Considered and Rejected / Deferred

- **C5 edit flow readiness**: real accidental complexity, but narrower than the lifecycle boundary. Treat as a quick hardening candidate or prerequisite after the main lifecycle decision, not the top refactor.
- **C6 router injection**: real hidden dependency, but it is best removed as part of the C2 routing/auth split rather than as a standalone change.
- **N1 missing tests**: not a structural refactor, but every selected option should start with characterization where feasible.
- **N2 Firebase config/rules**: important, but Firestore rules ownership is unknown and likely outside this repo; config externalization is deployment hygiene rather than the strongest code refactor.

## Verification Baseline

- `npm run build` passes.
- Build warning: Vite reports a chunk larger than 500 kB after minification.
- No local test script, test dependencies, project test files or CI config were found.

## Weryfikacja twierdzeń (ast-grep)

Structural claims behind the ranking were checked with `npx -p @ast-grep/cli ast-grep`. When a query returned zero, `rg` was used to distinguish a true absence from a bad matcher or unsupported file type.

| Twierdzenie | Werdykt | Dowód | Metoda |
| --- | --- | --- | --- |
| `auth.js` imports `notes.js` once. | Potwierdzone | `src/stores/auth.js:4` | `ast-grep`: `import { useNotesStore } from '@/stores/notes.js'` |
| `notes.js` imports `auth.js`; router also imports auth. | Doprecyzowane | `src/stores/notes.js:4`, `src/router/index.js:7` | `ast-grep`: `import { useAuthStore } from "@/stores/auth.js"` |
| `notes.init()` is called once and from `auth.init()`. | Potwierdzone | `src/stores/auth.js:21` | `ast-grep`: `$NOTES.init()` |
| `notes.cleanNotes()` is called once and from `auth.init()`. | Potwierdzone | `src/stores/auth.js:25` | `ast-grep`: `$NOTES.cleanNotes()` |
| Ranking claim: route/user scoping depends on `auth.user.id`. | Potwierdzone: 3 structural reads | `src/router/index.js:37`, `src/router/index.js:42`, `src/stores/notes.js:29` | `ast-grep`: `auth.user.id` |
| `notesCollectionRef` is module-level mutable state. | Potwierdzone | `src/stores/notes.js:8` | `ast-grep`: `let notesCollectionRef` |
| `getOnSnapshot` is module-level mutable state. | Potwierdzone | `src/stores/notes.js:9` | `ast-grep`: `let getOnSnapshot` |
| Firestore note mutations use `notesCollectionRef`. | Potwierdzone: 3 mutation doc refs | `src/stores/notes.js:53`, `src/stores/notes.js:57`, `src/stores/notes.js:60` | `ast-grep`: `doc(notesCollectionRef, $$$A)` |
| Router is injected into stores via Pinia plugin. | Potwierdzone | `src/main.js:9` | `ast-grep`: `store.router = markRaw(router)` |
| Edit flow calls `getItemById` immediately in Vue SFC setup. | Potwierdzone przez `rg` po zerze ast-grep | `src/views/Edit.vue:28`, `src/components/EditElementForm.vue:61`; getter at `src/stores/notes.js:21` | `ast-grep`: `notes.getItemById($ID)` returned zero; `ast-grep -l vue` unsupported; `rg -n "getItemById" src` confirmed occurrences |
| No local test/spec files support the selected refactors. | Potwierdzone | No project files found outside dependencies | `rg`/file search for test/spec patterns; `package.json` has no `test` script |

No verification result changed the ranking. The `getItemById` claim is the only case where `ast-grep` could not match the Vue SFC script usage; it remains confirmed by text search and should be treated as a tooling limitation, not an absence of evidence.
