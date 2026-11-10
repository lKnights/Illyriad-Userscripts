/*
 * Illyriad Tools Suite - Customizer
 *
 * Copyright (c) 2026 IKnights
 * Copyright (c) 2026 HoRRis Lupercal
 * Licensed under the IKnights Non-Commercial License
 *
 * Customizer provides the theme engine and configuration UI
 * for Illyriad Tools Suite.
 */

(function () {
    "use strict";


    // =========================================================================
    // LOAD GUARD
    // =========================================================================

    if (window.__IKTOOLS_CUSTOMIZER_LOADED__) {
        return;
    }

    window.__IKTOOLS_CUSTOMIZER_LOADED__ = true;


    // =========================================================================
    // CORE CHECK
    // =========================================================================

    if (
        !window.IKTools ||
        typeof window.IKTools.registerTool !== "function"
    ) {
        console.error(
            "IKnights Customizer could not load because IKnights Tools Core is missing."
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
    // CONSTANTS
    // =========================================================================

    const STORAGE_KEY =
        "ikCustomizer.settings.v1";


    const STYLE_ID =
        "ikCustomizerStyles";


    const UI_STYLE_ID =
        "ikCustomizerUIStyles";


    const DIALOG_ID =
        "ikCustomizerDialog";

    const COLOR_OVERRIDE_FIELDS = [
        {
            setting: "textColor",
            inputId: "ikCustomizerTextColor",
            label: "Text Colour",
            variables: ["--ik-theme-text"],
            previewVariable: "--ik-theme-text"
        },
        {
            setting: "backgroundColor",
            inputId: "ikCustomizerBackgroundColor",
            label: "Background Colour",
            variables: ["--ik-theme-content-bg"],
            previewVariable: "--ik-theme-content-bg"
        },
        {
            setting: "alternatingBackgroundColor",
            inputId: "ikCustomizerAlternatingBackgroundColor",
            label: "Alternating Background Colour",
            variables: ["--ik-theme-alt-bg"],
            previewVariable: "--ik-theme-alt-bg"
        },
        {
            setting: "borderColor",
            inputId: "ikCustomizerBorderColor",
            label: "Border Colour",
            variables: [
                "--ik-theme-border-color",
                "--ik-theme-alt-border-color"
            ],
            previewVariable: "--ik-theme-border-color"
        },
        {
            setting: "inputBoxColor",
            inputId: "ikCustomizerInputBoxColor",
            label: "Input Box Colour",
            variables: [
                "--ik-theme-input-bg",
                "--ik-theme-light-alt-bg"
            ],
            previewVariable: "--ik-theme-input-bg"
        },
        {
            setting: "activeHeaderColor",
            inputId: "ikCustomizerActiveHeaderColor",
            label: "Active Header Colour",
            variables: [
                "--ik-theme-special-text3",
                "--ik-theme-special-text5"
            ],
            previewVariable: "--ik-theme-special-text5"
        },
        {
            setting: "headerColor",
            inputId: "ikCustomizerHeaderColor",
            label: "Header Colour",
            variables: ["--ik-theme-special-text4"],
            previewVariable: "--ik-theme-special-text4"
        },
        {
            setting: "linkColor",
            inputId: "ikCustomizerLinkColor",
            label: "Link Colour",
            variables: ["--ik-theme-link"],
            previewVariable: "--ik-theme-link"
        },
        {
            setting: "linkHoverColor",
            inputId: "ikCustomizerLinkHoverColor",
            label: "Link Hover Colour",
            variables: ["--ik-theme-link-hover"],
            previewVariable: "--ik-theme-link-hover"
        },
        {
            setting: "nameColor",
            inputId: "ikCustomizerNameColor",
            label: "Name Colour",
            variables: ["--ik-theme-special-text6"],
            previewVariable: "--ik-theme-special-text6"
        },
        {
            setting: "selfChatColor",
            inputId: "ikCustomizerSelfChatColor",
            label: "Self Chat Colour",
            variables: ["--ik-theme-special-text1"],
            previewVariable: "--ik-theme-special-text1"
        },
        {
            setting: "systemChatColor",
            inputId: "ikCustomizerSystemChatColor",
            label: "System Chat Colour",
            variables: ["--ik-theme-special-text2"],
            previewVariable: "--ik-theme-special-text2"
        },
        {
            setting: "cityDropdownBackgroundColor",
            inputId: "ikCustomizerCityDropdownBackgroundColor",
            label: "City Dropdown Background Colour",
            variables: ["--ik-theme-special-text8"],
            previewVariable: "--ik-theme-special-text8"
        },
        {
            setting: "cityDropdownSelectedColor",
            inputId: "ikCustomizerCityDropdownSelectedColor",
            label: "City Dropdown Selected Colour",
            variables: ["--ik-theme-special-text7"],
            previewVariable: "--ik-theme-special-text7"
        }
    ];
    
    // Accept #RGB, #RRGGBB and #RRGGBBAA.
    function isValidHexColor(value) {
        return typeof value === "string" &&
            /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value);
    }

    // =========================================================================
    // DEFAULT SETTINGS
    // =========================================================================

    const DEFAULT_SETTINGS = {
        enabled:
            true,

        interfaceTheme:
            "native",

        cityTheme:
            "native",

        customCssEnabled:
            false,

        customCss:
            "",

        replacePaperTexture:
            false,
        
        ...Object.fromEntries(
            COLOR_OVERRIDE_FIELDS.map(field => [
                field.setting,
                ""
            ])
        )
       
    };


    // =========================================================================
    // STATE
    // =========================================================================

    let settings =
        null;


    let dialogCreated =
        false;


    let statusTimer =
        null;


    /*
     * Themes are intentionally kept separate by category.
     *
     * Later, theme files can register themselves without Customizer
     * needing to contain every theme definition.
     */
    const themes = {
        interface:
            new Map(),

        city:
            new Map()
    };


    /*
     * Tracks optional JavaScript theme hooks.
     *
     * Most themes should be CSS whenever possible, but this gives
     * city-map themes somewhere to perform DOM/image substitutions
     * later if CSS alone cannot do it.
     */
    const activeHooks = {
        interface:
            null,

        city:
            null
    };


    // =========================================================================
    // SETTINGS
    // =========================================================================

    function normalizeSettings(
        value
    ) {
        const source =
            value &&
            typeof value ===
                "object"
                ? value
                : {};


        return {
            enabled:
                source.enabled !==
                    false,

            interfaceTheme:
                typeof source.interfaceTheme ===
                    "string"
                    ? source.interfaceTheme
                    : "native",

            cityTheme:
                typeof source.cityTheme ===
                    "string"
                    ? source.cityTheme
                    : "native",

            customCssEnabled:
                source.customCssEnabled ===
                    true,

            customCss:
                typeof source.customCss ===
                    "string"
                    ? source.customCss
                    : "",

            replacePaperTexture:
                source.replacePaperTexture === 
                    true,
            
            ...Object.fromEntries(
                COLOR_OVERRIDE_FIELDS.map(field => [
                    field.setting,
            
                    typeof source[field.setting] === "string"
                        ? source[field.setting].trim()
                        : ""
                ])
            )
        };

        
    }


    function loadSettings() {
        // Import HoRRis's preference only when no Customizer settings exist.
        const existing = loadJSON(STORAGE_KEY, null);
        const legacy = loadJSON("ikLuperTweaks.settings.v1", null);
        const fallback = !existing && legacy && legacy.darkMode === true
            ? { ...DEFAULT_SETTINGS, interfaceTheme: "luper-dark-warm" }
            : DEFAULT_SETTINGS;
        settings =
            normalizeSettings(
                existing || fallback
            );

        if (!existing && fallback !== DEFAULT_SETTINGS) saveSettings();


        return settings;
    }


    function saveSettings() {
        saveJSON(
            STORAGE_KEY,
            settings
        );
    }


    function getSettings() {
        if (!settings) {
            loadSettings();
        }


        return {
            ...settings
        };
    }


    // =========================================================================
    // THEME REGISTRY
    // =========================================================================

    function normalizeThemeCategory(
        category
    ) {
        const value =
            String(
                category || ""
            )
                .trim()
                .toLowerCase();


        if (
            value ===
                "interface" ||
            value ===
                "city"
        ) {
            return value;
        }


        return null;
    }


    function registerTheme(
        theme
    ) {
        if (
            !theme ||
            !theme.id ||
            !theme.name
        ) {
            console.warn(
                "IKnights Customizer: Invalid theme registration.",
                theme
            );

            return false;
        }


        const category =
            normalizeThemeCategory(
                theme.category
            );


        if (!category) {
            console.warn(
                "IKnights Customizer: Theme must use category 'interface' or 'city'.",
                theme
            );

            return false;
        }


        const id =
            String(
                theme.id
            )
                .trim()
                .toLowerCase();


        if (
            !id ||
            id ===
                "native"
        ) {
            console.warn(
                "IKnights Customizer: Theme ID is invalid or reserved.",
                theme
            );

            return false;
        }


        const normalized = {
            id:
                id,

            name:
                String(
                    theme.name
                ),

            category:
                category,

            description:
                String(
                    theme.description ||
                    ""
                ),

            author:
                String(
                    theme.author ||
                    ""
                ),

            css:
                typeof theme.css ===
                    "string"
                    ? theme.css
                    : "",

            apply:
                typeof theme.apply ===
                    "function"
                    ? theme.apply
                    : null,

            remove:
                typeof theme.remove ===
                    "function"
                    ? theme.remove
                    : null
        };


        themes[
            category
        ].set(
            id,
            normalized
        );


        refreshThemeSelectors();


        /*
         * If the player already had this theme selected before
         * its definition loaded, immediately activate it now.
         */
        if (
            settings
        ) {
            const selectedId =
                category ===
                    "interface"
                    ? settings.interfaceTheme
                    : settings.cityTheme;


            if (
                selectedId ===
                id
            ) {
                applyCustomizer();
            }
        }


        return true;
    }


    function unregisterTheme(
        category,
        id
    ) {
        const normalizedCategory =
            normalizeThemeCategory(
                category
            );


        if (
            !normalizedCategory
        ) {
            return false;
        }


        const themeId =
            String(
                id || ""
            )
                .trim()
                .toLowerCase();


        const removed =
            themes[
                normalizedCategory
            ].delete(
                themeId
            );


        if (removed) {
            refreshThemeSelectors();
            applyCustomizer();
        }


        return removed;
    }


    function getTheme(
        category,
        id
    ) {
        const normalizedCategory =
            normalizeThemeCategory(
                category
            );


        if (
            !normalizedCategory ||
            !id ||
            id ===
                "native"
        ) {
            return null;
        }


        return (
            themes[
                normalizedCategory
            ].get(
                String(
                    id
                )
                    .trim()
                    .toLowerCase()
            ) ||
            null
        );
    }


    function getThemes(
        category
    ) {
        const normalizedCategory =
            normalizeThemeCategory(
                category
            );


        if (
            !normalizedCategory
        ) {
            return [];
        }


        return Array.from(
            themes[
                normalizedCategory
            ].values()
        )
            .sort(
                (
                    a,
                    b
                ) =>
                    a.name.localeCompare(
                        b.name
                    )
            );
    }

    // =========================================================================
    // COLOUR OVERRIDES
    // =========================================================================
    
    function getColorOverrides() {
        const overrides = {};
    
        // Only apply to active custom interface themes.
        if (
            !settings ||
            !settings.enabled ||
            !getTheme("interface", settings.interfaceTheme)
        ) {
            return overrides;
        }
    
        for (const field of COLOR_OVERRIDE_FIELDS) {
            const color = settings[field.setting];
    
            // Ignore missing or invalid colours.
            if (!isValidHexColor(color)) {
                continue;
            }
    
            // One input can override multiple variables.
            for (const variable of field.variables) {
                overrides[variable] = color;
            }
        }
    
        return overrides;
    }
    
    // =========================================================================
    // STYLE ENGINE
    // =========================================================================

    function removeGeneratedStyles() {
        document
            .querySelector(
                "#" +
                STYLE_ID
            )
            ?.remove();
    }


    function ensureGeneratedStyleElement() {
        let style =
            document.querySelector(
                "#" +
                STYLE_ID
            );


        if (!style) {
            style =
                document.createElement(
                    "style"
                );


            style.id =
                STYLE_ID;


            document.head.appendChild(
                style
            );
        }


        return style;
    }


    function cleanupThemeHook(
        category
    ) {
        const current =
            activeHooks[
                category
            ];


        if (
            !current
        ) {
            return;
        }


        if (
            typeof current.remove ===
                "function"
        ) {
            try {
                current.remove();

            } catch (
                error
            ) {
                console.error(
                    `IKnights Customizer failed to remove ${category} theme:`,
                    error
                );
            }
        }


        activeHooks[
            category
        ] =
            null;
    }


    function activateThemeHook(
        category,
        theme
    ) {
        cleanupThemeHook(
            category
        );


        if (
            !theme ||
            typeof theme.apply !==
                "function"
        ) {
            return;
        }


        try {
            theme.apply(
                getSettings()
            );


            activeHooks[
                category
            ] =
                theme;

        } catch (
            error
        ) {
            console.error(
                `IKnights Customizer failed to apply ${category} theme ${theme.id}:`,
                error
            );
        }
    }


    function buildGeneratedCss() {
        if (
            !settings ||
            settings.enabled ===
                false
        ) {
            return "";
        }


        const blocks =
            [];


        const interfaceTheme =
            getTheme(
                "interface",
                settings.interfaceTheme
            );


        const cityTheme =
            getTheme(
                "city",
                settings.cityTheme
            );


        if (
            interfaceTheme &&
            interfaceTheme.css
        ) {
            blocks.push(
                [
                    "/* ========================================",
                    `   Interface Theme: ${interfaceTheme.name}`,
                    "   ======================================== */",
                    "",
                    interfaceTheme.css
                ].join(
                    "\n"
                )
            );
        }


        if (
            cityTheme &&
            cityTheme.css
        ) {
            blocks.push(
                [
                    "/* ========================================",
                    `   City Theme: ${cityTheme.name}`,
                    "   ======================================== */",
                    "",
                    cityTheme.css
                ].join(
                    "\n"
                )
            );
        }

        const colorOverrides =
            Object.entries(getColorOverrides());
        
        if (colorOverrides.length) {
            blocks.push(
                [
                    "/* Interface Theme Colour Overrides */",
                    "html:root, body {",
                    ...colorOverrides.map(
                        ([variable, color]) =>
                            `    ${variable}: ${color} !important;`
                    ),
                    "}"
                ].join("\n")
            );
        }

        if (
            settings.customCssEnabled &&
            settings.customCss.trim()
        ) {
            blocks.push(
                [
                    "/* ========================================",
                    "   User Custom CSS",
                    "   ======================================== */",
                    "",
                    settings.customCss
                ].join(
                    "\n"
                )
            );
        }

        // =============================================================
        // REPLACE PAPER TEXTURE WITH SOLID BACKGROUND
        // =============================================================
        
        if (
            settings.replacePaperTexture === true &&
            interfaceTheme
        ) {
            blocks.push(`
                /* Disable the theme's paper texture variable */
                html:root,
                body {
                    --ik-theme-texture: none !important;
                }
        
                /*
                 * Replace textured backgrounds with the
                 * selected content background colour.
                 */
        
                body.ik-dark-mode
                .ui-widget-content:not([id="ikNotesPanel"]):not([id="ikNotesPanel"] *),
        
                body.ik-dark-mode .smallBorder,
                body.ik-dark-mode #DockedFriends,
                body.ik-dark-mode .ui-state-active,
        
                body.ik-dark-mode .sideTab.selected,
        
                body.ik-dark-mode
                span.ikcat-dialog-tab.data-tab,
        
                body.ik-dark-mode
                span.ikcat-dialog-tab.selected,
        
                body.ik-dark-mode
                span.ikcat-dialog-tab.active,
        
                body.ik-dark-mode
                span.ikcat-dialog-tab.active.data-tab,
        
                body.ik-dark-mode
                div.headlinks a.selected,
        
                body.ik-dark-mode
                div.headLinks a.selected,
        
                body.ik-dark-mode
                .headlinks a.selected,
        
                body.ik-dark-mode
                .headLinks a.selected {
                    background-image: none !important;
        
                    background-color:
                        var(--ik-theme-content-bg) !important;
                }
            `);
        }

        return blocks.join(
            "\n\n"
        );
    }


    function applyCustomizer() {
        if (!settings) {
            loadSettings();
        }


        /*
         * Disabled means Customizer makes absolutely no visual changes.
         */
        if (
            settings.enabled ===
                false
        ) {
            removeGeneratedStyles();


            cleanupThemeHook(
                "interface"
            );


            cleanupThemeHook(
                "city"
            );


            return;
        }


        const css =
            buildGeneratedCss();


        if (
            css.trim()
        ) {
            const style =
                ensureGeneratedStyleElement();


            style.textContent =
                css;

        } else {
            removeGeneratedStyles();
        }


        activateThemeHook(
            "interface",
            getTheme(
                "interface",
                settings.interfaceTheme
            )
        );


        activateThemeHook(
            "city",
            getTheme(
                "city",
                settings.cityTheme
            )
        );
    }


    // =========================================================================
    // NATIVE RESET
    // =========================================================================

    function resetToNative() {
        settings = {
            ...DEFAULT_SETTINGS
        };


        saveSettings();


        removeGeneratedStyles();


        cleanupThemeHook(
            "interface"
        );


        cleanupThemeHook(
            "city"
        );


        syncControlsFromSettings();


        setStatus(
            "Customizer reset to native Illyriad."
        );
    }


    // =========================================================================
    // STATUS
    // =========================================================================

    function setStatus(
        message,
        type
    ) {
        const element =
            document.querySelector(
                "#ikCustomizerStatus"
            );


        if (!element) {
            return;
        }


        element.textContent =
            String(
                message || ""
            );


        element.dataset.type =
            type ||
            "";


        if (
            statusTimer
        ) {
            clearTimeout(
                statusTimer
            );
        }


        statusTimer =
            setTimeout(
                () => {

                    const current =
                        document.querySelector(
                            "#ikCustomizerStatus"
                        );


                    if (current) {
                        current.textContent =
                            "";

                        current.dataset.type =
                            "";
                    }

                },

                5000
            );
    }


    // =========================================================================
    // UI STYLES
    //
    // Layout only.
    //
    // No theme colors are defined here.
    // =========================================================================

    function injectUIStyles() {
        if (
            document.querySelector(
                "#" +
                UI_STYLE_ID
            )
        ) {
            return;
        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            UI_STYLE_ID;


        style.textContent = `

            #ikCustomizerDialog {
                box-sizing:
                    border-box;
            }

            /* Main Customizer heading */
            #ikCustomizerDialog h1.ik-customizer-main-heading {
                font-size: 2em;
                font-weight: bold;
                line-height: 1.2;
                margin: 12px 0 12px 0 !important;
            }

            #ikCustomizerDialog
            .ik-customizer-section {

                margin-bottom:
                    12px;
            }


            #ikCustomizerDialog
            .ik-customizer-heading {

                font-weight:
                    bold;

                margin-bottom:
                    5px;
            }


            #ikCustomizerDialog
            .ik-customizer-row {

                display:
                    flex;

                align-items:
                    center;

                gap:
                    8px;

                margin-bottom:
                    6px;

                box-sizing:
                    border-box;
            }


            #ikCustomizerDialog
            .ik-customizer-row
            > label {

                flex:
                    0 0 125px;
            }


            #ikCustomizerDialog
            .ik-customizer-row
            > select {

                flex:
                    1 1 auto;

                min-width:
                    0;
            }

            #ikCustomizerDialog
            .ik-customizer-color-row > label {
                flex: 0 0 235px;
            }
            
            #ikCustomizerDialog
            .ik-customizer-color-input {
                flex: 1 1 auto;
                min-width: 0;
                box-sizing: border-box;
            }
            
            #ikCustomizerDialog
            .ik-customizer-color-input.ik-customizer-invalid {
                background-color: #ffd6d6 !important;
                color: #800000 !important;
                border: 2px solid #c00000 !important;
            }

            #ikCustomizerDialog
            .ik-customizer-texture-toggle {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 12px;
                margin-bottom: 12px;
            }
            
            #ikCustomizerDialog
            .ik-customizer-texture-toggle > label {
                flex: 1 1 auto;
                cursor: pointer;
            }
            
            #ikCustomizerDialog
            .ik-customizer-texture-toggle > input {
                flex: 0 0 auto;
            }

            /* Accordion headers */
            #ikCustomizerDialog #ikCustomizerAccordion > h3 {
                display: block !important;
                position: relative !important;
                box-sizing: border-box !important;
            
                padding: 10px 12px 10px 34px !important;
                min-height: 38px !important;
                line-height: 18px !important;
            
                font-size: 13px !important;
                cursor: pointer;
                margin: 0 0 3px 0 !important;
            }
            
            /* Hide default jQuery UI accordion icon */
            #ikCustomizerDialog
            #ikCustomizerAccordion .ui-accordion-header-icon {
                display: none !important;
            }
            
            /* Collapsed arrow */
            #ikCustomizerDialog #ikCustomizerAccordion > h3::before {
                content: "";
                position: absolute;
                left: 12px;
                top: 50%;
            
                width: 0;
                height: 0;
            
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                border-left: 6px solid currentColor;
            
                transform: translateY(-50%);
                pointer-events: none;
            }
            
            /* Expanded arrow */
            #ikCustomizerDialog
            #ikCustomizerAccordion > h3.ui-state-active::before {
                transform: translateY(-50%) rotate(90deg);
            }

            /* Active accordion header - native fallback */
            #ikCustomizerAccordion > h3.ui-state-active {
                background-image: var(
                    --ik-theme-texture,
                    url("https://assets.illyriad.net/img/backgrounds/paper2.jpg")
                );
            
                background-position: 50% 50%;
                background-repeat: repeat;
            }
            
            /* Expanded accordion panel */
            #ikCustomizerDialog
            #ikCustomizerAccordion > .ui-accordion-content {
                padding: 12px 12px 12px 34px !important;
            }
            
            /* Hex colour preview */
            #ikCustomizerDialog .ik-customizer-color-swatch {
                flex: 0 0 34px;
                width: 34px;
                height: 24px;
            
                box-sizing: border-box;
            
                border: 1px solid var(--ik-theme-border, #888);
                background-color: transparent;
            }
            
            /* Center Clear button */
            #ikCustomizerDialog .ik-customizer-color-actions {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                margin-top: 10px;
            }

            #ikCustomizerDialog
            #ikCustomizerCustomCss {

                width:
                    100%;

                min-height:
                    160px;

                resize:
                    vertical;

                box-sizing:
                    border-box;
            }

            /* Main Customizer settings panel */
            #ikCustomizerDialog #ikCustomizerMainPanel {
                box-sizing: border-box;
            
                border-style: solid;
                border-width: 0 1px 1px 1px;
            
                padding: 12px;
                margin-bottom: 10px;
            }
            
            /* Buttons inside the main panel */
            #ikCustomizerDialog
            #ikCustomizerMainPanel .ik-customizer-buttons {
                margin-top: 10px;
                padding-bottom: 4px;
            }


            #ikCustomizerDialog
            .ik-customizer-buttons {

                display:
                    flex;

                flex-wrap:
                    wrap;

                align-items:
                    center;

                justify-content: 
                    center;

                gap:
                    6px;

                margin-top:
                    10px;
            }


            #ikCustomizerDialog
            #ikCustomizerStatus {

                min-height:
                    18px;

                margin-top:
                    7px;
            }


            #ikCustomizerDialog
            .ik-customizer-description {

                margin-top:
                    3px;

                margin-bottom:
                    7px;
            }

        `;


        document.head.appendChild(
            style
        );
    }


    // =========================================================================
    // SELECT HELPERS
    // =========================================================================

    function populateThemeSelect(
        select,
        category,
        selectedValue
    ) {
        if (!select) {
            return;
        }


        const previous =
            selectedValue ||
            select.value ||
            "native";


        select.innerHTML =
            "";


        const nativeOption =
            document.createElement(
                "option"
            );


        nativeOption.value =
            "native";


        nativeOption.textContent =
            "Illyriad Native";


        select.appendChild(
            nativeOption
        );


        getThemes(
            category
        )
            .forEach(
                theme => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        theme.id;


                    option.textContent =
                        theme.name;


                    select.appendChild(
                        option
                    );
                }
            );


        const optionExists =
            Array.from(
                select.options
            )
                .some(
                    option =>
                        option.value ===
                        previous
                );


        select.value =
            optionExists
                ? previous
                : "native";
    }


    function refreshThemeSelectors() {
        const interfaceSelect =
            document.querySelector(
                "#ikCustomizerInterfaceTheme"
            );


        const citySelect =
            document.querySelector(
                "#ikCustomizerCityTheme"
            );


        if (
            interfaceSelect
        ) {
            populateThemeSelect(
                interfaceSelect,
                "interface",
                settings
                    ?.interfaceTheme ||
                    "native"
            );
        }


        if (
            citySelect
        ) {
            populateThemeSelect(
                citySelect,
                "city",
                settings
                    ?.cityTheme ||
                    "native"
            );
        }

        updateThemeDescriptions();
    }


    // =========================================================================
    // CONTROL SYNC
    // =========================================================================
function updateAccordionStatusHeaders() {
    const colorLabel = document.getElementById(
        "ikCustomizerColorHeaderLabel"
    );

    const cssLabel = document.getElementById(
        "ikCustomizerCssHeaderLabel"
    );

    const values = COLOR_OVERRIDE_FIELDS.map(field =>
        String(settings?.[field.setting] ?? "").trim()
    );

    const hasValue = values.some(value =>
        value !== ""
    );

    const hasError = values.some(value =>
        value !== "" && !isValidHexColor(value)
    );

    // Custom Color Settings
    if (colorLabel) {
        colorLabel.textContent =
            "Custom Color Settings" +
            (
                hasError
                    ? " - Error"
                    : hasValue
                        ? " - Active"
                        : ""
            );
    }

    // Custom CSS Injection
    if (cssLabel) {
        cssLabel.textContent =
            "Custom CSS Injection" +
            (
                settings?.customCssEnabled
                    ? " - Active"
                    : ""
            );
    }
}
    
    function updateThemeDescriptions() {
        const fields = [
            {
                selectId: "ikCustomizerInterfaceTheme",
                descriptionId: "ikCustomizerInterfaceDescription",
                category: "interface",
                nativeDescription:
                    "Native leaves Illyriad's normal interface unchanged."
            },
            {
                selectId: "ikCustomizerCityTheme",
                descriptionId: "ikCustomizerCityDescription",
                category: "city",
                nativeDescription:
                    "Native leaves Illyriad's city map unchanged."
            }
        ];
    
        for (const field of fields) {
            const select = document.getElementById(
                field.selectId
            );
    
            const description = document.getElementById(
                field.descriptionId
            );
    
            if (!select || !description) {
                continue;
            }
    
            const theme = getTheme(
                field.category,
                select.value
            );
    
            if (select.value === "native") {
                description.textContent =
                    field.nativeDescription;
            } else {
                description.textContent =
                    theme?.description?.trim() ||
                    "No description is available for this theme.";
            }
        }
    }
    
    function updateColorInputValidity(input, validate = false) {
        if (!input) {
            return false;
        }
    
        const value = input.value.trim();
    
        if (validate) {
            // Full validation only when requested by Apply.
            const invalid =
                value !== "" && !isValidHexColor(value);
    
            input.classList.toggle(
                "ik-customizer-invalid",
                invalid
            );
    
            input.setAttribute(
                "aria-invalid",
                String(invalid)
            );
    
        } else if (value === "") {
            // Always clear the error when the field is empty.
            input.classList.remove(
                "ik-customizer-invalid"
            );
    
            input.setAttribute(
                "aria-invalid",
                "false"
            );
        }
    
       // Update the colour indicator square.
        const swatch = document.getElementById(
            input.id + "Swatch"
        );
        
        // Find the configuration for this input.
        const field = COLOR_OVERRIDE_FIELDS.find(
            field => field.inputId === input.id
        );
        
        if (swatch && field) {
        
            // Valid input: preview the entered colour.
            // Otherwise use the designated theme variable.
            const previewColor = isValidHexColor(value)
                ? value
                : `var(${field.previewVariable}, transparent)`;
        
            swatch.style.setProperty(
                "background-color",
                previewColor,
                "important"
            );
        
            // Prevent theme background textures from
            // obscuring the solid colour indicator.
            swatch.style.setProperty(
                "background-image",
                "none",
                "important"
            );
        }
    
        return input.classList.contains(
            "ik-customizer-invalid"
        );
    }
    
    function syncControlsFromSettings() {
        if (!settings) {
            return;
        }


        const enabled =
            document.querySelector(
                "#ikCustomizerEnabled"
            );


        const interfaceTheme =
            document.querySelector(
                "#ikCustomizerInterfaceTheme"
            );


        const cityTheme =
            document.querySelector(
                "#ikCustomizerCityTheme"
            );


        const customCssEnabled =
            document.querySelector(
                "#ikCustomizerCustomCssEnabled"
            );


        const customCss =
            document.querySelector(
                "#ikCustomizerCustomCss"
            );


        if (
            enabled
        ) {
            enabled.checked =
                settings.enabled;
        }


        populateThemeSelect(
            interfaceTheme,
            "interface",
            settings.interfaceTheme
        );


        populateThemeSelect(
            cityTheme,
            "city",
            settings.cityTheme
        );


        if (
            customCssEnabled
        ) {
            customCssEnabled.checked =
                settings.customCssEnabled;
        }


        if (
            customCss
        ) {
            customCss.value =
                settings.customCss;
        }

        for (const field of COLOR_OVERRIDE_FIELDS) {
            const input =
                document.getElementById(field.inputId);
        
            if (input) {
                input.value = settings[field.setting] || "";
                updateColorInputValidity(input, true);
            }
        }

        const textureCheckbox = document.getElementById(
            "ikCustomizerReplacePaperTexture"
        );
        
        if (textureCheckbox) {
            textureCheckbox.checked =
                settings.replacePaperTexture === true;
        }

        updateThemeDescriptions();
        syncCustomCssState();
        updateAccordionStatusHeaders();
    }


    function syncCustomCssState() {
        const enabled =
            document.querySelector(
                "#ikCustomizerCustomCssEnabled"
            );


        const textarea =
            document.querySelector(
                "#ikCustomizerCustomCss"
            );


        if (
            textarea
        ) {
            textarea.disabled =
                !enabled?.checked;
        }

    }


    function readSettingsFromControls() {
        const enabled =
            document.querySelector(
                "#ikCustomizerEnabled"
            );


        const interfaceTheme =
            document.querySelector(
                "#ikCustomizerInterfaceTheme"
            );


        const cityTheme =
            document.querySelector(
                "#ikCustomizerCityTheme"
            );


        const customCssEnabled =
            document.querySelector(
                "#ikCustomizerCustomCssEnabled"
            );


        const customCss =
            document.querySelector(
                "#ikCustomizerCustomCss"
            );


        settings = {
            enabled:
                enabled
                    ? enabled.checked
                    : true,

            interfaceTheme:
                interfaceTheme
                    ? interfaceTheme.value
                    : "native",

            cityTheme:
                cityTheme
                    ? cityTheme.value
                    : "native",

            customCssEnabled:
                customCssEnabled
                    ? customCssEnabled.checked
                    : false,

            customCss:
                customCss
                    ? customCss.value
                    : "",
            
            replacePaperTexture:
                document.getElementById(
                    "ikCustomizerReplacePaperTexture"
                )?.checked === true
        };

        for (const field of COLOR_OVERRIDE_FIELDS) {
            const input =
                document.getElementById(field.inputId);
        
            settings[field.setting] =
                input ? input.value.trim() : "";
        
            updateColorInputValidity(input, true);
        }
        
    }


    // =========================================================================
    // APPLY FROM UI
    // =========================================================================

    function applyFromUI() {
        readSettingsFromControls();

        
        updateAccordionStatusHeaders();

        
        saveSettings();


        applyCustomizer();


        const invalidColors = COLOR_OVERRIDE_FIELDS.some(field => {
            const color = settings[field.setting];
        
            return color !== "" && !isValidHexColor(color);
        });
        
        setStatus(
            invalidColors
                ? "Settings applied. Invalid colour values were ignored (red fields)."
                : "Customizer settings applied."
        );
    }


    // =========================================================================
    // DIALOG
    // =========================================================================

    function createDialog() {
        if (
            dialogCreated
        ) {
            return true;
        }


        if (
            !window.jQuery ||
            !jQuery.fn ||
            typeof jQuery.fn.dialog !==
                "function"
        ) {
            return false;
        }


        injectUIStyles();


        const dialog =
            document.createElement(
                "div"
            );


        dialog.id =
            DIALOG_ID;


        dialog.title =
            "Customizer";


        dialog.innerHTML = `

            <div id="ikCustomizerMainPanel" class="ui-widget-content">
    
                <div class="ik-customizer-section">
    
                    <h1 class="ik-customizer-main-heading">
                        Customizer
                    </h1>
    
                    <div class="ik-customizer-row">
    
                        <label for="ikCustomizerEnabled">
                            Enabled
                        </label>
    
                        <input
                            type="checkbox"
                            id="ikCustomizerEnabled"
                        >
    
                    </div>
    
                </div>
    
    
                <div class="ik-customizer-section">
    
                    <div class="ik-customizer-heading">
                        Interface
                    </div>
    
                    <div class="ik-customizer-row">
    
                        <label for="ikCustomizerInterfaceTheme">
                            Interface Theme
                        </label>
    
                        <select
                            id="ikCustomizerInterfaceTheme"
                        ></select>
    
                    </div>
    
                    <div id="ikCustomizerInterfaceDescription" class="ik-customizer-description">
                        Native leaves Illyriad's normal interface unchanged.
                    </div>
    
                </div>
    
    
                <div class="ik-customizer-section">
    
                    <div class="ik-customizer-heading">
                        City Map
                    </div>
    
                    <div class="ik-customizer-row">
    
                        <label for="ikCustomizerCityTheme">
                            City Theme
                        </label>
    
                        <select
                            id="ikCustomizerCityTheme"
                        ></select>
    
                    </div>
    
                    <div id="ikCustomizerCityDescription" class="ik-customizer-description">
                        Native leaves Illyriad's city map unchanged.
                    </div>
    
                </div>

                <div id="ikCustomizerStatus"></div>
    
                <div class="ik-customizer-buttons">
    
                    <input
                        type="button"
                        id="ikCustomizerApply"
                        class="ik-game-button"
                        value="Apply"
                    >
    
                    <input
                        type="button"
                        id="ikCustomizerReset"
                        class="ik-game-button"
                        value="Native Reset"
                    >
    
                </div>
    
            </div>
            
            <div id="ikCustomizerAccordion">
            
                <h3>
                    <span id="ikCustomizerColorHeaderLabel">
                        Custom Color Settings
                    </span>
                </h3>
            
                <div class="ik-customizer-section">
            
                    <div class="ik-customizer-description">
                        Optional hex colours (3, 6, and 9 digit hex values).
                        Leave a field blank to use the interface theme's default.
                        Custom colours do not apply to Illyriad Native.
                    </div>

                    <div class="ik-customizer-row ik-customizer-texture-toggle">

                        <input
                            type="checkbox"
                            id="ikCustomizerReplacePaperTexture"
                        >
                    
                        <label for="ikCustomizerReplacePaperTexture">
                            Replace paper background texture with custom background colour
                        </label>
                    
                    </div>
            
                    ${COLOR_OVERRIDE_FIELDS.map(field => `
                        <div class="ik-customizer-row ik-customizer-color-row">
                    
                            <label for="${field.inputId}">
                                ${field.label}
                            </label>
                    
                            <input
                                type="text"
                                id="${field.inputId}"
                                class="ik-customizer-color-input"
                                placeholder="#RRGGBB"
                                autocomplete="off"
                                spellcheck="false"
                            >
                    
                            <span
                                id="${field.inputId}Swatch"
                                class="ik-customizer-color-swatch"
                                aria-hidden="true"
                            ></span>
                    
                        </div>
                    `).join("")}
            
                    <div class="ik-customizer-color-actions">
                    
                        <input type="button"
                               id="ikCustomizerApplyColors"
                               class="ik-game-button"
                               value="Apply">
                    
                        <input type="button"
                               id="ikCustomizerClearColors"
                               class="ik-game-button"
                               value="Clear">
                    
                    </div>
            
                </div>
            
            
                <h3>
                    <span id="ikCustomizerCssHeaderLabel">
                        Custom CSS Injection
                    </span>
                </h3>
            
                <div class="ik-customizer-section">
            
                    <div class="ik-customizer-row">
                        <label for="ikCustomizerCustomCssEnabled">
                            Custom CSS
                        </label>
            
                        <input type="checkbox"
                               id="ikCustomizerCustomCssEnabled">
                    </div>
            
                    <textarea id="ikCustomizerCustomCss"
                              spellcheck="false"
                              placeholder="Optional custom CSS"></textarea>
            
                </div>
            
            </div>

        `;


        document.body.appendChild(
            dialog
        );

        if (typeof jQuery.fn.accordion === "function") {
            jQuery("#ikCustomizerAccordion").accordion({
                header: "> h3",
                collapsible: true,
                active: false,
        
                // Modern jQuery UI
                heightStyle: "content",
        
                // Legacy jQuery UI
                autoHeight: false,
                fillSpace: false
            });
        }

        jQuery(
            dialog
        ).dialog({
            autoOpen:
                false,

            width:
                600,

            minWidth:
                520,

            minHeight:
                400,

            modal:
                false,

            resizable:
                true,

            closeOnEscape:
                true
        });


        document
            .querySelector(
                "#ikCustomizerApply"
            )
            ?.addEventListener(
                "click",
                applyFromUI
            );

        document
            .querySelector(
                "#ikCustomizerApplyColors"
            )
            ?.addEventListener(
                "click",
                applyFromUI
            );


        document
            .querySelector(
                "#ikCustomizerReset"
            )
            ?.addEventListener(
                "click",
                resetToNative
            );


        document
            .querySelector(
                "#ikCustomizerCustomCssEnabled"
            )
            ?.addEventListener(
                "change",
                syncCustomCssState
            );

        document.getElementById("ikCustomizerClearColors")
            ?.addEventListener("click", () => {
        
                for (const field of COLOR_OVERRIDE_FIELDS) {
                    const input =
                        document.getElementById(field.inputId);
        
                    if (!input) {
                        continue;
                    }
        
                    // Clear the input.
                    input.value = "";
        
                    // Reset validation and clear the preview.
                    updateColorInputValidity(input);
                }

                const textureCheckbox = document.getElementById(
                    "ikCustomizerReplacePaperTexture"
                );
                
                if (textureCheckbox) {
                    textureCheckbox.checked = false;
                }
                
                setStatus(
                    "Custom colour settings cleared. Click Apply to save."
                );
            });
        
        for (const field of COLOR_OVERRIDE_FIELDS) {
            const input = document.getElementById(
                field.inputId
            );
        
            input?.addEventListener("input", () => {
                // Update preview and clear errors on empty fields.
                // Do not flag new errors while typing.
                updateColorInputValidity(input);
            });
        }

        // Update theme descriptions immediately when selected.
        document.getElementById("ikCustomizerInterfaceTheme")
            ?.addEventListener(
                "change",
                updateThemeDescriptions
            );
        
        document.getElementById("ikCustomizerCityTheme")
            ?.addEventListener(
                "change",
                updateThemeDescriptions
            );

        syncControlsFromSettings();


        if (
            IKTools.ui &&
            typeof IKTools.ui.refreshNativeButtons ===
                "function"
        ) {
            IKTools.ui.refreshNativeButtons();
        }


        dialogCreated =
            true;


        return true;
    }


    function openCustomizer() {
        if (
            !dialogCreated
        ) {
            const created =
                createDialog();


            if (
                !created
            ) {
                console.error(
                    "IKnights Customizer could not open because jQuery UI is not ready."
                );

                return;
            }
        }


        syncControlsFromSettings();


        jQuery(
            "#" +
            DIALOG_ID
        ).dialog(
            "open"
        );


        if (
            IKTools.ui &&
            typeof IKTools.ui.refreshNativeButtons ===
                "function"
        ) {
            IKTools.ui.refreshNativeButtons();
        }
    }


    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    function initializeCustomizer() {
        if (
            !window.jQuery ||
            !jQuery.fn ||
            typeof jQuery.fn.dialog !==
                "function"
        ) {
            return false;
        }


        if (
            !settings
        ) {
            loadSettings();
        }


        applyCustomizer();


        createDialog();


        return true;
    }


    // =========================================================================
    // PUBLIC API
    // =========================================================================

    IKTools.customizer =
        IKTools.customizer ||
        {};


    IKTools.customizer.registerTheme =
        registerTheme;


    IKTools.customizer.unregisterTheme =
        unregisterTheme;


    IKTools.customizer.getThemes =
        getThemes;


    IKTools.customizer.getSettings =
        getSettings;

    IKTools.customizer.getColorOverrides =
        getColorOverrides;


    IKTools.customizer.apply =
        applyCustomizer;


    IKTools.customizer.reset =
        resetToNative;


    // =========================================================================
    // LOAD SAVED THEME IMMEDIATELY
    // =========================================================================

    loadSettings();


    applyCustomizer();


    // =========================================================================
    // REGISTER TOOL
    // =========================================================================

    IKTools.registerTool({
        id:
            "customizer",

        name:
            "Customizer",

        description:
            "Customize the Illyriad interface and city map appearance.",

        order:
            20,

        init:
            initializeCustomizer,

        open:
            openCustomizer
    });


    console.log(
        "IKnights Customizer module loaded."
    );

})();
