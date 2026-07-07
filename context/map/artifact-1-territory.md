# Artifact 1: Territory

## Scope

- Repository: Nodeballs / "To do list - Composition API"
- Stack visible from `package.json`: Vue 3, Vite, Pinia, Vue Router, Firebase, Bulma.
- Git history window available in this clone: 2023-03-20 to 2023-04-25, 41 commits.
- Last 12 months from current date have no commits in this clone, so this artifact uses all available history.
- Contributor data: one human author, `Sebastian <sebastianwuczkowski@gmail.com>`.

## Top Changed Files

Generated from:

```sh
git log --name-only --pretty=format: -- . ':!node_modules' ':!package-lock.json'
```

| Count | File | Initial interpretation |
| ---: | --- | --- |
| 16 | `src/components/Card.vue` | Main note display/edit/delete entry from list UI. |
| 13 | `src/stores/notes.js` | Core notes data store and Firestore operations. |
| 12 | `src/views/Main.vue` | Main screen that composes list, search, order, add form and delete popup. |
| 8 | `src/components/PopUpDelete.vue` | Delete confirmation flow. |
| 8 | `src/components/Navbar.vue` | Navigation and logout/auth-aware UI. |
| 8 | `src/App.vue` | Root shell; initializes auth. |
| 5 | `src/router/index.js` | Route table and auth guard. |
| 5 | `src/main.js` | App bootstrap and router injection into stores. |
| 4 | `src/components/EditElementForm.vue` | Edit/delete note flow from edit page. |
| 4 | `src/components/AddElementForm.vue` | Add note flow. |

## Active Areas

| Area | Count | Interpretation |
| --- | ---: | --- |
| `src/components` | 69 | Most work happened in UI components around notes, forms, navigation and delete confirmation. |
| `src/views` | 22 | Page-level composition, especially the main notes page. |
| `src/stores` | 15 | Pinia state and Firebase-backed note/auth operations. |
| `src/router` | 5 | Auth guard and route-level access control. |
| `src/js` | 2 | Firebase initialization; low commit count but high sensitivity. |

## Co-Change Signals

Generated from commit-level file pair counts.

| Count | Pair | Interpretation |
| ---: | --- | --- |
| 8 | `src/components/Card.vue` + `src/stores/notes.js` | Note display/actions evolved with note persistence/state. |
| 6 | `src/stores/notes.js` + `src/views/Main.vue` | Main page and data store form the central user flow. |
| 6 | `src/components/Card.vue` + `src/views/Main.vue` | List composition and card display changed together. |
| 4 | `src/components/Navbar.vue` + `src/stores/notes.js` | Navigation/auth behavior likely influenced notes lifecycle. |
| 4 | `src/components/Card.vue` + `src/components/EditElementForm.vue` | Read/list and edit flow stayed coupled. |
| 4 | `src/App.vue` + `src/main.js` | Bootstrap and app shell changed together. |
| 2 | `src/stores/auth.js` + `src/stores/notes.js` | Auth and note stores are coupled in history and imports. |

## Risk Hints From History

- The notes flow is the center of the app: `Main.vue`, `Card.vue`, `AddElementForm.vue`, `EditElementForm.vue`, `PopUpDelete.vue`, `Order.vue`, `Search.vue`, `stores/notes.js`.
- Auth was introduced late in the history (`add auth firebase`, `add multiply users`, `beforeEach router`) and touches app bootstrap, router guard and Firestore user scoping.
- `src/js/firebase.js` changed only twice, but it contains runtime config and initializes both Auth and Firestore, so it is sensitive despite low churn.
- `package.json` changed 7 times, including dependency additions; build/dependency changes may affect Firebase/Vite output.

## Unknowns

- There are no commits in the last 12 months, so "currently active" cannot be inferred from Git history.
- This repo has a short one-month development burst, not a long-running multi-team legacy history.
- Co-change counts do not prove architectural dependency; they are hints for where to inspect structure.
- Git history does not include PR discussion, issues or production incidents.
