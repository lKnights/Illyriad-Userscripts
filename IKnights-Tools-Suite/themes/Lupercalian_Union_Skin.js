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
        "--ik-theme-city-map": 'url("https://i.imgur.com/xWmXaI2.jpeg")',
        "--ik-theme-city-road": 'url("https://i.imgur.com/FmKCtP7.png")',
        "--ik-theme-city-trees": 'url("https://i.imgur.com/gTvNWI2.png")',
        
        "--ik-theme-city-wall-top": 'url("https://i.imgur.com/c22uYZI.png")',
        "--ik-theme-city-wall-bottom": 'url("https://i.imgur.com/Q9JecRZ.png")',
        
        "--ik-theme-city-commonground-off": 'url("https://i.imgur.com/5vQpFp6.png")',
        "--ik-theme-city-commonground-on": 'url("https://i.imgur.com/5vQpFp6.png")',
        
        "--ik-theme-city-paddock-off": 'url("https://i.imgur.com/wX3qQII.png")',
        "--ik-theme-city-paddock-on": 'url("https://i.imgur.com/wX3qQII.png")',
        
        "--ik-theme-city-castle-off": 'url("https://i.imgur.com/NZkjimR.png")',
        "--ik-theme-city-castle-on": 'url("https://i.imgur.com/NZkjimR.png")',
        
        "--ik-theme-city-warehouse-off": 'url("https://i.imgur.com/5Aya9sw.png")',
        "--ik-theme-city-warehouse-on": 'url("https://i.imgur.com/5Aya9sw.png")',
        
        "--ik-theme-city-magetower-off": 'url("https://i.imgur.com/MFDf0wI.png")',
        "--ik-theme-city-magetower-on": 'url("https://i.imgur.com/MFDf0wI.png")',
        
        "--ik-theme-city-carpenter-off": 'url("https://i.imgur.com/ZnCQM6u.png")',
        "--ik-theme-city-carpenter-on": 'url("https://i.imgur.com/ZnCQM6u.png")',

        "--ik-theme-city-swordsmith-off": 'url("https://i.imgur.com/9H9bOJo.png")',
        "--ik-theme-city-swordsmith-on": 'url("https://i.imgur.com/9H9bOJo.png")',
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
    /* ================== MAIN MAP + TREES ===================== */
    body.ik-city-lupercalian-union #townMap img[src*="back.jpg"] {
        content: var(--ik-theme-city-map) !important;
    }
    body.ik-city-lupercalian-union #townMap img[src*="03-roads.png"] {
        content: var(--ik-theme-city-road) !important;
    }
    body.ik-city-lupercalian-union img[src*="lumberwood.png"] {
        content: var(--ik-theme-city-trees) !important;
    }
    
    /* ======================= WALLS ============================ */
    body.ik-city-lupercalian-union img[src*="03-wall_upper.png"] {
        content: var(--ik-theme-city-wall-top) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-wall_lower.png"] {
        content: var(--ik-theme-city-wall-bottom) !important;
    }
    body.ik-city-lupercalian-union div[style*="03-wall_upper.png"] {
        background-image: var(--ik-theme-city-wall-top) !important;
        background-size: 1050px !important;
        background-position-y: -1.5% !important;
    }
    body.ik-city-lupercalian-union div[style*="03-wall_lower.png"] {
        background-image: var(--ik-theme-city-wall-bottom) !important;
        background-size: 1030px !important;
    }
    body.ik-city-lupercalian-union div[style*="03-wall_lower.png"] fieldset:nth-of-type(2) {
        margin-left: 125px !important;
    }
    
    /* ====================== CASTLE =========================== */
    body.ik-city-lupercalian-union img[src*="03-castle_off.png"] {
        content: var(--ik-theme-city-castle-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-castle_on.png"] {
        content: var(--ik-theme-city-castle-on) !important;
    }

    body.ik-city-lupercalian-union #MainContentDiv img[src*="03-castle_off.png"] {
        width: 169px !important;
        height: 251px !important;
        /* add seperate image with no right margin buffer */
    }

    body.ik-city-lupercalian-union #townMap img[src*="03-castle_off.png"],
    body.ik-city-lupercalian-union #townMap img[src*="03-castle_on.png"] {
        width: 125.5px !important;     /* Adjust width to fit your artwork proportions */
        height: 84.5px !important;    /* Adjust height to fit your artwork proportions */
    }
    
    /* =================== COMMONGROUND ======================== */
    body.ik-city-lupercalian-union img[src*="03-commonground_off.png"] {
        content: var(--ik-theme-city-commonground-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-commonground_on.png"] {
        content: var(--ik-theme-city-commonground-on) !important;
    }
    
    /* ===================== PADDOCK ========================== */
    body.ik-city-lupercalian-union img[src*="03-paddock_off.png"] {
        content: var(--ik-theme-city-paddock-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-paddock_on.png"] {
        content: var(--ik-theme-city-paddock-on) !important;
    }
    
     /* ==================== WAREHOUSE ======================== */
    body.ik-city-lupercalian-union img[src*="03-warehouse_off.png"] {
        content: var(--ik-theme-city-warehouse-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-warehouse_on.png"] {
        content: var(--ik-theme-city-warehouse-on) !important;
    }
    
     /* ===================== MAGE TOWER ======================== */
    body.ik-city-lupercalian-union img[src*="03-magetower_off.png"] {
        content: var(--ik-theme-city-magetower-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-magetower_on.png"] {
        content: var(--ik-theme-city-magetower-on) !important;
    }
    
     /* ===================== CARPENTER ======================== */
    body.ik-city-lupercalian-union img[src*="03-carpenter_off.png"] {
        content: var(--ik-theme-city-carpenter-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-carpenter_on.png"] {
        content: var(--ik-theme-city-carpenter-on) !important;
    }

     /* ==================== SWORDSMITH ======================== */
    body.ik-city-lupercalian-union img[src*="03-swordsmith_off.png"] {
        content: var(--ik-theme-city-swordsmith-off) !important;
    }
    body.ik-city-lupercalian-union img[src*="03-swordsmith_on.png"] {
        content: var(--ik-theme-city-swordsmith-on) !important;
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
