# HoRRis integration

Compared on October 28, 2026:

- IKnights: [80b2e9802950fbad3cceacb763e0a7906689109d](https://github.com/lKnights/Illyriad-Userscripts/tree/80b2e9802950fbad3cceacb763e0a7906689109d/IKnights-Tools-Suite).
- HoRRis: [77a2dcfcd0da52b89f59034ae8651ace99dd7d63](https://github.com/HoRRis-Lupercal/LuperScripts_BETAs/tree/77a2dcfcd0da52b89f59034ae8651ace99dd7d63/Illyriad-Tools-Suite).

## Comparison and decisions

| Area | Strongest implementation / decision |
| --- | --- |
| Core | Retain IKnights. Its sidebar registration API and separate Notes/Customizer modules support extensions without editing Core. HoRRis embeds Notes and its styling in Core, and uses a fixed sidebar. |
| Notes | Retain IKnights. It already has global/town notes, legacy plain-text storage migration, escaped rich-text rendering and validated formatting/color/link handling. HoRRis's legacy keys are already supported. No replacement or storage deletion. |
| Customizer | Retain IKnights's theme registry, apply/remove hooks, independent interface/city choices, custom CSS and native reset. Import HoRRis's dark interface rules/artwork variables as an interface theme through that API. |
| Quartermaster | No functional differences: the files differ only in the opening name comment. Keep the original unchanged, including protection, weighted distribution, presets, sharing and geometry. |
| Loading | Retain the manifest instead of HoRRis's fixed userscript `@require` list. Add explicit ordered dependencies, validation, timeouts, per-module load status and failure isolation. |
| Native UI | Keep Core's native button CSS discovery, measurement, fallback skin and sidebar geometry. Import dark-mode artwork and CKEditor panel support as opt-in theme behavior. Native appearance remains the default. |
| New modules | Import Catalogue data and searchable item/gear/unit catalogue. Extract sovereignty imbalance warnings into UI Tweaks. Keep zero-city-value highlighting class-based and active only under the dark theme. |
| LuperCalc | Excluded deliberately: upstream puts it in `Depreciated`, does not load it, and uses sample unit/army/equipment datasets. It is not a verified game calculator. |

## Changes

- Bootstrap 0.14.0 still downloads Core first, then manifest modules in order, then initializes the suite. No HoRRis repository is needed at runtime.
- `requires` lists earlier module IDs. Missing/later dependencies and duplicate IDs invalidate the manifest before execution. A disabled or failed dependency skips its consumers; unrelated modules continue. Core or manifest failure aborts startup. Every fetch, including body reading, has a 20-second abort timeout.
- `window.IKToolsLoadStatus` reports loaded, disabled, failed and skipped modules. A boot guard prevents duplicate starts. Module paths cannot escape the suite using root or protocol-relative URLs.
- Catalogue keeps HoRRis's datasets, sprite sheets, filtering, native popups and saved geometry/settings. It can fall back to copying a reference when the native popup API is missing or fails. Tooltip copy captures the selected item before awaiting the clipboard, reports clipboard failure accurately, and only closes the popup for that same item.
- Luper Dark registers after Customizer. It includes native interface textures, button/icon replacements, Herald and popup styling, and CKEditor iframe styles. It uses scoped CSS variables rather than persistent inline variables. Theme removal disconnects its observer, clears scheduled work and removes iframe styles/classes. Iframe processing is debounced and avoids replacing unchanged styles.
- An existing Customizer preference wins. If there is no Customizer setting, HoRRis's saved `darkMode: true` migrates to Luper Dark. Original settings remain intact. The incomplete upstream `Custom` palette is not imported; Customizer's existing custom CSS remains available.
- UI Tweaks imports the saved sovereignty preference on first use. It fixes parsing of IV/IIII, works with the native theme, and removes warning classes when disabled without erasing native inline colors.
- No city-map artwork is replaced and no city theme is selected by the import. Sovereignty warnings are an independent page utility.
- HoRRis's copyright notices and license are retained. The root README's incorrect MIT claim now points to the actual non-commercial licenses.

## Validation

From this directory, `npm test` runs nine tests using Node's built-in test runner. They exercise real module registration, legacy preference migration and precedence, native reset, Notes town/global migration and escaping, 251 Quartermaster capacity allocations, sovereignty numeral parsing/cleanup, network/evaluation failure isolation, path/dependency validation, disabled modules and Core failure.

`npm install` followed by `npm run test:browser` runs an optional Playwright test against installed Chrome using a local game-like fixture. It checks rendered theme activation/native reset, CKEditor iframe cleanup, Catalogue search and denied-clipboard fallback. External requests are blocked in that test. These checks do not establish live-game compatibility.

## Follow-up checks

1. In a logged-in Illyriad session, verify Tools/Notes/Friends sidebar layout, town switching while editing Notes, and Quartermaster presets, protection, quantities and caravan capacity. Check trade input population without sending resources during verification.
2. Select Luper Dark in Customizer; check dialogs, chat, Herald, navigation icons, CKEditor menus/fullscreen and Notes-specific colors. Toggle native/reset and reload. Check that the city map retains its original artwork.
3. Open Catalogue, search each category, open native item/unit popups, copy references, and verify geometry restoration and clipboard-denied behavior on HTTP as well as HTTPS if HTTP is still used.
4. Verify sovereignty headers and zero resource values across town changes. Actual game markup and asynchronous updates may differ from the fixture.
5. Review the external Imgur artwork for continued availability, suitability and redistribution rights before vendoring it. URLs are retained from HoRRis; asset downloads and dimensions were not verified here. Native Illyriad sprites also remain externally hosted.
6. Review Catalogue dataset accuracy/completeness against the live game; importing the supplied records does not independently validate their contents. Complete LuperCalc's real datasets and calculations before considering it for release.

Installation/update URLs continue to reference IKnights's `main` branch. A local checkout or review branch alone does not deploy the change to installed userscripts; the reviewed changes must reach `main` before users update to 0.14.0.
