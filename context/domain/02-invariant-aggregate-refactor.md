---
title: "02 Invariant Aggregate Refactor"
created: "2026-07-10"
type: refactor-plan
---

# 02 Invariant Aggregate Refactor

Repozytorium: **Nodeballs**

## Regula #1

**Notatki moga byc ladowane i modyfikowane tylko w kontekscie konkretnego, zalogowanego uzytkownika.**

To jest najgrozniejszy niezmiennik, bo laczy bezpieczenstwo danych, wlasnosc notatek i poprawne dzialanie glownego przeplywu aplikacji. Jesli ta regula peknie, aplikacja moze probowac zapisac notatke bez kontekstu uzytkownika albo pod zla sciezka Firestore.

## Agregat

Proponowany agregat: **UserNotes / ZbiorNotatekUzytkownika**.

Granica agregatu:

- identity: `userId`;
- children: notatki uzytkownika;
- operacje: `load`, `add`, `edit`, `delete`, `sort/search` jako widoki nad zbiorem;
- infrastruktura: Firestore powinien byc szczegolem repozytorium/adaptera, nie jezykiem agregatu.

Obecny kod jest blisko tej granicy, ale jeszcze jej nie nazywa. `src/stores/notes.js` tworzy `collection(db, "users", userId, "notes")` (`src/stores/notes.js:31`), trzyma snapshot (`src/stores/notes.js:36-43`) i wykonuje CRUD (`src/stores/notes.js:50-64`). `src/stores/auth.js` nadal decyduje, kiedy zaczac i wyczyscic lifecycle notatek (`src/stores/auth.js:21`, `src/stores/auth.js:25`).

## Ocena na trzech osiach

| Os | Ocena | Uzasadnienie |
| --- | --- | --- |
| Rdzeniowosc | 5/5 | Bez tej reguly aplikacja traci sens: prywatne notatki musza nalezec do zalogowanego uzytkownika. |
| Rozsmarowanie | 4/5 | Regula dotyka `auth.js`, `notes.js`, routera, formularzy CRUD i testu lifecycle. Po L4 `notes.js` nie importuje juz auth, ale lifecycle nadal idzie przez auth callback. |
| Egzekwowanie | 3/5 | Jest jawny guard `notes.init(userId)` rzucajacy blad bez id i test na ten przypadek. Nadal brak guardow na `add/edit/delete` przed inicjalizacja oraz brak lokalnych reguł Firestore. |

Zgadzam sie z wyborem tej reguly jako #1. Wczesniej najostrzejszym objawem byl cykl `auth.js` <-> `notes.js`; po czesciowej implementacji L4 cykl zostal oslabiony, ale sam niezmiennik nadal jest najwazniejszy.

## Aktualny stan egzekwowania

Potwierdzone w kodzie:

- `src/stores/auth.js:21` przekazuje `user.uid` do `notes.init(user.uid)`.
- `src/stores/notes.js:26-31` wymaga `userId` i tworzy sciezke `users/{userId}/notes`.
- `tests/stores/auth-notes-lifecycle.spec.js` sprawdza start notatek po zalogowaniu, czyszczenie po braku uzytkownika, budowanie sciezki Firestore oraz blad bez `userId`.

Luki:

- `addNote`, `editNote` i `deleteNote` uzywaja `notesCollectionRef` (`src/stores/notes.js:53`, `src/stores/notes.js:57`, `src/stores/notes.js:60`), ale same nie sprawdzaja, czy store zostal zainicjalizowany.
- Router nadal czyta `auth.user.id` synchronicznie (`src/router/index.js:37`, `src/router/index.js:42`), bez jawnego stanu "auth ready".
- Brak `firestore.rules` w repo, wiec klientowa sciezka per-user nie dowodzi serwerowej izolacji.

## Docelowy refaktor

1. Nazwac granice `UserNotes` albo `UserNotesRepository` i schowac Firestore path za portem.
2. Przeniesc `notesCollectionRef` i `getOnSnapshot` z poziomu modulu do jawnego stanu/adaptera lifecycle.
3. Dodac jeden mechanizm `requireInitialized()` uzywany przez `addNote`, `editNote`, `deleteNote` i snapshot.
4. W kolejnym kroku dodac `auth.ready`, zanim router bedzie podejmowal decyzje o przekierowaniu.

## Minimalna weryfikacja

- `npm run test`
- `npm run build`
- `rg -n "useAuthStore|auth.user.id|notes.init|notesCollectionRef|firebase/" src tests`
