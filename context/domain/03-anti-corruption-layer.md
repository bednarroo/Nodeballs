---
title: "03 Anti-Corruption Layer"
created: "2026-07-10"
type: refactor-plan
---

# 03 Anti-Corruption Layer

Repozytorium: **Nodeballs**

## Przeciekajaca zaleznosc

Zaleznosc do odseparowania: **Firebase SDK** (`firebase/app`, `firebase/auth`, `firebase/firestore`).

Dlaczego to ona: kod domenowo-aplikacyjny mowi o logowaniu i notatkach, ale sklepy Pinia operuja bezposrednio typami i funkcjami infrastruktury: `onAuthStateChanged` (`src/stores/auth.js:2`, `src/stores/auth.js:16`), `collection`, `onSnapshot`, `setDoc`, `deleteDoc`, `updateDoc` (`src/stores/notes.js:2`, `src/stores/notes.js:31`, `src/stores/notes.js:36`, `src/stores/notes.js:53`, `src/stores/notes.js:57`, `src/stores/notes.js:60`). To utrudnia nazwanie reguly "notatki zalogowanego uzytkownika" bez mowienia jezykiem Firebase.

## Wynik grep

Polecenie:

```sh
rg -n "from ['\"]firebase|firebase/|initializeApp|getFirestore|getAuth|onAuthStateChanged|collection\\(|onSnapshot\\(|setDoc\\(|deleteDoc\\(|updateDoc\\(" src tests package.json firebase.json
```

Wynik warstw:

| Warstwa | Pliki | Status |
| --- | --- | --- |
| Integracja runtime | `src/js/firebase.js:1-17` | Firebase inicjalizuje aplikacje, auth i db. |
| Store / application state | `src/stores/auth.js:2-3`, `src/stores/notes.js:2-3` | Firebase SDK przecieka do logiki lifecycle i CRUD. |
| Testy store | `tests/stores/auth-notes-lifecycle.spec.js` | Testy mockuja `firebase/auth` i `firebase/firestore`. |
| UI / views / router | brak bezposrednich importow `firebase/*` | UI korzysta ze store'ow, nie z SDK. |

Liczba warstw, w ktorych dzis zyje Firebase: **3**. Dla kodu produkcyjnego: **2** (`src/js/firebase.js` oraz `src/stores/*`).

## Kryterium sukcesu ACL

Po refaktorze grep po `firebase/` w `src` powinien zwracac tylko adaptery infrastruktury, np.:

- `src/js/firebase.js`;
- `src/infrastructure/firebaseAuthGateway.js`;
- `src/infrastructure/firebaseNotesRepository.js`.

Nie powinien zwracac:

- `src/stores/auth.js`;
- `src/stores/notes.js`;
- komponentow i widokow.

## Proponowany ACL

### Porty aplikacyjne

- `AuthGateway`
  - `onAuthStateChanged(callback)`
  - `register(email, password)`
  - `login(email, password)`
  - `logout()`

- `UserNotesRepository`
  - `subscribe(userId, callback)`
  - `add(userId, note)`
  - `delete(userId, noteId)`
  - `edit(userId, noteId, values)`

### Adaptery Firebase

Adaptery tlumacza Firebase na pojecia aplikacji:

- Firebase user -> `{ id, email }`;
- Firestore document -> `{ id, title, description, priority, date }`;
- `onSnapshot` unsubscribe -> zwykla funkcja `unsubscribe`;
- sciezka `users/{userId}/notes` -> szczegol wewnatrz `FirebaseUserNotesRepository`.

## Kolejnosc wdrozenia

1. Wydzielic `AuthGateway` bez zmiany zachowania `auth.js`.
2. Wydzielic `UserNotesRepository`, zaczynajac od `subscribe(userId, onNotes)`.
3. Przeniesc `setDoc/deleteDoc/updateDoc` za repository.
4. Zaktualizowac testy tak, aby mockowaly porty aplikacyjne, a nie bezposrednio `firebase/*`.

## Ryzyka

- ACL nie naprawia sam z siebie braku `auth.ready`; to oddzielny problem routingu.
- ACL nie zastepuje reguł Firestore po stronie serwera.
- Zbyt duzy jednorazowy refaktor moglby przykryc prosty sukces L4: jawne przekazywanie `userId` do notatek.
