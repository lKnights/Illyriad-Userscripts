/*
 * IKnights Tools Suite - Customizer
 *
 * Copyright (c) 2026 IKnights
 * Licensed under the IKnights Non-Commercial License
 *
 * Customizer provides the theme engine and configuration UI
 * for IKnights Tools Suite.
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
            ""
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
                    : ""
        };
    }


    function loadSettings() {
        settings =
            normalizeSettings(
                loadJSON(
                    STORAGE_KEY,
                    DEFAULT_SETTINGS
                )
            );


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


            #ikCustomizerDialog
            .ik-customizer-buttons {

                display:
                    flex;

                flex-wrap:
                    wrap;

                align-items:
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
    }


    // =========================================================================
    // CONTROL SYNC
    // =========================================================================

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


        syncCustomCssState();
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
                    : ""
        };
    }


    // =========================================================================
    // APPLY FROM UI
    // =========================================================================

    function applyFromUI() {
        readSettingsFromControls();


        saveSettings();


        applyCustomizer();


        setStatus(
            "Customizer settings applied."
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

            <div class="ik-customizer-section">

                <div class="ik-customizer-heading">
                    Customizer
                </div>

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

                <div class="ik-customizer-description">
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

                <div class="ik-customizer-description">
                    City-map themes will appear here as they are added.
                </div>

            </div>


            <div class="ik-customizer-section">

                <div class="ik-customizer-heading">
                    Advanced
                </div>

                <div class="ik-customizer-row">

                    <label for="ikCustomizerCustomCssEnabled">
                        Custom CSS
                    </label>

                    <input
                        type="checkbox"
                        id="ikCustomizerCustomCssEnabled"
                    >

                </div>

                <textarea
                    id="ikCustomizerCustomCss"
                    spellcheck="false"
                    placeholder="Optional custom CSS"
                ></textarea>

            </div>


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


            <div id="ikCustomizerStatus"></div>

        `;


        document.body.appendChild(
            dialog
        );


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
