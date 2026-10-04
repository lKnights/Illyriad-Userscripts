// ==UserScript==
// @name         IKnights Tools Suite
// @namespace    IKnights
// @version      0.11.5
// @updateURL    https://raw.githubusercontent.com/lKnights/Illyriad-Userscripts/main/IKnights-Tools-Suite/IKnights-Tools-Suite.user.js
// @downloadURL  https://raw.githubusercontent.com/lKnights/Illyriad-Userscripts/main/IKnights-Tools-Suite/IKnights-Tools-Suite.user.js
// @description  IKnights' integrated Illyriad tools suite. Includes Quartermaster.
// @author       IKnights
// @match        https://elgea.illyriad.co.uk/*
// @match        http://elgea.illyriad.co.uk/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

(function () {
    "use strict";

    if (window.__IKNIGHTS_TOOLS_SUITE_LOADED__) {
        return;
    }

    window.__IKNIGHTS_TOOLS_SUITE_LOADED__ = true;

    // =====================================================================
    // SUITE
    // =====================================================================

    let toolsTabSelected = false;

    const IKTools = window.IKTools = window.IKTools || {};
    IKTools.tools = IKTools.tools || {};

    IKTools.registerTool = function (tool) {
        if (
            !tool ||
            !tool.id ||
            !tool.name ||
            typeof tool.open !== "function"
        ) {
            console.warn("IKTools: Invalid tool registration.", tool);
            return;
        }

        IKTools.tools[tool.id] = tool;
        renderToolsList();
    };

    IKTools.openTool = function (id) {
        const tool = IKTools.tools[id];

        if (tool) {
            tool.open();
        }
    };


    // =====================================================================
    // NATIVE ILLYRIAD BUTTON CSS
    // =====================================================================

    let nativeButtonWidth = 158;
    let nativeButtonHeight = 35;
    let nativeFallbackSkin = null;

    function absolutizeCssUrls(cssText, baseUrl) {
        return cssText.replace(
            /url\(\s*(['"]?)(.*?)\1\s*\)/gi,
            function (match, quote, url) {
                if (
                    !url ||
                    /^(?:data:|https?:|\/\/|#)/i.test(url)
                ) {
                    return match;
                }

                try {
                    const absolute =
                        new URL(url, baseUrl || location.href).href;

                    return `url("${absolute}")`;
                } catch (error) {
                    return match;
                }
            }
        );
    }

    function collectSendTradeRules(rules, baseUrl, output) {
        if (!rules) {
            return;
        }

        for (const rule of Array.from(rules)) {
            try {
                if (
                    rule.type === CSSRule.STYLE_RULE &&
                    rule.selectorText &&
                    rule.selectorText.includes(".sendTrade")
                ) {
                    const selectors =
                        rule.selectorText
                            .split(",")
                            .map(selector => selector.trim())
                            .filter(selector =>
                                selector.includes(".sendTrade")
                            )
                            .map(selector =>
                                selector.replace(
                                    /\.sendTrade/g,
                                    ".ik-game-button"
                                )
                            );

                    if (!selectors.length) {
                        continue;
                    }

                    const declaration =
                        absolutizeCssUrls(
                            rule.style.cssText,
                            baseUrl
                        );

                    output.push(
                        `${selectors.join(", ")} { ${declaration} }`
                    );

                    continue;
                }

                if (
                    rule.cssRules &&
                    rule.type === CSSRule.MEDIA_RULE
                ) {
                    const nested = [];

                    collectSendTradeRules(
                        rule.cssRules,
                        baseUrl,
                        nested
                    );

                    if (nested.length) {
                        output.push(
                            `@media ${rule.conditionText} {
                                ${nested.join("\n")}
                            }`
                        );
                    }
                }
            } catch (error) {
                // Ignore inaccessible nested rules.
            }
        }
    }

    function installNativeButtonCss() {
        document
            .querySelector("#ikNativeButtonCss")
            ?.remove();

        const copiedRules = [];

        for (
            const sheet of
            Array.from(document.styleSheets)
        ) {
            try {
                collectSendTradeRules(
                    sheet.cssRules,
                    sheet.href || location.href,
                    copiedRules
                );
            } catch (error) {
                // Cross-origin or otherwise inaccessible sheet.
            }
        }

        if (copiedRules.length) {
            const style =
                document.createElement("style");

            style.id = "ikNativeButtonCss";
            style.textContent =
                copiedRules.join("\n");

            document.head.appendChild(style);
        }

        captureNativeButtonMeasurements();
    }

    function captureNativeButtonMeasurements() {
        let sample =
            document.querySelector(
                'input.sendTrade[value="Send Trade Mission"]'
            );

        let temporary = false;

        if (!sample) {
            sample =
                document.createElement("input");

            sample.type = "submit";
            sample.className = "sendTrade";
            sample.value = "Send Trade Mission";

            sample.style.position = "fixed";
            sample.style.left = "-10000px";
            sample.style.top = "-10000px";
            sample.style.visibility = "hidden";
            sample.style.pointerEvents = "none";

            document.body.appendChild(sample);

            temporary = true;
        }

        const rect =
            sample.getBoundingClientRect();

        const computed =
            getComputedStyle(sample);

        const measuredWidth =
            rect.width ||
            parseFloat(computed.width);

        const measuredHeight =
            rect.height ||
            parseFloat(computed.height);

        if (
            Number.isFinite(measuredWidth) &&
            measuredWidth > 0
        ) {
            nativeButtonWidth =
                Math.round(measuredWidth);
        }

        if (
            Number.isFinite(measuredHeight) &&
            measuredHeight > 0
        ) {
            nativeButtonHeight =
                Math.round(measuredHeight);
        }

        nativeFallbackSkin = {
            background:
                computed.background,

            backgroundColor:
                computed.backgroundColor,

            backgroundImage:
                computed.backgroundImage,

            backgroundPosition:
                computed.backgroundPosition,

            backgroundRepeat:
                computed.backgroundRepeat,

            borderTop:
                computed.borderTop,

            borderRight:
                computed.borderRight,

            borderBottom:
                computed.borderBottom,

            borderLeft:
                computed.borderLeft,

            boxShadow:
                computed.boxShadow,

            color:
                computed.color,

            fontFamily:
                computed.fontFamily,

            fontSize:
                computed.fontSize,

            fontWeight:
                computed.fontWeight,

            lineHeight:
                computed.lineHeight,

            textAlign:
                computed.textAlign,

            textShadow:
                computed.textShadow,

            paddingTop:
                computed.paddingTop,

            paddingRight:
                computed.paddingRight,

            paddingBottom:
                computed.paddingBottom,

            paddingLeft:
                computed.paddingLeft,

            cursor:
                computed.cursor
        };

        document.documentElement.style.setProperty(
            "--ik-native-button-width",
            `${nativeButtonWidth}px`
        );

        document.documentElement.style.setProperty(
            "--ik-native-button-height",
            `${nativeButtonHeight}px`
        );

        if (temporary) {
            sample.remove();
        }

        applyFallbackSkinIfNeeded();
    }

    function applyFallbackSkinIfNeeded() {
        /*
         * Usually the cloned Illyriad CSS rules above handle everything.
         * This is only a safety net if the original stylesheet could not
         * be read through CSSOM.
         */

        if (
            document.querySelector("#ikNativeButtonCss") ||
            !nativeFallbackSkin
        ) {
            return;
        }

        document
            .querySelectorAll(".ik-game-button")
            .forEach(button => {
                Object.assign(
                    button.style,
                    nativeFallbackSkin
                );
            });
    }


    // =====================================================================
    // TOOLS TAB
    // =====================================================================

    function showToolsTab() {
        const friendsBtn =
            document.querySelector("#FriendsBtn");

        const toolsBtn =
            document.querySelector("#CommunitiesBtn");

        const friendsTab =
            document.querySelector("#FriendsTab");

        const toolsTab =
            document.querySelector("#CommunitiesTab");

        if (
            !friendsBtn ||
            !toolsBtn ||
            !friendsTab ||
            !toolsTab
        ) {
            return;
        }

        friendsBtn.classList.remove("selected");
        toolsBtn.classList.add("selected");

        friendsTab.style.display = "none";
        toolsTab.style.display = "block";

        toolsTabSelected = true;

        renderToolsList();
    }

    function showFriendsTab() {
        const friendsBtn =
            document.querySelector("#FriendsBtn");

        const toolsBtn =
            document.querySelector("#CommunitiesBtn");

        const friendsTab =
            document.querySelector("#FriendsTab");

        const toolsTab =
            document.querySelector("#CommunitiesTab");

        if (
            !friendsBtn ||
            !toolsBtn ||
            !friendsTab ||
            !toolsTab
        ) {
            return;
        }

        toolsBtn.classList.remove("selected");
        friendsBtn.classList.add("selected");

        toolsTab.style.display = "none";
        friendsTab.style.display = "block";

        toolsTabSelected = false;
    }

    function bindToolsTabs() {
        const friendsBtn =
            document.querySelector("#FriendsBtn");

        const toolsBtn =
            document.querySelector("#CommunitiesBtn");

        if (!friendsBtn || !toolsBtn) {
            return;
        }

        if (
            toolsBtn.dataset.ikToolsBound !== "1"
        ) {
            toolsBtn.dataset.ikToolsBound = "1";

            toolsBtn.addEventListener(
                "click",
                event => {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    showToolsTab();
                },
                true
            );
        }

        if (
            friendsBtn.dataset.ikToolsBound !== "1"
        ) {
            friendsBtn.dataset.ikToolsBound = "1";

            friendsBtn.addEventListener(
                "click",
                event => {
                    if (!toolsTabSelected) {
                        return;
                    }

                    event.preventDefault();
                    event.stopImmediatePropagation();

                    showFriendsTab();
                },
                true
            );
        }
    }

    function renderToolsList() {
        const list =
            document.querySelector("#ikToolsList");

        if (!list) {
            return;
        }

        list.innerHTML = "";

        const tools =
            Object.values(IKTools.tools)
                .sort((a, b) => {
                    const orderA =
                        Number(a.order ?? 999);

                    const orderB =
                        Number(b.order ?? 999);

                    if (orderA !== orderB) {
                        return orderA - orderB;
                    }

                    return a.name.localeCompare(
                        b.name
                    );
                });

        if (!tools.length) {
            const empty =
                document.createElement("div");

            empty.className =
                "iktools-empty";

            empty.textContent =
                "No tools loaded.";

            list.appendChild(empty);

            return;
        }

        tools.forEach(tool => {
            const button =
                document.createElement("input");

            button.type = "button";

            button.className =
                "ik-game-button iktools-launch-button";

            button.value = tool.name;

            button.title =
                tool.description ||
                tool.name;

            button.addEventListener(
                "click",
                () => {
                    IKTools.openTool(
                        tool.id
                    );
                }
            );

            list.appendChild(button);
        });

        applyFallbackSkinIfNeeded();
    }

    function ensureToolsPanel() {
        const dock =
            document.querySelector("#DockedFriends");

        const friendsBtn =
            document.querySelector("#FriendsBtn");

        const toolsBtn =
            document.querySelector("#CommunitiesBtn");

        const friendsTab =
            document.querySelector("#FriendsTab");

        const toolsTab =
            document.querySelector("#CommunitiesTab");

        if (
            !dock ||
            !friendsBtn ||
            !toolsBtn ||
            !friendsTab ||
            !toolsTab
        ) {
            return false;
        }

        toolsBtn.textContent = "Tools";
        toolsBtn.style.cursor = "pointer";
        toolsBtn.title = "Tools";

        if (
            toolsTab.dataset.ikToolsOwned !== "1" ||
            !toolsTab.querySelector("#ikToolsList")
        ) {
            toolsTab.dataset.ikToolsOwned = "1";

            toolsTab.innerHTML = `
                <div id="ikToolsPanel">
                    <div id="ikToolsList"></div>
                </div>
            `;

            toolsTab.style.width = "245px";
            toolsTab.style.overflow = "hidden";
        }

        bindToolsTabs();
        renderToolsList();

        if (toolsTabSelected) {
            showToolsTab();
        }

        return true;
    }


    // =====================================================================
    // SUITE STYLES
    // =====================================================================

    function injectSuiteStyles() {
        if (
            document.querySelector(
                "#ikToolsSuiteStyles"
            )
        ) {
            return;
        }

        const style =
            document.createElement("style");

        style.id =
            "ikToolsSuiteStyles";

        style.textContent = `

            /* =============================================================
               SAFE NATIVE-LOOKING BUTTONS
               ============================================================= */

            .ik-game-button {
                box-sizing: border-box !important;

                width:
                    var(
                        --ik-native-button-width,
                        158px
                    ) !important;

                min-width:
                    var(
                        --ik-native-button-width,
                        158px
                    ) !important;

                max-width:
                    var(
                        --ik-native-button-width,
                        158px
                    ) !important;

                height:
                    var(
                        --ik-native-button-height,
                        35px
                    ) !important;

                min-height:
                    var(
                        --ik-native-button-height,
                        35px
                    ) !important;

                max-height:
                    var(
                        --ik-native-button-height,
                        35px
                    ) !important;

                flex:
                    0 0
                    var(
                        --ik-native-button-width,
                        158px
                    ) !important;

                float: none !important;

                margin: 0 !important;
            }


            /* =============================================================
               TOOLS TAB
               ============================================================= */

            #ikToolsPanel {
                width: 245px;
                box-sizing: border-box;
                padding: 6px;
            }

            #ikToolsList {
                height: 120px;
                overflow-y: auto;
                box-sizing: border-box;
                padding-top: 4px;
            }

            #ikToolsList .iktools-launch-button {
                display: block !important;
                margin: 5px auto !important;
            }

            #ikToolsList .iktools-empty {
                text-align: center;
                font-style: italic;
                padding-top: 15px;
            }


            /* =============================================================
               QUARTERMASTER
               ============================================================= */

            #ikQuartermaster {
                box-sizing: border-box;
                overflow: auto;
            }

            #ikQuartermaster .ikqm-main {
                box-sizing: border-box;
                min-width: 535px;
                padding: 6px;
            }

            #ikQuartermaster .ikqm-resource-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
                margin: 5px 0;
            }

            #ikQuartermaster .ikqm-resource-row label {
                flex: 1;
                cursor: pointer;
            }

            #ikQuartermaster .ikqm-percent-wrap {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            #ikQuartermaster .ikqm-percent {
                width: 70px;
                box-sizing: border-box;
            }

            #ikQuartermaster .ikqm-total {
                margin-top: 7px;
                font-weight: bold;
            }

            #ikQuartermaster .ikqm-divider {
                border-top:
                    1px solid
                    rgba(90, 60, 20, 0.35);

                margin: 10px 0;
            }

            #ikQuartermaster .ikqm-protection-title {
                font-weight: bold;
                margin-bottom: 6px;
            }

            #ikQuartermaster .ikqm-setting-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                margin: 5px 0;
            }

            #ikQuartermaster .ikqm-setting-row label {
                flex: 1;
            }

            #ikQuartermaster #ikqmProtectionMode {
                width: 145px;
            }

            #ikQuartermaster #ikqmReserve {
                width: 140px;
                box-sizing: border-box;
            }

            #ikQuartermaster .ikqm-mode-help {
                font-size: 11px;
                margin-top: 5px;
                opacity: 0.8;
                min-height: 28px;
            }


            /* =============================================================
               FIXED-SIZE BUTTON ROWS
               ============================================================= */

            #ikQuartermaster .ikqm-button-row,
            #ikQuartermaster .ikqm-preset-buttons {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: 6px;
                width: 100%;
                box-sizing: border-box;
            }


            /* =============================================================
               SHARE / LOAD CODE ROW
               ============================================================= */

            #ikQuartermaster .ikqm-code-row {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: 6px;
                width: 100%;
                box-sizing: border-box;
                margin-top: 7px;
            }

            #ikQuartermaster #ikqmCodeBox {
                flex: 1 1 auto;
                width: auto;
                min-width: 120px;

                height:
                    var(
                        --ik-native-button-height,
                        35px
                    );

                box-sizing: border-box;
            }


            #ikQuartermaster #ikqmPresetList {
                width: 100%;
                box-sizing: border-box;
                margin-bottom: 7px;
            }

            #ikQuartermaster .ikqm-status {
                margin-top: 10px;
                min-height: 16px;
                font-size: 11px;
                font-weight: bold;
            }

        `;

        document.head.appendChild(style);
    }


    // =====================================================================
    // QUARTERMASTER CONFIG
    // =====================================================================

    const RESOURCES = [
        "Wood",
        "Clay",
        "Iron",
        "Stone",
        "Food"
    ];

    const STORAGE = {
        SETTINGS:
            "ikQuartermaster.settings.v1",

        PRESETS:
            "ikQuartermaster.presets.v1",

        GEOMETRY:
            "ikQuartermaster.geometry.v1",

        OPEN:
            "ikQuartermaster.open.v1"
    };

    const DEFAULT_SETTINGS = {
        resources: {
            Wood: {
                checked: true,
                pct: 20
            },

            Clay: {
                checked: true,
                pct: 20
            },

            Iron: {
                checked: true,
                pct: 20
            },

            Stone: {
                checked: true,
                pct: 20
            },

            Food: {
                checked: true,
                pct: 20
            }
        },

        protectionMode:
            "bilge",

        reserve:
            50000,

        selectedPreset:
            ""
    };

    let $quartermaster = null;
    let statusClearTimer = null;


    // =====================================================================
    // HELPERS
    // =====================================================================

    function wait(ms) {
        return new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    ms
                )
        );
    }

    function isTradeOrdersPage() {
        return /^#\/Trade\/Orders(?:\/|$)/
            .test(location.hash);
    }

    function loadJSON(
        key,
        fallback
    ) {
        try {
            const raw =
                localStorage.getItem(key);

            if (!raw) {
                return fallback;
            }

            return JSON.parse(raw);

        } catch (error) {
            console.warn(
                "IKnights Tools could not read:",
                key,
                error
            );

            return fallback;
        }
    }

    function saveJSON(
        key,
        value
    ) {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    }

    function cloneDefaultSettings() {
        return JSON.parse(
            JSON.stringify(
                DEFAULT_SETTINGS
            )
        );
    }

    function parseHumanNumber(value) {
        if (
            typeof value === "number"
        ) {
            return Math.max(
                0,
                Math.floor(value)
            );
        }

        let text =
            String(value || "")
                .trim()
                .toLowerCase()
                .replace(/,/g, "")
                .replace(/\s+/g, "");

        if (!text) {
            return 0;
        }

        let multiplier = 1;

        if (text.endsWith("bn")) {
            multiplier = 1000000000;
            text = text.slice(0, -2);

        } else if (text.endsWith("b")) {
            multiplier = 1000000000;
            text = text.slice(0, -1);

        } else if (text.endsWith("m")) {
            multiplier = 1000000;
            text = text.slice(0, -1);

        } else if (text.endsWith("k")) {
            multiplier = 1000;
            text = text.slice(0, -1);
        }

        const number =
            Number(text);

        if (
            !Number.isFinite(number)
        ) {
            return 0;
        }

        return Math.max(
            0,
            Math.floor(
                number *
                multiplier
            )
        );
    }

    function formatNumber(value) {
        return Math.max(
            0,
            Math.floor(
                Number(value) ||
                0
            )
        ).toLocaleString();
    }


    // =====================================================================
    // LEGACY MIGRATION
    // =====================================================================

    function migrateLegacyData() {
        if (
            !localStorage.getItem(
                STORAGE.SETTINGS
            )
        ) {
            const oldSettings =
                loadJSON(
                    "dtSplitSettings",
                    null
                );

            if (oldSettings) {
                const migrated =
                    cloneDefaultSettings();

                RESOURCES.forEach(name => {
                    if (oldSettings[name]) {
                        migrated.resources[name] = {
                            checked:
                                !!oldSettings[name].checked,

                            pct:
                                Number(
                                    oldSettings[name].pct
                                ) || 0
                        };
                    }
                });

                migrated.protectionMode =
                    "bilge";

                saveJSON(
                    STORAGE.SETTINGS,
                    migrated
                );
            }
        }

        if (
            !localStorage.getItem(
                STORAGE.PRESETS
            )
        ) {
            const oldPresets =
                loadJSON(
                    "dtSplitPresets",
                    null
                );

            if (oldPresets) {
                const migratedPresets = {};

                Object.keys(
                    oldPresets
                ).forEach(name => {
                    const oldPreset =
                        oldPresets[name];

                    const preset = {
                        resources: {},
                        protectionMode:
                            "bilge",
                        reserve:
                            50000
                    };

                    RESOURCES.forEach(
                        resource => {
                            preset.resources[
                                resource
                            ] = {
                                checked:
                                    !!oldPreset?.[
                                        resource
                                    ]?.checked,

                                pct:
                                    Number(
                                        oldPreset?.[
                                            resource
                                        ]?.pct
                                    ) || 0
                            };
                        }
                    );

                    migratedPresets[name] =
                        preset;
                });

                saveJSON(
                    STORAGE.PRESETS,
                    migratedPresets
                );
            }
        }

        if (
            !localStorage.getItem(
                STORAGE.GEOMETRY
            )
        ) {
            const oldPosition =
                loadJSON(
                    "dtSplitPopupPosition",
                    null
                );

            if (
                oldPosition &&
                typeof oldPosition.left === "number" &&
                typeof oldPosition.top === "number"
            ) {
                saveJSON(
                    STORAGE.GEOMETRY,
                    {
                        left:
                            oldPosition.left,

                        top:
                            oldPosition.top,

                        width:
                            590,

                        height:
                            520
                    }
                );
            }
        }
    }


    // =====================================================================
    // INVENTORY
    // =====================================================================

    function getResourceAmount(
        resourceName
    ) {
        const icon =
            document.querySelector(
                `.resIcon[title="${resourceName}"]`
            );

        if (!icon) {
            return 0;
        }

        const iconCell =
            icon.closest(
                "td.resIco"
            );

        if (!iconCell) {
            return 0;
        }

        const amountCell =
            iconCell.previousElementSibling;

        if (!amountCell) {
            return 0;
        }

        const value =
            Number(
                amountCell.getAttribute(
                    "data"
                )
            );

        if (
            !Number.isFinite(value)
        ) {
            return 0;
        }

        return Math.max(
            0,
            Math.floor(value)
        );
    }

    function getInventory() {
        const inventory = {};

        RESOURCES.forEach(name => {
            inventory[name] =
                getResourceAmount(name);
        });

        return inventory;
    }


    // =====================================================================
    // CARAVAN CAPACITY
    // =====================================================================

    function getCaravanCapacityPerVan() {
        const candidates =
            Array.from(
                document.querySelectorAll(
                    "div.fRight"
                )
            );

        const element =
            candidates.find(el =>
                /Caravan Capacity/i.test(
                    el.textContent
                )
            );

        if (!element) {
            return 0;
        }

        const match =
            element.textContent.match(
                /Caravan Capacity\s*([\d,]+)/i
            );

        if (!match) {
            return 0;
        }

        return Number(
            match[1].replace(
                /,/g,
                ""
            )
        ) || 0;
    }

    function getAvailableCaravans() {
        const required =
            document.querySelector(
                "#requiredVans"
            );

        if (
            !required ||
            !required.parentElement
        ) {
            return 0;
        }

        const text =
            required.parentElement
                .textContent
                .replace(/\s+/g, " ")
                .trim();

        const match =
            text.match(
                /Required Caravans:\s*[\d,]+\s*of\s*([\d,]+)/i
            );

        if (!match) {
            return 0;
        }

        return Number(
            match[1].replace(
                /,/g,
                ""
            )
        ) || 0;
    }

    function getDisplayedTotalCapacity() {
        const caravanCount =
            document.querySelector(
                "#CaravanCount"
            );

        if (!caravanCount) {
            return 0;
        }

        const row =
            caravanCount.closest("tr");

        if (!row) {
            return 0;
        }

        const cells =
            row.querySelectorAll("td");

        if (cells.length < 4) {
            return 0;
        }

        return Number(
            cells[3].textContent
                .replace(/,/g, "")
                .trim()
        ) || 0;
    }

    function getMaximumTradeCapacity() {
        const perVan =
            getCaravanCapacityPerVan();

        const vans =
            getAvailableCaravans();

        const fromVans =
            perVan * vans;

        const displayed =
            getDisplayedTotalCapacity();

        return {
            perVan,
            vans,

            displayedCapacity:
                displayed,

            maxCapacity:
                Math.max(
                    fromVans,
                    displayed
                )
        };
    }


    // =====================================================================
    // CONSIGNMENT
    // =====================================================================

    function getConsignmentRow(
        resourceName
    ) {
        const rows =
            Array.from(
                document.querySelectorAll(
                    "#consignment tr"
                )
            );

        return (
            rows.find(row => {
                const nameCell =
                    row.querySelector(
                        "td.left"
                    );

                return (
                    nameCell &&
                    nameCell.textContent.trim() ===
                        resourceName
                );
            }) || null
        );
    }

    function getQuantityInput(
        resourceName
    ) {
        const row =
            getConsignmentRow(
                resourceName
            );

        if (!row) {
            return null;
        }

        return row.querySelector(
            'input[name="Quantity"]'
        );
    }

    function getResourceTreeLink(
        resourceName
    ) {
        const links =
            Array.from(
                document.querySelectorAll(
                    "#tree a"
                )
            );

        return (
            links.find(link => {
                const text =
                    link.textContent
                        .replace(/\s+/g, " ")
                        .trim();

                return (
                    text === resourceName ||
                    text.startsWith(
                        resourceName + " ("
                    )
                );
            }) || null
        );
    }

    async function ensureResourceRows(
        resourceNames
    ) {
        const missing =
            resourceNames.filter(
                name =>
                    !getConsignmentRow(name)
            );

        if (!missing.length) {
            return true;
        }

        const links = [];

        missing.forEach(name => {
            const link =
                getResourceTreeLink(name);

            if (link) {
                links.push(link);
            }
        });

        if (!links.length) {
            return false;
        }

        links.forEach(link => {
            link.click();
        });

        const start =
            Date.now();

        while (
            Date.now() - start <
            3000
        ) {
            const allPresent =
                resourceNames.every(
                    name =>
                        !!getConsignmentRow(
                            name
                        )
                );

            if (allPresent) {
                return true;
            }

            await wait(50);
        }

        return resourceNames.every(
            name =>
                !!getConsignmentRow(name)
        );
    }

    function triggerQuantityEvents(
        input
    ) {
        [
            "input",
            "keyup",
            "change",
            "blur"
        ].forEach(type => {
            input.dispatchEvent(
                new Event(
                    type,
                    {
                        bubbles: true
                    }
                )
            );
        });
    }

    function setQuantity(
        resourceName,
        amount
    ) {
        const input =
            getQuantityInput(
                resourceName
            );

        if (!input) {
            return false;
        }

        const value =
            Math.max(
                0,
                Math.floor(amount)
            );

        input.value =
            value > 0
                ? String(value)
                : "";

        input.setAttribute(
            "value",
            value > 0
                ? String(value)
                : ""
        );

        triggerQuantityEvents(input);

        return true;
    }

    function clearBasicResourceQuantities() {
        RESOURCES.forEach(name => {
            const input =
                getQuantityInput(name);

            if (!input) {
                return;
            }

            input.value = "";

            input.setAttribute(
                "value",
                ""
            );

            triggerQuantityEvents(input);
        });
    }


    // =====================================================================
    // ALLOCATION ENGINE
    // =====================================================================

    function allocateWeighted(
        capacity,
        entries
    ) {
        const result = {};
        const caps = {};

        entries.forEach(entry => {
            result[entry.name] = 0;

            caps[entry.name] =
                Math.max(
                    0,
                    Math.floor(entry.cap)
                );
        });

        const totalPossible =
            entries.reduce(
                (sum, entry) =>
                    sum +
                    caps[entry.name],
                0
            );

        let remaining =
            Math.min(
                Math.max(
                    0,
                    Math.floor(capacity)
                ),
                totalPossible
            );

        let active =
            entries.filter(
                entry =>
                    entry.weight > 0 &&
                    caps[entry.name] > 0
            );

        while (
            remaining > 0 &&
            active.length
        ) {
            const weightSum =
                active.reduce(
                    (sum, entry) =>
                        sum +
                        entry.weight,
                    0
                );

            if (weightSum <= 0) {
                break;
            }

            const shares =
                active.map(entry => ({
                    entry,

                    available:
                        caps[entry.name] -
                        result[entry.name],

                    raw:
                        remaining *
                        (
                            entry.weight /
                            weightSum
                        )
                }));

            const capped =
                shares.filter(
                    share =>
                        share.available <=
                        share.raw
                );

            if (capped.length) {
                capped.forEach(share => {
                    result[
                        share.entry.name
                    ] +=
                        share.available;

                    remaining -=
                        share.available;
                });

                const cappedNames =
                    new Set(
                        capped.map(
                            share =>
                                share.entry.name
                        )
                    );

                active =
                    active.filter(
                        entry =>
                            !cappedNames.has(
                                entry.name
                            )
                    );

                continue;
            }

            let distributed = 0;

            const fractions =
                shares.map(share => {
                    const base =
                        Math.floor(
                            share.raw
                        );

                    result[
                        share.entry.name
                    ] +=
                        base;

                    distributed += base;

                    return {
                        entry:
                            share.entry,

                        fraction:
                            share.raw -
                            base
                    };
                });

            remaining -= distributed;

            fractions.sort(
                (a, b) =>
                    b.fraction -
                    a.fraction
            );

            for (
                let i = 0;
                i < fractions.length &&
                remaining > 0;
                i++
            ) {
                const name =
                    fractions[
                        i
                    ].entry.name;

                if (
                    result[name] <
                    caps[name]
                ) {
                    result[name] += 1;
                    remaining -= 1;
                }
            }

            break;
        }

        return result;
    }


    // =====================================================================
    // OVER-JUICE MODES
    // =====================================================================

    function makeBilgeRatAllocation(
        selected,
        inventory,
        capacity
    ) {
        const weighted =
            selected.filter(
                item =>
                    item.pct > 0
            );

        if (!weighted.length) {
            throw new Error(
                "Bilge Rat needs at least one selected resource above 0%."
            );
        }

        return allocateWeighted(
            capacity,

            weighted.map(item => ({
                name:
                    item.name,

                weight:
                    item.pct,

                cap:
                    inventory[
                        item.name
                    ] || 0
            }))
        );
    }

    function makeCrewmateAllocation(
        selected,
        inventory,
        capacity,
        reserve
    ) {
        const weighted =
            selected.filter(
                item =>
                    item.pct > 0
            );

        if (!weighted.length) {
            throw new Error(
                "Crewmate needs at least one selected resource above 0%."
            );
        }

        return allocateWeighted(
            capacity,

            weighted.map(item => {
                const current =
                    inventory[
                        item.name
                    ] || 0;

                return {
                    name:
                        item.name,

                    weight:
                        item.pct,

                    cap:
                        Math.max(
                            0,
                            current -
                                reserve
                        )
                };
            })
        );
    }

    function makeCabinBoyAllocation(
        selected,
        inventory,
        capacity
    ) {
        const entries =
            selected.map(item => {
                const current =
                    inventory[
                        item.name
                    ] || 0;

                return {
                    name:
                        item.name,

                    weight:
                        current,

                    cap:
                        current
                };
            });

        const totalStock =
            entries.reduce(
                (sum, entry) =>
                    sum +
                    entry.cap,
                0
            );

        if (totalStock <= 0) {
            throw new Error(
                "None of the selected resources are available in this town."
            );
        }

        return allocateWeighted(
            capacity,
            entries
        );
    }


    // =====================================================================
    // SETTINGS
    // =====================================================================

    function readUiState() {
        const state = {
            resources: {},

            protectionMode:
                document.querySelector(
                    "#ikqmProtectionMode"
                )?.value ||
                "bilge",

            reserve:
                parseHumanNumber(
                    document.querySelector(
                        "#ikqmReserve"
                    )?.value ||
                    0
                ),

            selectedPreset:
                document.querySelector(
                    "#ikqmPresetList"
                )?.value ||
                ""
        };

        RESOURCES.forEach(name => {
            const checkbox =
                document.querySelector(
                    `.ikqm-resource[value="${name}"]`
                );

            const pct =
                document.querySelector(
                    `.ikqm-percent[data-resource="${name}"]`
                );

            state.resources[name] = {
                checked:
                    !!checkbox?.checked,

                pct:
                    Math.max(
                        0,
                        Number(
                            pct?.value
                        ) || 0
                    )
            };
        });

        return state;
    }

    function saveSettingsFromUi() {
        saveJSON(
            STORAGE.SETTINGS,
            readUiState()
        );
    }

    function applyStateToUi(state) {
        if (!state) {
            return;
        }

        RESOURCES.forEach(name => {
            const checkbox =
                document.querySelector(
                    `.ikqm-resource[value="${name}"]`
                );

            const pct =
                document.querySelector(
                    `.ikqm-percent[data-resource="${name}"]`
                );

            const resource =
                state.resources?.[name];

            if (
                checkbox &&
                resource
            ) {
                checkbox.checked =
                    !!resource.checked;
            }

            if (
                pct &&
                resource
            ) {
                pct.value =
                    Number(
                        resource.pct
                    ) || 0;
            }
        });

        const mode =
            document.querySelector(
                "#ikqmProtectionMode"
            );

        if (mode) {
            mode.value =
                state.protectionMode ||
                "bilge";
        }

        const reserve =
            document.querySelector(
                "#ikqmReserve"
            );

        if (reserve) {
            reserve.value =
                formatNumber(
                    state.reserve ??
                    50000
                );
        }

        updateProtectionUi();
        updateModeHelp();
        updateTotal();
        updateCodeBoxFromSettings();
    }


    // =====================================================================
    // PRESETS
    // =====================================================================

    function refreshPresetList(
        selectName
    ) {
        const select =
            document.querySelector(
                "#ikqmPresetList"
            );

        if (!select) {
            return;
        }

        const presets =
            loadJSON(
                STORAGE.PRESETS,
                {}
            );

        const current =
            selectName ??
            select.value;

        select.innerHTML = "";

        const blank =
            document.createElement(
                "option"
            );

        blank.value = "";

        blank.textContent =
            "-- Select preset --";

        select.appendChild(blank);

        Object.keys(presets)
            .sort(
                (a, b) =>
                    a.localeCompare(b)
            )
            .forEach(name => {
                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    name;

                option.textContent =
                    name;

                select.appendChild(
                    option
                );
            });

        if (
            current &&
            presets[current]
        ) {
            select.value =
                current;
        }
    }

    function savePreset() {
        let name =
            prompt(
                "Preset name?"
            );

        if (!name) {
            return;
        }

        name = name.trim();

        if (!name) {
            return;
        }

        const presets =
            loadJSON(
                STORAGE.PRESETS,
                {}
            );

        if (
            presets[name] &&
            !confirm(
                `Replace preset "${name}"?`
            )
        ) {
            return;
        }

        const state =
            readUiState();

        presets[name] = {
            resources:
                state.resources,

            protectionMode:
                state.protectionMode,

            reserve:
                state.reserve
        };

        saveJSON(
            STORAGE.PRESETS,
            presets
        );

        refreshPresetList(name);

        const select =
            document.querySelector(
                "#ikqmPresetList"
            );

        if (select) {
            select.value = name;
        }

        saveSettingsFromUi();
        updateCodeBoxFromSettings();

        setStatus(
            `Preset "${name}" saved.`,
            "good"
        );
    }

    function loadPreset() {
        const select =
            document.querySelector(
                "#ikqmPresetList"
            );

        const name =
            select?.value;

        if (!name) {
            setStatus(
                "Select a preset first.",
                "warn"
            );

            return;
        }

        const presets =
            loadJSON(
                STORAGE.PRESETS,
                {}
            );

        if (!presets[name]) {
            return;
        }

        applyStateToUi(
            presets[name]
        );

        select.value = name;

        saveSettingsFromUi();
        updateCodeBoxFromSettings();

        setStatus(
            `Preset "${name}" loaded.`,
            "good"
        );
    }

    function deletePreset() {
        const select =
            document.querySelector(
                "#ikqmPresetList"
            );

        const name =
            select?.value;

        if (!name) {
            setStatus(
                "Select a preset first.",
                "warn"
            );

            return;
        }

        if (
            !confirm(
                `Delete preset "${name}"?`
            )
        ) {
            return;
        }

        const presets =
            loadJSON(
                STORAGE.PRESETS,
                {}
            );

        delete presets[name];

        saveJSON(
            STORAGE.PRESETS,
            presets
        );

        refreshPresetList("");

        saveSettingsFromUi();

        setStatus(
            `Preset "${name}" deleted.`,
            "good"
        );
    }


    // =====================================================================
    // PRESET CODES
    // =====================================================================

    function toBase36Fixed(
        value,
        length
    ) {
        return Math.max(
            0,
            Math.floor(value)
        )
            .toString(36)
            .toUpperCase()
            .padStart(
                length,
                "0"
            );
    }

    function encodePresetCode() {
        const state =
            readUiState();

        let mask = 0;

        RESOURCES.forEach(
            (name, index) => {
                if (
                    state.resources[
                        name
                    ]?.checked
                ) {
                    mask |=
                        1 << index;
                }
            }
        );

        const maskCode =
            mask
                .toString(36)
                .toUpperCase();

        const percentages =
            RESOURCES.map(name => {
                const pct =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            Math.floor(
                                Number(
                                    state.resources[
                                        name
                                    ]?.pct
                                ) || 0
                            )
                        )
                    );

                return toBase36Fixed(
                    pct,
                    2
                );
            }).join("");

        let modeCode = "B";

        if (
            state.protectionMode ===
            "crewmate"
        ) {
            modeCode = "C";

        } else if (
            state.protectionMode ===
            "cabin"
        ) {
            modeCode = "A";
        }

        const reserve =
            Math.max(
                0,
                Math.floor(
                    state.reserve || 0
                )
            )
                .toString(36)
                .toUpperCase();

        return (
            "IKQ1" +
            maskCode +
            percentages +
            modeCode +
            reserve
        );
    }

    function decodePresetCode(input) {
        const code =
            String(input || "")
                .toUpperCase()
                .replace(/\s+/g, "")
                .replace(/-/g, "");

        if (
            !code.startsWith(
                "IKQ1"
            )
        ) {
            throw new Error(
                "That is not a valid Quartermaster preset code."
            );
        }

        if (code.length < 17) {
            throw new Error(
                "That Quartermaster preset code is incomplete."
            );
        }

        const mask =
            parseInt(
                code.charAt(4),
                36
            );

        if (
            !Number.isFinite(mask) ||
            mask < 0 ||
            mask > 31
        ) {
            throw new Error(
                "Invalid resource selection in preset code."
            );
        }

        let position = 5;
        const resources = {};

        RESOURCES.forEach(
            (name, index) => {
                const pct =
                    parseInt(
                        code.slice(
                            position,
                            position + 2
                        ),
                        36
                    );

                position += 2;

                if (
                    !Number.isFinite(pct) ||
                    pct < 0 ||
                    pct > 100
                ) {
                    throw new Error(
                        "Invalid percentage in preset code."
                    );
                }

                resources[name] = {
                    checked:
                        (
                            mask &
                            (
                                1 <<
                                index
                            )
                        ) !== 0,

                    pct
                };
            }
        );

        const modeCode =
            code.charAt(position);

        position += 1;

        let protectionMode;

        if (modeCode === "C") {
            protectionMode =
                "crewmate";

        } else if (
            modeCode === "A"
        ) {
            protectionMode =
                "cabin";

        } else if (
            modeCode === "B"
        ) {
            protectionMode =
                "bilge";

        } else {
            throw new Error(
                "Invalid protection mode in preset code."
            );
        }

        const reserveText =
            code.slice(position);

        const reserve =
            reserveText
                ? parseInt(
                    reserveText,
                    36
                )
                : 0;

        if (
            !Number.isFinite(reserve) ||
            reserve < 0
        ) {
            throw new Error(
                "Invalid reserve amount in preset code."
            );
        }

        return {
            resources,
            protectionMode,
            reserve
        };
    }

    function updateCodeBoxFromSettings() {
        const box =
            document.querySelector(
                "#ikqmCodeBox"
            );

        if (!box) {
            return;
        }

        try {
            box.value =
                encodePresetCode();

        } catch (error) {
            box.value = "";
        }
    }

    async function sharePresetCode() {
        const box =
            document.querySelector(
                "#ikqmCodeBox"
            );

        const code =
            encodePresetCode();

        if (box) {
            box.value = code;
        }

        try {
            await navigator
                .clipboard
                .writeText(code);

            setStatus(
                "Preset code copied.",
                "good"
            );

        } catch (error) {
            setStatus(
                "Preset code is shown in the box.",
                "good"
            );

            box?.focus();
            box?.select();
        }
    }

    function loadPresetCode() {
        const box =
            document.querySelector(
                "#ikqmCodeBox"
            );

        const input =
            box?.value?.trim();

        if (!input) {
            setStatus(
                "Paste a preset code into the box first.",
                "warn"
            );

            return;
        }

        try {
            const state =
                decodePresetCode(input);

            applyStateToUi(state);

            saveSettingsFromUi();

            updateCodeBoxFromSettings();

            setStatus(
                "Preset code loaded.",
                "good"
            );

        } catch (error) {
            setStatus(
                error.message ||
                "Could not load preset code.",
                "error"
            );
        }
    }


    // =====================================================================
    // DISPLAY
    // =====================================================================

    function updateTotal() {
        let total = 0;

        RESOURCES.forEach(name => {
            const checkbox =
                document.querySelector(
                    `.ikqm-resource[value="${name}"]`
                );

            if (!checkbox?.checked) {
                return;
            }

            const input =
                document.querySelector(
                    `.ikqm-percent[data-resource="${name}"]`
                );

            total +=
                Number(
                    input?.value
                ) || 0;
        });

        const output =
            document.querySelector(
                "#ikqmTotal"
            );

        if (!output) {
            return;
        }

        output.textContent =
            `Total: ${total}%`;

        output.style.color =
            total === 100
                ? "#278117"
                : "#b22222";
    }

    function updateProtectionUi() {
        const mode =
            document.querySelector(
                "#ikqmProtectionMode"
            )?.value;

        const reserveRow =
            document.querySelector(
                "#ikqmReserveRow"
            );

        if (reserveRow) {
            reserveRow.style.display =
                mode === "crewmate"
                    ? "flex"
                    : "none";
        }
    }

    function updateModeHelp() {
        const mode =
            document.querySelector(
                "#ikqmProtectionMode"
            )?.value;

        const help =
            document.querySelector(
                "#ikqmModeHelp"
            );

        if (!help) {
            return;
        }

        if (mode === "crewmate") {
            help.textContent =
                "Crewmate protects your reserve and redistributes shortages to other selected resources.";

        } else if (
            mode === "cabin"
        ) {
            help.textContent =
                "Cabin Boy bases the shipment on the proportions currently stored in this town.";

        } else {
            help.textContent =
                "Bilge Rat follows your requested percentages and drains selected resources as needed to fill the vans.";
        }
    }

    function setStatus(
        message,
        type
    ) {
        const status =
            document.querySelector(
                "#ikqmStatus"
            );

        if (!status) {
            return;
        }

        if (statusClearTimer) {
            clearTimeout(
                statusClearTimer
            );

            statusClearTimer = null;
        }

        status.textContent =
            message || "";

        if (!message) {
            status.style.color = "";
            return;
        }

        if (type === "good") {
            status.style.color =
                "#278117";

        } else if (
            type === "warn"
        ) {
            status.style.color =
                "#9a6400";

        } else if (
            type === "error"
        ) {
            status.style.color =
                "#b22222";

        } else {
            status.style.color = "";
        }

        statusClearTimer =
            setTimeout(
                () => {
                    status.textContent = "";
                    status.style.color = "";
                    statusClearTimer = null;
                },
                5000
            );
    }


    // =====================================================================
    // QUARTERMASTER CONTENT
    // =====================================================================

    function createQuartermasterContents() {
        if (
            document.querySelector(
                "#ikQuartermaster"
            )
        ) {
            return;
        }

        const content =
            document.createElement("div");

        content.id =
            "ikQuartermaster";

        content.innerHTML = `

            <div class="ikqm-main">

                ${RESOURCES.map(name => `
                    <div class="ikqm-resource-row">

                        <label>
                            <input
                                type="checkbox"
                                class="ikqm-resource"
                                value="${name}"
                            >
                            ${name}
                        </label>

                        <div class="ikqm-percent-wrap">

                            <input
                                type="number"
                                class="ikqm-percent"
                                data-resource="${name}"
                                min="0"
                                max="100"
                                step="1"
                                value="0"
                            >

                            <span>%</span>

                        </div>

                    </div>
                `).join("")}


                <div
                    id="ikqmTotal"
                    class="ikqm-total"
                >
                    Total: 0%
                </div>


                <div class="ikqm-divider"></div>


                <div class="ikqm-protection-title">
                    Over-Juice Protection
                </div>


                <div class="ikqm-setting-row">

                    <label for="ikqmProtectionMode">
                        Mode:
                    </label>

                    <select id="ikqmProtectionMode">

                        <option value="crewmate">
                            Crewmate
                        </option>

                        <option value="cabin">
                            Cabin Boy
                        </option>

                        <option value="bilge">
                            Bilge Rat
                        </option>

                    </select>

                </div>


                <div
                    class="ikqm-setting-row"
                    id="ikqmReserveRow"
                >

                    <label for="ikqmReserve">
                        Leave Behind:
                    </label>

                    <input
                        type="text"
                        id="ikqmReserve"
                        value="50,000"
                    >

                </div>


                <div
                    class="ikqm-mode-help"
                    id="ikqmModeHelp"
                ></div>


                <div class="ikqm-divider"></div>


                <div class="ikqm-button-row">

                    <input
                        type="button"
                        id="ikqmNextTown"
                        class="ik-game-button"
                        value="Next Town"
                    >

                    <input
                        type="button"
                        id="ikqmLastPage"
                        class="ik-game-button"
                        value="Last Page"
                    >

                    <input
                        type="button"
                        id="ikqmDistribute"
                        class="ik-game-button"
                        value="Distribute"
                    >

                </div>


                <div class="ikqm-divider"></div>


                <select id="ikqmPresetList">

                    <option value="">
                        -- Select preset --
                    </option>

                </select>


                <div class="ikqm-preset-buttons">

                    <input
                        type="button"
                        id="ikqmLoadPreset"
                        class="ik-game-button"
                        value="Load Preset"
                    >

                    <input
                        type="button"
                        id="ikqmSavePreset"
                        class="ik-game-button"
                        value="Save Preset"
                    >

                    <input
                        type="button"
                        id="ikqmDeletePreset"
                        class="ik-game-button"
                        value="Delete Preset"
                    >

                </div>


                <div class="ikqm-code-row">

                    <input
                        type="button"
                        id="ikqmShareCode"
                        class="ik-game-button"
                        value="Share Code"
                    >

                    <input
                        type="button"
                        id="ikqmLoadCode"
                        class="ik-game-button"
                        value="Load Code"
                    >

                    <input
                        type="text"
                        id="ikqmCodeBox"
                        spellcheck="false"
                        autocomplete="off"
                        placeholder="Preset code"
                    >

                </div>


                <div
                    id="ikqmStatus"
                    class="ikqm-status"
                ></div>

            </div>
        `;

        document.body.appendChild(
            content
        );

        bindQuartermasterEvents();

        applyFallbackSkinIfNeeded();
    }


    // =====================================================================
    // QUARTERMASTER EVENTS
    // =====================================================================

    function bindQuartermasterEvents() {
        const content =
            document.querySelector(
                "#ikQuartermaster"
            );

        if (
            !content ||
            content.dataset.bound === "1"
        ) {
            return;
        }

        content.dataset.bound = "1";

        content.addEventListener(
            "input",
            event => {
                if (
                    event.target.matches(
                        ".ikqm-resource, .ikqm-percent, #ikqmReserve"
                    )
                ) {
                    updateTotal();
                    saveSettingsFromUi();
                    updateCodeBoxFromSettings();
                }
            }
        );

        content.addEventListener(
            "change",
            event => {
                if (
                    event.target.matches(
                        ".ikqm-resource, .ikqm-percent"
                    )
                ) {
                    updateTotal();
                    saveSettingsFromUi();
                    updateCodeBoxFromSettings();
                }

                if (
                    event.target.id ===
                    "ikqmProtectionMode"
                ) {
                    updateProtectionUi();
                    updateModeHelp();
                    saveSettingsFromUi();
                    updateCodeBoxFromSettings();
                }

                if (
                    event.target.id ===
                    "ikqmPresetList"
                ) {
                    saveSettingsFromUi();
                }
            }
        );

        content
            .querySelectorAll(
                ".ikqm-percent"
            )
            .forEach(input => {
                input.addEventListener(
                    "dblclick",
                    () => {
                        content
                            .querySelectorAll(
                                ".ikqm-percent"
                            )
                            .forEach(other => {
                                other.value = 0;
                            });

                        content
                            .querySelectorAll(
                                ".ikqm-resource"
                            )
                            .forEach(other => {
                                other.checked = false;
                            });

                        input.value = 100;

                        const checkbox =
                            content.querySelector(
                                `.ikqm-resource[value="${input.dataset.resource}"]`
                            );

                        if (checkbox) {
                            checkbox.checked = true;
                        }

                        updateTotal();
                        saveSettingsFromUi();
                        updateCodeBoxFromSettings();
                    }
                );
            });

        const reserve =
            document.querySelector(
                "#ikqmReserve"
            );

        reserve?.addEventListener(
            "blur",
            () => {
                reserve.value =
                    formatNumber(
                        parseHumanNumber(
                            reserve.value
                        )
                    );

                saveSettingsFromUi();
                updateCodeBoxFromSettings();
            }
        );

        document
            .querySelector(
                "#ikqmNextTown"
            )
            .addEventListener(
                "click",
                goToNextTown
            );

        document
            .querySelector(
                "#ikqmLastPage"
            )
            .addEventListener(
                "click",
                () => {
                    history.back();
                }
            );

        document
            .querySelector(
                "#ikqmDistribute"
            )
            .addEventListener(
                "click",
                distribute
            );

        document
            .querySelector(
                "#ikqmLoadPreset"
            )
            .addEventListener(
                "click",
                loadPreset
            );

        document
            .querySelector(
                "#ikqmSavePreset"
            )
            .addEventListener(
                "click",
                savePreset
            );

        document
            .querySelector(
                "#ikqmDeletePreset"
            )
            .addEventListener(
                "click",
                deletePreset
            );

        document
            .querySelector(
                "#ikqmShareCode"
            )
            .addEventListener(
                "click",
                sharePresetCode
            );

        document
            .querySelector(
                "#ikqmLoadCode"
            )
            .addEventListener(
                "click",
                loadPresetCode
            );
    }


    // =====================================================================
    // WINDOW GEOMETRY
    // =====================================================================

    function saveQuartermasterGeometry() {
        if (!$quartermaster) {
            return;
        }

        try {
            const widget =
                $quartermaster.dialog(
                    "widget"
                );

            if (!widget?.length) {
                return;
            }

            const offset =
                widget.offset();

            saveJSON(
                STORAGE.GEOMETRY,
                {
                    left:
                        Math.round(
                            offset.left
                        ),

                    top:
                        Math.round(
                            offset.top
                        ),

                    width:
                        Math.round(
                            widget.outerWidth()
                        ),

                    height:
                        Math.round(
                            widget.outerHeight()
                        )
                }
            );

        } catch (error) {
            console.warn(
                "Quartermaster could not save its position.",
                error
            );
        }
    }

    function clampQuartermaster() {
        if (!$quartermaster) {
            return;
        }

        const widget =
            $quartermaster.dialog(
                "widget"
            );

        if (!widget?.length) {
            return;
        }

        const width =
            widget.outerWidth();

        const height =
            widget.outerHeight();

        const current =
            widget.offset();

        const maxLeft =
            Math.max(
                0,
                window.innerWidth -
                width
            );

        const maxTop =
            Math.max(
                0,
                window.innerHeight -
                height
            );

        widget.css({
            left:
                Math.max(
                    0,
                    Math.min(
                        current.left,
                        maxLeft
                    )
                ) + "px",

            top:
                Math.max(
                    0,
                    Math.min(
                        current.top,
                        maxTop
                    )
                ) + "px"
        });
    }

    function restoreQuartermasterGeometry() {
        if (!$quartermaster) {
            return;
        }

        const geometry =
            loadJSON(
                STORAGE.GEOMETRY,
                null
            );

        if (!geometry) {
            return;
        }

        try {
            if (
                geometry.width &&
                geometry.height
            ) {
                $quartermaster.dialog(
                    "option",
                    "width",
                    Math.max(
                        560,
                        geometry.width
                    )
                );

                $quartermaster.dialog(
                    "option",
                    "height",
                    Math.max(
                        400,
                        geometry.height
                    )
                );
            }

            const widget =
                $quartermaster.dialog(
                    "widget"
                );

            widget.css({
                left:
                    Number(
                        geometry.left ||
                        0
                    ) + "px",

                top:
                    Number(
                        geometry.top ||
                        0
                    ) + "px"
            });

            clampQuartermaster();

        } catch (error) {
            console.warn(
                "Quartermaster could not restore its position.",
                error
            );
        }
    }


    // =====================================================================
    // QUARTERMASTER DIALOG
    // =====================================================================

    function createQuartermasterDialog() {
        if (
            !window.jQuery ||
            !jQuery.fn ||
            typeof jQuery.fn.dialog !==
                "function"
        ) {
            return false;
        }

        createQuartermasterContents();

        const saved =
            loadJSON(
                STORAGE.GEOMETRY,
                {}
            );

        $quartermaster =
            jQuery(
                "#ikQuartermaster"
            );

        $quartermaster.dialog({
            title:
                "Quartermaster",

            autoOpen:
                false,

            width:
                Math.max(
                    560,
                    Number(
                        saved.width
                    ) ||
                    600
                ),

            height:
                Math.max(
                    400,
                    Number(
                        saved.height
                    ) ||
                    520
                ),

            minWidth:
                560,

            minHeight:
                400,

            draggable:
                true,

            resizable:
                true,

            closeOnEscape:
                false,

            dragStop:
                saveQuartermasterGeometry,

            resizeStop:
                saveQuartermasterGeometry,

            open:
                function () {
                    saveJSON(
                        STORAGE.OPEN,
                        true
                    );

                    const widget =
                        $quartermaster.dialog(
                            "widget"
                        );

                    widget.addClass(
                        "flora"
                    );

                    widget.css(
                        "z-index",
                        11000
                    );

                    restoreQuartermasterGeometry();

                    updateCodeBoxFromSettings();

                    setTimeout(
                        clampQuartermaster,
                        0
                    );
                },

            close:
                function () {
                    saveQuartermasterGeometry();

                    saveJSON(
                        STORAGE.OPEN,
                        false
                    );
                }
        });

        $quartermaster
            .dialog("widget")
            .addClass("flora");

        const settings =
            loadJSON(
                STORAGE.SETTINGS,
                cloneDefaultSettings()
            );

        applyStateToUi(
            settings
        );

        refreshPresetList(
            settings.selectedPreset ||
            ""
        );

        const presetSelect =
            document.querySelector(
                "#ikqmPresetList"
            );

        if (
            presetSelect &&
            settings.selectedPreset
        ) {
            presetSelect.value =
                settings.selectedPreset;
        }

        updateProtectionUi();
        updateModeHelp();
        updateTotal();
        updateCodeBoxFromSettings();

        return true;
    }

    function openQuartermaster() {
        if (!$quartermaster) {
            return;
        }

        if (
            !$quartermaster.dialog(
                "isOpen"
            )
        ) {
            $quartermaster.dialog(
                "open"
            );

        } else {
            try {
                $quartermaster.dialog(
                    "moveToTop"
                );

            } catch (error) {}
        }

        updateTotal();
        updateModeHelp();
        updateCodeBoxFromSettings();
    }


    // =====================================================================
    // NEXT TOWN
    // =====================================================================

    function goToNextTown() {
        const nextTown =
            document.querySelector(
                "span.nextTown"
            );

        if (!nextTown) {
            setStatus(
                "Could not find Illyriad's Next Town control.",
                "error"
            );

            return;
        }

        try {
            if (window.jQuery) {
                jQuery(nextTown)
                    .trigger("mousedown")
                    .trigger("mouseup")
                    .trigger("click");

            } else {
                nextTown.dispatchEvent(
                    new MouseEvent(
                        "click",
                        {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        }
                    )
                );
            }

            setStatus(
                "Changing town..."
            );

        } catch (error) {
            console.error(
                "Quartermaster Next Town:",
                error
            );

            setStatus(
                "Next Town failed.",
                "error"
            );
        }
    }


    // =====================================================================
    // DISTRIBUTE
    // =====================================================================

    async function distribute() {
        try {
            if (!isTradeOrdersPage()) {
                throw new Error(
                    "Open Trade Orders before using Distribute."
                );
            }

            setStatus(
                "Reading trade information..."
            );

            const state =
                readUiState();

            const selected =
                RESOURCES
                    .filter(
                        name =>
                            state.resources[
                                name
                            ]?.checked
                    )
                    .map(name => ({
                        name,

                        pct:
                            Number(
                                state.resources[
                                    name
                                ]?.pct
                            ) || 0
                    }));

            if (!selected.length) {
                throw new Error(
                    "Select at least one resource."
                );
            }

            const caravan =
                getMaximumTradeCapacity();

            if (!caravan.perVan) {
                throw new Error(
                    "Could not read Caravan Capacity from Illyriad."
                );
            }

            if (!caravan.maxCapacity) {
                throw new Error(
                    "Illyriad is reporting 0 available trade capacity."
                );
            }

            const inventory =
                getInventory();

            const reserve =
                Math.max(
                    0,
                    state.reserve
                );

            let allocation;

            if (
                state.protectionMode ===
                "crewmate"
            ) {
                allocation =
                    makeCrewmateAllocation(
                        selected,
                        inventory,
                        caravan.maxCapacity,
                        reserve
                    );

            } else if (
                state.protectionMode ===
                "cabin"
            ) {
                allocation =
                    makeCabinBoyAllocation(
                        selected,
                        inventory,
                        caravan.maxCapacity
                    );

            } else {
                allocation =
                    makeBilgeRatAllocation(
                        selected,
                        inventory,
                        caravan.maxCapacity
                    );
            }

            let selectedNames;

            if (
                state.protectionMode ===
                "cabin"
            ) {
                selectedNames =
                    selected.map(
                        item =>
                            item.name
                    );

            } else {
                selectedNames =
                    selected
                        .filter(
                            item =>
                                item.pct > 0
                        )
                        .map(
                            item =>
                                item.name
                        );
            }

            setStatus(
                "Adding selected resources..."
            );

            const added =
                await ensureResourceRows(
                    selectedNames
                );

            if (!added) {
                throw new Error(
                    "Could not add every selected resource to the consignment."
                );
            }

            clearBasicResourceQuantities();

            await wait(30);

            let totalLoaded = 0;

            selectedNames.forEach(name => {
                const amount =
                    Math.max(
                        0,
                        Math.floor(
                            allocation[
                                name
                            ] || 0
                        )
                    );

                totalLoaded += amount;

                setQuantity(
                    name,
                    amount
                );
            });

            await wait(50);

            const shortfall =
                Math.max(
                    0,
                    caravan.maxCapacity -
                    totalLoaded
                );

            const modeName =
                state.protectionMode ===
                "crewmate"
                    ? "Crewmate"
                    : state.protectionMode ===
                        "cabin"
                        ? "Cabin Boy"
                        : "Bilge Rat";

            if (shortfall > 0) {
                setStatus(
                    `${modeName}: ${formatNumber(totalLoaded)} / ${formatNumber(caravan.maxCapacity)} loaded. ${formatNumber(shortfall)} capacity could not be filled.`,
                    "warn"
                );

            } else {
                setStatus(
                    `${modeName}: ${formatNumber(totalLoaded)} / ${formatNumber(caravan.maxCapacity)} loaded.`,
                    "good"
                );
            }

            saveSettingsFromUi();
            updateCodeBoxFromSettings();

        } catch (error) {
            console.error(
                "Quartermaster:",
                error
            );

            setStatus(
                error.message ||
                "Distribution failed.",
                "error"
            );
        }
    }


    // =====================================================================
    // REGISTER QUARTERMASTER
    // =====================================================================

    function registerQuartermaster() {
        IKTools.registerTool({
            id:
                "quartermaster",

            name:
                "Quartermaster",

            description:
                "Trade distribution and resource protection",

            order:
                10,

            open:
                openQuartermaster
        });
    }


    // =====================================================================
    // CLEAN OLD LAUNCHERS
    // =====================================================================

    function cleanOldLaunchers() {
        document
            .querySelector(
                "#ikqmLauncherHost"
            )
            ?.remove();

        document
            .querySelector(
                "#ikqmOpenButton"
            )
            ?.remove();

        document
            .querySelectorAll(
                ".ikqm-open-button"
            )
            .forEach(
                element =>
                    element.remove()
            );
    }


    // =====================================================================
    // STARTUP
    // =====================================================================

    function init() {
        if (
            !window.jQuery ||
            !jQuery.fn ||
            typeof jQuery.fn.dialog !==
                "function"
        ) {
            return false;
        }

        injectSuiteStyles();

        installNativeButtonCss();

        cleanOldLaunchers();

        migrateLegacyData();

        if (
            !createQuartermasterDialog()
        ) {
            return false;
        }

        registerQuartermaster();

        ensureToolsPanel();

        applyFallbackSkinIfNeeded();

        const shouldBeOpen =
            loadJSON(
                STORAGE.OPEN,
                false
            );

        if (shouldBeOpen) {
            setTimeout(
                openQuartermaster,
                100
            );
        }

        window.addEventListener(
            "resize",
            () => {
                if (
                    $quartermaster &&
                    $quartermaster.dialog(
                        "isOpen"
                    )
                ) {
                    clampQuartermaster();
                    saveQuartermasterGeometry();
                }
            }
        );

        setInterval(
            () => {
                ensureToolsPanel();
                applyFallbackSkinIfNeeded();
            },
            750
        );

        console.log(
            "IKnights Tools Suite v0.11.5 loaded."
        );

        return true;
    }


    let tries = 0;

    const startup =
        setInterval(
            () => {
                tries++;

                if (
                    init() ||
                    tries >= 60
                ) {
                    clearInterval(
                        startup
                    );
                }
            },
            500
        );

})();
