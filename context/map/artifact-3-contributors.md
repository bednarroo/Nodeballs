# Artifact 3: Contributors

## Scope

Git history contains one contributor in this clone:

| Commits | Contributor |
| ---: | --- |
| 41 | `Sebastian <sebastianwuczkowski@gmail.com>` |

This means the contributor map cannot distribute ownership across a team. Instead, it identifies which topic clusters would require historical context from the same author.

## Areas To Ask About

| Area | Why ask | Evidence |
| --- | --- | --- |
| Auth and per-user notes | Auth was added after the basic notes app and changed routing plus Firestore scoping. | Commits: `add auth firebase`, `add multiply users`, `beforeEach router`; files: `auth.js`, `notes.js`, `router/index.js`, `App.vue`. |
| Firestore note lifecycle | The app uses live `onSnapshot`, module-level unsubscribe state and user-scoped collection refs. | `src/stores/notes.js` changed 13 times. |
| Main note UI | Most churn is around card/list behavior, delete popup, sort and search. | `Card.vue` 16 changes, `Main.vue` 12, `PopUpDelete.vue` 8. |
| Routing and guarded pages | Access control is route-name based and depends on Pinia auth state being ready. | `src/router/index.js` changed 5 times; `beforeEach router` commit. |
| Firebase deployment/config | Firebase config and hosting files exist, but rules and deployment process are not documented. | `firebase.json`, `.firebaserc`, `src/js/firebase.js`. |

## Practical Reading Questions For Sebastian

- What behavior should happen during initial page load before Firebase Auth resolves?
- Is redirecting from `auth.init()` intentional, or should routing own all navigation decisions?
- Should notes store know about auth store, or should auth pass the user id into notes initialization?
- Are Firestore security rules deployed outside this repo?
- Is `Stats.vue` intended to become real functionality or is it a placeholder?
- Was `Documentation.vue` meant as product content or a temporary learning/demo page?

## Unknowns

- There is no PR, issue or code review context in this local clone.
- There is no evidence of current maintainers beyond Git author data.
- Because all commits are from March-April 2023, this does not prove who knows the project today.
