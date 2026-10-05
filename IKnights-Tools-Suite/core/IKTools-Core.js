/*
 * IKnights Tools Suite - Core
 * Copyright (c) 2026 IKnights
 * Licensed under the IKnights Non-Commercial License
 */

(function () {
    "use strict";

    if (window.__IKTOOLS_CORE_LOADED__) {
        return;
    }

    window.__IKTOOLS_CORE_LOADED__ = true;


    // =========================================================================
    // CORE STATE
    // =========================================================================

    let coreInitialized = false;
    let coreStarting = false;

    let activeSidebarTab = "friends";
    let sidebarRegistrationCounter = 0;

    const initializedTools = new Set();

    let nativeButtonWidth = 158;
    let nativeButtonHeight = 35;
    let nativeFallbackSkin = null;


    // =========================================================================
    // GLOBAL SUITE OBJECT
    // =========================================================================

    const IKTools =
        window.IKTools =
        window.IKTools || {};

    IKTools.tools =
        IKTools.tools || {};

    IKTools.sidebarTabs =
        IKTools.sidebarTabs || {};


    // =========================================================================
    // SHARED UTILITIES
    // =========================================================================

    function wait(ms) {
        return new Promise(
            resolve => setTimeout(resolve, ms)
        );
    }


    function loadJSON(key, fallback) {
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


    function saveJSON(key, value) {
        try {
            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

        } catch (error) {
            console.warn(
                "IKnights Tools could not save:",
                key,
                error
            );
        }
    }


    function parseHumanNumber(value) {
        if (typeof value === "number") {
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

        if (!Number.isFinite(number)) {
            return 0;
        }

        return Math.max(
            0,
            Math.floor(
                number * multiplier
            )
        );
    }


    function formatNumber(value) {
        return Math.max(
            0,
            Math.floor(
                Number(value) || 0
            )
        ).toLocaleString();
    }


    IKTools.util = {
        wait,
        loadJSON,
        saveJSON,
        parseHumanNumber,
        formatNumber
    };


    // =========================================================================
    // TOOL REGISTRY
    // =========================================================================

    IKTools.registerTool =
        function (tool) {

            if (
                !tool ||
                !tool.id ||
                !tool.name ||
                typeof tool.open !== "function"
            ) {
                console.warn(
                    "IKTools: Invalid tool registration.",
                    tool
                );

                return;
            }

            IKTools.tools[
                tool.id
            ] = tool;

            if (coreInitialized) {
                initializeTool(tool);
                renderToolsList();
            }
        };


    IKTools.openTool =
        function (id) {

            const tool =
                IKTools.tools[id];

            if (!tool) {
                console.warn(
                    "IKTools: Unknown tool:",
                    id
                );

                return;
            }

            initializeTool(tool);

            tool.open();
        };


    function initializeTool(tool) {
        if (
            !tool ||
            initializedTools.has(tool.id)
        ) {
            return true;
        }

        if (
            typeof tool.init !== "function"
        ) {
            initializedTools.add(
                tool.id
            );

            return true;
        }

        try {
            const result =
                tool.init();

            if (result === false) {
                return false;
            }

            initializedTools.add(
                tool.id
            );

            return true;

        } catch (error) {
            console.error(
                `IKTools: Failed to initialize ${tool.id}.`,
                error
            );

            return false;
        }
    }


    function initializeRegisteredTools() {
        Object.values(
            IKTools.tools
        ).forEach(
            tool => initializeTool(tool)
        );
    }


    // =========================================================================
    // SIDEBAR TAB REGISTRY
    // =========================================================================

    IKTools.registerSidebarTab =
        function (tab) {

            if (
                !tab ||
                !tab.id ||
                !tab.name
            ) {
                console.warn(
                    "IKTools: Invalid sidebar tab registration.",
                    tab
                );

                return;
            }

            if (tab.id === "friends") {
                console.warn(
                    'IKTools: "friends" is reserved for Illyriad.'
                );

                return;
            }

            sidebarRegistrationCounter++;

            tab._ikRegistrationVersion =
                sidebarRegistrationCounter;

            IKTools.sidebarTabs[
                tab.id
            ] = tab;

            if (coreInitialized) {
                ensureSidebar();
            }
        };


    IKTools.showSidebarTab =
        function (id) {
            showSidebarTab(id);
        };


    IKTools.getSidebarPanel =
        function (id) {
            return getSidebarPanel(id);
        };


    IKTools.render =
        function () {
            ensureSidebar();
            renderToolsList();
        };


    function getRegisteredSidebarTabs() {
        return Object.values(
            IKTools.sidebarTabs
        ).sort(
            (a, b) => {

                const orderA =
                    Number(
                        a.order ?? 999
                    );

                const orderB =
                    Number(
                        b.order ?? 999
                    );

                if (orderA !== orderB) {
                    return orderA - orderB;
                }

                return a.name.localeCompare(
                    b.name
                );
            }
        );
    }


    // =========================================================================
    // SIDEBAR BUTTONS
    // =========================================================================

    function getSidebarButton(id) {
        if (id === "friends") {
            return document.querySelector(
                "#FriendsBtn"
            );
        }

        if (id === "tools") {
            return document.querySelector(
                "#CommunitiesBtn"
            );
        }

        return document.querySelector(
            `[data-ik-sidebar-button="${id}"]`
        );
    }


    function createSidebarButton(
        tab,
        sideTabs
    ) {
        let button =
            getSidebarButton(tab.id);

        if (button) {
            return button;
        }

        button =
            document.createElement("div");

        /*
         * Illyriad owns the appearance.
         */
        button.className =
            "sideTab ik-suite-managed-tab";

        button.dataset
            .ikSidebarButton =
            tab.id;

        button.textContent =
            tab.name;

        button.title =
            tab.name;

        sideTabs.appendChild(
            button
        );

        return button;
    }


    function bindSidebarButton(
        id,
        button
    ) {
        if (!button) {
            return;
        }

        const bindingKey =
            `ikSidebarBound${id}`;

        if (
            button.dataset[
                bindingKey
            ] === "1"
        ) {
            return;
        }

        button.dataset[
            bindingKey
        ] = "1";

        button.addEventListener(
            "click",

            event => {
                event.preventDefault();

                event.stopImmediatePropagation();

                showSidebarTab(id);
            },

            true
        );
    }


    // =========================================================================
    // NATIVE SIDEBAR TAB LAYOUT
    // =========================================================================

    function layoutSidebarButtons() {
        const dock =
            document.querySelector(
                "#DockedFriends"
            );

        const sideTabs =
            dock?.querySelector(
                ".sideTabs"
            );

        if (
            !dock ||
            !sideTabs
        ) {
            return;
        }


        sideTabs.classList.add(
            "ik-suite-native-tabs"
        );


        const entries = [
            {
                id: "friends",
                name: "Friends",
                button:
                    getSidebarButton(
                        "friends"
                    )
            },

            ...getRegisteredSidebarTabs()
                .map(
                    tab => ({
                        id: tab.id,
                        name: tab.name,
                        button:
                            getSidebarButton(
                                tab.id
                            )
                    })
                )
        ].filter(
            entry => !!entry.button
        );


        if (!entries.length) {
            return;
        }


        /*
         * Match Illyriad's native 6px inset.
         */
        const dockWidth =
            dock.clientWidth || 245;

        const leftInset = 6;
        const rightInset = 6;

        const rightEdge =
            dockWidth - rightInset;

        const usableWidth =
            Math.max(
                1,
                rightEdge - leftInset
            );


        /*
         * Use whole pixels for the first tabs.
         *
         * The final tab receives every remaining pixel,
         * guaranteeing that its right edge ends exactly at rightEdge.
         */
        const normalTabWidth =
            Math.floor(
                usableWidth /
                entries.length
            );


        entries.forEach(
            (entry, index) => {

                const button =
                    entry.button;


                const left =
                    leftInset +
                    (
                        index *
                        normalTabWidth
                    );


                const isLast =
                    index ===
                    entries.length - 1;


                const width =
                    isLast
                        ? rightEdge - left
                        : normalTabWidth;


                button.classList.add(
                    "ik-suite-managed-tab"
                );


                /*
                 * Geometry only.
                 *
                 * We deliberately do not set colors,
                 * backgrounds, borders, fonts or other
                 * appearance properties here.
                 */
                button.style.setProperty(
                    "position",
                    "absolute",
                    "important"
                );

                button.style.setProperty(
                    "left",
                    `${left}px`,
                    "important"
                );

                button.style.setProperty(
                    "right",
                    "auto",
                    "important"
                );

                button.style.setProperty(
                    "width",
                    `${width}px`,
                    "important"
                );

                button.style.setProperty(
                    "min-width",
                    "0",
                    "important"
                );

                button.style.setProperty(
                    "max-width",
                    "none",
                    "important"
                );

                button.style.setProperty(
                    "box-sizing",
                    "border-box",
                    "important"
                );

                button.style.setProperty(
                    "cursor",
                    "pointer",
                    "important"
                );
            }
        );
    }


    // =========================================================================
    // SIDEBAR PANELS
    // =========================================================================

    function getSidebarPanel(id) {
        if (id === "friends") {
            return document.querySelector(
                "#FriendsTab"
            );
        }

        if (id === "tools") {
            return document.querySelector(
                "#CommunitiesTab"
            );
        }

        return document.querySelector(
            `[data-ik-sidebar-panel="${id}"]`
        );
    }


    function createSidebarPanel(
        tab,
        dock
    ) {
        let panel =
            getSidebarPanel(tab.id);

        if (panel) {
            return panel;
        }

        panel =
            document.createElement("div");

        panel.className =
            "ik-suite-sidebar-panel";

        panel.dataset
            .ikSidebarPanel =
            tab.id;

        panel.style.display =
            "none";

        dock.appendChild(
            panel
        );

        return panel;
    }


    function mountSidebarPanel(
        tab,
        panel
    ) {
        if (!panel) {
            return;
        }

        const version =
            String(
                tab._ikRegistrationVersion ||
                0
            );

        if (
            panel.dataset
                .ikRegistrationVersion ===
            version
        ) {
            return;
        }

        panel.dataset
            .ikRegistrationVersion =
            version;

        panel.innerHTML =
            "";

        if (
            typeof tab.mount === "function"
        ) {
            try {
                tab.mount(panel);

            } catch (error) {
                console.error(
                    `IKTools: Failed to mount sidebar tab ${tab.id}.`,
                    error
                );
            }
        }
    }


    // =========================================================================
    // SIDEBAR STATE
    // =========================================================================

    function applySidebarState() {
        const friendsButton =
            getSidebarButton(
                "friends"
            );

        const friendsPanel =
            getSidebarPanel(
                "friends"
            );


        if (friendsButton) {
            friendsButton.classList.toggle(
                "selected",
                activeSidebarTab === "friends"
            );
        }


        if (friendsPanel) {
            friendsPanel.style.display =
                activeSidebarTab === "friends"
                    ? "block"
                    : "none";
        }


        getRegisteredSidebarTabs()
            .forEach(
                tab => {

                    const button =
                        getSidebarButton(
                            tab.id
                        );

                    const panel =
                        getSidebarPanel(
                            tab.id
                        );


                    if (button) {
                        button.classList.toggle(
                            "selected",
                            activeSidebarTab ===
                                tab.id
                        );
                    }


                    if (panel) {
                        panel.style.display =
                            activeSidebarTab ===
                            tab.id
                                ? (
                                    tab.display ||
                                    "block"
                                )
                                : "none";
                    }
                }
            );
    }


    function showSidebarTab(id) {
        if (
            id !== "friends" &&
            !IKTools.sidebarTabs[id]
        ) {
            id = "friends";
        }

        activeSidebarTab =
            id;

        applySidebarState();

        if (id === "tools") {
            renderToolsList();
        }

        const tab =
            IKTools.sidebarTabs[id];

        if (
            tab &&
            typeof tab.onShow === "function"
        ) {
            try {
                tab.onShow(
                    getSidebarPanel(id)
                );

            } catch (error) {
                console.error(
                    `IKTools: Failed to show sidebar tab ${id}.`,
                    error
                );
            }
        }
    }


    // =========================================================================
    // ILLYRIAD BUTTON STYLE
    // =========================================================================

    function absolutizeCssUrls(
        cssText,
        baseUrl
    ) {
        return cssText.replace(
            /url\(\s*(['"]?)(.*?)\1\s*\)/gi,

            function (
                match,
                quote,
                url
            ) {
                if (
                    !url ||
                    /^(?:data:|https?:|\/\/|#)/i
                        .test(url)
                ) {
                    return match;
                }

                try {
                    const absolute =
                        new URL(
                            url,
                            baseUrl ||
                                location.href
                        ).href;

                    return (
                        `url("${absolute}")`
                    );

                } catch (error) {
                    return match;
                }
            }
        );
    }


    function collectSendTradeRules(
        rules,
        baseUrl,
        output
    ) {
        if (!rules) {
            return;
        }

        for (
            const rule of
            Array.from(rules)
        ) {
            try {
                if (
                    rule.type ===
                        CSSRule.STYLE_RULE &&
                    rule.selectorText &&
                    rule.selectorText.includes(
                        ".sendTrade"
                    )
                ) {
                    const selectors =
                        rule.selectorText
                            .split(",")
                            .map(
                                selector =>
                                    selector.trim()
                            )
                            .filter(
                                selector =>
                                    selector.includes(
                                        ".sendTrade"
                                    )
                            )
                            .map(
                                selector =>
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
                    rule.type ===
                        CSSRule.MEDIA_RULE
                ) {
                    const nested =
                        [];

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
                /*
                 * Ignore inaccessible stylesheet rules.
                 */
            }
        }
    }


    function installNativeButtonCss() {
        document
            .querySelector(
                "#ikNativeButtonCss"
            )
            ?.remove();

        const copiedRules =
            [];

        for (
            const sheet of
            Array.from(
                document.styleSheets
            )
        ) {
            try {
                collectSendTradeRules(
                    sheet.cssRules,
                    sheet.href ||
                        location.href,
                    copiedRules
                );

            } catch (error) {
                /*
                 * Cross-origin stylesheet.
                 */
            }
        }


        if (copiedRules.length) {
            const style =
                document.createElement(
                    "style"
                );

            style.id =
                "ikNativeButtonCss";

            style.textContent =
                copiedRules.join("\n");

            document.head.appendChild(
                style
            );
        }


        captureNativeButtonMeasurements();
    }


    function captureNativeButtonMeasurements() {
        let sample =
            document.querySelector(
                'input.sendTrade[value="Send Trade Mission"]'
            );

        let temporary =
            false;


        if (!sample) {
            sample =
                document.createElement(
                    "input"
                );

            sample.type =
                "submit";

            sample.className =
                "sendTrade";

            sample.value =
                "Send Trade Mission";

            sample.style.position =
                "fixed";

            sample.style.left =
                "-10000px";

            sample.style.top =
                "-10000px";

            sample.style.visibility =
                "hidden";

            sample.style.pointerEvents =
                "none";

            document.body.appendChild(
                sample
            );

            temporary =
                true;
        }


        const rect =
            sample.getBoundingClientRect();

        const computed =
            getComputedStyle(sample);


        const measuredWidth =
            rect.width ||
            parseFloat(
                computed.width
            );

        const measuredHeight =
            rect.height ||
            parseFloat(
                computed.height
            );


        if (
            Number.isFinite(
                measuredWidth
            ) &&
            measuredWidth > 0
        ) {
            nativeButtonWidth =
                Math.round(
                    measuredWidth
                );
        }


        if (
            Number.isFinite(
                measuredHeight
            ) &&
            measuredHeight > 0
        ) {
            nativeButtonHeight =
                Math.round(
                    measuredHeight
                );
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


        document.documentElement
            .style
            .setProperty(
                "--ik-native-button-width",
                `${nativeButtonWidth}px`
            );


        document.documentElement
            .style
            .setProperty(
                "--ik-native-button-height",
                `${nativeButtonHeight}px`
            );


        if (temporary) {
            sample.remove();
        }


        applyFallbackSkinIfNeeded();
    }


    function applyFallbackSkinIfNeeded() {
        if (
            document.querySelector(
                "#ikNativeButtonCss"
            ) ||
            !nativeFallbackSkin
        ) {
            return;
        }

        document
            .querySelectorAll(
                ".ik-game-button"
            )
            .forEach(
                button => {
                    Object.assign(
                        button.style,
                        nativeFallbackSkin
                    );
                }
            );
    }


    IKTools.ui =
        IKTools.ui || {};


    IKTools.ui.refreshNativeButtons =
        function () {
            installNativeButtonCss();
            applyFallbackSkinIfNeeded();
        };


    // =========================================================================
    // CORE CSS
    // =========================================================================

    function injectCoreStyles() {
        if (
            document.querySelector(
                "#ikToolsCoreStyles"
            )
        ) {
            return;
        }

        const style =
            document.createElement(
                "style"
            );

        style.id =
            "ikToolsCoreStyles";

        style.textContent = `

            /*
             * SAFE ILLYRIAD-STYLE BUTTONS
             */

            .ik-game-button {
                box-sizing:
                    border-box !important;

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

                float:
                    none !important;

                margin:
                    0 !important;
            }


            /*
             * NATIVE ILLYRIAD SIDEBAR TABS
             *
             * Geometry only.
             * Visual appearance remains Illyriad's .sideTab styling.
             */

            #DockedFriends > .sideTabs.ik-suite-native-tabs {
                left:
                    0 !important;

                right:
                    auto !important;

                width:
                    100% !important;

                box-sizing:
                    border-box !important;
            }


            #DockedFriends
            > .sideTabs.ik-suite-native-tabs
            > .ik-suite-managed-tab {

                min-width:
                    0 !important;

                max-width:
                    none !important;

                box-sizing:
                    border-box !important;
            }


            /*
             * SIDEBAR PANELS
             */

            #DockedFriends .ik-suite-sidebar-panel {
                position:
                    absolute !important;

                top:
                    22px !important;

                left:
                    0 !important;

                width:
                    245px !important;

                height:
                    128px !important;

                box-sizing:
                    border-box !important;

                overflow:
                    hidden !important;
            }


            /*
             * TOOLS PANEL
             */

            #ikToolsPanel {
                width:
                    245px;

                height:
                    100%;

                box-sizing:
                    border-box;

                padding:
                    4px 6px;
            }


            #ikToolsList {
                width:
                    100%;

                height:
                    100%;

                overflow-y:
                    auto;

                box-sizing:
                    border-box;

                padding-top:
                    2px;
            }


            #ikToolsList .iktools-launch-button {
                display:
                    block !important;

                margin:
                    5px auto !important;
            }


            #ikToolsList .iktools-empty {
                text-align:
                    center;

                font-style:
                    italic;

                padding-top:
                    15px;
            }


            /*
             * TEMPORARY NOTES PLACEHOLDER
             */

            .ik-suite-placeholder {
                width:
                    100%;

                height:
                    100%;

                display:
                    flex;

                align-items:
                    center;

                justify-content:
                    center;

                text-align:
                    center;

                box-sizing:
                    border-box;

                padding:
                    10px;
            }

        `;

        document.head.appendChild(
            style
        );
    }


    // =========================================================================
    // TOOLS PANEL
    // =========================================================================

    function renderToolsList() {
        const list =
            document.querySelector(
                "#ikToolsList"
            );

        if (!list) {
            return;
        }

        list.innerHTML =
            "";

        const tools =
            Object.values(
                IKTools.tools
            ).sort(
                (a, b) => {

                    const orderA =
                        Number(
                            a.order ?? 999
                        );

                    const orderB =
                        Number(
                            b.order ?? 999
                        );

                    if (
                        orderA !==
                        orderB
                    ) {
                        return (
                            orderA -
                            orderB
                        );
                    }

                    return (
                        a.name.localeCompare(
                            b.name
                        )
                    );
                }
            );


        if (!tools.length) {
            const empty =
                document.createElement(
                    "div"
                );

            empty.className =
                "iktools-empty";

            empty.textContent =
                "No tools loaded.";

            list.appendChild(
                empty
            );

            return;
        }


        tools.forEach(
            tool => {

                const button =
                    document.createElement(
                        "input"
                    );

                button.type =
                    "button";

                button.className =
                    "ik-game-button iktools-launch-button";

                button.value =
                    tool.name;

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

                list.appendChild(
                    button
                );
            }
        );


        applyFallbackSkinIfNeeded();
    }


    // =========================================================================
    // SIDEBAR CONSTRUCTION
    // =========================================================================

    function ensureSidebar() {
        const dock =
            document.querySelector(
                "#DockedFriends"
            );

        const sideTabs =
            dock?.querySelector(
                ".sideTabs"
            );

        const friendsButton =
            document.querySelector(
                "#FriendsBtn"
            );

        const friendsPanel =
            document.querySelector(
                "#FriendsTab"
            );

        const toolsButton =
            document.querySelector(
                "#CommunitiesBtn"
            );

        const toolsPanel =
            document.querySelector(
                "#CommunitiesTab"
            );


        if (
            !dock ||
            !sideTabs ||
            !friendsButton ||
            !friendsPanel ||
            !toolsButton ||
            !toolsPanel
        ) {
            return false;
        }


        document
            .querySelector(
                "#ikSidebarTabs"
            )
            ?.remove();


        friendsButton.textContent =
            "Friends";

        friendsButton.classList.add(
            "ik-suite-managed-tab"
        );

        bindSidebarButton(
            "friends",
            friendsButton
        );


        const toolsTab =
            IKTools.sidebarTabs.tools;

        if (toolsTab) {
            toolsButton.textContent =
                toolsTab.name;

            toolsButton.title =
                toolsTab.name;

            toolsButton.classList.add(
                "ik-suite-managed-tab"
            );

            bindSidebarButton(
                "tools",
                toolsButton
            );

            toolsPanel.style.position =
                "absolute";

            toolsPanel.style.top =
                "22px";

            toolsPanel.style.left =
                "0";

            toolsPanel.style.width =
                "245px";

            toolsPanel.style.height =
                "128px";

            toolsPanel.style.boxSizing =
                "border-box";

            toolsPanel.style.overflow =
                "hidden";

            mountSidebarPanel(
                toolsTab,
                toolsPanel
            );
        }


        getRegisteredSidebarTabs()
            .forEach(
                tab => {

                    if (
                        tab.id === "tools"
                    ) {
                        return;
                    }

                    const button =
                        createSidebarButton(
                            tab,
                            sideTabs
                        );

                    button.textContent =
                        tab.name;

                    button.title =
                        tab.name;

                    bindSidebarButton(
                        tab.id,
                        button
                    );


                    const panel =
                        createSidebarPanel(
                            tab,
                            dock
                        );

                    mountSidebarPanel(
                        tab,
                        panel
                    );
                }
            );


        sideTabs
            .querySelectorAll(
                "[data-ik-sidebar-button]"
            )
            .forEach(
                button => {

                    const id =
                        button.dataset
                            .ikSidebarButton;

                    if (
                        !IKTools.sidebarTabs[id]
                    ) {
                        button.remove();
                    }
                }
            );


        dock
            .querySelectorAll(
                "[data-ik-sidebar-panel]"
            )
            .forEach(
                panel => {

                    const id =
                        panel.dataset
                            .ikSidebarPanel;

                    if (
                        !IKTools.sidebarTabs[id]
                    ) {
                        panel.remove();
                    }
                }
            );


        layoutSidebarButtons();


        if (
            activeSidebarTab !==
                "friends" &&
            !IKTools.sidebarTabs[
                activeSidebarTab
            ]
        ) {
            activeSidebarTab =
                "friends";
        }


        applySidebarState();

        return true;
    }


    // =========================================================================
    // BUILT-IN SIDEBAR TABS
    // =========================================================================

    IKTools.registerSidebarTab({
        id:
            "tools",

        name:
            "Tools",

        order:
            10,

        mount:
            function (panel) {

                panel.innerHTML = `
                    <div id="ikToolsPanel">
                        <div id="ikToolsList"></div>
                    </div>
                `;

                renderToolsList();
            },

        onShow:
            function () {
                renderToolsList();
            }
    });


    /*
     * Temporary registration.
     *
     * features/Notes.js will replace this.
     */
    IKTools.registerSidebarTab({
        id:
            "notes",

        name:
            "Notes",

        order:
            20,

        mount:
            function (panel) {

                panel.innerHTML = `
                    <div class="ik-suite-placeholder">
                        Notes module not loaded yet.
                    </div>
                `;
            }
    });


    // =========================================================================
    // CORE STARTUP
    // =========================================================================

    function initializeCoreNow() {
        if (coreInitialized) {
            return true;
        }

        if (
            !document.body ||
            !document.head
        ) {
            return false;
        }


        injectCoreStyles();

        installNativeButtonCss();


        if (!ensureSidebar()) {
            return false;
        }


        initializeRegisteredTools();

        coreInitialized =
            true;


        setInterval(
            () => {

                ensureSidebar();

                initializeRegisteredTools();

                applyFallbackSkinIfNeeded();

            },

            750
        );


        console.log(
            "IKnights Tools Core loaded."
        );

        return true;
    }


    IKTools.init =
        function () {

            if (
                coreInitialized ||
                coreStarting
            ) {
                return;
            }


            coreStarting =
                true;

            let tries =
                0;


            const startup =
                setInterval(
                    () => {

                        tries++;


                        if (
                            initializeCoreNow() ||
                            tries >= 60
                        ) {
                            clearInterval(
                                startup
                            );

                            coreStarting =
                                false;
                        }

                    },

                    500
                );
        };


})();
