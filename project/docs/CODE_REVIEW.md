# CODE_REVIEW.md

Tento dokument je určený pre vývojára ktorý manuálne zasahuje do codebase. Prečítaj pred každou zmenou.

---

## Citlivé miesta — kde si dať pozor

### `frontend/components/SubPage.jsx`
- **ERROR dedulikácia** — logovanie na BE sa posiela cez `errorSentRef`. Ak ho odstrániš alebo presunieš, log sa bude posielať pri každom keystroke.
- **`hasError` stav** riadi farbu tlačidiel aj disabled stav — nemeň podmienku bez otestovania oboch stavov.
- Komponent je zdieľaný pre všetky 3 podstránky — akákoľvek zmena sa prejaví všade.

### `frontend/lib/GlobalContext.jsx`
- Polling každých 5 sekúnd má `clearInterval` v cleanup funkcii `useEffect`. Ak pridáš ďalší `useEffect` s intervalom, nezabudni na cleanup — inak memory leak.
- Optimistický update UI — pri `updateSettings` sa stav zmení okamžite, až potom ide request na BE. Ak BE zlyhá, robí sa rollback cez `fetchSettings()`. Tento pattern zachovaj.

### `frontend/app/globals.css`
- Všetky farby sú CSS premenné v `:root`. Nikdy nepoužívaj hardcoded hex hodnoty mimo `:root` bloku.
- Trieda `btn-error` musí mať `!important` na color/background/border — inak ju prepíšu varianty (primary, secondary, ghost).
- Animácie (`errorPulse`, `inputShake`, `tableReveal`, `fadeIn`) sú referencované priamo v JSX cez `className` — ak ich premenujete v CSS, musíte zmeniť aj JSX.

### `backend/db/database.js`
- `better-sqlite3` je **synchrónna** knižnica — nepoužívaj `async/await` pri DB volaniach, rozbije to.
- DB súbor sa vytvára automaticky pri `initDB()`. Ak zmeníš `DB_PATH`, over že adresár existuje pred prvým volaním.

### `backend/routes/logs.js` a `global.js`
- Všetky SQL príkazy musia byť cez `db.prepare()` — nikdy string interpolácia (`WHERE id = ${id}` je SQL injection).
- `global_settings` má vždy práve **1 riadok** (`id=1`). Nemazať, neInsertovať ďalší.

---

## Časté zmeny a ako ich urobiť správne

### Pridať novú podstránku
1. Vytvor `frontend/app/pageN/page.jsx` — skopíruj z `page1/page.jsx`, zmeň `pageName` a `accent`
2. Pridaj záznam do poľa `links` v `frontend/components/Nav.jsx`
3. Nič iné meniť netreba

### Zmeniť dáta v tabuľke
- Ukážkové dáta sú v `SAMPLE_DATA` poli v `SubPage.jsx`
- Pre dynamické dáta: pridaj GET endpoint na BE, fetchni v `SubPage.jsx` cez `useEffect`

### Pridať nový globálny toggle
1. `backend/db/database.js` — pridaj stĺpec do `global_settings` tabuľky
2. `backend/routes/global.js` — zahrň nový stĺpec v GET aj PATCH
3. `frontend/lib/GlobalContext.jsx` — pridaj do `settings` stavu a `updateSettings`
4. `frontend/app/page.jsx` — pridaj toggle row na Dashboarde
5. `frontend/components/SubPage.jsx` — použi nové nastavenie

### Zmeniť farby / dizajn
- Edituj iba CSS premenné v `:root` bloku v `globals.css`
- Fonty: zmeň `<link>` v `app/layout.jsx` aj CSS premenné `--font-display` / `--font-mono`

---

## Čo nerobiť

- Nefetchovať `/api/global` priamo v podstránkach — vždy cez `useGlobal()` hook
- Nepridávať `localStorage` — nastavenia patria do DB, nie do browsera
- Nepoužívať `<form>` elementy — len `onClick`/`onChange` handlery
- Neodstraňovať `clearInterval` z `GlobalContext.jsx`
- Nezapísať SQL cez string interpoláciu
