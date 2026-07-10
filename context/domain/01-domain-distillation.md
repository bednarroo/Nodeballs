---
title: "01 Domain Distillation"
created: "2026-07-10"
type: domain-distillation
---

# 01 Domain Distillation

Repozytorium: **Nodeballs**  
Stan analizy: kod po czesciowej realizacji planu L4, gdzie `notes.init(userId)` przyjmuje jawny identyfikator uzytkownika.

## Cel domeny

Nodeballs jest mala aplikacja do prywatnych notatek. Rdzeniowy przeplyw to: uzytkownik loguje sie, aplikacja otwiera jego kolekcje notatek w Firestore, notatki sa wyswietlane na liscie, a uzytkownik moze je dodawac, edytowac, usuwac, wyszukiwac i sortowac.

## Ubiquitous Language

| Pojecie | Znaczenie domenowe | Reprezentacja w kodzie | Status |
| --- | --- | --- | --- |
| Uzytkownik | Wlasciciel prywatnego zbioru notatek. | `auth.user.id`, `auth.user.email`; Firebase Auth w `src/stores/auth.js:16-21`. | OBECNE, ale model zredukowany do obiektu technicznego. |
| Sesja logowania | Warunek dostepu do aplikacji i punkt startu/stopu notatek. | `onAuthStateChanged` w `src/stores/auth.js:16`, guard w `src/router/index.js:34-48`. | OBECNE, silnie techniczne. |
| Notatka | Glowny obiekt pracy: tytul, opis, priorytet, data, id. | `notes.notes[]` w `src/stores/notes.js:13-17`, zapis w `src/stores/notes.js:50-64`. | OBECNE. |
| Zbior notatek uzytkownika | Wszystkie notatki nalezace do jednego uzytkownika. | `collection(db, "users", userId, "notes")` w `src/stores/notes.js:31`. | OBECNE, ale jako sciezka infrastruktury. |
| Priorytet | Klasyfikacja waznosci notatki: high/medium/low. | Sortowanie po priorytecie w `src/stores/notes.js:69-70`; formularz uzywa wartosci `"1"`, `"2"`, `"3"`. | OBECNE, ale bez nazwanego typu. |
| Wyszukiwanie | Filtrowanie listy po tytule. | `Search.vue` + computed filter w `Main.vue`. | OBECNE. |
| Sortowanie | Zmiana kolejnosci listy wedlug tytulu, priorytetu albo daty. | `Order.vue`, `notes.sortNote(methodOfOrder)`. | OBECNE, ale sortowanie mutuje tablice w miejscu. |
| Potwierdzenie usuniecia | Ochrona przed przypadkowym skasowaniem notatki. | `PopUpDelete.vue`, event z `Card.vue`. | OBECNE. |
| Statystyki | Planowana analiza notatek. | `Stats.vue` pokazuje tylko "Work in progress"; `Documentation.vue` wspomina Chart.js jako przyszlosc. | BRAK w kodzie domenowym. |
| Reguly dostepu po stronie serwera | Gwarancja, ze uzytkownik czyta tylko swoje notatki. | Brak `firestore.rules`; repo pokazuje tylko klienta i `firebase.json` dla hostingu. | BRAK w kodzie. |

Liczba pojec z adnotacja **"BRAK w kodzie"**: **2**.

## Rozjazdy model-vs-kod

1. **"Zbior notatek uzytkownika" jest sciezka Firestore, nie pojeciem domenowym.** Kod wie, ze dane leza w `users/{userId}/notes` (`src/stores/notes.js:31`), ale nie ma osobnego modelu/portu, ktory nazwalby ta granice jako prywatny zbior notatek.

2. **"Priorytet" nie jest typem domenowym.** Store sortuje po wartosciach liczbowych zapisanych jako stringi (`src/stores/notes.js:69-70`), a karta mapuje `1/2/3` na klasy CSS. To dziala, ale znaczenie priorytetu jest rozrzucone.

3. **"Sesja logowania" steruje zbyt wieloma rzeczami.** `auth.init()` obserwuje Firebase Auth (`src/stores/auth.js:16`), ustawia uzytkownika (`src/stores/auth.js:18-19`), nawiguje (`src/stores/auth.js:20`, `src/stores/auth.js:24`) i uruchamia/czysci notatki (`src/stores/auth.js:21`, `src/stores/auth.js:25`). Domena mowi "uzytkownik ma swoje notatki"; kod mowi "callback Firebase orkiestruje aplikacje".

4. **"Notatka istnieje" jest zalozeniem UI.** `Edit.vue` i `EditElementForm.vue` od razu uzywaja `notes.getItemById(...)` (`src/views/Edit.vue:28`, `src/components/EditElementForm.vue:61`); brak stanu "notatka jeszcze sie laduje" albo "notatka nie istnieje".

5. **"Statystyki" sa obietnica produktu, nie funkcja.** Trasa i widok istnieja, ale domenowo nie ma agregacji, metryk ani danych statystycznych.

## Co mnie zaskoczylo

Najwiekszy rozjazd to nie brak funkcji, tylko to, ze najwazniejsze pojecie domenowe - prywatny zbior notatek uzytkownika - jest obecnie zapisane jako szczegol Firestore. Po L4 najgorszy cykl `notes -> auth` zostal juz usuniety, ale kod nadal nie ma czystej nazwy dla granicy "notatki nalezace do tego uzytkownika".
