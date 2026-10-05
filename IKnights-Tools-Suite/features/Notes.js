/*
 * IKnights Tools Suite - Notes
 *
 * Based on LuperNotes v1.0
 * Original author: HoRRis Lupercal
 * Original creation assistance: Google Gemini
 *
 * Suite integration and modifications: IKnights
 *
 * Original LuperNotes functionality adapted to operate as a native
 * IKnights Tools Suite sidebar feature.
 */

(function () {
    "use strict";


    // =========================================================================
    // LOAD GUARD
    // =========================================================================

    if (window.__IKTOOLS_NOTES_LOADED__) {
        return;
    }

    window.__IKTOOLS_NOTES_LOADED__ = true;


    // =========================================================================
    // CORE CHECK
    // =========================================================================

    if (
        !window.IKTools ||
        typeof window.IKTools.registerSidebarTab !== "function"
    ) {
        console.error(
            "IKnights Notes could not load because IKnights Tools Core is missing."
        );

        return;
    }


    const IKTools =
        window.IKTools;


    const {
        loadJSON,
        saveJSON
    } = IKTools.util;


    // =========================================================================
    // STORAGE
    // =========================================================================

    const STORAGE = {
        GLOBAL:
            "ikNotes.global.v1",

        TOWN_PREFIX:
            "ikNotes.town.v1."
    };


    // =========================================================================
    // STATE
    // =========================================================================

    let currentLoadedTown =
        null;

    let isGlobalMode =
        false;

    let notesRoot =
        null;

    let titleLabel =
        null;

    let displayDiv =
        null;

    let textarea =
        null;

    let modeAction =
        null;

    let editAction =
        null;

    let notesPollingStarted =
        false;


    // =========================================================================
    // TOWN DETECTION
    // =========================================================================

    const TOWN_SELECTORS = [
        "#ddlTowns",
        'select[name="towns"]',
        "#townSelect",
        "#currentTown",
        ".town-select",
        "#ddlTown"
    ];


    function getTownSelectEl() {
        for (
            const selector of
            TOWN_SELECTORS
        ) {
            const element =
                document.querySelector(
                    selector
                );


            if (element) {
                return element;
            }
        }


        return null;
    }


    function cleanTownName(
        rawName
    ) {
        if (!rawName) {
            return "";
        }


        return String(
            rawName
        )
            .replace(
                /[\(\[\{]\s*Capital\s*[\)\]\}]/gi,
                ""
            )
            .replace(
                /^(Capital)\s*[-:]?\s*/gi,
                ""
            )
            .replace(
                /\s*-\s*.*$/,
                ""
            )
            .replace(
                /^[\s-:]+|[\s-:]+$/g,
                ""
            )
            .trim() ||
            String(
                rawName
            );
    }


    function getActiveTownId() {
        try {
            if (
                window.Illyriad &&
                window.Illyriad.Town &&
                window.Illyriad.Town.CurrentTownID
            ) {
                return String(
                    window.Illyriad.Town.CurrentTownID
                );
            }

        } catch (
            error
        ) {}


        if (
            window.currentTownId
        ) {
            return String(
                window.currentTownId
            );
        }


        if (
            window.townId
        ) {
            return String(
                window.townId
            );
        }


        const townSelect =
            getTownSelectEl();


        if (townSelect) {
            if (
                townSelect.tagName ===
                    "SELECT" &&
                townSelect.value
            ) {
                return String(
                    townSelect.value
                );
            }


            if (
                townSelect.textContent &&
                townSelect.textContent.trim()
            ) {
                return townSelect
                    .textContent
                    .trim();
            }
        }


        const selectedOption =
            document.querySelector(
                "select option:checked"
            );


        if (
            selectedOption &&
            selectedOption.value
        ) {
            return String(
                selectedOption.value
            );
        }


        return "default_city";
    }


    function getActiveTownName() {
        let rawName =
            "";


        try {
            if (
                window.Illyriad &&
                window.Illyriad.Town &&
                window.Illyriad.Town.CurrentTownName
            ) {
                rawName =
                    window.Illyriad.Town.CurrentTownName;
            }

        } catch (
            error
        ) {}


        if (!rawName) {
            const townSelect =
                getTownSelectEl();


            if (townSelect) {
                if (
                    townSelect.tagName ===
                        "SELECT" &&
                    townSelect.selectedIndex >=
                        0 &&
                    townSelect.options[
                        townSelect.selectedIndex
                    ]
                ) {
                    rawName =
                        townSelect.options[
                            townSelect.selectedIndex
                        ].text.trim();

                } else if (
                    townSelect.textContent
                ) {
                    rawName =
                        townSelect
                            .textContent
                            .trim();
                }
            }
        }


        if (!rawName) {
            const selectedOption =
                document.querySelector(
                    "select option:checked"
                );


            if (
                selectedOption &&
                selectedOption.text
            ) {
                rawName =
                    selectedOption.text.trim();
            }
        }


        return cleanTownName(
            rawName ||
            getActiveTownId()
        );
    }


    // =========================================================================
    // STORAGE HELPERS
    // =========================================================================

    function getStorageKey() {
        if (
            isGlobalMode
        ) {
            return STORAGE.GLOBAL;
        }


        return (
            STORAGE.TOWN_PREFIX +
            getActiveTownId()
        );
    }


    function loadCurrentNote() {
        return loadJSON(
            getStorageKey(),
            ""
        ) || "";
    }


    function saveCurrentNote(
        text
    ) {
        saveJSON(
            getStorageKey(),
            String(
                text || ""
            )
        );
    }


    // =========================================================================
    // TEXT SAFETY
    // =========================================================================

    function escapeHTML(
        value
    ) {
        return String(
            value || ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }


    function parseHexColor(
        text,
        tagRegex
    ) {
        if (!text) {
            return null;
        }


        const match =
            String(
                text
            ).match(
                tagRegex
            );


        if (
            !match ||
            !match[1]
        ) {
            return null;
        }


        const rawHex =
            match[1]
                .trim();


        if (
            !/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
                .test(
                    rawHex
                )
        ) {
            return null;
        }


        return rawHex.startsWith(
            "#"
        )
            ? rawHex
            : "#" + rawHex;
    }


    // =========================================================================
    // OPTIONAL USER THEME TAGS
    //
    // IMPORTANT:
    //
    // No custom colors are applied by default.
    // The normal interface inherits Illyriad.
    //
    // These overrides happen ONLY when the user explicitly includes
    // the corresponding tag in their note.
    // =========================================================================

    function clearThemeOverrides() {
        if (!notesRoot) {
            return;
        }


        [
            notesRoot,
            titleLabel,
            displayDiv,
            textarea,
            modeAction,
            editAction
        ]
            .filter(
                Boolean
            )
            .forEach(
                element => {
                    element.style.removeProperty(
                        "color"
                    );

                    element.style.removeProperty(
                        "background-color"
                    );

                    element.style.removeProperty(
                        "border-color"
                    );
                }
            );


        notesRoot.style.removeProperty(
            "border"
        );

        titleLabel?.style.removeProperty(
            "background-color"
        );

        displayDiv?.style.removeProperty(
            "border"
        );

        textarea?.style.removeProperty(
            "border"
        );

        modeAction?.style.removeProperty(
            "border"
        );

        editAction?.style.removeProperty(
            "border"
        );
    }


    function applyCustomUITheme(
        text
    ) {
        if (!notesRoot) {
            return;
        }


        clearThemeOverrides();


        const textColour =
            parseHexColor(
                text,
                /!TextColour\(([^)]+)\)/i
            );


        const uiTextColour =
            parseHexColor(
                text,
                /!UITextColour\(([^)]+)\)/i
            );


        const uiButtonColour =
            parseHexColor(
                text,
                /!UIButtonColour\(([^)]+)\)/i
            );


        const uiBodyColour =
            parseHexColor(
                text,
                /!UIBodyColour\(([^)]+)\)/i
            );


        const uiBorderColour =
            parseHexColor(
                text,
                /!UIBorderColour\(([^)]+)\)/i
            );


        const uiHeaderColour =
            parseHexColor(
                text,
                /!UIHeaderColour\(([^)]+)\)/i
            );


        if (
            textColour
        ) {
            displayDiv?.style.setProperty(
                "color",
                textColour,
                "important"
            );

            textarea?.style.setProperty(
                "color",
                textColour,
                "important"
            );
        }


        if (
            uiTextColour
        ) {
            titleLabel?.style.setProperty(
                "color",
                uiTextColour,
                "important"
            );

            modeAction?.style.setProperty(
                "color",
                uiTextColour,
                "important"
            );

            editAction?.style.setProperty(
                "color",
                uiTextColour,
                "important"
            );
        }


        if (
            uiButtonColour
        ) {
            modeAction?.style.setProperty(
                "background-color",
                uiButtonColour,
                "important"
            );

            editAction?.style.setProperty(
                "background-color",
                uiButtonColour,
                "important"
            );
        }


        if (
            uiBodyColour
        ) {
            displayDiv?.style.setProperty(
                "background-color",
                uiBodyColour,
                "important"
            );

            textarea?.style.setProperty(
                "background-color",
                uiBodyColour,
                "important"
            );
        }


        if (
            uiHeaderColour
        ) {
            titleLabel?.style.setProperty(
                "background-color",
                uiHeaderColour,
                "important"
            );
        }


        if (
            uiBorderColour
        ) {
            notesRoot.style.setProperty(
                "border",
                `1px solid ${uiBorderColour}`,
                "important"
            );

            displayDiv?.style.setProperty(
                "border",
                `1px solid ${uiBorderColour}`,
                "important"
            );

            textarea?.style.setProperty(
                "border",
                `1px solid ${uiBorderColour}`,
                "important"
            );

            modeAction?.style.setProperty(
                "border",
                `1px solid ${uiBorderColour}`,
                "important"
            );

            editAction?.style.setProperty(
                "border",
                `1px solid ${uiBorderColour}`,
                "important"
            );
        }
    }


    // =========================================================================
    // NOTE RENDERER
    // =========================================================================

    function stripThemeTags(
        text
    ) {
        return String(
            text || ""
        )
            .replace(
                /!TextColour\(([^)]+)\)/gi,
                ""
            )
            .replace(
                /!UITextColour\(([^)]+)\)/gi,
                ""
            )
            .replace(
                /!UIButtonColour\(([^)]+)\)/gi,
                ""
            )
            .replace(
                /!UIBodyColour\(([^)]+)\)/gi,
                ""
            )
            .replace(
                /!UIBorderColour\(([^)]+)\)/gi,
                ""
            )
            .replace(
                /!UIHeaderColour\(([^)]+)\)/gi,
                ""
            );
    }


    function normalizeLinkHref(
        href
    ) {
        let result =
            String(
                href || ""
            ).trim();


        if (!result) {
            return "#";
        }


        if (
            result.startsWith(
                "/"
            )
        ) {
            return result;
        }


        if (
            /^https?:\/\//i.test(
                result
            )
        ) {
            return result;
        }


        if (
            /^www\./i.test(
                result
            )
        ) {
            return (
                "https://" +
                result
            );
        }


        /*
         * Anything else becomes a normal HTTPS destination.
         * This prevents javascript: and similar schemes from executing.
         */
        return (
            "https://" +
            result
        );
    }


    function renderClickableText(
        text
    ) {
        const sourceText =
            String(
                text || ""
            );


        if (
            !sourceText.trim()
        ) {
            const emptyLabel =
                isGlobalMode
                    ? "No global notes yet."
                    : "No city notes yet.";


            return (
                "<em>" +
                escapeHTML(
                    emptyLabel +
                    " Select Edit to add notes."
                ) +
                "</em>"
            );
        }


        const cleanText =
            stripThemeTags(
                sourceText
            );


        let processed =
            escapeHTML(
                cleanText
            );


        /*
         * Markdown:
         *
         * [Label](URL)
         * [Label](URL){#hex}
         *
         * Bare:
         *
         * https://...
         * http://...
         * www....
         */
        const linkRegex =
            /\[([^\]]+)\]\(([^)]+)\)(?:\{([^}]+)\})?|((?:https?:\/\/|www\.)[^\s<]+)/gi;


        processed =
            processed.replace(
                linkRegex,

                function (
                    match,
                    label,
                    markdownUrl,
                    hexColor,
                    bareUrl
                ) {
                    let href =
                        "";

                    let displayText =
                        "";

                    let linkColour =
                        null;


                    if (
                        label &&
                        markdownUrl
                    ) {
                        href =
                            normalizeLinkHref(
                                markdownUrl
                            );

                        displayText =
                            label;


                        if (
                            hexColor
                        ) {
                            const cleanedHex =
                                hexColor.trim();


                            if (
                                /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
                                    .test(
                                        cleanedHex
                                    )
                            ) {
                                linkColour =
                                    cleanedHex.startsWith(
                                        "#"
                                    )
                                        ? cleanedHex
                                        : "#" +
                                            cleanedHex;
                            }
                        }

                    } else if (
                        bareUrl
                    ) {
                        href =
                            normalizeLinkHref(
                                bareUrl
                            );

                        displayText =
                            bareUrl;

                    } else {
                        return match;
                    }


                    const colourStyle =
                        linkColour
                            ? ` style="color:${linkColour};"`
                            : "";


                    return (
                        `<a href="${href}" target="_top"${colourStyle}>` +
                        displayText +
                        "</a>"
                    );
                }
            );


        /*
         * <fs(14)>Text</fs>
         * <fs(1.2em)>Text</fs>
         */
        processed =
            processed.replace(
                /&lt;fs\(([^)]+)\)&gt;/gi,

                function (
                    match,
                    size
                ) {
                    let cleanSize =
                        size
                            .trim()
                            .replace(
                                /[^a-zA-Z0-9.%]/g,
                                ""
                            );


                    if (
                        /^\d+(\.\d+)?$/
                            .test(
                                cleanSize
                            )
                    ) {
                        cleanSize +=
                            "px";
                    }


                    if (
                        !cleanSize
                    ) {
                        return "";
                    }


                    return (
                        `<span style="font-size:${cleanSize};">`
                    );
                }
            );


        processed =
            processed.replace(
                /&lt;\/fs(?:\([^)]+\))?&gt;/gi,
                "</span>"
            );


        /*
         * Allow only the formatting tags that LuperNotes supported.
         */
        processed =
            processed.replace(
                /&lt;(\/?[bui])&gt;/gi,
                "<$1>"
            );


        return processed;
    }


    // =========================================================================
    // DISPLAY
    // =========================================================================

    function getExpectedTitle() {
        if (
            isGlobalMode
        ) {
            return "Global Notes";
        }


        return (
            "City Notes (" +
            getActiveTownName() +
            ")"
        );
    }


    function updateTitle() {
        if (!titleLabel) {
            return;
        }


        titleLabel.textContent =
            getExpectedTitle();
    }


    function updateModeAction() {
        if (!modeAction) {
            return;
        }


        modeAction.textContent =
            isGlobalMode
                ? "City"
                : "Global";
    }


    function updatePlaceholder() {
        if (!textarea) {
            return;
        }


        textarea.placeholder =
            isGlobalMode
                ? "No global notes yet."
                : "No city notes yet.";
    }


    function updateNotesDisplay() {
        if (
            !displayDiv
        ) {
            return;
        }


        const savedText =
            loadCurrentNote();


        displayDiv.innerHTML =
            renderClickableText(
                savedText
            );


        applyCustomUITheme(
            savedText
        );


        updateTitle();

        updateModeAction();

        updatePlaceholder();
    }


    // =========================================================================
    // EDITING
    // =========================================================================

    function isEditing() {
        return (
            textarea &&
            textarea.style.display ===
                "block"
        );
    }


    function enterEditMode() {
        if (
            !textarea ||
            !displayDiv ||
            !editAction
        ) {
            return;
        }


        textarea.value =
            loadCurrentNote();


        displayDiv.style.display =
            "none";


        textarea.style.display =
            "block";


        editAction.textContent =
            "Done";


        applyCustomUITheme(
            textarea.value
        );


        textarea.focus();
    }


    function leaveEditMode() {
        if (
            !textarea ||
            !displayDiv ||
            !editAction
        ) {
            return;
        }


        saveCurrentNote(
            textarea.value
        );


        textarea.style.display =
            "none";


        displayDiv.style.display =
            "block";


        editAction.textContent =
            "Edit";


        updateNotesDisplay();
    }


    function toggleEditMode() {
        if (
            isEditing()
        ) {
            leaveEditMode();

        } else {
            enterEditMode();
        }
    }


    // =========================================================================
    // CITY / GLOBAL MODE
    // =========================================================================

    function toggleNotesMode() {
        /*
         * Input already autosaves, but save again here
         * so switching modes can never lose the current text.
         */
        if (
            isEditing()
        ) {
            saveCurrentNote(
                textarea.value
            );
        }


        isGlobalMode =
            !isGlobalMode;


        currentLoadedTown =
            getActiveTownId();


        const newText =
            loadCurrentNote();


        if (
            textarea
        ) {
            textarea.value =
                newText;
        }


        updateNotesDisplay();


        if (
            isEditing()
        ) {
            displayDiv.style.display =
                "none";

            textarea.style.display =
                "block";

            editAction.textContent =
                "Done";

            applyCustomUITheme(
                newText
            );
        }
    }


    // =========================================================================
    // TOWN CHANGE SYNC
    // =========================================================================

    function checkAndSyncTownNotes() {
        const activeTownId =
            getActiveTownId();


        if (
            activeTownId !==
            currentLoadedTown
        ) {
            currentLoadedTown =
                activeTownId;


            if (
                !isGlobalMode
            ) {
                const savedText =
                    loadCurrentNote();


                if (
                    textarea &&
                    isEditing()
                ) {
                    textarea.value =
                        savedText;
                }


                updateNotesDisplay();
            }
        }


        updateTitle();
    }


    function startTownPolling() {
        if (
            notesPollingStarted
        ) {
            return;
        }


        notesPollingStarted =
            true;


        setInterval(
            checkAndSyncTownNotes,
            500
        );
    }


    // =========================================================================
    // STYLES
    //
    // LAYOUT ONLY.
    //
    // There are deliberately NO default custom colors, fake backgrounds,
    // custom borders or replacement fonts here.
    //
    // Illyriad remains responsible for the visual appearance.
    // =========================================================================

    function injectNotesStyles() {
        if (
            document.querySelector(
                "#ikNotesStyles"
            )
        ) {
            return;
        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "ikNotesStyles";


        style.textContent = `

            #ikNotesRoot {
                width:
                    100%;

                height:
                    100%;

                display:
                    flex;

                flex-direction:
                    column;

                box-sizing:
                    border-box;

                overflow:
                    hidden;

                padding:
                    1px;
            }


            #ikNotesTitle {
                flex:
                    0 0 auto;

                text-align:
                    center;

                box-sizing:
                    border-box;

                padding:
                    2px;

                overflow:
                    hidden;

                white-space:
                    nowrap;

                text-overflow:
                    ellipsis;
            }


            #ikNotesDisplay,
            #ikNotesTextarea {
                flex:
                    1 1 0;

                width:
                    100%;

                min-height:
                    0;

                box-sizing:
                    border-box;

                padding:
                    4px;
            }


            #ikNotesDisplay {
                overflow-y:
                    auto;

                white-space:
                    pre-wrap;

                word-break:
                    break-word;
            }


            #ikNotesTextarea {
                display:
                    none;

                resize:
                    none;
            }


            #ikNotesFooter {
                flex:
                    0 0 auto;

                display:
                    flex;

                justify-content:
                    center;

                align-items:
                    center;

                gap:
                    6px;

                box-sizing:
                    border-box;

                padding:
                    2px;
            }


            #ikNotesFooter .ik-notes-action {
                cursor:
                    pointer;
            }

        `;


        document.head.appendChild(
            style
        );
    }


    // =========================================================================
    // UI CONSTRUCTION
    // =========================================================================

    function createActionLink(
        text
    ) {
        const action =
            document.createElement(
                "a"
            );


        action.href =
            "#";


        action.className =
            "ik-notes-action";


        action.textContent =
            text;


        return action;
    }


    function mountNotes(
        panel
    ) {
        injectNotesStyles();


        panel.innerHTML =
            "";


        notesRoot =
            document.createElement(
                "div"
            );


        notesRoot.id =
            "ikNotesRoot";


        // ---------------------------------------------------------------------
        // TITLE
        // ---------------------------------------------------------------------

        titleLabel =
            document.createElement(
                "div"
            );


        titleLabel.id =
            "ikNotesTitle";


        notesRoot.appendChild(
            titleLabel
        );


        // ---------------------------------------------------------------------
        // DISPLAY
        // ---------------------------------------------------------------------

        displayDiv =
            document.createElement(
                "div"
            );


        displayDiv.id =
            "ikNotesDisplay";


        notesRoot.appendChild(
            displayDiv
        );


        // ---------------------------------------------------------------------
        // TEXTAREA
        // ---------------------------------------------------------------------

        textarea =
            document.createElement(
                "textarea"
            );


        textarea.id =
            "ikNotesTextarea";


        textarea.spellcheck =
            true;


        notesRoot.appendChild(
            textarea
        );


        // ---------------------------------------------------------------------
        // FOOTER
        // ---------------------------------------------------------------------

        const footer =
            document.createElement(
                "div"
            );


        footer.id =
            "ikNotesFooter";


        modeAction =
            createActionLink(
                "Global"
            );


        editAction =
            createActionLink(
                "Edit"
            );


        const separator =
            document.createElement(
                "span"
            );


        separator.textContent =
            "|";


        footer.append(
            modeAction,
            separator,
            editAction
        );


        notesRoot.appendChild(
            footer
        );


        panel.appendChild(
            notesRoot
        );


        // ---------------------------------------------------------------------
        // EVENTS
        // ---------------------------------------------------------------------

        modeAction.addEventListener(
            "click",

            event => {
                event.preventDefault();

                toggleNotesMode();
            }
        );


        editAction.addEventListener(
            "click",

            event => {
                event.preventDefault();

                toggleEditMode();
            }
        );


        textarea.addEventListener(
            "input",

            () => {
                saveCurrentNote(
                    textarea.value
                );


                applyCustomUITheme(
                    textarea.value
                );
            }
        );


        // ---------------------------------------------------------------------
        // INITIAL STATE
        // ---------------------------------------------------------------------

        currentLoadedTown =
            getActiveTownId();


        textarea.value =
            loadCurrentNote();


        updateNotesDisplay();


        startTownPolling();
    }


    // =========================================================================
    // TAB SHOW
    // =========================================================================

    function onNotesShown() {
        checkAndSyncTownNotes();


        if (
            !isEditing()
        ) {
            updateNotesDisplay();
        }
    }


    // =========================================================================
    // REGISTER WITH IKNIGHTS TOOLS SUITE
    // =========================================================================

    IKTools.registerSidebarTab({
        id:
            "notes",

        name:
            "Notes",

        order:
            20,

        mount:
            mountNotes,

        onShow:
            onNotesShown
    });


    console.log(
        "IKnights Notes module loaded."
    );

})();
