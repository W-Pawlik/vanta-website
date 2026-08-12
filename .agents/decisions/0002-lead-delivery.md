# ADR-0002 — Dostarczanie zgłoszeń z formularza

- **Status:** Accepted
- **Data:** 2026-08-11

## Kontekst

Formularz wyceny jest celem konwersji całej strony. Backend ma być minimalny — bez bazy danych,
panelu administracyjnego ani CMS-a. Zgłoszenie musi jednak trafić do studia i nie może zostać po cichu zgubione.

Na etapie szkieletu nie mamy jeszcze poświadczeń dostawcy e-mail ani decyzji o hostingu.

## Decyzja

Formularz obsługujemy **Server Action** (`src/server/lead/submit-lead.ts`), nie Route Handlerem.

Przepływ:

```
LeadForm (client)  →  submitLead (Server Action)  →  deliverLead()  →  LeadFormState
```

- Walidacja klienta służy wyłącznie UX. Server Action jest publicznym endpointem POST i waliduje **cały** payload
  ponownie tym samym schematem Zod (`src/lib/validation/lead.ts`).
- Efekt uboczny jest odizolowany za jedną funkcją: `deliverLead()` w `src/server/lead/lead-delivery.ts`,
  oznaczoną `server-only`. To jedyne miejsce, które wie, _jak_ zgłoszenie opuszcza aplikację.
- Dopóki `RESEND_API_KEY` i `LEAD_NOTIFICATION_EMAIL` nie są ustawione, zgłoszenia są logowane po stronie serwera.
  Brak konfiguracji jest **widoczny w logach**, a nie ukryty.
- Log zawiera skróconą postać zgłoszenia: bez treści wiadomości, z uciętym numerem telefonu.
- Stan formularza (`LeadFormState`) i komunikaty żyją w `lead-form-state.ts`, bo moduł `'use server'`
  może eksportować wyłącznie funkcje async.

## Konsekwencje

Dobre:

- Ścieżka sukcesu formularza jest w pełni testowalna bez żadnych poświadczeń.
- Podłączenie dostawcy e-mail to zmiana jednego pliku, bez dotykania komponentu ani akcji.
- Progressive enhancement: `<form action={...}>` działa również przed hydracją.
- Brak nowej zależności na etapie szkieletu.

Kosztowne:

- Do czasu wdrożenia dostawcy zgłoszenia istnieją tylko w logach. To stan tymczasowy i **blokuje wdrożenie produkcyjne**.
- Server Actions są identyfikowane action ID, które rotuje między deploymentami. Przy wdrożeniu produkcyjnym
  trzeba ustawić stabilny `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` i pokazać użytkownikowi ścieżkę ponowienia.

## Do zrobienia przed produkcją

1. Wybrać dostawcę e-mail i dopisać ADR-0004, jeżeli wybór padnie na coś innego niż Resend.
2. Zaimplementować wysyłkę w `deliverLead()`.
3. Dodać ochronę przed spamem (honeypot lub rate limiting po IP).
4. Ustawić `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` w środowisku wdrożeniowym.

## Rozważone alternatywy

**Route Handler + `fetch` z klienta.** Odrzucone: więcej kodu, brak progressive enhancement,
ręczna serializacja stanu błędów.

**Zewnętrzny serwis formularzy (Formspree i podobne).** Odrzucone: przenosi walidację i UX poza nasz kod,
a formularz jest tu najważniejszym elementem UX-owym i portfolio.

**Zapis do bazy.** Odrzucone: brief wyklucza bazę danych, a jedno powiadomienie e-mail w pełni pokrywa potrzebę.
