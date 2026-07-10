# Raport architektoniczny - modul 4, 10xArchitect

## 1. Opisane projekty

Wszystkie artefakty dotycza repozytorium **Nodeballs**. To mala aplikacja notatkowa Vue 3 + Vite z Pinia, Vue Router, Bulma, Firebase Auth i Firestore. Skala jest niewielka: kilkanascie plikow w `src`, glownie komponenty Vue, dwa store'y Pinia, router i integracja Firebase. Repo pojawia sie we wszystkich artefaktach: L2 (`context/map/repo-map.md`), L3 (`context/changes/auth-notes-lifecycle/research.md`), L4 (`context/changes/refactor-opportunities/plan.md`) i L5 (`context/domain/*.md`).

## 2. Mapa projektu z L2

Mapa wskazala centralny przeplyw: bootstrap aplikacji, auth, router, notes store i Firebase. Najwieksza strefa ryzyka to lifecycle auth + notes, bo logowanie, route guardy, przekierowania, user-scoped Firestore i subskrypcje live byly polaczone w jednej osi. Lokalnym centrum zmian jest workflow notatek: `Card.vue`, `Main.vue`, `PopUpDelete.vue` i `src/stores/notes.js`; mapa pokazuje czeste wspolzmiany `Card.vue + notes.js` oraz `notes.js + Main.vue`. Entry pointy do pierwszego dnia pracy to `src/main.js`, `src/App.vue`, `src/router/index.js`, `src/js/firebase.js`, `src/stores/auth.js` i `src/stores/notes.js`. Najwazniejsze unknowns z mapy to brak widocznych reguł Firestore, brak kontekstu produkcyjnego oraz brak pewnosci, czy `Stats.vue` i `Documentation.vue` sa realnymi funkcjami czy placeholderami.

## 3. Analiza ficzera z L3

Badany przeplyw to **auth notes lifecycle**, wybrany bezposrednio ze strefy ryzyka L2. Input przychodzi z Firebase Auth przez `onAuthStateChanged`; przy zalogowanym uzytkowniku store ustawia `auth.user`, przekierowuje na `/` i uruchamia notatki. Stan zmienia sie w Pinia oraz Firestore: `notes.js` subskrybuje `users/{uid}/notes`, a CRUD wykonuje zapisy przez Firestore. Do UI wraca lista notatek renderowana przez `Main.vue`, filtrowana po tytule i sortowana przez store.

Najwazniejszy dlug techniczny z L3 to historyczny cykl `auth.js` <-> `notes.js`, zbyt szeroka odpowiedzialnosc `auth.init()` oraz module-level `notesCollectionRef` / `getOnSnapshot`. Ast-grep potwierdzil m.in. uzycia `notes.init()`, `notes.cleanNotes()`, `doc(notesCollectionRef, ...)`, `onSnapshot(notesCollectionRef, ...)` oraz odczyty `auth.user.id`. Jedna luka pozostala potwierdzona przez `rg`, bo ast-grep nie zlapal SFC: `getItemById` jest dereferencjonowane od razu w widoku edycji.

## 4. Plan refaktoryzacji z L4

Wybrana opcja to **C1: zerwac cykl `auth.js` <-> `notes.js`**. Docelowy ksztalt: `auth.js` nadal moze byc callerem lifecycle, ale przekazuje `user.uid` jako jawne wejscie `notes.init(userId)`, a `notes.js` nie importuje `auth.js`. Tego refaktoru nie rozszerzamy na `auth.ready`, rewrite router guardow, usuniecie router injection, przebudowe Firestore ref ownership ani Firebase rules.

Fazy planu: najpierw charakterystyka zachowania przez testy lifecycle; potem parametryzacja `notes.init(userId)`; nastepnie guard na brak `userId`; na koncu review planu przed szerszymi zmianami. W aktualnym kodzie widac juz czesc realizacji L4: jest `npm run test`, test `tests/stores/auth-notes-lifecycle.spec.js`, `notes.init(user.uid)` w `auth.js` oraz guard `notes.init requires a user id` w `notes.js`. Weryfikacja przewidziana przez plan to `npm run test`, `npm run build` i grep/ast-grep importow oraz call site'ow.

## 5. Domena wg DDD z L5

Ubiquitous language: `Uzytkownik`, `Sesja logowania`, `Notatka`, `Zbior notatek uzytkownika`, `Priorytet`. Najwiekszy rozjazd model-vs-kod polega na tym, ze `Zbior notatek uzytkownika` jest dzis sciezka Firestore `users/{userId}/notes`, a nie nazwanym agregatem lub portem. `Priorytet` jest rozproszony miedzy stringami `"1"`, `"2"`, `"3"`, sortowaniem i klasami CSS. `Statystyki` oraz serwerowe reguly dostepu sa oznaczone w L5 jako **BRAK w kodzie**.

Niezmiennik #1: **notatki moga byc ladowane i modyfikowane tylko w kontekscie konkretnego, zalogowanego uzytkownika**. Agregat, do ktorego nalezy, to proponowany `UserNotes / ZbiorNotatekUzytkownika`. ACL dotyczy zaleznosci `firebase/*`: grep pokazuje ja w trzech warstwach lacznie z testami (`src/js/firebase.js`, `src/stores/*`, `tests/stores/*`) i w dwoch warstwach produkcyjnych (`src/js/firebase.js`, `src/stores/*`).

## 6. Decyzje, ktore naleza do mnie

AI pomoglo wskazac, ze najwiekszy problem nie jest w pojedynczym komponencie, tylko na granicy auth, notatek i Firebase. Ja akceptuje wybor C1 jako pierwszego kroku, bo jest najmniejszy i odwracalny, a jednoczesnie poprawia jezyk domeny: notatki dostaja jawny `userId`. Swiadomie nie rozszerzam tego samego kroku o `auth.ready` i router, bo to zmienialoby semantyke startu aplikacji. Jako kolejna decyzje zostawiam sobie wybor, czy najpierw wydzielic ACL dla Firebase, czy domknac guardy `add/edit/delete` dla niezainicjalizowanego `UserNotes`.
