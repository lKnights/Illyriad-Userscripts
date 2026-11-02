/*
 * Designed for Illyriad Tools Suite by HoRRis Lupercal.
 *
 * Copyright (c) 2026 HoRRis Lupercal
 * Licensed under the HoRRis Lupercal Non-Commercial License.
 *
 * Integration into IKnights Tools Suite by IKnights contributors.
 */
(function () {
    "use strict";

    if (window.__IKTOOLS_LUPERCALIAN_UNION_SKIN_LOADED__) {
        return;
    }

    if (!window.IKTools?.customizer) {
        throw new Error("Lupercalian Union Skin requires Customizer.");
    }

    window.__IKTOOLS_LUPERCALIAN_UNION_SKIN_LOADED__ = true;

    // 1. Single source of truth for city theme variables and art assets
    const variables = {
        "--ik-theme-city-castle-off": 'url("https://i.imgur.com/6N15PMJ.png")',
        "--ik-theme-city-castle-on": 'url("https://i.imgur.com/hlD6wHO.png")'
    };

    function generateVariablesCSS() {
        let cssString = "html.ik-city-lupercalian-union {\n";
        for (const [key, value] of Object.entries(variables)) {
            cssString += `  ${key}: ${value};\n`;
        }
        cssString += "}\n";
        return cssString;
    }

    // 2. CSS Rules mapping image sources to custom theme variables
    const dynamicCityThemeCSS = generateVariablesCSS() + `
    body.ik-city-lupercalian-union img[src*="03-castle_off.png"] {
        content: var(--ik-theme-city-castle-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-castle_on.png"] {
        content: var(--ik-theme-city-castle-on) !important;
    }
    
    `;

    function remove() {
        document.documentElement.classList.remove("ik-city-lupercalian-union");
        document.body.classList.remove("ik-city-lupercalian-union");
    }

    // 3. Register the theme with Customizer under category: "city"
    window.IKTools.customizer.registerTheme({
        id: "lupercalian-union-skin",
        name: "Lupercalian Union Skin",
        category: "city",
        author: "HoRRis Lupercal",
        description: "Custom city theme styling buildings and assets for the Lupercalian Union.",
        css: dynamicCityThemeCSS,
        apply() {
            document.documentElement.classList.add("ik-city-lupercalian-union");
            document.body.classList.add("ik-city-lupercalian-union");
        },
        remove
    });

    console.log("IKnights Lupercalian Union Skin module loaded.");
})();
