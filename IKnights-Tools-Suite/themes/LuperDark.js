/*
 * Adapted from LuperScripts_BETAs by HoRRis Lupercal.
 * Copyright (c) 2026 HoRRis Lupercal
 * Licensed under the HoRRis Lupercal Non-Commercial License.
 * Integration into IKnights Tools Suite by IKnights contributors.
 */
(function () {
    "use strict";
    if (window.__IKTOOLS_LUPER_DARK_LOADED__) return;
    if (!window.IKTools?.customizer) throw new Error("Luper Dark requires Customizer.");

    // 1. SINGLE SOURCE OF TRUTH: All variables defined once here.
    const variables = {
        "--ik-theme-bg": "#131314",
        "--ik-theme-content-bg": "#151516",
        "--ik-theme-alt-bg": "#202021",
        "--ik-theme-light-alt-bg": "#515252",
        "--ik-theme-input-bg": "#515252",
        "--ik-theme-border": "#333537",
        "--ik-theme-text": "#e3e3e3",
        "--ik-theme-special-text1": "#e5b420",
        "--ik-theme-special-text2": "#f00",
        "--ik-theme-special-text3": "#e54e20",
        "--ik-theme-special-text4": "#ea882e",
        "--ik-theme-special-text5": "#e54e20",
        "--ik-theme-special-text6": "#ea882e",
        "--ik-theme-special-text7": "#2d2e30",
        "--ik-theme-special-text8": "#1e1f20",
        "--ik-theme-special-text9": "#434343",
        "--ik-theme-health-bar": "#d0110e",
        "--ik-theme-xp-bar": "#f26723",
        "--ik-theme-link": "#ea882e",
        "--ik-theme-link-hover": "#e54e20",
        "--ik-theme-warning-highlight": "#ff000042",
        "--ik-theme-border-color": "#7c420f",
        "--ik-theme-alt-border-color": "#7c420f",
        "--ik-theme-logout": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793506244/darklogout.png")',
        "--ik-theme-tutorial": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793506245/darktutorial.png")',
        "--ik-theme-compass": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793506244/darkcompass.png")',
        "--ik-theme-scale": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793506244/darkmappscale.png")',
        "--ik-theme-texture": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408003/darkpaper2_V2.jpg")',
        "--ik-theme-headerP-texture": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407986/darkheader_banner5p_v3.jpg")',
        "--ik-theme-headerO-texture": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407985/darkheader_banner5o_v3.png")',
        "--ik-theme-header-texture": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407987/darkheader_banner5_v3.jpg")',
        "--ik-theme-headermain-texture": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407987/darkheader_clean.png")',
        "--ik-theme-popup-top": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408015/darkscroll_header3.png")',
        "--ik-theme-popup-mid": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408015/darkscroll_body5.png")',
        "--ik-theme-popup-bot": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408015/darkscroll_footer4.png")',
        "--ik-theme-herald-right": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408012/darkright_shadow.jpg")',
        "--ik-theme-herald-left": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407992/darkleft_shadow.jpg")',
        "--ik-theme-herald-title": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408002/darkpage1a.jpg")',
        "--ik-theme-herald-book": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407967/darkbook-with-pages4.jpg")',
        "--ik-theme-darkmode-credits": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407976/darkcredits_small.png")',
        "--ik-theme-border-image": 'url("https://assets.illyriad.net/img/backgrounds/borderclasps3.png")',
        "--ik-theme-small-border-image": 'url("https://assets.illyriad.net/img/backgrounds/border_tiny.png")',
        "--ik-theme-button-short-off": 'url("https://i.imgur.com/nuQOHDJ.png")',
        "--ik-theme-button-short-on": 'url("https://i.imgur.com/YN73zxB.png")',
        "--ik-theme-button-reg-off": 'url("https://i.imgur.com/FhGpJ0A.png")',
        "--ik-theme-button-reg-on": 'url("https://i.imgur.com/jBaWKfZ.png")',
        "--ik-theme-button-med-off": 'url("https://i.imgur.com/8xTzrCm.png")',
        "--ik-theme-button-med-on": 'url("https://i.imgur.com/vZvgdzo.png")',
        "--ik-theme-button-world-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408026/darkworld_64x64_off.png")',
        "--ik-theme-button-world-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408026/darkworld_64x64_on.png")',
        "--ik-theme-button-region-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408010/darkregionalbonus_32x32_off.png")',
        "--ik-theme-button-region-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408011/darkregionalbonus_32x32_on.png")',
        "--ik-theme-button-quest-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408007/darkquests_32x32_off.png")',
        "--ik-theme-button-quest-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408007/darkquests_32x32_on.png")',
        "--ik-theme-button-tourney-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408018/darktournaments_32x32_off.png")',
        "--ik-theme-button-tourney-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408019/darktournaments_32x32_on.png")',
        "--ik-theme-button-stats-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407999/darknotes2_32x32_off.png")',
        "--ik-theme-button-stats-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407999/darknotes2_32x32_on.png")',
        "--ik-theme-button-herald-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407988/darkherald_32x32_off.png")',
        "--ik-theme-button-herald-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407988/darkherald_32x32_on.png")',
        "--ik-theme-button-city-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407972/darkcity_64x64_off.png")',
        "--ik-theme-button-city-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407973/darkcity_64x64_on.png")',
        "--ik-theme-button-castle-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407968/darkcastle_32x32_off.png")',
        "--ik-theme-button-castle-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407969/darkcastle_32x32_on.png")',
        "--ik-theme-button-res-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408019/darktown_summary_32x32_off.png")',
        "--ik-theme-button-res-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408020/darktown_summary_32x32_on.png")',
        "--ik-theme-button-prod-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408005/darkproduction_summary_32x32_off.png")',
        "--ik-theme-button-prod-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408006/darkproduction_summary_32x32_on.png")',
        "--ik-theme-button-sov-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408016/darksovereignty_32x32_off.png")',
        "--ik-theme-button-sov-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408016/darksovereignty_32x32_on.png")',
        "--ik-theme-button-inv-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407990/darkinventory_32x32_off.png")',
        "--ik-theme-button-inv-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407991/darkinventory_32x32_on.png")',
        "--ik-theme-button-diplomacy-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407977/darkdiplomacy_64x64_off.png")',
        "--ik-theme-button-diplomacy-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407978/darkdiplomacy_64x64_on.png")',
        "--ik-theme-button-diplo-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407976/darkdiplo_32x32_off.png")',
        "--ik-theme-button-diplo-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407977/darkdiplo_32x32_on.png")',
        "--ik-theme-button-military-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407996/darkmilitary_64x64_off.png")',
        "--ik-theme-button-military-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407997/darkmilitary_64x64_on.png")',
        "--ik-theme-button-moves-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407997/darkmovements_32x32_off.png")',
        "--ik-theme-button-moves-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407998/darkmovements_32x32_on.png")',
        "--ik-theme-button-orders-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408001/darkorders_32x32_off.png")',
        "--ik-theme-button-orders-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408001/darkorders_32x32_on.png")',
        "--ik-theme-button-armies-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407963/darkarmies_32x32_off.png")',
        "--ik-theme-button-armies-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407964/darkarmies_32x32_on.png")',
        "--ik-theme-button-command-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407973/darkcommanders_32x32_off.png")',
        "--ik-theme-button-command-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407974/darkcommanders_32x32_on.png")',
        "--ik-theme-button-troops-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408024/darktroops_32x32_off.png")',
        "--ik-theme-button-troops-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408025/darktroops_32x32_on.png")',
        "--ik-theme-button-trade-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408022/darktrade_64x64_off.png")',
        "--ik-theme-button-trade-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408022/darktrade_64x64_on.png")',
        "--ik-theme-button-markets-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408004/darkprices_32x32_off.png")',
        "--ik-theme-button-markets-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408005/darkprices_32x32_on.png")',
        "--ik-theme-button-factions-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407980/darkfactionmarket_32x32_off.png")',
        "--ik-theme-button-factions-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407981/darkfactionmarket_32x32_on.png")',
        "--ik-theme-button-tradeunits-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408020/darktrade_32x32_off.png")',
        "--ik-theme-button-tradeunits-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408021/darktrade_32x32_on.png")',
        "--ik-theme-button-research-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408011/darkresearch_64x64_off.png")',
        "--ik-theme-button-research-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408012/darkresearch_64x64_on.png")',
        "--ik-theme-button-available-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407964/darkavailable_32x32_off.png")',
        "--ik-theme-button-available-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407965/darkavailable_32x32_on.png")',
        "--ik-theme-button-tree-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407975/darkcomplete_research_tree_32x32_off.png")',
        "--ik-theme-button-tree-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407975/darkcomplete_research_tree_32x32_on.png")',
        "--ik-theme-button-discovery-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407979/darkdiscovery_32x32_off.png")',
        "--ik-theme-button-discovery-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407979/darkdiscovery_32x32_on.png")',
        "--ik-theme-button-reading-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408009/darkreading_32x32_off.png")',
        "--ik-theme-button-reading-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408010/darkreading_32x32_on.png")',
        "--ik-theme-button-magic-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407992/darkmagic_64x64_off.png")',
        "--ik-theme-button-magic-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407993/darkmagic_64x64_on.png")',
        "--ik-theme-button-active-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408017/darkspells_in_progress_32x32_off.png")',
        "--ik-theme-button-active-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408017/darkspells_in_progress_32x32_on.png")',
        "--ik-theme-button-cast-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407970/darkcast_spell_32x32_off.png")',
        "--ik-theme-button-cast-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407970/darkcast_spell_32x32_on.png")',
        "--ik-theme-button-transmog-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408023/darktransmogrification_32x32_off.png")',
        "--ik-theme-button-transmog-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408024/darktransmogrification_32x32_on.png")',
        "--ik-theme-char-ring2-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408013/darkring2_off.png")',
        "--ik-theme-char-ring2-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408014/darkring2_on.png")',
        "--ik-theme-button-darkbg-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407965/darkbg_off.png")',
        "--ik-theme-button-darkbg-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407966/darkbg_on.png")',
        "--ik-theme-button-favourites-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407983/darkfavourites_32x32_off.png")',
        "--ik-theme-button-favourites-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407984/darkfavourites_32x32_on.png")',
        "--ik-theme-button-leaderboard-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408008/darkrankings_32x32_off.png")',
        "--ik-theme-button-leaderboard-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408008/darkrankings_32x32_on.png")',
        "--ik-theme-button-account-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407960/darkaccount_preferences_32x32_off.png")',
        "--ik-theme-button-account-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407960/darkaccount_preferences_32x32_on.png")',
        "--ik-theme-button-support-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407959/darkabout_32x32_off.png")',
        "--ik-theme-button-support-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407960/darkabout_32x32_on.png")',
        "--ik-theme-button-alliance-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407962/darkalliances_64x64_off.png")',
        "--ik-theme-button-alliance-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407963/darkalliances_64x64_on.png")',
        "--ik-theme-button-recruit-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407961/darkalliance_32x32_off.png")',
        "--ik-theme-button-recruit-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407962/darkalliance_32x32_on.png")',
        "--ik-theme-button-standings-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407982/darkfactions_standings_32x32_off.png")',
        "--ik-theme-button-standings-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407982/darkfactions_standings_32x32_on.png")',
        "--ik-theme-button-prestige-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408003/darkprestige_64x64_off.png")',
        "--ik-theme-button-prestige-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408004/darkprestige_64x64_on.png")',
        "--ik-theme-button-medal-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407995/darkmedal_32x32_off.png")',
        "--ik-theme-button-medal-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407995/darkmedal_32x32_on.png")',
        "--ik-theme-button-buy-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407967/darkbuy_prestige_32x32_off.png")',
        "--ik-theme-button-buy-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407968/darkbuy_prestige_32x32_on.png")',
        "--ik-theme-button-history-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407989/darkhistory_32x32_off.png")',
        "--ik-theme-button-history-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407990/darkhistory_32x32_on.png")',
        "--ik-theme-button-mail-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407994/darkmail_64x64_off.png")',
        "--ik-theme-button-mail-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407994/darkmail_64x64_on.png")',
        "--ik-theme-button-notif-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408000/darknotifications_32x32_off.png")',
        "--ik-theme-button-notif-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793408000/darknotifications_32x32_on.png")',
        "--ik-theme-button-forum-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407984/darkforum_32x32_off.png")',
        "--ik-theme-button-forum-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407985/darkforum_32x32_on.png")',
        "--ik-theme-button-chat-off": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407971/darkchat_32x32_off.png")',
        "--ik-theme-button-chat-on": 'url("https://res.cloudinary.com/uzoacdfm/image/upload/v1793407972/darkchat_32x32_on.png")'
    };

    let observer = null;
    let pending = null;
    const frameListeners = new Map();

    // 2. Automatically generate the CSS string block from the JavaScript object map
    function generateVariablesCSS() {
        let cssString = "html.ik-dark-mode {\n";
        for (const [key, value] of Object.entries(variables)) {
            cssString += `  ${key}: ${value};\n`;
        }
        cssString += "}\n";
        return cssString;
    }

    function styleCKEditorPanels() {
        const iframes = document.querySelectorAll("iframe.cke_panel_frame, iframe.cke_wysiwyg_frame");
        const isDark = document.body.classList.contains("ik-dark-mode");

        if (!isDark) {
            iframes.forEach(iframe => {
                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    const existingStyle = doc && doc.querySelector("#ikDarkPanelStyle");
                    if (existingStyle) existingStyle.remove();
                } catch (e) {}
            });
            return;
        }

        let rootVarsCSS = ":root {\n";
        for (const [key, value] of Object.entries(variables)) {
            rootVarsCSS += `  ${key}: ${value};\n`;
        }
        rootVarsCSS += "}\n";

        iframes.forEach(iframe => {
            try {
                if (!frameListeners.has(iframe)) {
                    iframe.addEventListener("load", scheduleEditorStyles);
                    frameListeners.set(iframe, scheduleEditorStyles);
                }
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                if (!doc || !doc.head) return;

                let style = doc.querySelector("#ikDarkPanelStyle");
                if (!style) {
                    style = doc.createElement("style");
                    style.id = "ikDarkPanelStyle";
                    doc.head.appendChild(style);
                }
                const editorCss = `
                    ${rootVarsCSS}

                    /* 1. Main Text Editing Area (WYSIWYG iframe) */
                    body, html, body.cke_editable {
                        background-color: var(--ik-theme-content-bg) !important;
                        color: var(--ik-theme-text) !important;
                    }
                    body.cke_editable a {
                        color: var(--ik-theme-link) !important;
                    }

                    /* 2. Context Menus & Popups */
                    .cke_menu {
                        background-color: var(--ik-theme-content-bg) !important;
                        border-color: var(--ik-theme-border) !important;
                    }
                    .cke_menuitem a.cke_menubutton {
                        background-color: var(--ik-theme-content-bg) !important;
                        color: var(--ik-theme-text) !important;
                    }
                    .cke_menuitem a.cke_menubutton:hover,
                    .cke_menuitem a.cke_menubutton:focus,
                    .cke_menubutton_hover,
                    .cke_menubutton_focus {
                        background-color: var(--ik-theme-light-alt-bg) !important;
                        background-image: none !important;
                        border-color: var(--ik-theme-border) !important;
                        color: var(--ik-theme-text) !important;
                    }
                    .cke_menuitem a.cke_menubutton *,
                    .cke_menubutton_hover * {
                        color: var(--ik-theme-text) !important;
                        text-shadow: none !important;
                    }
                    .cke_menubutton:hover .cke_menubutton_icon,
                    .cke_menubutton_icon {
                        filter: invert(0.85) hue-rotate(180deg) !important;
                    }

                    /* 3. Toolbar & Button Fixes */
                    .cke_button_icon {
                        filter: invert(0.85) hue-rotate(180deg) !important;
                    }
                    .cke_combo_button,
                    .cke_dialog_ui_button {
                        background-image: -webkit-linear-gradient(top, var(--ik-theme-alt-bg), var(--ik-theme-alt-bg)) !important;
                        border-color: var(--ik-theme-border) !important;
                        outline: none !important;
                        text-shadow: none !important;
                    }

                    /* 4. CKEditor Dropdown Lists */
                    .cke_panel_block,
                    .cke_panel_list {
                        background-color: var(--ik-theme-content-bg) !important;
                        border-color: var(--ik-theme-border) !important;
                    }
                    .cke_panel_grouptitle {
                        background-color: var(--ik-theme-alt-bg) !important;
                        background-image: -webkit-linear-gradient(top, var(--ik-theme-alt-bg), var(--ik-theme-alt-bg)) !important;
                        color: var(--ik-theme-text) !important;
                        border-bottom: 1px solid var(--ik-theme-border) !important;
                        text-shadow: none !important;
                    }
                    .cke_panel_listItem a {
                        color: var(--ik-theme-text) !important;
                        background-color: transparent !important;
                        border-color: var(--ik-theme-border) !important;
                    }
                `;
                if (style.textContent !== editorCss) style.textContent = editorCss;
            } catch (e) {}
        });
    }

    function scheduleEditorStyles() {
        if (pending !== null) return;
        pending = setTimeout(() => {
            pending = null;
            styleCKEditorPanels();
        }, 50);
    }

    function remove() {
        if (observer) observer.disconnect();
        observer = null;
        frameListeners.forEach((listener, iframe) => iframe.removeEventListener("load", listener));
        frameListeners.clear();
        if (pending !== null) clearTimeout(pending);
        pending = null;
        document.documentElement.classList.remove("ik-dark-mode");
        document.body.classList.remove("ik-dark-mode");
        styleCKEditorPanels();
    }

    // 3. Combine the generated variable block with the rest of your rule definitions cleanly
    const dynamicThemeCSS = generateVariablesCSS() + `
body.ik-dark-mode p:not([id*="Notes"] *),
body.ik-dark-mode td:not([id*="Notes"] *),
body.ik-dark-mode th:not([id*="Notes"] *),
body.ik-dark-mode label:not([id*="Notes"] *),
body.ik-dark-mode #resbar,
body.ik-dark-mode #resbar td,
body.ik-dark-mode #resbar span,
body.ik-dark-mode #resbar a,
body.ik-dark-mode .ui-widget-content a,
body.ik-dark-mode div#friendActivity.smallBorder div,
body.ik-dark-mode span:not([id*="Notes"] *):not(.name):not(.ui-dialog-title):not(.ui-accordion-header *):not([class*="ikcat-dialog-tab"]) {
    color: var(--ik-theme-text) !important;
}

body.ik-dark-mode a[href]:not([id*="Notes"] *),
body.ik-dark-mode .link a[href]:not([id*="Notes"] *) {
    color: var(--ik-theme-link) !important;
}
body.ik-dark-mode a[href]:not([id*="Notes"] *):hover,
body.ik-dark-mode .link a[href]:not([id*="Notes"] *):hover {
    color: var(--ik-theme-link-hover) !important;
}

body.ik-dark-mode h1 { color: var(--ik-theme-special-text4) !important; }
body.ik-dark-mode h2 { color: var(--ik-theme-special-text5) !important; }
body.ik-dark-mode h3 { color: var(--ik-theme-special-text5) !important; }
body.ik-dark-mode h4 { color: var(--ik-theme-special-text5) !important; }

body.ik-dark-mode .headLinks,
body.ik-dark-mode .headlinks,
body.ik-dark-mode .headLinks a[href],
body.ik-dark-mode .headlinks a[href] {
    color: var(--ik-theme-special-text4) !important;
}
body.ik-dark-mode .subLinks,
body.ik-dark-mode .sublinks,
body.ik-dark-mode .subLinks a[href],
body.ik-dark-mode .sublinks a[href] {
    color: var(--ik-theme-special-text4) !important;
}
body.ik-dark-mode .subLinks a.selected {
    color: var(--ik-theme-special-text5) !important;
}

body.ik-dark-mode .name,
body.ik-dark-mode span.name,
body.ik-dark-mode a.name {
    color: var(--ik-theme-special-text6) !important;
}
body.ik-dark-mode .name.nameYou,
body.ik-dark-mode span.name.nameYou,
body.ik-dark-mode a.name.nameYou {
    color: var(--ik-theme-special-text1) !important;
}
body.ik-dark-mode .name.nameSystem,
body.ik-dark-mode span.name.nameSystem,
body.ik-dark-mode a.name.nameSystem {
    color: var(--ik-theme-special-text2) !important;
}

html body.ik-dark-mode {
    background-image: var(--ik-theme-headermain-texture) !important;
    background-repeat: no-repeat !important;
}

body.ik-dark-mode [style*="font-weight:bold;color:#0000B0"] {
    color: var(--ik-theme-special-text4) !important;
}

body.ik-dark-mode div.skillBar,
body.ik-dark-mode div [style*="background-color:#860008"],
body.ik-dark-mode div [style*="background-color:#d3b994"],
body.ik-dark-mode [data-type="1"],
body.ik-dark-mode [data-type="2"],
body.ik-dark-mode [data-type="3"],
body.ik-dark-mode form.odd {
    background-color: var(--ik-theme-alt-bg) !important;
    border-color: var(--ik-theme-border-color) !important;
}
body.ik-dark-mode div [style*="background-color:#a37342"],
body.ik-dark-mode div.skillBarFill {
    background-color: var(--ik-theme-xp-bar) !important;
}
body.ik-dark-mode div [style*="background-color:#950b09"] {
    background-color: var(--ik-theme-health-bar) !important;
}
body.ik-dark-mode div [style*="color: #004B00"] {
    color: var(--ik-theme-special-text3) !important;
}
body.ik-dark-mode fieldset { border-color: var(--ik-theme-alt-border-color) !important; }

body.ik-dark-mode div.b-page {
    background-color: var(--ik-theme-alt-bg) !important;
}

body.ik-dark-mode div.headline {
    color: var(--ik-theme-special-text4) !important;
}

body.ik-dark-mode #book [style*="color:black"] {
    color: var(--ik-theme-special-text4) !important;
}

body.ik-dark-mode div.b-wrap.b-wrap-right {
    background-image: var(--ik-theme-herald-right) !important;
}

body.ik-dark-mode div.b-wrap.b-wrap-left {
    background-image: var(--ik-theme-herald-left) !important;
}

body.ik-dark-mode div.b-page.b-page-0.b-p1 div.b-wrap.b-wrap-left {
    background-image: var(--ik-theme-herald-title) !important;
}

body.ik-dark-mode div#hidePage {
    background-image: var(--ik-theme-herald-book) !important;
}

body.ik-dark-mode input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]),
body.ik-dark-mode textarea:not(#ikNotesTextarea),
body.ik-dark-mode select {
    background-color: var(--ik-theme-input-bg) !important;
    color: var(--ik-theme-text) !important;
    border: 1px solid var(--ik-theme-border) !important;
}

body.ik-dark-mode div div.content table.generic tbody tr td#contentTD div.largeBorder div.scrollContent div#MainContentDiv div.info div div#radio.center.ui-buttonset {
    background-image: var(--ik-theme-header-texture) !important;
}

body.ik-dark-mode .ui-state-default {
    color: var(--ik-theme-special-text4) !important;
    background-image: var(--ik-theme-header-texture) !important;
    border-color: var(--ik-theme-border-color) !important;
}

body.ik-dark-mode div div.content table.generic tbody tr td#contentTD div.largeBorder div.scrollContent div#MainContentDiv div div.smallBorder > div:first-of-type {
    background-image: var(--ik-theme-header-texture) !important;
}

body.ik-dark-mode div div.content table.generic tbody tr td#contentTD div.largeBorder div.scrollContent div#MainContentDiv div div.smallBorder div#medalCost div {
    background-image: var(--ik-theme-header-texture) !important;
}

body.ik-dark-mode div#AwardMedalHTML div.smallBorder div form div div {
    background-color: var(--ik-theme-alt-bg) !important;
}

body.ik-dark-mode div#AwardMedalHTML div.smallBorder div form div div div.odd {
background-color: var(--ik-theme-light-alt-bg) !important;
}

body.ik-dark-mode .ui-state-default a[href],
body.ik-dark-mode .ui-state-default a,
body.ik-dark-mode .ui-tabs-nav li:not(.ui-tabs-selected):not(.ui-tabs-active) a,
body.ik-dark-mode .ui-tabs-nav li:not(.ui-tabs-selected):not(.ui-tabs-active) a[href] {
    color: var(--ik-theme-special-text4) !important;
}

body.ik-dark-mode .ui-state-active, body.ik-dark-mode .ui-state-active a, body.ik-dark-mode .ui-state-active a[href] {
    color: var(--ik-theme-special-text5) !important;
}

body.ik-dark-mode .ui-widget-content:not([id="ikNotesPanel"]):not([id="ikNotesPanel"] *) {
    background-color: var(--ik-theme-content-bg) !important;
    background-image: var(--ik-theme-texture) !important;
    color: var(--ik-theme-text) !important;
    border-color: var(--ik-theme-border-color) !important;
}

body.ik-dark-mode .ui-accordion-header h3 a span:not([id*="Notes"] *),
body.ik-dark-mode div.accordionCommand h3.ui-accordion-header a table.generic tbody tr td:not([id*="Notes"] *) {
    color: var(--ik-theme-special-text4) !important;
    border-color: var(--ik-theme-border-color) !important;
}

body.ik-dark-mode .ui-accordion-header.ui-state-active a,
body.ik-dark-mode .ui-accordion-header.ui-state-active a[href],
body.ik-dark-mode div.accordionCommand h3.ui-accordion-header.ui-state-active a table.generic tbody tr td:not([id*="Notes"] *) {
    color: var(--ik-theme-special-text5) !important;
    border-color: var(--ik-theme-border-color) !important;
}

body.ik-dark-mode .sideTab,
body.ik-dark-mode span.ikcat-dialog-tab:not([id*="Notes"] *) {
    background-image: var(--ik-theme-headerO-texture) !important;
    background-repeat: repeat !important;
    color: var(--ik-theme-special-text4) !important;
}

body.ik-dark-mode .sideTab.selected,
body.ik-dark-mode span.ikcat-dialog-tab.data-tab:not([id*="Notes"] *),
body.ik-dark-mode span.ikcat-dialog-tab.selected:not([id*="Notes"] *) {
    background-image: var(--ik-theme-texture) !important;
    background-repeat: repeat !important;
    color: var(--ik-theme-special-text5) !important;
}

body.ik-dark-mode tr.odd,
body.ik-dark-mode li.odd,
body.ik-dark-mode form.odd,
body.ik-dark-mode table.oddeven > tbody > tr:nth-child(2n),
body.ik-dark-mode table.evenodd > tbody > tr:nth-child(2n+1),
body.ik-dark-mode .ui-widget-content div.oddeven > div:not([id*="chat"]):nth-child(2n),
body.ik-dark-mode table.oddevencols > colgroup > col:nth-child(2n+1),
body.ik-dark-mode #Notifications > div:nth-child(2n),
body.ik-dark-mode td.rhsPanel div#sideBar.smallScrollContent div#DockedChat.smallBorder div#globalChatTab div.globalChatHldr div.globalChat.oddeven div:nth-child(2n),
body.ik-dark-mode td#contentTD div.largeBorder div.scrollContent div#MainContentDiv div.info div.odd,
body.ik-dark-mode td#contentTD div.largeBorder div.scrollContent div#MainContentDiv table.generic tbody tr td div.odd,
body.ik-dark-mode colgroup.odd, body.ik-dark-mode colgroup col.odd, body.ik-dark-mode table.generic.odd,
body.ik-dark-mode td#contentTD div.largeBorder div.scrollContent div#MainContentDiv div.info div table.generic.middle.oddeven tbody tr th,
body.ik-dark-mode td#contentTD div.largeBorder div.scrollContent div#MainContentDiv div.info div table.generic.middle.oddeven tbody tr td:nth-of-type(2),
body.ik-dark-mode tr td#contentTD div.largeBorder div.scrollContent div#MainContentDiv div.info div#recentEvents.center.evenodd div.combat:nth-child(2n+1),
body.ik-dark-mode td.rhsPanel div#sideBar.smallScrollContent div#DockedChat.smallBorder div#allianceChatTab div.allianceChatHldr div.allianceChat.oddeven div:nth-child(2n) {
    background-color: var(--ik-theme-alt-bg) !important;
}

body.ik-dark-mode .ui-dialog .ui-dialog-buttonpane button,
body.ik-dark-mode button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only {
    background-image: var(--ik-theme-button-short-off) !important;
    background-repeat: no-repeat !important;
    background-size: 100% 100% !important;
}
body.ik-dark-mode .ui-dialog .ui-dialog-buttonpane button.ui-state-hover,
body.ik-dark-mode button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only.ui-state-hover {
    background-image: var(--ik-theme-button-short-on) !important;
    background-repeat: no-repeat !important;
    background-size: 100% 100% !important;
}

body.ik-dark-mode div.ui-state-hover,
body.ik-dark-mode a#ui-active-menuitem,
body.ik-dark-mode a.ui-state-hover,
body.ik-dark-mode .ui-menu .ui-menu-item a.ui-state-hover,
body.ik-dark-mode .ui-autocomplete li a.ui-state-hover,
body.ik-dark-mode a.jstree-clicked,
body.ik-dark-mode a.jstree-hovered {
    background-color: var(--ik-theme-alt-bg) !important;
    background-image: none !important;
}

body.ik-dark-mode .topBar {
    background-color: var(--ik-theme-content-bg) !important;
    color: var(--ik-theme-text) !important;
    border-color: var(--ik-theme-alt-border-color) !important;
}
body.ik-dark-mode .ui-dialog .ui-dialog-title:not([id*="Notes"] *),
body.ik-dark-mode span.ui-dialog-title:not([id*="Notes"] *) {
    background-color: var(--ik-theme-content-bg) !important;
    color: var(--ik-theme-special-text3) !important;
}

body.ik-dark-mode div.flotr-legend { background-color: var(--ik-theme-alt-bg) !important; }
body.ik-dark-mode legend { color: var(--ik-theme-special-text3) !important; }

body.ik-dark-mode #dTownTD *, body.ik-dark-mode .dTownTD *, body.ik-dark-mode #citiesMenu { background-color: var(--ik-theme-special-text8) !important; }
body.ik-dark-mode .cityMenu.selected { background-color: var(--ik-theme-special-text7) !important; }

body.ik-dark-mode div.ui-accordion-content.ui-helper-reset.ui-widget-content.ui-corner-bottom.ui-accordion-content-active hr,
body.ik-dark-mode div#MainContentDiv div.info hr {
    border-color: var(--ik-theme-border-color) !important;
}

body.ik-dark-mode #cke_MsgBodyEditor,
body.ik-dark-mode .cke_chrome,
body.ik-dark-mode .cke_inner,
body.ik-dark-mode .cke_maximized,
body.ik-dark-mode .cke_maximized .cke_inner {
    background-color: var(--ik-theme-alt-bg) !important;
    border-color: var(--ik-theme-border) !important;
}

body.ik-dark-mode .cke_maximized .cke_contents {
    background-color: var(--ik-theme-content-bg) !important;
}

body.ik-dark-mode .cke_combo_text,
body.ik-dark-mode .cke_button_label,
body.ik-dark-mode .cke_reset_all * {
    color: var(--ik-theme-text) !important;
    text-shadow: none !important;
}
body.ik-dark-mode .cke_reset_all {
    background-color: var(--ik-theme-alt-bg) !important;
    border-color: var(--ik-theme-border) !important;
    color: var(--ik-theme-text) !important;
}

body.ik-dark-mode span.cke_top,
body.ik-dark-mode .cke_toolbox {
    background-color: var(--ik-theme-content-bg) !important;
    background-image: var(--ik-theme-header-texture) !important;
    border-bottom: 1px solid var(--ik-theme-border) !important;
    box-shadow: none !important;
}

body.ik-dark-mode span.cke_bottom {
    background-color: var(--ik-theme-content-bg) !important;
    background-image: var(--ik-theme-header-texture) !important;
    border-top: 1px solid var(--ik-theme-border) !important;
    box-shadow: none !important;
}

body.ik-dark-mode .cke_toolgroup {
    background: var(--ik-theme-alt-bg) !important;
    border-color: var(--ik-theme-border) !important;
}

body.ik-dark-mode a.cke_button {
    background: transparent !important;
    text-shadow: none !important;
}
body.ik-dark-mode a.cke_dialog_ui_button span {
    text-shadow: none !important;
}

body.ik-dark-mode a.cke_button:hover,
body.ik-dark-mode a.cke_button_on {
    background-color: var(--ik-theme-light-alt-bg) !important;
    border-color: var(--ik-theme-border) !important;
}

body.ik-dark-mode .cke_button_icon {
    filter: invert(0.85) hue-rotate(180deg) !important;
}

body.ik-dark-mode .cke_combo_button,
body.ik-dark-mode .cke_dialog_ui_button {
    background-image: -webkit-linear-gradient(top, var(--ik-theme-alt-bg), var(--ik-theme-alt-bg)) !important;
    border-color: var(--ik-theme-border) !important;
    outline: none !important;
    text-shadow: none !important;
}

body.ik-dark-mode .cke_dialog .ImagePreviewBox {
    background-color: var(--ik-theme-input-bg) !important;
    border-color: var(--ik-theme-border) !important;
    color: var(--ik-theme-text) !important;
}

body.ik-dark-mode .cke_dialog .cke_dark_background {
    background-color: var(--ik-theme-alt-bg) !important;
    border-color: var(--ik-theme-border) !important;
    color: var(--ik-theme-text) !important;
}
body.ik-dark-mode a.cke_specialchar:focus {
    background-color: var(--ik-theme-alt-bg) !important;
    border-color: transparent !important;
    color: var(--ik-theme-text) !important;
}
body.ik-dark-mode a.cke_specialchar:hover {
    background-color: var(--ik-theme-light-alt-bg) !important;
    border-color: var(--ik-theme-border) !important;
    color: var(--ik-theme-text) !important;
}

body.ik-dark-mode td.cke_dialog_footer,
body.ik-dark-mode div.cke_dialog_title {
    box-shadow: none !important;
    text-shadow: none !important;
    background-color: var(--ik-theme-content-bg) !important;
    background-image: var(--ik-theme-header-texture) !important;
    border-color: var(--ik-theme-border) !important;
}
body.ik-dark-mode div.cke_inner,
body.ik-dark-mode td.cke_dialog_contents_body,
body.ik-dark-mode .cke_dialog_contents,
body.ik-dark-mode .cke_menu {
    background-color: var(--ik-theme-content-bg) !important;
    border-color: var(--ik-theme-border) !important;
    color: var(--ik-theme-text) !important;
}
body.ik-dark-mode .cke_dialog iframe.cke_pasteframe,
body.ik-dark-mode .cke_pasteframe,
body.ik-dark-mode .cke_panel {
    background-color: var(--ik-theme-alt-bg) !important;
    border-color: var(--ik-theme-border) !important;
}
body.ik-dark-mode .cke_dialog_body {
    background-color: var(--ik-theme-alt-bg) !important;
}
body.ik-dark-mode .cke_dialog_tab {
    background-image: -webkit-linear-gradient(top, var(--ik-theme-alt-bg), var(--ik-theme-alt-bg)) !important;
}
body.ik-dark-mode .cke_dialog_tab_selected {
    background-image: -webkit-linear-gradient(top, var(--ik-theme-content-bg), var(--ik-theme-content-bg)) !important;
}
body.ik-dark-mode .cke_dialog_background_cover {
    background-color: var(--ik-theme-bg) !important;
}

body.ik-dark-mode .largeBorder { border-image: var(--ik-theme-border-image) 33 35 stretch repeat !important; }
body.ik-dark-mode .smallBorder, body.ik-dark-mode .ui-dialog { border-image: var(--ik-theme-small-border-image) 10 6 10 6 stretch !important; }

html.ik-dark-mode {
    background-image: var(--ik-theme-darkmode-credits) !important;
}
body.ik-dark-mode .smallBorder,
body.ik-dark-mode #DockedFriends,
body.ik-dark-mode .ui-state-active {
    background-image: var(--ik-theme-texture) !important;
    background-repeat: repeat !important;
}
body.ik-dark-mode div.headlinks a.selected,
body.ik-dark-mode div.headLinks a.selected,
body.ik-dark-mode .headlinks a.selected,
body.ik-dark-mode .headLinks a.selected {
    background: var(--ik-theme-texture) repeat !important;
    background-image: var(--ik-theme-texture) !important;
    background-repeat: repeat !important;
    background-size: auto !important;
}
body.ik-dark-mode .ui-widget-header {
    background-image: var(--ik-theme-header-texture) !important;
    background-repeat: repeat !important;
}
body.ik-dark-mode #contentTD {
    background-image: var(--ik-theme-header-texture) !important;
    background-color: var(--ik-theme-content-bg) !important;
}
body.ik-dark-mode .ui-dialog .ui-dialog-titlebar {
    background-image: var(--ik-theme-headerO-texture) !important;
    background-repeat: repeat !important;
}
body.ik-dark-mode .headlinks,
body.ik-dark-mode .headLinks {
    background-image: var(--ik-theme-headerO-texture) !important;
}

body.ik-dark-mode img.logout {
    content: var(--ik-theme-logout) !important;
}

body.ik-dark-mode .vid {
    background-image: var(--ik-theme-tutorial) !important;
}

body.ik-dark-mode #ctrlCompass { content: var(--ik-theme-compass) !important; }

body.ik-dark-mode div[style*="mapscale.png"] { background-image: var(--ik-theme-scale) !important; }

body.ik-dark-mode div.iconBox.ib1 a img.icon { content: var(--ik-theme-button-world-off) !important; }
body.ik-dark-mode div.iconBox.ib1 a:hover img.icon { content: var(--ik-theme-button-world-on) !important; }
body.ik-dark-mode div.iconBox.ib1.top a img.sIcon.sIcon1 { content: var(--ik-theme-button-region-off) !important; }
body.ik-dark-mode div.iconBox.ib1.top a:hover img.sIcon.sIcon1 { content: var(--ik-theme-button-region-on) !important; }
body.ik-dark-mode div.iconBox.ib1.top a img.sIcon.sIcon2 { content: var(--ik-theme-button-quest-off) !important; }
body.ik-dark-mode div.iconBox.ib1.top a:hover img.sIcon.sIcon2 { content: var(--ik-theme-button-quest-on) !important; }
body.ik-dark-mode div.iconBox.ib1.top a img.sIcon.sIcon3 { content: var(--ik-theme-button-tourney-off) !important; }
body.ik-dark-mode div.iconBox.ib1.top a:hover img.sIcon.sIcon3 { content: var(--ik-theme-button-tourney-on) !important; }
body.ik-dark-mode div.iconBox.ib1.top a img.sIcon.sIcon4 { content: var(--ik-theme-button-stats-off) !important; }
body.ik-dark-mode div.iconBox.ib1.top a:hover img.sIcon.sIcon4 { content: var(--ik-theme-button-stats-on) !important; }
body.ik-dark-mode div.iconBox.ib1.top a img.sIcon.sIcon5 { content: var(--ik-theme-button-herald-off) !important; }
body.ik-dark-mode div.iconBox.ib1.top a:hover img.sIcon.sIcon5 { content: var(--ik-theme-button-herald-on) !important; }

body.ik-dark-mode div.iconBox.ib2 a img.icon { content: var(--ik-theme-button-city-off) !important; }
body.ik-dark-mode div.iconBox.ib2 a:hover img.icon { content: var(--ik-theme-button-city-on) !important; }
body.ik-dark-mode div.iconBox.ib2.top a img.sIcon.sIcon1 { content: var(--ik-theme-button-castle-off) !important; }
body.ik-dark-mode div.iconBox.ib2.top a:hover img.sIcon.sIcon1 { content: var(--ik-theme-button-castle-on) !important; }
body.ik-dark-mode div.iconBox.ib2.top a img.sIcon.sIcon2 { content: var(--ik-theme-button-res-off) !important; }
body.ik-dark-mode div.iconBox.ib2.top a:hover img.sIcon.sIcon2 { content: var(--ik-theme-button-res-on) !important; }
body.ik-dark-mode div.iconBox.ib2.top a img.sIcon.sIcon3 { content: var(--ik-theme-button-prod-off) !important; }
body.ik-dark-mode div.iconBox.ib2.top a:hover img.sIcon.sIcon3 { content: var(--ik-theme-button-prod-on) !important; }
body.ik-dark-mode div.iconBox.ib2.top a img.sIcon.sIcon4 { content: var(--ik-theme-button-sov-off) !important; }
body.ik-dark-mode div.iconBox.ib2.top a:hover img.sIcon.sIcon4 { content: var(--ik-theme-button-sov-on) !important; }
body.ik-dark-mode div.iconBox.ib2.top a img.sIcon.sIcon5 { content: var(--ik-theme-button-inv-off) !important; }
body.ik-dark-mode div.iconBox.ib2.top a:hover img.sIcon.sIcon5 { content: var(--ik-theme-button-inv-on) !important; }

body.ik-dark-mode div.iconBox.ib3 a img.icon { content: var(--ik-theme-button-military-off) !important; }
body.ik-dark-mode div.iconBox.ib3 a:hover img.icon { content: var(--ik-theme-button-military-on) !important; }
body.ik-dark-mode div.iconBox.ib3.top a img.sIcon.sIcon1 { content: var(--ik-theme-button-moves-off) !important; }
body.ik-dark-mode div.iconBox.ib3.top a:hover img.sIcon.sIcon1 { content: var(--ik-theme-button-moves-on) !important; }
body.ik-dark-mode div.iconBox.ib3.top a img.sIcon.sIcon2 { content: var(--ik-theme-button-orders-off) !important; }
body.ik-dark-mode div.iconBox.ib3.top a:hover img.sIcon.sIcon2 { content: var(--ik-theme-button-orders-on) !important; }
body.ik-dark-mode div.iconBox.ib3.top a img.sIcon.sIcon3 { content: var(--ik-theme-button-armies-off) !important; }
body.ik-dark-mode div.iconBox.ib3.top a:hover img.sIcon.sIcon3 { content: var(--ik-theme-button-armies-on) !important; }
body.ik-dark-mode div.iconBox.ib3.top a img.sIcon.sIcon4 { content: var(--ik-theme-button-command-off) !important; }
body.ik-dark-mode div.iconBox.ib3.top a:hover img.sIcon.sIcon4 { content: var(--ik-theme-button-command-on) !important; }
body.ik-dark-mode div.iconBox.ib3.top a img.sIcon.sIcon5 { content: var(--ik-theme-button-troops-off) !important; }
body.ik-dark-mode div.iconBox.ib3.top a:hover img.sIcon.sIcon5 { content: var(--ik-theme-button-troops-on) !important; }

body.ik-dark-mode div.iconBox.ib4 a img.icon { content: var(--ik-theme-button-diplomacy-off) !important; }
body.ik-dark-mode div.iconBox.ib4 a:hover img.icon { content: var(--ik-theme-button-diplomacy-on) !important; }
body.ik-dark-mode div.iconBox.ib4.top a img.sIcon.sIcon1 { content: var(--ik-theme-button-moves-off) !important; }
body.ik-dark-mode div.iconBox.ib4.top a:hover img.sIcon.sIcon1 { content: var(--ik-theme-button-moves-on) !important; }
body.ik-dark-mode div.iconBox.ib4.top a img.sIcon.sIcon2 { content: var(--ik-theme-button-orders-off) !important; }
body.ik-dark-mode div.iconBox.ib4.top a:hover img.sIcon.sIcon2 { content: var(--ik-theme-button-orders-on) !important; }
body.ik-dark-mode div.iconBox.ib4.top a img.sIcon.sIcon5 { content: var(--ik-theme-button-diplo-off) !important; }
body.ik-dark-mode div.iconBox.ib4.top a:hover img.sIcon.sIcon5 { content: var(--ik-theme-button-diplo-on) !important; }

body.ik-dark-mode div.iconBox.ib5 a img.icon { content: var(--ik-theme-button-trade-off) !important; }
body.ik-dark-mode div.iconBox.ib5 a:hover img.icon { content: var(--ik-theme-button-trade-on) !important; }
body.ik-dark-mode div.iconBox.ib5.top a img.sIcon.sIcon1 { content: var(--ik-theme-button-moves-off) !important; }
body.ik-dark-mode div.iconBox.ib5.top a:hover img.sIcon.sIcon1 { content: var(--ik-theme-button-moves-on) !important; }
body.ik-dark-mode div.iconBox.ib5.top a img.sIcon.sIcon2 { content: var(--ik-theme-button-orders-off) !important; }
body.ik-dark-mode div.iconBox.ib5.top a:hover img.sIcon.sIcon2 { content: var(--ik-theme-button-orders-on) !important; }
body.ik-dark-mode div.iconBox.ib5.top a img.sIcon.sIcon3 { content: var(--ik-theme-button-markets-off) !important; }
body.ik-dark-mode div.iconBox.ib5.top a:hover img.sIcon.sIcon3 { content: var(--ik-theme-button-markets-on) !important; }
body.ik-dark-mode div.iconBox.ib5.top a img.sIcon.sIcon4 { content: var(--ik-theme-button-factions-off) !important; }
body.ik-dark-mode div.iconBox.ib5.top a:hover img.sIcon.sIcon4 { content: var(--ik-theme-button-factions-on) !important; }
body.ik-dark-mode div.iconBox.ib5.top a img.sIcon.sIcon5 { content: var(--ik-theme-button-tradeunits-off) !important; }
body.ik-dark-mode div.iconBox.ib5.top a:hover img.sIcon.sIcon5 { content: var(--ik-theme-button-tradeunits-on) !important; }

body.ik-dark-mode div.iconBox.ib6 a img.icon { content: var(--ik-theme-button-research-off) !important; }
body.ik-dark-mode div.iconBox.ib6 a:hover img.icon { content: var(--ik-theme-button-research-on) !important; }
body.ik-dark-mode div.iconBox.ib6.top a img.sIcon.sIcon1 { content: var(--ik-theme-button-available-off) !important; }
body.ik-dark-mode div.iconBox.ib6.top a:hover img.sIcon.sIcon1 { content: var(--ik-theme-button-available-on) !important; }
body.ik-dark-mode div.iconBox.ib6.top a img.sIcon.sIcon2 { content: var(--ik-theme-button-tree-off) !important; }
body.ik-dark-mode div.iconBox.ib6.top a:hover img.sIcon.sIcon2 { content: var(--ik-theme-button-tree-on) !important; }
body.ik-dark-mode div.iconBox.ib6.top a img.sIcon.sIcon4 { content: var(--ik-theme-button-discovery-off) !important; }
body.ik-dark-mode div.iconBox.ib6.top a:hover img.sIcon.sIcon4 { content: var(--ik-theme-button-discovery-on) !important; }
body.ik-dark-mode div.iconBox.ib6.top a img.sIcon.sIcon5 { content: var(--ik-theme-button-reading-off) !important; }
body.ik-dark-mode div.iconBox.ib6.top a:hover img.sIcon.sIcon5 { content: var(--ik-theme-button-reading-on) !important; }

body.ik-dark-mode div.iconBox.ib7 a img.icon { content: var(--ik-theme-button-magic-off) !important; }
body.ik-dark-mode div.iconBox.ib7 a:hover img.icon { content: var(--ik-theme-button-magic-on) !important; }
body.ik-dark-mode div.iconBox.ib7.top a img.sIcon.sIcon1 { content: var(--ik-theme-button-active-off) !important; }
body.ik-dark-mode div.iconBox.ib7.top a:hover img.sIcon.sIcon1 { content: var(--ik-theme-button-active-on) !important; }
body.ik-dark-mode div.iconBox.ib7.top a img.sIcon.sIcon2 { content: var(--ik-theme-button-cast-off) !important; }
body.ik-dark-mode div.iconBox.ib7.top a:hover img.sIcon.sIcon2 { content: var(--ik-theme-button-cast-on) !important; }
body.ik-dark-mode div.iconBox.ib7.top a img.sIcon.sIcon5 { content: var(--ik-theme-button-transmog-off) !important; }
body.ik-dark-mode div.iconBox.ib7.top a:hover img.sIcon.sIcon5 { content: var(--ik-theme-button-transmog-on) !important; }

body.ik-dark-mode div.iconBox.ib8 a img.icon[src*="ring2_off.png"] { content: var(--ik-theme-char-ring2-off) !important; }
body.ik-dark-mode div.iconBox.ib8.top a:hover img.icon[src*="ring2_on.png"] { content: var(--ik-theme-char-ring2-on) !important; }
body.ik-dark-mode div.iconBox.ib8 a img.icon[src*="bg_off.png"] { content: var(--ik-theme-button-darkbg-off) !important; }
body.ik-dark-mode div.iconBox.ib8.top a:hover img.icon[src*="bg_on.png"] { content: var(--ik-theme-button-darkbg-on) !important; }
body.ik-dark-mode div.iconBox.ib8.top a img.sIcon.sIcon1 { content: var(--ik-theme-button-favourites-off) !important; }
body.ik-dark-mode div.iconBox.ib8.top a:hover img.sIcon.sIcon1 { content: var(--ik-theme-button-favourites-on) !important; }
body.ik-dark-mode div.iconBox.ib8.top a img.sIcon.sIcon2 { content: var(--ik-theme-button-leaderboard-off) !important; }
body.ik-dark-mode div.iconBox.ib8.top a:hover img.sIcon.sIcon2 { content: var(--ik-theme-button-leaderboard-on) !important; }
body.ik-dark-mode div.iconBox.ib8.top a img.sIcon.sIcon3 { content: var(--ik-theme-button-account-off) !important; }
body.ik-dark-mode div.iconBox.ib8.top a:hover img.sIcon.sIcon3 { content: var(--ik-theme-button-account-on) !important; }
body.ik-dark-mode div.iconBox.ib8.top a img.sIcon.sIcon4 { content: var(--ik-theme-button-support-off) !important; }
body.ik-dark-mode div.iconBox.ib8.top a:hover img.sIcon.sIcon4 { content: var(--ik-theme-button-support-on) !important; }

body.ik-dark-mode div.iconBox.ib9 a img.icon { content: var(--ik-theme-button-alliance-off) !important; }
body.ik-dark-mode div.iconBox.ib9 a:hover img.icon { content: var(--ik-theme-button-alliance-on) !important; }
body.ik-dark-mode div.iconBox.ib9.top a img.sIcon.sIcon1 { content: var(--ik-theme-button-favourites-off) !important; }
body.ik-dark-mode div.iconBox.ib9.top a:hover img.sIcon.sIcon1 { content: var(--ik-theme-button-favourites-on) !important; }
body.ik-dark-mode div.iconBox.ib9.top a img.sIcon.sIcon2 { content: var(--ik-theme-button-recruit-off) !important; }
body.ik-dark-mode div.iconBox.ib9.top a:hover img.sIcon.sIcon2 { content: var(--ik-theme-button-recruit-on) !important; }
body.ik-dark-mode div.iconBox.ib9.top a img.sIcon.sIcon3 { content: var(--ik-theme-button-standings-off) !important; }
body.ik-dark-mode div.iconBox.ib9.top a:hover img.sIcon.sIcon3 { content: var(--ik-theme-button-standings-on) !important; }

body.ik-dark-mode div.iconBox.ib10 a img.icon { content: var(--ik-theme-button-prestige-off) !important; }
body.ik-dark-mode div.iconBox.ib10 a:hover img.icon { content: var(--ik-theme-button-prestige-on) !important; }
body.ik-dark-mode div.iconBox.ib10.top a img.sIcon.sIcon1 { content: var(--ik-theme-button-medal-off) !important; }
body.ik-dark-mode div.iconBox.ib10.top a:hover img.sIcon.sIcon1 { content: var(--ik-theme-button-medal-on) !important; }
body.ik-dark-mode div.iconBox.ib10.top a img.sIcon.sIcon2 { content: var(--ik-theme-button-buy-off) !important; }
body.ik-dark-mode div.iconBox.ib10.top a:hover img.sIcon.sIcon2 { content: var(--ik-theme-button-buy-on) !important; }
body.ik-dark-mode div.iconBox.ib10.top a img.sIcon.sIcon3 { content: var(--ik-theme-button-alliance-off) !important; }
body.ik-dark-mode div.iconBox.ib10.top a:hover img.sIcon.sIcon3 { content: var(--ik-theme-button-alliance-on) !important; }
body.ik-dark-mode div.iconBox.ib10.top a img.sIcon.sIcon4 { content: var(--ik-theme-button-support-off) !important; }
body.ik-dark-mode div.iconBox.ib10.top a:hover img.sIcon.sIcon4 { content: var(--ik-theme-button-support-on) !important; }
body.ik-dark-mode div.iconBox.ib10.top a img.sIcon.sIcon5 { content: var(--ik-theme-button-history-off) !important; }
body.ik-dark-mode div.iconBox.ib10.top a:hover img.sIcon.sIcon5 { content: var(--ik-theme-button-history-on) !important; }

body.ik-dark-mode div.iconBox.ib11 a img.icon { content: var(--ik-theme-button-mail-off) !important; }
body.ik-dark-mode div.iconBox.ib11 a:hover img.icon { content: var(--ik-theme-button-mail-on) !important; }
body.ik-dark-mode div.iconBox.ib11.top a img.sIcon.sIcon2 { content: var(--ik-theme-button-notif-off) !important; }
body.ik-dark-mode div.iconBox.ib11.top a:hover img.sIcon.sIcon2 { content: var(--ik-theme-button-notif-on) !important; }
body.ik-dark-mode div.iconBox.ib11.top a img.sIcon.sIcon3 { content: var(--ik-theme-button-forum-off) !important; }
body.ik-dark-mode div.iconBox.ib11.top a:hover img.sIcon.sIcon3 { content: var(--ik-theme-button-forum-on) !important; }
body.ik-dark-mode div.iconBox.ib11.top a img.sIcon.sIcon4 { content: var(--ik-theme-button-chat-off) !important; }
body.ik-dark-mode div.iconBox.ib11.top a:hover img.sIcon.sIcon4 { content: var(--ik-theme-button-chat-on) !important; }

body.ik-dark-mode h1 img.h1Icon[src*="world_64x64_off.png"] { content: var(--ik-theme-button-world-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="regionalbonus_32x32_off.png"] { content: var(--ik-theme-button-region-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="quests_32x32_off.png"] { content: var(--ik-theme-button-quest-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="tournaments_32x32_off.png"] { content: var(--ik-theme-button-tourney-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="notes_32x32_off.png"] { content: var(--ik-theme-button-stats-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="city_64x64_off.png"] { content: var(--ik-theme-button-city-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="castle_32x32_off.png"] { content: var(--ik-theme-button-castle-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="town_summary_32x32_off.png"] { content: var(--ik-theme-button-res-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="production_summary_32x32_off.png"] { content: var(--ik-theme-button-prod-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="sovereignty_32x32_off.png"] { content: var(--ik-theme-button-sov-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="inventory_32x32_off.png"] { content: var(--ik-theme-button-inv-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="movements_32x32_off.png"] { content: var(--ik-theme-button-moves-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="orders_32x32_off.png"] { content: var(--ik-theme-button-orders-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="armies_32x32_off.png"] { content: var(--ik-theme-button-armies-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="commanders_32x32_off.png"] { content: var(--ik-theme-button-command-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="military_64x64_off.png"] { content: var(--ik-theme-button-military-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="diplomacy_64x64_off.png"] { content: var(--ik-theme-button-diplomacy-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="prices_32x32_off.png"] { content: var(--ik-theme-button-markets-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="factionmarket_32x32_off.png"] { content: var(--ik-theme-button-factions-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="trade_64x64_off.png"] { content: var(--ik-theme-button-trade-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="available_32x32_off.png"] { content: var(--ik-theme-button-available-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="complete_research_tree_32x32_off.png"] { content: var(--ik-theme-button-tree-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="discovery_32x32_off.png"] { content: var(--ik-theme-button-discovery-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="reading_32x32_off.png"] { content: var(--ik-theme-button-reading-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="research_64x64_off.png"] { content: var(--ik-theme-button-research-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="spells_in_progress_32x32_off.png"] { content: var(--ik-theme-button-active-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="cast_spell_32x32_off.png"] { content: var(--ik-theme-button-cast-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="transmogrification_32x32_off.png"] { content: var(--ik-theme-button-transmog-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="magic_64x64_off.png"] { content: var(--ik-theme-button-magic-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="favourites_32x32_off.png"] { content: var(--ik-theme-button-favourites-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="rankings_32x32_off.png"] { content: var(--ik-theme-button-leaderboard-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="account_preferences_32x32_off.png"] { content: var(--ik-theme-button-account-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="about_32x32_off.png"] { content: var(--ik-theme-button-support-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="alliances_64x64_off.png"], body.ik-dark-mode h1 img[src*="alliances_64x64_off.png"] { content: var(--ik-theme-button-alliance-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="alliance_32x32_off.png"] { content: var(--ik-theme-button-recruit-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="factions_standings_32x32_off.png"] { content: var(--ik-theme-button-standings-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="prestige_64x64_off.png"] { content: var(--ik-theme-button-prestige-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="medal_32x32_off.png"] { content: var(--ik-theme-button-medal-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="buy_prestige_32x32_off.png"] { content: var(--ik-theme-button-buy-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="history_32x32_off.png"] { content: var(--ik-theme-button-history-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="notifications_32x32_off.png"] { content: var(--ik-theme-button-notif-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="chat_32x32_off.png"] { content: var(--ik-theme-button-chat-off) !important; }
body.ik-dark-mode h1 img.h1Icon[src*="mail_64x64_off.png"] { content: var(--ik-theme-button-mail-off) !important; }

body.ik-dark-mode input[type="submit"] {
    background-image: var(--ik-theme-button-reg-off) !important;
    background-repeat: repeat !important;
}

body.ik-dark-mode input[type="submit"]:hover {
    background-image: var(--ik-theme-button-reg-on) !important;
    background-repeat: repeat !important;
}

body.ik-dark-mode input.medium[type="submit"] {
    background-image: var(--ik-theme-button-med-off) !important;
    background-repeat: repeat !important;
}

body.ik-dark-mode input[type="submit"]:hover.medium {
    background-image: var(--ik-theme-button-med-on) !important;
    background-repeat: repeat !important;
}

body.ik-dark-mode input.short[type="submit"] {
    background-image: var(--ik-theme-button-short-off) !important;
    background-repeat: repeat !important;
}

body.ik-dark-mode input[type="submit"]:hover.short {
    background-image: var(--ik-theme-button-short-on) !important;
    background-repeat: repeat !important;
}

body.ik-dark-mode div#WzTtDiV div#WzBoDy table tbody tr td#WzBoDyI div.popup div.t { background-image: var(--ik-theme-popup-top) !important; }
body.ik-dark-mode div#WzTtDiV div#WzBoDy table tbody tr td#WzBoDyI div.popup div.m { background-image: var(--ik-theme-popup-mid) !important; }
body.ik-dark-mode div#WzTtDiV div#WzBoDy table tbody tr td#WzBoDyI div.popup div.b { background-image: var(--ik-theme-popup-bot) !important; }
body.ik-dark-mode div#WzTtDiV div#WzBoDy table tbody tr td#WzBoDyI div.popup hr { 
    border-top-color: var(--ik-theme-border-color) !important;
    border-right-color: var(--ik-theme-border-color) !important;
    border-bottom-color: var(--ik-theme-border-color) !important;
    border-left-color: var(--ik-theme-border-color) !important;
    border-top-color: var(--ik-theme-border-color) !important;
}


body.ik-dark-mode .ui-widget-header.ui-progressbar-value {
    background-image: var(--ik-theme-headerP-texture) !important;
    background-repeat: repeat !important;
    border-color: var(--ik-theme-border-color) !important;
}

body.ik-dark-mode .ui-tabs-selected,
body.ik-dark-mode .ui-tabs-active,
body.ik-dark-mode .ui-tabs-selected a,
body.ik-dark-mode .ui-tabs-active a,
body.ik-dark-mode .ui-tabs-selected a[href],
body.ik-dark-mode .ui-tabs-active a[href],
body.ik-dark-mode .ui-tabs-nav li.ui-tabs-selected a,
body.ik-dark-mode .ui-tabs-nav li.ui-tabs-selected a[href] {
    color: var(--ik-theme-special-text5) !important;
}
body.ik-dark-mode #resbar .resPos, body.ik-dark-mode #resbar span[class*="pos"],
body.ik-dark-mode #resbar [style*="color: green"],
body.ik-dark-mode #resbar [style*="color:green"] {
    color: #55ff55 !important;
}
body.ik-dark-mode #resbar .resNeg, body.ik-dark-mode #resbar .resFull,
body.ik-dark-mode #resbar span[class*="neg"],
body.ik-dark-mode #resbar [style*="color: red"],
body.ik-dark-mode #resbar [style*="color:red"] {
    color: #ff5555 !important;
}
body.ik-dark-mode #resbar .resMax, body.ik-dark-mode #resbar span[class*="max"] { color: #ffaa00 !important; }
body.ik-dark-mode div#advRes {
    background-color: var(--ik-theme-content-bg) !important;
    border-color: var(--ik-theme-alt-border-color) !important;
}
body.ik-dark-mode div#WzTtDiV div#WzBoDy table tbody tr td#WzBoDyI div.popup div.m div div b span [style*="860008"] { color: #ff5555 !important; }
body.ik-dark-mode div#WzTtDiV div#WzBoDy table tbody tr td#WzBoDyI div.popup div.m div div b span [style*="004B00"] { color: #55ff55 !important; }
body.ik-dark-mode div#WzTtDiV [style*="color: #004B00"],
body.ik-dark-mode div#WzTtDiV [style*="color:#004B00"],
body.ik-dark-mode div#WzTtDiV span[style*="004B00"] {
    color: #55ff55 !important;
}
body.ik-dark-mode div#WzTtDiV [style*="color: #860008"],
body.ik-dark-mode div#WzTtDiV [style*="color:#860008"],
body.ik-dark-mode div#WzTtDiV span[style*="860008"] {
    color: #ff5555 !important;
}
body.ik-dark-mode .indOwn, body.ik-dark-mode .indOwn a[href],
body.ik-dark-mode .indHostile, body.ik-dark-mode .indHostile a[href],
body.ik-dark-mode .indFriendly, body.ik-dark-mode .indFriendly a[href],
body.ik-dark-mode .indCommunication, body.ik-dark-mode .indCommunication a[href],
body.ik-dark-mode [class*="ind"], body.ik-dark-mode [class*="ind"] a[href] {
    color: var(--ik-theme-special-text9) !important;
}
body.ik-dark-mode div.ui-slider-range.ui-widget-header.ui-slider-range-min {
    background-image: var(--ik-theme-headerP-texture) !important;
    background-repeat: repeat !important;
}
body.ik-dark-mode .selected,
body.ik-dark-mode a.selected,
body.ik-dark-mode a:link.selected,
body.ik-dark-mode a:visited.selected,
body.ik-dark-mode span.selected {
    color: var(--ik-theme-special-text5) !important;
}
body.ik-dark-mode span.ikcat-dialog-tab {
    color: var(--ik-theme-special-text4) !important;
}
body.ik-dark-mode span.ikcat-dialog-tab.active,
body.ik-dark-mode span.ikcat-dialog-tab.data-tab,
body.ik-dark-mode span.ikcat-dialog-tab.active.data-tab {
    color: var(--ik-theme-special-text5) !important;
}
body.ik-dark-mode div.iconBox img.icon,
body.ik-dark-mode div.iconBox img.sIcon {
    color: transparent !important;
    text-indent: -9999px;
}
`;

    window.IKTools.customizer.registerTheme({
        id: "luper-dark",
        name: "Luper Dark",
        category: "interface",
        author: "HoRRis Lupercal",
        description: "Dark native interface, buttons, popups and editor panels. Uses externally hosted artwork.",
        css: dynamicThemeCSS,
        apply() {
            document.documentElement.classList.add("ik-dark-mode");
            document.body.classList.add("ik-dark-mode");
            styleCKEditorPanels();
            observer = new MutationObserver(scheduleEditorStyles);
            observer.observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:["class"]});
        },
        remove
    });

    window.__IKTOOLS_LUPER_DARK_LOADED__ = true;
})();
