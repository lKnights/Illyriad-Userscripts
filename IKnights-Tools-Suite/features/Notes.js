/*
 * IKnights Tools Suite - Notes
 *
 * Based on LuperNotes v1.0
 * Original author: HoRRis Lupercal
 * Original creation assistance: Google Gemini
 *
 * Suite integration and modifications: IKnights
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


    /*
     * HoRRis's integrated version used these keys.
     *
     * We recognize them so notes created with that version
     * are automatically brought into the modular version.
     */
    const LEGACY_STORAGE = {
        GLOBAL:
            "ikNotes_global",

        TOWN_PREFIX:
            "ikNotes_"
    };


    // =========================================================================
    // STATE
    // =========================================================================

    let notesGlobalMode =
        false;

    let currentNotesTown =
        null;

    let notesSyncInterval =
        null;

    let notesPanel =
        null;

    let notesHeader =
        null;

    let titleLabel =
        null;

    let displayDiv =
        null;

    let textarea =
        null;

    let globalButton =
        null;

    let editButton =
        null;


    // =========================================================================
    // TOWN DETECTION
    // =========================================================================

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


        const element =
            document.querySelector(
                "#ddlTowns, " +
                'select[name="towns"], ' +
                "#townSelect, " +
                "#currentTown, " +
                ".town-select, " +
                "#ddlTown"
            );


        if (
            element &&
            element.tagName ===
                "SELECT" &&
            element.value
        ) {
            return String(
                element.value
            );
        }


        if (
            element &&
            element.textContent
        ) {
            return element
                .textContent
                .trim();
        }


        const option =
            document.querySelector(
                "select option:checked"
            );


        return (
            option &&
            option.value
        )
            ? String(
                option.value
            )
            : "default_city";
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
            const element =
                document.querySelector(
                    "#ddlTowns, " +
                    'select[name="towns"], ' +
                    "#townSelect, " +
                    "#currentTown, " +
                    ".town-select, " +
                    "#ddlTown"
                );


            if (
                element &&
                element.tagName ===
                    "SELECT" &&
                element.selectedIndex >=
                    0
            ) {
                rawName =
                    element.options[
                        element.selectedIndex
                    ].text.trim();

            } else if (
                element &&
                element.textContent
            ) {
                rawName =
                    element
                        .textContent
                        .trim();
            }
        }


        if (!rawName) {
            const option =
                document.querySelector(
                    "select option:checked"
                );


            if (
                option &&
                option.text
            ) {
                rawName =
                    option.text.trim();
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

    function getNotesStorageKey() {
        return notesGlobalMode
            ? STORAGE.GLOBAL
            : (
                STORAGE.TOWN_PREFIX +
                getActiveTownId()
            );
    }


    function getLegacyStorageKey() {
        return notesGlobalMode
            ? LEGACY_STORAGE.GLOBAL
            : (
                LEGACY_STORAGE.TOWN_PREFIX +
                getActiveTownId()
            );
    }


    function loadNote() {
        const key =
            getNotesStorageKey();


        const current =
            loadJSON(
                key,
                null
            );


        if (
            typeof current ===
            "string"
        ) {
            return current;
        }


        /*
         * Import HoRRis's earlier localStorage format if found.
         */
        const legacy =
            localStorage.getItem(
                getLegacyStorageKey()
            );


        if (
            legacy !== null
        ) {
            saveJSON(
                key,
                legacy
            );


            return legacy;
        }


        return "";
    }


    function saveNote(
        text
    ) {
        saveJSON(
            getNotesStorageKey(),
            String(
                text || ""
            )
        );
    }


    // =========================================================================
    // TEXT HELPERS
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
        expression
    ) {
        const match =
            String(
                text || ""
            ).match(
                expression
            );


        if (
            !match ||
            !match[1]
        ) {
            return "";
        }


        let color =
            match[1]
                .trim();


        if (
            !/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i
                .test(
                    color
                )
        ) {
            return "";
        }


        if (
            !color.startsWith(
                "#"
            )
        ) {
            color =
                "#" +
                color;
        }


        return color;
    }


    function normalizeLink(
        value
    ) {
        let href =
            String(
                value || ""
            ).trim();


        if (!href) {
            return "#";
        }


        if (
            href.startsWith(
                "/"
            )
        ) {
            return href;
        }


        if (
            /^https?:\/\//i.test(
                href
            )
        ) {
            return href;
        }


        if (
            /^www\./i.test(
                href
            )
        ) {
            return (
                "https://" +
                href
            );
        }


        return (
            "https://" +
            href
        );
    }


    // =========================================================================
    // NOTE RENDERING
    // =========================================================================

    function renderClickableText(
        text
    ) {
        const source =
            String(
                text || ""
            );


        if (
            !source.trim()
        ) {
            const emptyLabel =
                notesGlobalMode
                    ? "No global notes yet."
                    : "No city notes yet.";


            return (
                "<span style=\"font-style:italic;opacity:0.7;\">" +
                escapeHTML(
                    emptyLabel +
                    ' Click "Edit" to add notes.'
                ) +
                "</span>"
            );
        }


        let cleanText =
            source
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


        let processed =
            escapeHTML(
                cleanText
            );


        const linkRegex =
            /\[([^\]]+)\]\(([^)]+)\)(?:\{([^}]+)\})?|((?:https?:\/\/|www\.)[^\s<]+)/gi;


        processed =
            processed.replace(
                linkRegex,

                (
                    match,
                    label,
                    markdownUrl,
                    hexColor,
                    bareUrl
                ) => {

                    const href =
                        normalizeLink(
                            markdownUrl ||
                            bareUrl
                        );


                    const displayText =
                        label ||
                        bareUrl;


                    const linkColor =
                        hexColor
                            ? parseHexColor(
                                `!color(${hexColor})`,
                                /!color\(([^)]+)\)/i
                            )
                            : "";


                    const style =
                        linkColor
                            ? (
                                ` style="color:${linkColor};text-decoration:underline;"`
                            )
                            : "";


                    return (
                        `<a href="${href}" target="_top"${style}>` +
                        displayText +
                        "</a>"
                    );
                }
            );


        /*
         * Font size:
         *
         * <fs(14)>Text</fs>
         * <fs(1.2em)>Text</fs>
         */
        processed =
            processed.replace(
                /&lt;fs\(([^)]+)\)&gt;/gi,

                (
                    match,
                    size
                ) => {

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


                    if (!cleanSize) {
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
         * Original LuperNotes formatting.
         */
        processed =
            processed.replace(
                /&lt;(\/?[bui])&gt;/gi,
                "<$1>"
            );


        const textColor =
            parseHexColor(
                source,
                /!TextColour\(([^)]+)\)/i
            );


        if (
            textColor
        ) {
            return (
                `<span style="color:${textColor};">` +
                processed +
                "</span>"
            );
        }


        return (
            "<span>" +
            processed +
            "</span>"
        );
    }


    // =========================================================================
    // OPTIONAL LUPERNOTES THEME TAGS
    //
    // No colors are supplied by this module itself.
    // Overrides only occur when the user explicitly uses a theme tag.
    // =========================================================================

    function clearThemeOverrides() {
        const elements = [
            notesPanel,
            notesHeader,
            titleLabel,
            displayDiv,
            textarea,
            globalButton,
            editButton
        ];


        elements
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


        globalButton
            ?.style
            .removeProperty(
                "--ik-btn-color"
            );


        editButton
            ?.style
            .removeProperty(
                "--ik-btn-color"
            );
    }


    function applyCustomUITheme(
        text
    ) {
        clearThemeOverrides();


        const uiTextColor =
            parseHexColor(
                text,
                /!UITextColour\(([^)]+)\)/i
            );


        const uiHeaderBg =
            parseHexColor(
                text,
                /!UIHeaderColour\(([^)]+)\)/i
            );


        const uiBodyBg =
            parseHexColor(
                text,
                /!UIBodyColour\(([^)]+)\)/i
            );


        const uiButtonBg =
            parseHexColor(
                text,
                /!UIButtonColour\(([^)]+)\)/i
            );


        const uiBorderColor =
            parseHexColor(
                text,
                /!UIBorderColour\(([^)]+)\)/i
            );


        const textColor =
            parseHexColor(
                text,
                /!TextColour\(([^)]+)\)/i
            );


        if (
            uiTextColor
        ) {
            titleLabel
                ?.style
                .setProperty(
                    "color",
                    uiTextColor,
                    "important"
                );


            globalButton
                ?.style
                .setProperty(
                    "--ik-btn-color",
                    uiTextColor
                );


            editButton
                ?.style
                .setProperty(
                    "--ik-btn-color",
                    uiTextColor
                );
        }


        if (
            uiHeaderBg
        ) {
            notesHeader
                ?.style
                .setProperty(
                    "background-color",
                    uiHeaderBg,
                    "important"
                );
        }


        if (
            uiBodyBg
        ) {
            displayDiv
                ?.style
                .setProperty(
                    "background-color",
                    uiBodyBg,
                    "important"
                );


            textarea
                ?.style
                .setProperty(
                    "background-color",
                    uiBodyBg,
                    "important"
                );
        }


        if (
            uiButtonBg
        ) {
            globalButton
                ?.style
                .setProperty(
                    "background-color",
                    uiButtonBg,
                    "important"
                );


            editButton
                ?.style
                .setProperty(
                    "background-color",
                    uiButtonBg,
                    "important"
                );
        }


        if (
            uiBorderColor
        ) {
            notesPanel
                ?.style
                .setProperty(
                    "border-color",
                    uiBorderColor,
                    "important"
                );


            notesHeader
                ?.style
                .setProperty(
                    "border-color",
                    uiBorderColor,
                    "important"
                );


            displayDiv
                ?.style
                .setProperty(
                    "border-color",
                    uiBorderColor,
                    "important"
                );


            textarea
                ?.style
                .setProperty(
                    "border-color",
                    uiBorderColor,
                    "important"
                );
        }


        if (
            textColor
        ) {
            textarea
                ?.style
                .setProperty(
                    "color",
                    textColor,
                    "important"
                );
        }
    }


    // =========================================================================
    // DISPLAY UPDATE
    // =========================================================================

    function updateNotesDisplay() {
        if (
            !displayDiv
        ) {
            return;
        }


        const savedText =
            loadNote();


        displayDiv.innerHTML =
            renderClickableText(
                savedText
            );


        applyCustomUITheme(
            savedText
        );


        updateTitle();
    }


    function updateTitle() {
        if (
            !titleLabel
        ) {
            return;
        }


        titleLabel.textContent =
            notesGlobalMode
                ? "Global Notes"
                : (
                    "City Notes (" +
                    getActiveTownName() +
                    ")"
                );
    }


    // =========================================================================
    // TOWN SYNC
    // =========================================================================

    function checkAndSyncTownNotes() {
        const activeTownId =
            getActiveTownId();


        if (
            activeTownId !==
            currentNotesTown
        ) {
            currentNotesTown =
                activeTownId;


            if (
                !notesGlobalMode
            ) {
                const savedText =
                    loadNote();


                if (
                    textarea &&
                    textarea.style.display !==
                        "none"
                ) {
                    textarea.value =
                        savedText;
                }


                updateNotesDisplay();
            }
        }


        updateTitle();
    }


    // =========================================================================
    // EDIT MODE
    // =========================================================================

    function toggleEditMode() {
        if (
            !textarea ||
            !displayDiv ||
            !editButton
        ) {
            return;
        }


        const isEditing =
            textarea.style.display ===
            "block";


        if (
            isEditing
        ) {
            saveNote(
                textarea.value
            );


            textarea.style.display =
                "none";


            displayDiv.style.display =
                "block";


            editButton.value =
                "Edit";


            updateNotesDisplay();

        } else {
            textarea.value =
                loadNote();


            displayDiv.style.display =
                "none";


            textarea.style.display =
                "block";


            editButton.value =
                "Done";


            applyCustomUITheme(
                textarea.value
            );


            textarea.focus();
        }
    }


    // =========================================================================
    // GLOBAL / CITY MODE
    // =========================================================================

    function toggleGlobalMode() {
        if (
            textarea &&
            textarea.style.display ===
                "block"
        ) {
            saveNote(
                textarea.value
            );
        }


        notesGlobalMode =
            !notesGlobalMode;


        globalButton.value =
            notesGlobalMode
                ? "City"
                : "Global";


        const savedText =
            loadNote();


        if (
            textarea
        ) {
            textarea.value =
                savedText;
        }


        updateNotesDisplay();


        if (
            textarea &&
            textarea.style.display ===
                "block"
        ) {
            displayDiv.style.display =
                "none";


            applyCustomUITheme(
                savedText
            );
        }
    }


    // =========================================================================
    // NOTES CSS
    //
    // This carries over the layout HoRRis got working.
    //
    // Colors and skins are still supplied by Illyriad/Core.
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

            /* =============================================================
               FULL HEIGHT NOTES TAB
               ============================================================= */

            #DockedFriends
            [data-ik-sidebar-panel="notes"] {

                position:
                    absolute !important;

                top:
                    25px !important;

                bottom:
                    0 !important;

                left:
                    0 !important;

                right:
                    0 !important;

                width:
                    100% !important;

                height:
                    auto !important;

                overflow-x:
                    hidden !important;

                overflow-y:
                    hidden !important;
            }


            /* =============================================================
               NOTES PANEL
               ============================================================= */

            #ikNotesPanel {
                display:
                    flex;

                flex-direction:
                    column;

                width:
                    calc(100% - 2px) !important;

                margin-left:
                    2px !important;

                height:
                    100% !important;

                box-sizing:
                    border-box;

                padding:
                    1px;
            }


            /* =============================================================
               NOTES HEADER
               ============================================================= */

            #ikNotesHeader {
                flex:
                    0 0 auto;

                text-align:
                    center;

                font-weight:
                    bold;

                padding:
                    4px;

                margin-bottom:
                    2px;

                box-sizing:
                    border-box;
            }


            #cityNotesTitleLabel {
                cursor:
                    default;
            }


            /* =============================================================
               DISPLAY / EDITOR
               ============================================================= */

            #ikNotesDisplay,
            #ikNotesTextarea {

                flex:
                    1 1 auto;

                min-height:
                    0;

                padding:
                    4px;

                box-sizing:
                    border-box;

                width:
                    100%;

                overflow-y:
                    auto;
            }


            #ikNotesDisplay {
                white-space:
                    pre-wrap;

                word-break:
                    break-word;
            }


            #ikNotesTextarea {
                resize:
                    none;

                display:
                    none;
            }


            /* =============================================================
               FOOTER
               ============================================================= */

            #ikNotesFooter {

                display:
                    flex !important;

                flex-direction:
                    row !important;

                justify-content:
                    space-between !important;

                align-items:
                    center !important;

                gap:
                    4px !important;

                padding-top:
                    6px !important;

                flex:
                    0 0 auto !important;

                width:
                    100% !important;

                box-sizing:
                    border-box !important;

                /*
                 * HoRRis's working solution:
                 *
                 * Keep the real 158px native button geometry and scale
                 * the complete footer so both buttons fit in the sidebar.
                 */
                zoom:
                    0.72 !important;
            }


            #ikNotesFooter .ik-game-button {

                margin:
                    0 !important;

                outline:
                    none !important;

                background-size:
                    auto !important;
            }

        `;


        document.head.appendChild(
            style
        );
    }


    // =========================================================================
    // MOUNT NOTES
    // =========================================================================

    function mountNotes(
        panel
    ) {
        injectNotesStyles();


        panel.innerHTML = `
            <div id="ikNotesPanel">

                <div id="ikNotesHeader">
                    <span
                        id="cityNotesTitleLabel"
                        class="selected"
                    >
                        City Notes
                    </span>
                </div>

                <div id="ikNotesDisplay"></div>

                <textarea
                    id="ikNotesTextarea"
                    placeholder="Enter notes here..."
                ></textarea>

                <div id="ikNotesFooter">

                    <input
                        type="button"
                        id="ikNotesGlobalBtn"
                        class="ik-game-button"
                        value="Global"
                    >

                    <input
                        type="button"
                        id="ikNotesEditBtn"
                        class="ik-game-button"
                        value="Edit"
                    >

                </div>

            </div>
        `;


        notesPanel =
            panel.querySelector(
                "#ikNotesPanel"
            );


        notesHeader =
            panel.querySelector(
                "#ikNotesHeader"
            );


        titleLabel =
            panel.querySelector(
                "#cityNotesTitleLabel"
            );


        displayDiv =
            panel.querySelector(
                "#ikNotesDisplay"
            );


        textarea =
            panel.querySelector(
                "#ikNotesTextarea"
            );


        globalButton =
            panel.querySelector(
                "#ikNotesGlobalBtn"
            );


        editButton =
            panel.querySelector(
                "#ikNotesEditBtn"
            );


        // ---------------------------------------------------------------------
        // INITIAL STATE
        // ---------------------------------------------------------------------

        currentNotesTown =
            getActiveTownId();


        textarea.value =
            loadNote();


        updateNotesDisplay();


        // ---------------------------------------------------------------------
        // EDIT BUTTON
        // ---------------------------------------------------------------------

        editButton.addEventListener(
            "click",
            toggleEditMode
        );


        // ---------------------------------------------------------------------
        // GLOBAL BUTTON
        // ---------------------------------------------------------------------

        globalButton.addEventListener(
            "click",
            toggleGlobalMode
        );


        // ---------------------------------------------------------------------
        // AUTOSAVE
        // ---------------------------------------------------------------------

        textarea.addEventListener(
            "input",

            event => {

                saveNote(
                    event.target.value
                );


                applyCustomUITheme(
                    event.target.value
                );
            }
        );


        // ---------------------------------------------------------------------
        // TOWN SYNC
        // ---------------------------------------------------------------------

        if (
            !notesSyncInterval
        ) {
            notesSyncInterval =
                setInterval(
                    checkAndSyncTownNotes,
                    500
                );
        }


        /*
         * Refresh the cloned native Illyriad red button skin.
         */
        if (
            IKTools.ui &&
            typeof IKTools.ui.refreshNativeButtons ===
                "function"
        ) {
            IKTools.ui.refreshNativeButtons();
        }
    }


    // =========================================================================
    // TAB SHOW
    // =========================================================================

    function onNotesShown() {
        checkAndSyncTownNotes();


        if (
            IKTools.ui &&
            typeof IKTools.ui.refreshNativeButtons ===
                "function"
        ) {
            IKTools.ui.refreshNativeButtons();
        }
    }


    // =========================================================================
    // REGISTER MODULE
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
