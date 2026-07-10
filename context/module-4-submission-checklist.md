# Module 4 Submission Checklist

Repozytorium: **Nodeballs**

## Artefakty z lekcji

| Lekcja | Artefakt | Status |
| --- | --- | --- |
| L2 | `context/map/repo-map.md` | GOTOWE |
| L3 | `context/changes/auth-notes-lifecycle/research.md` | GOTOWE |
| L4 | `context/changes/refactor-opportunities/plan.md` | GOTOWE |
| L5 | `context/domain/01-domain-distillation.md` | GOTOWE |
| L5 | `context/domain/02-invariant-aggregate-refactor.md` | GOTOWE |
| L5 | `context/domain/03-anti-corruption-layer.md` | GOTOWE |
| Domkniecie | `context/architect-report.md` | GOTOWE DO FORMULARZA |

## Co wkleic do formularza

Glowny dokument do formularza certyfikacyjnego:

```text
context/architect-report.md
```

Dokument opiera sie na artefaktach z `context/map/`, `context/changes/` i `context/domain/`. Wszystkie wejscia pochodza z jednego repozytorium: Nodeballs.

## Decyzje i braki jawnie opisane

- Raport opisuje, ze czesc planu L4 jest juz widoczna w kodzie: `notes.init(userId)`, test lifecycle i guard na brak `userId`.
- L5 oznacza jako **BRAK w kodzie**: statystyki oraz serwerowe reguly dostepu Firestore.
- ACL wskazuje przeciekajaca zaleznosc `firebase/*` i liczy jej wystepowanie w warstwach.
- Opcjonalny event-storming canvas nie zostal uruchomiony, bo zadanie jest oznaczone jako opcjonalne.

## Weryfikacja

Ostatnio uruchomione:

```sh
npm run test
npm run build
```

Wynik:

- `npm run test`: 1 plik testowy, 4 testy przechodza.
- `npm run build`: build przechodzi.
- Build pokazuje ostrzezenie Vite o chunku wiekszym niz 500 kB; to ostrzezenie bylo potraktowane jako znane ryzyko, nie blokada raportu.

## Stan do kolejnej pracy

Najbardziej naturalny nastepny krok techniczny po module:

1. Domknac guardy `addNote`, `editNote`, `deleteNote` przed uzyciem niezainicjalizowanego `notesCollectionRef`.
2. Dodac `auth.ready` i poprawic route guardy, zeby nie decyzjonowaly przed rozstrzygnieciem Firebase Auth.
3. Wydzielic ACL dla Firebase: `AuthGateway` i `UserNotesRepository`.
